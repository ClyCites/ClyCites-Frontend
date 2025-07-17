import { apiClient } from "@/lib/api"

export async function getSession() {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return null
  }

  try {
    const response = await apiClient.get("/auth/me")

    if (response) {
      return response
    } else {
      localStorage.removeItem("token")
      return null
    }
  } catch (error) {
    console.error("Session check failed:", error)
    return null
  }
}

export function logout() {
  localStorage.removeItem("token")
  window.location.href = "/auth"
}
