"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface Team {
  id: string
  name: string
  description: string
  type: "department" | "project" | "functional" | "cross-functional"
  visibility: "public" | "private" | "secret"
  memberCount: number
  parentId?: string
  parent?: {
    id: string
    name: string
  }
  children?: Team[]
  createdAt: string
  updatedAt: string
}

interface TeamMember {
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
  status: "active" | "pending" | "suspended"
}

interface CreateTeamData {
  name: string
  description?: string
  type?: Team["type"]
  visibility?: Team["visibility"]
  parentId?: string
}

interface InviteToTeamData {
  userId: string
  roleId: string
}

export function useTeams(organizationId?: string) {
  const [teams, setTeams] = useState<Team[]>([])
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null)
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTeams = useCallback(
    async (orgId?: string) => {
      if (!orgId && !organizationId) return

      try {
        setIsLoading(true)
        const response = await apiClient.get<Team[]>(`/organizations/${orgId || organizationId}/teams`)
        if (response.success && response.data) {
          setTeams(response.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [organizationId],
  )

  const createTeam = async (orgId: string, data: CreateTeamData) => {
    try {
      const response = await apiClient.post<Team>(`/organizations/${orgId}/teams`, data)
      if (response.success && response.data) {
        setTeams((prev) => [...prev, response.data!])
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to create team" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const inviteToTeam = async (teamId: string, inviteData: InviteToTeamData) => {
    try {
      const response = await apiClient.post(`/teams/${teamId}/invite`, inviteData)
      if (response.success) {
        return { success: true, message: response.message }
      }
      return { success: false, error: "Failed to send team invitation" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    if (organizationId) {
      fetchTeams(organizationId)
    }
  }, [fetchTeams, organizationId])

  return {
    teams,
    currentTeam,
    teamMembers,
    isLoading,
    error,
    fetchTeams,
    createTeam,
    inviteToTeam,
    setCurrentTeam,
  }
}
