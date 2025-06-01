"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface Organization {
  id: string
  name: string
  slug: string
  description: string
  industry: string
  size: string
  website?: string
  subscription: {
    plan: string
    status: string
  }
  role: string
  memberCount: number
  createdAt: string
  updatedAt: string
}

interface CreateOrganizationData {
  name: string
  description?: string
  website?: string
  industry?: string
  size?: string
}

interface InviteUserData {
  email: string
  roleId: string
  message?: string
}

interface OrganizationMember {
  id: string
  user: {
    id: string
    username: string
    email: string
    firstName: string
    lastName: string
    profilePicture?: string
  }
  role: {
    id: string
    name: string
    level: number
  }
  joinedAt: string
  invitedBy: string
  status: "active" | "pending" | "suspended"
}

export function useOrganizations() {
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [currentOrganization, setCurrentOrganization] = useState<Organization | null>(null)
  const [members, setMembers] = useState<OrganizationMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrganizations = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null) // Clear previous errors
      const response = await apiClient.get<Organization[]>("/organizations")
      if (response.success && response.data) {
        setOrganizations(response.data)
      } else {
        setOrganizations([]) // Set empty array if no data
      }
    } catch (err: any) {
      console.error("Failed to fetch organizations:", err)
      setError(err.message || "Failed to load organizations")
      setOrganizations([]) // Set empty array on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchOrganization = useCallback(async (id: string) => {
    try {
      setError(null)
      const response = await apiClient.get<Organization>(`/organizations/${id}`)
      if (response.success && response.data) {
        setCurrentOrganization(response.data)
        return response.data
      }
      throw new Error("Organization not found")
    } catch (err: any) {
      console.error("Failed to fetch organization:", err)
      setError(err.message || "Failed to load organization")
      throw err
    }
  }, [])

  const fetchMembers = useCallback(async (orgId: string) => {
    try {
      setError(null)
      const response = await apiClient.get<OrganizationMember[]>(`/organizations/${orgId}/members`)
      if (response.success && response.data) {
        setMembers(response.data)
        return response.data
      }
      setMembers([])
      return []
    } catch (err: any) {
      console.error("Failed to fetch members:", err)
      setError(err.message || "Failed to load members")
      setMembers([])
      throw err
    }
  }, [])

  const createOrganization = async (data: CreateOrganizationData) => {
    try {
      const response = await apiClient.post<Organization>("/organizations", data)
      if (response.success && response.data) {
        setOrganizations((prev) => [...prev, response.data!])
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to create organization" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateOrganization = async (id: string, data: Partial<CreateOrganizationData>) => {
    try {
      const response = await apiClient.put<Organization>(`/organizations/${id}`, data)
      if (response.success && response.data) {
        setOrganizations((prev) => prev.map((org) => (org.id === id ? response.data! : org)))
        if (currentOrganization?.id === id) {
          setCurrentOrganization(response.data)
        }
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to update organization" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const inviteUser = async (orgId: string, inviteData: InviteUserData) => {
    try {
      const response = await apiClient.post(`/organizations/${orgId}/invite`, inviteData)
      if (response.success) {
        // Refresh members list
        await fetchMembers(orgId)
        return { success: true, message: response.message }
      }
      return { success: false, error: "Failed to send invitation" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    fetchOrganizations()
  }, [fetchOrganizations])

  return {
    organizations,
    currentOrganization,
    members,
    isLoading,
    error,
    fetchOrganizations,
    fetchOrganization,
    fetchMembers,
    createOrganization,
    updateOrganization,
    inviteUser,
    setCurrentOrganization,
  }
}
