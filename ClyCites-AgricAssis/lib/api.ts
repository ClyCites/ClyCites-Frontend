// API configuration and base client
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"

interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

class ApiClient {
  private baseURL: string
  private defaultHeaders: Record<string, string>

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.defaultHeaders = {
      "Content-Type": "application/json",
    }
  }

  private getAuthHeaders(): Record<string, string> {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  private async sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms))
  }

  private async request<T>(endpoint: string, options: RequestInit = {}, retryCount = 0): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const headers = {
      ...this.defaultHeaders,
      ...this.getAuthHeaders(),
      ...options.headers,
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      // Handle rate limiting with exponential backoff
      if (response.status === 429 && retryCount < 3) {
        const retryAfter = response.headers.get("Retry-After")
        const delay = retryAfter ? Number.parseInt(retryAfter) * 1000 : Math.pow(2, retryCount) * 1000

        console.warn(`Rate limited. Retrying after ${delay}ms (attempt ${retryCount + 1}/3)`)
        await this.sleep(delay)
        return this.request<T>(endpoint, options, retryCount + 1)
      }

      let data: any
      try {
        data = await response.json()
      } catch (jsonError) {
        // Handle non-JSON responses
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        data = { success: true }
      }

      if (!response.ok) {
        const errorMessage = data?.message || data?.error || `HTTP error! status: ${response.status}`

        // Provide user-friendly error messages
        switch (response.status) {
          case 429:
            throw new Error("Too many requests. Please wait a moment and try again.")
          case 401:
            throw new Error("Authentication required. Please log in again.")
          case 403:
            throw new Error("You don't have permission to perform this action.")
          case 404:
            throw new Error("The requested resource was not found.")
          case 500:
            throw new Error("Server error. Please try again later.")
          default:
            throw new Error(errorMessage)
        }
      }

      return data
    } catch (error) {
      console.error("API request failed:", error)

      // Don't retry on authentication errors
      if (error instanceof Error && (error.message.includes("401") || error.message.includes("Authentication"))) {
        // Redirect to login or clear auth state
        if (typeof window !== "undefined") {
          localStorage.removeItem("token")
          window.location.href = "/auth"
        }
      }

      throw error
    }
  }

  // HTTP methods
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "GET" })
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    })
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: "DELETE" })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
