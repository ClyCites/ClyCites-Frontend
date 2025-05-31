"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface ApiToken {
  id: string
  name: string
  description: string
  scopes: string[]
  permissions: string[]
  lastUsed: string | null
  createdAt: string
  expiresAt: string | null
  isActive: boolean
  rateLimits: {
    requestsPerMinute: number
    requestsPerHour: number
    requestsPerDay: number
  }
  usage: {
    totalRequests: number
    lastRequest: string | null
  }
}

interface CreateTokenData {
  name: string
  description?: string
  scopes: string[]
  permissions?: string[]
  expiresAt?: string
  rateLimits?: {
    requestsPerMinute?: number
    requestsPerHour?: number
    requestsPerDay?: number
  }
}

interface TokenUsageStats {
  totalRequests: number
  requestsToday: number
  requestsThisHour: number
  averageRequestsPerDay: number
  topEndpoints: Array<{
    endpoint: string
    count: number
  }>
  errorRate: number
}

export function useApiTokens(organizationId?: string) {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [currentToken, setCurrentToken] = useState<ApiToken | null>(null)
  const [usageStats, setUsageStats] = useState<TokenUsageStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(
    async (orgId?: string) => {
      if (!orgId && !organizationId) return

      try {
        setIsLoading(true)
        const response = await apiClient.get<ApiToken[]>(`/organizations/${orgId || organizationId}/tokens`)
        if (response.success && response.data) {
          setTokens(response.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [organizationId],
  )

  const fetchTokenDetails = useCallback(async (tokenId: string) => {
    try {
      const response = await apiClient.get<ApiToken>(`/tokens/${tokenId}`)
      if (response.success && response.data) {
        setCurrentToken(response.data)
        return response.data
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const fetchUsageStats = useCallback(async (tokenId: string) => {
    try {
      const response = await apiClient.get<TokenUsageStats>(`/tokens/${tokenId}/usage`)
      if (response.success && response.data) {
        setUsageStats(response.data)
        return response.data
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const createToken = async (orgId: string, data: CreateTokenData) => {
    try {
      const response = await apiClient.post<{ token: string; tokenInfo: ApiToken }>(
        `/organizations/${orgId}/tokens`,
        data,
      )
      if (response.success && response.data) {
        setTokens((prev) => [...prev, response.data!.tokenInfo])
        return {
          success: true,
          token: response.data.token,
          tokenInfo: response.data.tokenInfo,
        }
      }
      return { success: false, error: "Failed to create token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateToken = async (tokenId: string, data: Partial<CreateTokenData>) => {
    try {
      const response = await apiClient.put<ApiToken>(`/tokens/${tokenId}`, data)
      if (response.success && response.data) {
        setTokens((prev) => prev.map((token) => (token.id === tokenId ? response.data! : token)))
        if (currentToken?.id === tokenId) {
          setCurrentToken(response.data)
        }
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to update token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const revokeToken = async (tokenId: string) => {
    try {
      const response = await apiClient.delete(`/tokens/${tokenId}`)
      if (response.success) {
        setTokens((prev) => prev.filter((token) => token.id !== tokenId))
        if (currentToken?.id === tokenId) {
          setCurrentToken(null)
        }
        return { success: true }
      }
      return { success: false, error: "Failed to revoke token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const regenerateToken = async (tokenId: string) => {
    try {
      const response = await apiClient.post<{ token: string; tokenInfo: ApiToken }>(`/tokens/${tokenId}/regenerate`)
      if (response.success && response.data) {
        setTokens((prev) => prev.map((token) => (token.id === tokenId ? response.data!.tokenInfo : token)))
        if (currentToken?.id === tokenId) {
          setCurrentToken(response.data.tokenInfo)
        }
        return {
          success: true,
          token: response.data.token,
          tokenInfo: response.data.tokenInfo,
        }
      }
      return { success: false, error: "Failed to regenerate token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const testToken = async (tokenId: string) => {
    try {
      const response = await apiClient.post(`/tokens/${tokenId}/test`)
      return { success: response.success, message: response.message }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const validateToken = async (token: string) => {
    try {
      const response = await apiClient.post("/auth/validate-token", { token })
      return { success: response.success, data: response.data }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    if (organizationId) {
      fetchTokens(organizationId)
    }
  }, [fetchTokens, organizationId])

  return {
    tokens,
    currentToken,
    usageStats,
    isLoading,
    error,
    fetchTokens,
    fetchTokenDetails,
    fetchUsageStats,
    createToken,
    updateToken,
    revokeToken,
    regenerateToken,
    testToken,
    validateToken,
    setCurrentToken,
  }
}
