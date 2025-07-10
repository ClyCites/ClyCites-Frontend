"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api/api-client"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  profilePicture?: string
  isEmailVerified: boolean
  globalRole: string
  lastLogin: string
  createdAt: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface LoginCredentials {
  identifier: string
  password: string
}

interface RegisterData {
  username: string
  email: string
  password: string
  firstName: string
  lastName: string
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })
  const router = useRouter()

  const checkAuth = useCallback(async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setAuthState({ user: null, isLoading: false, isAuthenticated: false })
        return
      }

      const response = await apiClient.get<User>("/auth/me")
      if (response.success && response.data) {
        setAuthState({
          user: response.data,
          isLoading: false,
          isAuthenticated: true,
        })
      } else {
        localStorage.removeItem("token")
        setAuthState({ user: null, isLoading: false, isAuthenticated: false })
      }
    } catch (error) {
      localStorage.removeItem("token")
      setAuthState({ user: null, isLoading: false, isAuthenticated: false })
    }
  }, [])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  const login = async (credentials: LoginCredentials) => {
    try {
      const response = await apiClient.post<{ token: string; user: User }>("/auth/login", credentials)
      if (response.success && response.data) {
        localStorage.setItem("token", response.data.token)
        setAuthState({
          user: response.data.user,
          isLoading: false,
          isAuthenticated: true,
        })
        return { success: true }
      }
      return { success: false, error: "Login failed" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      const response = await apiClient.post("/auth/register", userData)
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const logout = async () => {
    try {
      await apiClient.post("/auth/logout")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      localStorage.removeItem("token")
      setAuthState({ user: null, isLoading: false, isAuthenticated: false })
      router.push("/auth")
    }
  }

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      const response = await apiClient.put<User>("/auth/profile", profileData)
      if (response.success && response.data) {
        setAuthState((prev) => ({
          ...prev,
          user: response.data!,
        }))
        return { success: true }
      }
      return { success: false, error: "Profile update failed" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      const response = await apiClient.put("/auth/change-password", {
        currentPassword,
        newPassword,
      })
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", { email })
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    ...authState,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    checkAuth,
  }
}
