export interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  role: "viewer" | "editor" | "admin"
  profilePicture?: string
  isEmailVerified: boolean
  lastLogin: Date
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

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

export interface AuthResponse<T = any> {
  success: boolean
  message?: string
  data?: T
}

// API Configuration
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  ENDPOINTS: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    LOGOUT: "/auth/logout",
    ME: "/auth/me",
    REFRESH: "/auth/refresh-token",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
    CHANGE_PASSWORD: "/auth/change-password",
    VERIFY_EMAIL: "/auth/verify-email",
    GOOGLE_AUTH: "/auth/google",
  },
}

// Validation patterns
export const VALIDATION_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  USERNAME: /^[a-zA-Z0-9_]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
}

// Password strength levels
export const PASSWORD_STRENGTH = {
  WEAK: 0,
  FAIR: 1,
  GOOD: 2,
  STRONG: 3,
} as const

export type PasswordStrength = (typeof PASSWORD_STRENGTH)[keyof typeof PASSWORD_STRENGTH]
