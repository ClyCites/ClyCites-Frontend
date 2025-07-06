import { VALIDATION_PATTERNS, PASSWORD_STRENGTH, type PasswordStrength } from "./auth-config"

export function validateEmail(email: string): boolean {
  return VALIDATION_PATTERNS.EMAIL.test(email)
}

export function validateUsername(username: string): boolean {
  return VALIDATION_PATTERNS.USERNAME.test(username) && username.length >= 3 && username.length <= 30
}

export function validatePassword(password: string): boolean {
  return VALIDATION_PATTERNS.PASSWORD.test(password) && password.length >= 8
}

export function calculatePasswordStrength(password: string): {
  level: PasswordStrength
  label: string
  suggestions: string[]
} {
  if (!password) {
    return { level: PASSWORD_STRENGTH.WEAK, label: "weak", suggestions: [] }
  }

  let score = 0
  const suggestions: string[] = []

  // Length check
  if (password.length >= 8) score += 1
  else suggestions.push("Use at least 8 characters")

  if (password.length >= 12) score += 1
  else if (password.length >= 8) suggestions.push("Consider using 12+ characters for better security")

  // Character variety checks
  if (/[a-z]/.test(password)) score += 1
  else suggestions.push("Add lowercase letters")

  if (/[A-Z]/.test(password)) score += 1
  else suggestions.push("Add uppercase letters")

  if (/\d/.test(password)) score += 1
  else suggestions.push("Add numbers")

  if (/[@$!%*?&]/.test(password)) score += 1
  else suggestions.push("Add special characters (@$!%*?&)")

  // Bonus points
  if (password.length >= 16) score += 1
  if (/[^a-zA-Z0-9@$!%*?&]/.test(password)) score += 1 // Other special chars

  // Determine strength level
  let level: PasswordStrength
  let label: string

  if (score <= 2) {
    level = PASSWORD_STRENGTH.WEAK
    label = "weak"
  } else if (score <= 4) {
    level = PASSWORD_STRENGTH.FAIR
    label = "fair"
  } else if (score <= 6) {
    level = PASSWORD_STRENGTH.GOOD
    label = "good"
  } else {
    level = PASSWORD_STRENGTH.STRONG
    label = "strong"
  }

  return { level, label, suggestions }
}

export function isTokenExpired(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return Date.now() >= payload.exp * 1000
  } catch {
    return true
  }
}

export function formatAuthError(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === "string") {
    return error
  }
  return "An unexpected error occurred"
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
}

export function formatUserName(firstName: string, lastName: string): string {
  return `${firstName} ${lastName}`
}
