import axios from "axios"
import { authService } from "@/lib/auth/auth-service"

// Create axios instance with base configuration
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
})

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = authService.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshResponse = await authService.refreshToken()

        if (refreshResponse.success && refreshResponse.data?.token) {
          // Update the authorization header and retry the request
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`
          return apiClient(originalRequest)
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        console.error("Token refresh failed:", refreshError)
      }

      // If refresh fails or no refresh token, redirect to login
      authService.removeToken()
      authService.removeRefreshToken()

      if (typeof window !== "undefined") {
        window.location.href = "/auth?redirect=" + encodeURIComponent(window.location.pathname)
      }
    }

    return Promise.reject(error)
  },
)

// Helper function for making authenticated requests
export const makeAuthenticatedRequest = async <T>(
  url: string,
  options: RequestInit = {}
)
: Promise<T> =>
{
  const token = authService.getToken()

  const config: RequestInit = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}${url}`, config)

  if (!response.ok) {
    if (response.status === 401) {
      // Try to refresh token
      const refreshResponse = await authService.refreshToken()

      if (refreshResponse.success && refreshResponse.data?.token) {
        // Retry with new token
        const retryConfig: RequestInit = {
          ...options,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshResponse.data.token}`,
            ...options.headers,
          },
        }

        const retryResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"}${url}`,
          retryConfig,
        )

        if (retryResponse.ok) {
          return retryResponse.json()
        }
      }

      // Refresh failed, redirect to login
      authService.removeToken()
      authService.removeRefreshToken()

      if (typeof window !== "undefined") {
        window.location.href = "/auth?redirect=" + encodeURIComponent(window.location.pathname)
      }
    }

    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
