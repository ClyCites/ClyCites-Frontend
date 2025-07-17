import { makeAuthenticatedRequest, type PaginatedApiResponse, type ApiResponse } from "./api-client"

export interface Organization {
  _id: string
  name: string
  description?: string
  type: "individual" | "company" | "cooperative" | "government"
  address?: {
    street?: string
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  contactInfo?: {
    email?: string
    phone?: string
    website?: string
  }
  settings?: {
    timezone?: string
    currency?: string
    language?: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
  memberCount?: number
  farmCount?: number
}

export interface CreateOrganizationData {
  name: string
  description?: string
  type: Organization["type"]
  address?: Organization["address"]
  contactInfo?: Organization["contactInfo"]
  settings?: Organization["settings"]
}

export interface UpdateOrganizationData extends Partial<CreateOrganizationData> {
  isActive?: boolean
}

export interface OrganizationFilters {
  type?: string
  isActive?: boolean
  search?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface OrganizationMember {
  _id: string
  userId: string
  organizationId: string
  role: "owner" | "admin" | "member" | "viewer"
  joinedAt: string
  user: {
    _id: string
    name: string
    email: string
    avatar?: string
  }
}

export interface InviteUserData {
  email: string
  role: OrganizationMember["role"]
  message?: string
}

// Organization API functions
export const organizationApi = {
  // Get all organizations with optional filters and pagination
  getOrganizations: async (
    filters: OrganizationFilters = {},
    pagination: PaginationParams = {},
  ): Promise<PaginatedApiResponse<Organization>> => {
    const params = {
      ...filters,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
    }

    return makeAuthenticatedRequest<PaginatedApiResponse<Organization>>("/organizations", {
      method: "GET",
      params,
    })
  },

  // Get user's organizations - Fixed endpoint
  getUserOrganizations: async (): Promise<ApiResponse<Organization[]>> => {
    return makeAuthenticatedRequest<ApiResponse<Organization[]>>("/organizations/my-organizations")
  },

  // Get a single organization by ID
  getOrganization: async (id: string): Promise<ApiResponse<Organization>> => {
    return makeAuthenticatedRequest<ApiResponse<Organization>>(`/organizations/${id}`)
  },

  // Create a new organization
  createOrganization: async (data: CreateOrganizationData): Promise<ApiResponse<Organization>> => {
    return makeAuthenticatedRequest<ApiResponse<Organization>>("/organizations", {
      method: "POST",
      body: data,
    })
  },

  // Update an existing organization
  updateOrganization: async (id: string, data: UpdateOrganizationData): Promise<ApiResponse<Organization>> => {
    return makeAuthenticatedRequest<ApiResponse<Organization>>(`/organizations/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  // Delete an organization
  deleteOrganization: async (id: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/organizations/${id}`, {
      method: "DELETE",
    })
  },

  // Get organization members
  getOrganizationMembers: async (organizationId: string): Promise<ApiResponse<OrganizationMember[]>> => {
    return makeAuthenticatedRequest<ApiResponse<OrganizationMember[]>>(`/organizations/${organizationId}/members`)
  },

  // Invite user to organization
  inviteUser: async (organizationId: string, data: InviteUserData): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/organizations/${organizationId}/invite`, {
      method: "POST",
      body: data,
    })
  },

  // Remove user from organization
  removeMember: async (organizationId: string, userId: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/organizations/${organizationId}/members/${userId}`, {
      method: "DELETE",
    })
  },

  // Update member role
  updateMemberRole: async (
    organizationId: string,
    userId: string,
    role: OrganizationMember["role"],
  ): Promise<ApiResponse<OrganizationMember>> => {
    return makeAuthenticatedRequest<ApiResponse<OrganizationMember>>(
      `/organizations/${organizationId}/members/${userId}`,
      {
        method: "PATCH",
        body: { role },
      },
    )
  },

  // Join organization (accept invitation)
  joinOrganization: async (organizationId: string, inviteToken: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/organizations/${organizationId}/join`, {
      method: "POST",
      body: { inviteToken },
    })
  },

  // Leave organization
  leaveOrganization: async (organizationId: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/organizations/${organizationId}/leave`, {
      method: "POST",
    })
  },

  // Get organization statistics
  getOrganizationStats: async (
    organizationId: string,
  ): Promise<
    ApiResponse<{
      memberCount: number
      farmCount: number
      totalArea: number
      activeFarms: number
      recentActivity: any[]
    }>
  > => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/organizations/${organizationId}/stats`)
  },
}
