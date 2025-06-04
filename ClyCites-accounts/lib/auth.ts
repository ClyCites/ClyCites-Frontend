export async function getSession() {
  if (typeof window === "undefined") {
    return null
  }

  const token = localStorage.getItem("token")
  if (!token) {
    return null
  }

  try {
    const response = await fetch("/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })

    if (response.ok) {
      return await response.json()
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
  window.location.href = "/auth/login"
}
