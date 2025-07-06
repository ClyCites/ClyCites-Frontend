"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import { authService } from "./auth-service"
import type { AuthState, User, LoginCredentials, RegisterData } from "./auth-config"
import { toast } from "sonner"

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => Promise<void>
  refreshAuth: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: User }
  | { type: "AUTH_FAILURE"; payload: string }
  | { type: "AUTH_LOGOUT" }
  | { type: "CLEAR_ERROR" }

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "AUTH_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      }
    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      }
    case "AUTH_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      }
    case "AUTH_LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      }
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      }
    default:
      return state
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState)

  // Check for existing authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = authService.getToken()
      if (!token) {
        dispatch({ type: "AUTH_FAILURE", payload: "" })
        return
      }

      try {
        const response = await authService.getMe()
        if (response.success && response.data?.user) {
          dispatch({ type: "AUTH_SUCCESS", payload: response.data.user })
        } else {
          throw new Error(response.message || "Failed to get user data")
        }
      } catch (error) {
        // Try to refresh token
        try {
          const refreshResponse = await authService.refreshToken()
          if (refreshResponse.success && refreshResponse.data?.user) {
            dispatch({ type: "AUTH_SUCCESS", payload: refreshResponse.data.user })
          } else {
            throw new Error("Failed to refresh authentication")
          }
        } catch (refreshError) {
          authService.removeToken()
          authService.removeRefreshToken()
          dispatch({ type: "AUTH_FAILURE", payload: "" })
        }
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    dispatch({ type: "AUTH_START" })
    try {
      const response = await authService.login(credentials)
      if (response.success && response.data?.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user })
        toast.success("Login successful!")
      } else {
        throw new Error(response.message || "Login failed")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed"
      dispatch({ type: "AUTH_FAILURE", payload: message })
      toast.error(message)
      throw error
    }
  }

  const register = async (data: RegisterData) => {
    dispatch({ type: "AUTH_START" })
    try {
      const response = await authService.register(data)
      if (response.success) {
        toast.success(response.message || "Registration successful! Please check your email to verify your account.")
        dispatch({ type: "AUTH_FAILURE", payload: "" }) // Reset loading state
      } else {
        throw new Error(response.message || "Registration failed")
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed"
      dispatch({ type: "AUTH_FAILURE", payload: message })
      toast.error(message)
      throw error
    }
  }

  const logout = async () => {
    try {
      const response = await authService.logout()
      dispatch({ type: "AUTH_LOGOUT" })
      if (response.success) {
        toast.success("Logged out successfully")
      }
    } catch (error) {
      // Even if logout fails on server, clear local state
      authService.removeToken()
      authService.removeRefreshToken()
      dispatch({ type: "AUTH_LOGOUT" })
      toast.error("Logout failed, but you have been logged out locally")
    }
  }

  const refreshAuth = async () => {
    try {
      const response = await authService.getMe()
      if (response.success && response.data?.user) {
        dispatch({ type: "AUTH_SUCCESS", payload: response.data.user })
      }
    } catch (error) {
      console.error("Failed to refresh auth:", error)
    }
  }

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" })
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    refreshAuth,
    clearError,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
