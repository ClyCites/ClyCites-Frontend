import { API_CONFIG, type AuthResponse, type LoginCredentials, type RegisterData, type User } from "./auth-config"

class AuthService {
  private baseURL = API_CONFIG.BASE_URL

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<AuthResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    const token = this.getToken()

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: "include",
      ...options,
    }

    try {
      const response = await fetch(url, config)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (error) {
      console.error("API Request Error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Network error occurred",
        data: null,
      }
    }
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<AuthResponse<{ user: User; token: string; refreshToken: string }>> {
    const response = await this.request<{ user: User; token: string; refreshToken: string }>(
      API_CONFIG.ENDPOINTS.LOGIN,
      {
        method: "POST",
        body: JSON.stringify(credentials),
      },
    )

    if (response.success && response.data) {
      this.setToken(response.data.token)
      this.setRefreshToken(response.data.refreshToken)
    }

    return response
  }

  async register(data: RegisterData): Promise<AuthResponse<{ user: User }>> {
    return this.request<{ user: User }>(API_CONFIG.ENDPOINTS.REGISTER, {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async logout(): Promise<AuthResponse<any>> {
    try {
      const response = await this.request(API_CONFIG.ENDPOINTS.LOGOUT, {
        method: "POST",
      })
      return response
    } finally {
      this.removeToken()
      this.removeRefreshToken()
    }
  }

  async getMe(): Promise<AuthResponse<{ user: User }>> {
    return this.request<{ user: User }>(API_CONFIG.ENDPOINTS.ME)
  }

  async refreshToken(): Promise<AuthResponse<{ token: string; user: User }>> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      return {
        success: false,
        message: "No refresh token available",
        data: null,
      }
    }

    const response = await this.request<{ token: string; user: User }>(API_CONFIG.ENDPOINTS.REFRESH, {
      method: "POST",
      body: JSON.stringify({ refreshToken }),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async forgotPassword(email: string): Promise<AuthResponse<any>> {
    return this.request(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
      method: "POST",
      body: JSON.stringify({ email }),
    })
  }

  async resetPassword(token: string, password: string): Promise<AuthResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>(
      `${API_CONFIG.ENDPOINTS.RESET_PASSWORD}/${token}`,
      {
        method: "PUT",
        body: JSON.stringify({ password }),
      },
    )

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<AuthResponse<{ user: User; token: string }>> {
    const response = await this.request<{ user: User; token: string }>(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (response.success && response.data) {
      this.setToken(response.data.token)
    }

    return response
  }

  async verifyEmail(token: string): Promise<AuthResponse<any>> {
    return this.request(`${API_CONFIG.ENDPOINTS.VERIFY_EMAIL}/${token}`, {
      method: "GET",
    })
  }

  async updateProfile(data: { firstName?: string; lastName?: string; username?: string }): Promise<
    AuthResponse<{ user: User }>
  > {
    return this.request<{ user: User }>("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    })
  }

  // Token management
  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
      // Also set as cookie for SSR
      document.cookie = `token=${token}; path=/; max-age=${15 * 60}; secure; samesite=strict`
    }
  }

  getToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("auth_token")
    }
    return null
  }

  removeToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
      document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
  }

  setRefreshToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("refresh_token", token)
      document.cookie = `refreshToken=${token}; path=/; max-age=${7 * 24 * 60 * 60}; secure; samesite=strict`
    }
  }

  getRefreshToken(): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem("refresh_token")
    }
    return null
  }

  removeRefreshToken(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("refresh_token")
      document.cookie = "refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;"
    }
  }

  isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]))
      return Date.now() >= payload.exp * 1000
    } catch {
      return true
    }
  }

  // Google OAuth
  initiateGoogleAuth(): void {
    window.location.href = `${this.baseURL}${API_CONFIG.ENDPOINTS.GOOGLE_AUTH}`
  }
}

export const authService = new AuthService()
