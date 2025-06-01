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

// Backend response interface (what we actually get from API)
interface BackendOrganization {
  _id: string
  name: string
  slug: string
  description: string
  industry: string
  size: string
  website?: string
  logo?: string | null
  isActive: boolean
  isDefault: boolean
  createdBy: string
  subscription: {
    plan: string
    status: string
    limits: {
      maxUsers: number
      maxTeams: number
      maxApplications: number
      maxAPIRequests: number
    }
  }
  membership: {
    role: {
      _id: string
      name: string
      level: number
    }
    status: string
    joinedAt: string
  }
  owner: {
    _id: string
    email: string
    firstName: string
    lastName: string
    fullName: string
    isLocked: boolean
  }
  settings: {
    passwordPolicy: any
    sessionSettings: any
    allowPublicSignup: boolean
    requireEmailVerification: boolean
    enableSSO: boolean
  }
  createdAt: string
  updatedAt: string
  __v: number
}

// Function to transform backend data to frontend format
const transformOrganization = (backendOrg: BackendOrganization): Organization => {
  return {
    id: backendOrg._id,
    name: backendOrg.name,
    slug: backendOrg.slug,
    description: backendOrg.description,
    industry: backendOrg.industry,
    size: backendOrg.size,
    website: backendOrg.website,
    subscription: {
      plan: backendOrg.subscription.plan,
      status: backendOrg.subscription.status,
    },
    role: backendOrg.membership?.role?.name || "member",
    memberCount: 0, // We'll need to get this from a separate API call or calculate it
    createdAt: backendOrg.createdAt,
    updatedAt: backendOrg.updatedAt,
  }
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
      console.log("Fetching organizations...")
      setError(null) // Clear previous errors
      const response = await apiClient.get("/organizations")
      console.log("Organizations API response:", response)

      if (response.success && response.data) {
        // Check if response.data is an array
        if (Array.isArray(response.data)) {
          // Transform backend data to frontend format
          const transformedOrganizations = response.data.map(transformOrganization)
          setOrganizations(transformedOrganizations)
        }
        // Check if response.data.organizations exists and is an array (common API pattern)
        else if (
          typeof response.data === "object" &&
          response.data !== null &&
          "organizations" in response.data &&
          Array.isArray((response.data as any).organizations)
        ) {
          const transformedOrganizations = (response.data as any).organizations.map(transformOrganization)
          setOrganizations(transformedOrganizations)
        }
        // If it's a single organization object
        else if (typeof response.data === "object" && response.data !== null) {
          console.log("Single organization received:", response.data)
          // If it's a single organization, wrap it in an array
          const transformedOrganization = transformOrganization(response.data as BackendOrganization)
          setOrganizations([transformedOrganization])
        } else {
          console.warn("Unexpected organizations data format:", response.data)
          setOrganizations([]) // Set empty array for unexpected format
        }
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
      const response = await apiClient.get<BackendOrganization>(`/organizations/${id}`)
      if (response.success && response.data) {
        const transformedOrg = transformOrganization(response.data)
        setCurrentOrganization(transformedOrg)
        return transformedOrg
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
      const response = await apiClient.post<BackendOrganization>("/organizations", data)
      if (response.success && response.data) {
        const transformedOrg = transformOrganization(response.data)
        setOrganizations((prev) => [...prev, transformedOrg])
        return { success: true, data: transformedOrg }
      }
      return { success: false, error: "Failed to create organization" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateOrganization = async (id: string, data: Partial<CreateOrganizationData>) => {
    try {
      const response = await apiClient.put<BackendOrganization>(`/organizations/${id}`, data)
      if (response.success && response.data) {
        const transformedOrg = transformOrganization(response.data)
        setOrganizations((prev) => prev.map((org) => (org.id === id ? transformedOrg : org)))
        if (currentOrganization?.id === id) {
          setCurrentOrganization(transformedOrg)
        }
        return { success: true, data: transformedOrg }
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
