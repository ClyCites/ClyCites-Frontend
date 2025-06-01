"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface Application {
  id: string
  name: string
  description: string
  type: "web" | "mobile" | "desktop" | "api" | "service" | "integration"
  clientId: string
  clientSecret: string
  redirectUris: string[]
  scopes: string[]
  grantTypes: string[]
  isActive: boolean
  usage: {
    activeUsers: number
    totalRequests: number
  }
  createdAt: string
  updatedAt: string
}

interface CreateApplicationData {
  name: string
  description?: string
  type: "web" | "mobile" | "desktop" | "api" | "service" | "integration"
  platform?: string
  redirectUris: string[]
  scopes: string[]
  grantTypes: string[]
}

// Backend response interface
interface BackendApplication {
  _id: string
  name: string
  description: string
  type: string
  clientId: string
  clientSecret: string
  redirectUris: string[]
  scopes: string[]
  grantTypes: string[]
  isActive: boolean
  organizationId: string
  createdBy: string
  usage?: {
    activeUsers: number
    totalRequests: number
  }
  createdAt: string
  updatedAt: string
  __v: number
}

// Transform backend data to frontend format
const transformApplication = (backendApp: BackendApplication): Application => {
  return {
    id: backendApp._id,
    name: backendApp.name,
    description: backendApp.description,
    type: backendApp.type as Application["type"],
    clientId: backendApp.clientId,
    clientSecret: backendApp.clientSecret,
    redirectUris: backendApp.redirectUris,
    scopes: backendApp.scopes,
    grantTypes: backendApp.grantTypes,
    isActive: backendApp.isActive,
    usage: backendApp.usage || { activeUsers: 0, totalRequests: 0 },
    createdAt: backendApp.createdAt,
    updatedAt: backendApp.updatedAt,
  }
}

export function useApplications(organizationId?: string) {
  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchApplications = useCallback(async () => {
    if (!organizationId) {
      setApplications([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const response = await apiClient.get<BackendApplication[]>(`/organizations/${organizationId}/applications`)
      if (response.success && response.data) {
        const transformedApplications = response.data.map(transformApplication)
        setApplications(transformedApplications)
      } else {
        setApplications([])
      }
    } catch (err: any) {
      console.error("Failed to fetch applications:", err)
      setError(err.message || "Failed to load applications")
      setApplications([])
    } finally {
      setIsLoading(false)
    }
  }, [organizationId])

  const createApplication = async (orgId: string, data: CreateApplicationData) => {
    try {
      const response = await apiClient.post<BackendApplication>(`/organizations/${orgId}/applications`, data)
      if (response.success && response.data) {
        const transformedApp = transformApplication(response.data)
        setApplications((prev) => [...prev, transformedApp])
        return { success: true, data: transformedApp }
      }
      return { success: false, error: "Failed to create application" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const regenerateClientSecret = async (appId: string) => {
    try {
      const response = await apiClient.post<BackendApplication>(`/applications/${appId}/regenerate-secret`)
      if (response.success && response.data) {
        const transformedApp = transformApplication(response.data)
        setApplications((prev) => prev.map((app) => (app.id === appId ? transformedApp : app)))
        return { success: true, data: transformedApp }
      }
      return { success: false, error: "Failed to regenerate client secret" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchApplications()
  }, [fetchApplications])

  return {
    applications,
    isLoading,
    error,
    fetchApplications,
    createApplication,
    regenerateClientSecret,
  }
}
