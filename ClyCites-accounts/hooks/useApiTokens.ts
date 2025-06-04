"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface ApiToken {
  id: string
  name: string
  description?: string
  token: string
  permissions: string[]
  expiresAt?: string
  lastUsed?: string
  isActive: boolean
  usage: {
    requestCount: number
    lastRequest?: string
  }
  createdAt: string
  updatedAt: string
}

interface CreateTokenData {
  name: string
  description?: string
  permissions: string[]
  expiresAt?: string
}

// Backend response interface
interface BackendApiToken {
  _id: string
  name: string
  description?: string
  token: string
  permissions: string[]
  expiresAt?: string
  lastUsed?: string
  isActive: boolean
  userId: string
  organizationId?: string
  usage?: {
    requestCount: number
    lastRequest?: string
  }
  createdAt: string
  updatedAt: string
  __v: number
}

// Transform backend data to frontend format
const transformApiToken = (backendToken: BackendApiToken): ApiToken => {
  return {
    id: backendToken._id,
    name: backendToken.name,
    description: backendToken.description,
    token: backendToken.token,
    permissions: backendToken.permissions,
    expiresAt: backendToken.expiresAt,
    lastUsed: backendToken.lastUsed,
    isActive: backendToken.isActive,
    usage: backendToken.usage || { requestCount: 0 },
    createdAt: backendToken.createdAt,
    updatedAt: backendToken.updatedAt,
  }
}

export function useApiTokens(organizationId?: string) {
  const [tokens, setTokens] = useState<ApiToken[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTokens = useCallback(async () => {
    if (!organizationId) {
      setTokens([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<any>(`/organizations/${organizationId}/tokens`)

      console.log("Tokens API Response:", response)

      if (response.success && response.data) {
        let tokensData: BackendApiToken[] = []

        // Handle different possible response structures
        if (Array.isArray(response.data)) {
          tokensData = response.data
        } else if (response.data.tokens && Array.isArray(response.data.tokens)) {
          tokensData = response.data.tokens
        } else if (response.data.data && Array.isArray(response.data.data)) {
          tokensData = response.data.data
        } else if (typeof response.data === "object" && response.data._id) {
          // Single token object
          tokensData = [response.data]
        } else {
          console.warn("Unexpected tokens data structure:", response.data)
          tokensData = []
        }

        const transformedTokens = tokensData.map(transformApiToken)
        setTokens(transformedTokens)
      } else {
        setTokens([])
      }
    } catch (err: any) {
      console.error("Failed to fetch tokens:", err)
      setError(err.message || "Failed to load tokens")
      setTokens([])
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  const createToken = async (orgId: string, data: CreateTokenData) => {
    try {
      const response = await apiClient.post<BackendApiToken>(`/organizations/${orgId}/tokens`, data)
      if (response.success && response.data) {
        const transformedToken = transformApiToken(response.data)
        setTokens((prev) => [...prev, transformedToken])
        return { success: true, data: transformedToken }
      }
      return { success: false, error: "Failed to create token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const deleteToken = async (tokenId: string) => {
    try {
      const response = await apiClient.delete(`/tokens/${tokenId}`)
      if (response.success) {
        setTokens((prev) => prev.filter((token) => token.id !== tokenId))
        return { success: true }
      }
      return { success: false, error: "Failed to delete token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const regenerateToken = async (tokenId: string) => {
    try {
      const response = await apiClient.post<BackendApiToken>(`/tokens/${tokenId}/regenerate`)
      if (response.success && response.data) {
        const transformedToken = transformApiToken(response.data)
        setTokens((prev) => prev.map((token) => (token.id === tokenId ? transformedToken : token)))
        return { success: true, data: transformedToken }
      }
      return { success: false, error: "Failed to regenerate token" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchTokens()
  }, [fetchTokens])

  return {
    tokens,
    isLoading,
    error,
    fetchTokens,
    createToken,
    deleteToken,
    regenerateToken,
  }
}
