export interface LoginCredentials {
  identifier: string // email or username
  password: string
  rememberMe?: boolean
}

export interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role?: string
  profilePicture?: string | null
  isEmailVerified: boolean
  lastLogin?: string
  createdAt?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  data?: {
    user: User
    token: string
    refreshToken?: string
  }
  error?: string
}

class AuthService {
  private baseURL: string
  private tokenKey = "auth_token"
  private refreshTokenKey = "refresh_token"

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
  }

  // Set cookie helper
  private setCookie(name: string, value: string, days = 7) {
    if (typeof document === "undefined") return
    const expires = new Date()
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict${
      process.env.NODE_ENV === "production" ? ";Secure" : ""
    }`
  }

  // Get cookie helper
  private getCookie(name: string): string | null {
    if (typeof document === "undefined") return null
    const nameEQ = name + "="
    const ca = document.cookie.split(";")
    for (let i = 0; i < ca.length; i++) {
      let c = ca[i]
      while (c.charAt(0) === " ") c = c.substring(1, c.length)
      if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
    }
    return null
  }

  // Delete cookie helper
  private deleteCookie(name: string) {
    if (typeof document === "undefined") return
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
  }

  async login(
    credentials: LoginCredentials,
  ): Promise<{ success: boolean; user?: User; token?: string; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          identifier: credentials.identifier,
          password: credentials.password,
        }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Login failed")
      }

      if (data.success && data.data) {
        // Store tokens in localStorage and cookies
        localStorage.setItem(this.tokenKey, data.data.token)
        if (data.data.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, data.data.refreshToken)
        }

        // Set cookies for middleware
        this.setCookie("token", data.data.token)
        this.setCookie("auth_token", data.data.token)
        if (data.data.refreshToken) {
          this.setCookie("refreshToken", data.data.refreshToken)
        }

        return {
          success: true,
          user: data.data.user,
          token: data.data.token,
          message: data.message || "Login successful",
        }
      }

      throw new Error(data.message || "Login failed")
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Login failed",
      }
    }
  }

  async register(userData: RegisterData): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(userData),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Registration failed")
      }

      return {
        success: data.success,
        message: data.message || "Registration successful",
        user: data.data?.user,
      }
    } catch (error) {
      console.error("Registration error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Registration failed",
      }
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)

      await fetch(`${this.baseURL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.getToken()}`,
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      })
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      // Clear all tokens regardless of API call success
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.refreshTokenKey)
      this.deleteCookie("token")
      this.deleteCookie("auth_token")
      this.deleteCookie("refreshToken")
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const token = this.getToken()
      if (!token) return null

      const response = await fetch(`${this.baseURL}/auth/me`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          const refreshed = await this.refreshToken()
          if (refreshed) {
            return this.getCurrentUser()
          }
        }
        throw new Error(data.message || "Failed to get user")
      }

      return data.success && data.data ? data.data.user : null
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  async refreshToken(): Promise<boolean> {
    try {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)
      if (!refreshToken) return false

      const response = await fetch(`${this.baseURL}/auth/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ refreshToken }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok || !data.success || !data.data) {
        this.logout()
        return false
      }

      // Update tokens
      localStorage.setItem(this.tokenKey, data.data.token)
      this.setCookie("token", data.data.token)
      this.setCookie("auth_token", data.data.token)

      return true
    } catch (error) {
      console.error("Token refresh error:", error)
      this.logout()
      return false
    }
  }

  async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/forgot-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to send reset email")
      }

      return {
        success: data.success,
        message: data.message || "Reset email sent",
      }
    } catch (error) {
      console.error("Forgot password error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to send reset email",
      }
    }
  }

  async resetPassword(token: string, password: string): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/reset-password/${token}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to reset password")
      }

      if (data.success && data.data) {
        // Store new tokens after password reset
        localStorage.setItem(this.tokenKey, data.data.token)
        if (data.data.refreshToken) {
          localStorage.setItem(this.refreshTokenKey, data.data.refreshToken)
        }
        this.setCookie("token", data.data.token)
        this.setCookie("auth_token", data.data.token)
        if (data.data.refreshToken) {
          this.setCookie("refreshToken", data.data.refreshToken)
        }

        return {
          success: true,
          user: data.data.user,
          message: data.message || "Password reset successful",
        }
      }

      return {
        success: data.success,
        message: data.message || "Password reset successful",
      }
    } catch (error) {
      console.error("Reset password error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Password reset failed",
      }
    }
  }

  async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await fetch(`${this.baseURL}/auth/verify-email/${token}`, {
        method: "GET",
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Email verification failed")
      }

      return {
        success: data.success,
        message: data.message || "Email verified successfully",
      }
    } catch (error) {
      console.error("Email verification error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Email verification failed",
      }
    }
  }

  async changePassword(
    currentPassword: string,
    newPassword: string,
  ): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          success: false,
          message: "Not authenticated",
        }
      }

      const response = await fetch(`${this.baseURL}/auth/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to change password")
      }

      if (data.success && data.data) {
        // Update tokens if provided
        localStorage.setItem(this.tokenKey, data.data.token)
        this.setCookie("token", data.data.token)
        this.setCookie("auth_token", data.data.token)

        return {
          success: true,
          user: data.data.user,
          message: data.message || "Password changed successfully",
        }
      }

      return {
        success: data.success,
        message: data.message || "Password changed successfully",
      }
    } catch (error) {
      console.error("Change password error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to change password",
      }
    }
  }

  async updateProfile(profileData: Partial<User>): Promise<{ success: boolean; message: string; user?: User }> {
    try {
      const token = this.getToken()
      if (!token) {
        return {
          success: false,
          message: "Not authenticated",
        }
      }

      const response = await fetch(`${this.baseURL}/auth/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profileData),
      })

      const data: AuthResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Failed to update profile")
      }

      return {
        success: data.success,
        message: data.message || "Profile updated successfully",
        user: data.data?.user,
      }
    } catch (error) {
      console.error("Update profile error:", error)
      return {
        success: false,
        message: error instanceof Error ? error.message : "Failed to update profile",
      }
    }
  }

  getToken(): string | null {
    if (typeof window === "undefined") return null
    return localStorage.getItem(this.tokenKey) || this.getCookie("token")
  }

  isAuthenticated(): boolean {
    return !!this.getToken()
  }
}

export const authService = new AuthService()
