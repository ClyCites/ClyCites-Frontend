// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api"

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message?: string
  error?: string
}

export interface PaginatedApiResponse<T = any> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasMore: boolean
  }
  message?: string
  error?: string
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string,
  ) {
    super(message)
    this.name = "ApiError"
  }
}

export class AuthError extends ApiError {
  constructor(message = "Authentication required") {
    super(message, 401, "AUTH_ERROR")
    this.name = "AuthError"
  }
}

export class ValidationError extends ApiError {
  constructor(
    message: string,
    public errors?: Record<string, string[]>,
  ) {
    super(message, 400, "VALIDATION_ERROR")
    this.name = "ValidationError"
  }
}

// Token management
export const tokenManager = {
  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem("auth_token") || null
  },

  setToken(token: string): void {
    if (typeof window === "undefined") return
    localStorage.setItem("auth_token", token)
  },

  removeToken(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem("auth_token")
  },

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  },
}

// Main API client function
export async function makeAuthenticatedRequest<T = any>(
  endpoint: string,
  options: RequestInit & {
    requireAuth?: boolean
    params?: Record<string, any>
  } = {},
): Promise<T> {
  const { requireAuth = true, params, ...fetchOptions } = options

  // Build URL with query parameters
  let url = `${API_BASE_URL}${endpoint}`
  if (params) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value))
      }
    })
    if (searchParams.toString()) {
      url += `?${searchParams.toString()}`
    }
  }

  // Prepare headers
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...fetchOptions.headers,
  }

  // Add authentication header if required
  if (requireAuth) {
    const token = tokenManager.getToken()
    if (!token) {
      throw new AuthError("No authentication token found")
    }
    if (tokenManager.isTokenExpired(token)) {
      tokenManager.removeToken()
      throw new AuthError("Authentication token has expired")
    }
    headers.Authorization = `Bearer ${token}`
  }

  // Prepare request options
  const requestOptions: RequestInit = {
    ...fetchOptions,
    headers,
  }

  // Stringify body if it's an object
  if (requestOptions.body && typeof requestOptions.body === "object") {
    requestOptions.body = JSON.stringify(requestOptions.body)
  }

  try {
    const response = await fetch(url, requestOptions)

    // Handle different response types
    let data: any
    const contentType = response.headers.get("content-type")

    if (contentType?.includes("application/json")) {
      data = await response.json()
    } else {
      data = await response.text()
    }

    // Handle error responses
    if (!response.ok) {
      if (response.status === 401) {
        tokenManager.removeToken()
        throw new AuthError(data.message || "Authentication failed")
      } else if (response.status === 400 && data.errors) {
        throw new ValidationError(data.message || "Validation failed", data.errors)
      } else {
        throw new ApiError(
          data.message || data.error || `HTTP ${response.status}: ${response.statusText}`,
          response.status,
        )
      }
    }

    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }

    // Handle network errors
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new ApiError("Network error: Unable to connect to server")
    }

    throw new ApiError(error instanceof Error ? error.message : "Unknown error occurred")
  }
}

// Convenience methods
export const apiClient = {
  get: <T = any>(endpoint: string, params?: Record<string, any>) =>
    makeAuthenticatedRequest<T>(endpoint, { method: "GET", params }),

  post: <T = any>(endpoint: string, data?: any) =>
    makeAuthenticatedRequest<T>(endpoint, { method: "POST", body: data }),

  put: <T = any>(endpoint: string, data?: any) => makeAuthenticatedRequest<T>(endpoint, { method: "PUT", body: data }),

  patch: <T = any>(endpoint: string, data?: any) =>
    makeAuthenticatedRequest<T>(endpoint, { method: "PATCH", body: data }),

  delete: <T = any>(endpoint: string) => makeAuthenticatedRequest<T>(endpoint, { method: "DELETE" }),
}
