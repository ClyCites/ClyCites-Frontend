"use client"

import { useState, useCallback, useEffect } from "react"
import { aiStatusApi } from "@/lib/api/ai-status-api"

export interface AIStatus {
  configured: boolean
  connected: boolean
  timestamp: string
  error?: string
  testResponse?: string
}

export function useAIStatus() {
  const [status, setStatus] = useState<AIStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastChecked, setLastChecked] = useState<Date | null>(null)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  const checkStatus = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await aiStatusApi.getStatus()
      setStatus(response)
      setLastChecked(new Date())
    } catch (err: any) {
      console.error("AI Status check error:", err)

      // Handle authentication errors gracefully
      if (err.message.includes("401") || err.message.includes("Access denied")) {
        setStatus({
          configured: false,
          connected: false,
          timestamp: new Date().toISOString(),
          error: "Authentication required. Please log in to check AI service status.",
        })
      } else {
        setError(err.message || "Failed to check AI status")
        // Set a fallback status
        setStatus({
          configured: false,
          connected: false,
          timestamp: new Date().toISOString(),
          error: err.message || "Failed to check AI status",
        })
      }
      setLastChecked(new Date())
    } finally {
      setLoading(false)
    }
  }, [])

  const testConnection = useCallback(async () => {
    setIsTestingConnection(true)

    try {
      const response = await aiStatusApi.testConnection()
      setStatus((prev) =>
        prev
          ? {
              ...prev,
              testResponse: response.message || "Connection test successful",
              connected: true,
              timestamp: new Date().toISOString(),
            }
          : {
              configured: true,
              connected: true,
              timestamp: new Date().toISOString(),
              testResponse: response.message || "Connection test successful",
            },
      )
      setLastChecked(new Date())
    } catch (err: any) {
      console.error("AI Connection test error:", err)

      if (err.message.includes("401") || err.message.includes("Access denied")) {
        setStatus((prev) =>
          prev
            ? {
                ...prev,
                connected: false,
                error: "Authentication required. Please log in to test AI connection.",
                timestamp: new Date().toISOString(),
              }
            : {
                configured: false,
                connected: false,
                timestamp: new Date().toISOString(),
                error: "Authentication required. Please log in to test AI connection.",
              },
        )
      } else {
        setStatus((prev) =>
          prev
            ? {
                ...prev,
                connected: false,
                error: err.message || "Connection test failed",
                timestamp: new Date().toISOString(),
              }
            : {
                configured: false,
                connected: false,
                timestamp: new Date().toISOString(),
                error: err.message || "Connection test failed",
              },
        )
      }
      setLastChecked(new Date())
    } finally {
      setIsTestingConnection(false)
    }
  }, [])

  // Auto-check status on mount
  useEffect(() => {
    checkStatus()
  }, [checkStatus])

  const isConfigured = status?.configured ?? false
  const isConnected = status?.connected ?? false

  return {
    status,
    loading,
    error,
    lastChecked,
    checkStatus,
    testConnection,
    isTestingConnection,
    isConfigured,
    isConnected,
  }
}
