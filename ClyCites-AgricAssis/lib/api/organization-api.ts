import { makeAuthenticatedRequest } from "./api-client"

export interface Organization {
  _id: string
  name: string
  description?: string
  industry?: string
  size?: string
  website?: string
  owner: string
  createdBy: string
  settings?: Record<string, any>
  createdAt: string
  updatedAt: string
  membership?: {
    role: {
      name: string
      level: number
    }
    status: string
    joinedAt: string
  }
}

export interface CreateOrganizationData {
  name: string
  description?: string
  industry?: string
  size?: string
  website?: string
}

export interface OrganizationMember {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profilePicture?: string
    lastLogin?: string
  }
  role: {
    _id: string
    name: string
    level: number
  }
  status: "active" | "pending" | "inactive"
  joinedAt: string
  invitedBy?: {
    firstName: string
    lastName: string
  }
  invitedAt?: string
}

export const organizationApi = {
  // Get user's organizations
  getUserOrganizations: async () => {
    return makeAuthenticatedRequest("/organizations")
  },

  // Create organization
  createOrganization: async (data: CreateOrganizationData) => {
    return makeAuthenticatedRequest("/organizations", {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get organization details
  getOrganization: async (orgId: string) => {
    return makeAuthenticatedRequest(`/organizations/${orgId}`)
  },

  // Update organization
  updateOrganization: async (orgId: string, data: Partial<CreateOrganizationData>) => {
    return makeAuthenticatedRequest(`/organizations/${orgId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Invite user to organization
  inviteUser: async (orgId: string, email: string, roleId: string, message?: string) => {
    return makeAuthenticatedRequest(`/organizations/${orgId}/invite`, {
      method: "POST",
      body: JSON.stringify({ email, roleId, message }),
    })
  },

  // Get organization members
  getMembers: async (orgId: string, page = 1, limit = 20, status = "active") => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString(), status })
    return makeAuthenticatedRequest(`/organizations/${orgId}/members?${params}`)
  },
}
