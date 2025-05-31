"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface Application {
  id: string
  name: string
  description: string
  type: "web" | "mobile" | "desktop" | "api" | "service" | "integration"
  platform?: "web" | "ios" | "android" | "windows" | "macos" | "linux" | "cross-platform"
  clientId: string
  clientSecret: string
  redirectUris: string[]
  scopes: string[]
  grantTypes: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  usage: {
    totalRequests: number
    activeUsers: number
    lastUsed: string | null
  }
}

interface CreateApplicationData {
  name: string
  description?: string
  type: Application["type"]
  platform?: Application["platform"]
  redirectUris?: string[]
  scopes: string[]
  grantTypes?: string[]
}

export function useApplications(organizationId?: string) {
  const [applications, setApplications] = useState<Application[]>([])
  const [currentApplication, setCurrentApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(
    async (orgId?: string) => {
      if (!orgId && !organizationId) return

      try {
        setIsLoading(true)
        const response = await apiClient.get<Application[]>(`/organizations/${orgId || organizationId}/applications`)
        if (response.success && response.data) {
          setApplications(response.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [organizationId],
  )

  const fetchApplication = useCallback(async (appId: string) => {
    try {
      const response = await apiClient.get<Application>(`/applications/${appId}`)
      if (response.success && response.data) {
        setCurrentApplication(response.data)
        return response.data
      }
    } catch (err: any) {
      setError(err.message)
      throw err
    }
  }, [])

  const createApplication = async (orgId: string, data: CreateApplicationData) => {
    try {
      const response = await apiClient.post<Application>(`/organizations/${orgId}/applications`, data)
      if (response.success && response.data) {
        setApplications((prev) => [...prev, response.data!])
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to create application" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const regenerateClientSecret = async (appId: string) => {
    try {
      const response = await apiClient.post<{ clientSecret: string }>(`/applications/${appId}/regenerate-secret`)
      if (response.success && response.data) {
        setApplications((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, clientSecret: response.data!.clientSecret } : app)),
        )
        if (currentApplication?.id === appId) {
          setCurrentApplication((prev) => (prev ? { ...prev, clientSecret: response.data!.clientSecret } : null))
        }
        return { success: true, clientSecret: response.data.clientSecret }
      }
      return { success: false, error: "Failed to regenerate client secret" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    if (organizationId) {
      fetchApplications(organizationId)
    }
  }, [fetchApplications, organizationId])

  return {
    applications,
    currentApplication,
    isLoading,
    error,
    fetchApplications,
    fetchApplication,
    createApplication,
    regenerateClientSecret,
    setCurrentApplication,
  }
}
