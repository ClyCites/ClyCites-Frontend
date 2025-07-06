import { apiClient } from "./api-client"

export interface Team {
  _id: string
  name: string
  description?: string
  organization: string
  parent?: {
    _id: string
    name: string
  }
  type?: "department" | "project" | "functional" | "cross-functional"
  visibility?: "public" | "private" | "secret"
  lead: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  _id: string
  user: {
    _id: string
    firstName: string
    lastName: string
    email: string
    profilePicture?: string
  }
  team: string
  role: {
    _id: string
    name: string
    level: number
  }
  status: "pending" | "active" | "inactive"
  joinedAt?: string
  invitedBy?: {
    _id: string
    firstName: string
    lastName: string
  }
}

export interface CreateTeamData {
  name: string
  description?: string
  type?: "department" | "project" | "functional" | "cross-functional"
  visibility?: "public" | "private" | "secret"
  parentId?: string
}

export interface InviteToTeamData {
  userId: string
  roleId: string
}

export const teamApi = {
  // Get organization teams
  getOrganizationTeams: async (orgId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get(`/organizations/${orgId}/teams`, { params })
    return response.data
  },

  // Create new team
  createTeam: async (orgId: string, data: CreateTeamData) => {
    const response = await apiClient.post(`/organizations/${orgId}/teams`, data)
    return response.data
  },

  // Get team details
  getTeam: async (teamId: string) => {
    const response = await apiClient.get(`/teams/${teamId}`)
    return response.data
  },

  // Update team
  updateTeam: async (teamId: string, data: Partial<CreateTeamData>) => {
    const response = await apiClient.put(`/teams/${teamId}`, data)
    return response.data
  },

  // Get team members
  getTeamMembers: async (teamId: string, params?: { page?: number; limit?: number }) => {
    const response = await apiClient.get(`/teams/${teamId}/members`, { params })
    return response.data
  },

  // Invite user to team
  inviteUserToTeam: async (teamId: string, data: InviteToTeamData) => {
    const response = await apiClient.post(`/teams/${teamId}/invite`, data)
    return response.data
  },

  removeTeamMember: async (teamId: string, userId: string) => {
    const response = await apiClient.delete(`/teams/${teamId}/members/${userId}`)
    return response.data
  },
}
