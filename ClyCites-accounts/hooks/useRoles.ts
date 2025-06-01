"use client"

import { useState, useEffect, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface Role {
  id: string
  name: string
  description: string
  level: number
  permissions: string[]
  inheritsFrom: string[]
  isSystemRole: boolean
  isCustom: boolean
  userCount: number
  createdAt: string
  updatedAt: string
}

interface CreateRoleData {
  name: string
  description?: string
  level: number
  permissions: string[]
  inheritsFrom?: string[]
}

export function useRoles(organizationId?: string) {
  const [roles, setRoles] = useState<Role[]>([])
  const [currentRole, setCurrentRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(
    async (orgId?: string) => {
      if (!orgId && !organizationId) return

      try {
        setIsLoading(true)
        const response = await apiClient.get<Role[]>(`/organizations/${orgId || organizationId}/roles`)
        if (response.success && response.data) {
          setRoles(response.data)
        }
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    },
    [organizationId],
  )

  const createRole = async (orgId: string, data: CreateRoleData) => {
    try {
      const response = await apiClient.post<Role>(`/organizations/${orgId}/roles`, data)
      if (response.success && response.data) {
        setRoles((prev) => [...prev, response.data!])
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to create role" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const updateRole = async (roleId: string, data: Partial<CreateRoleData>) => {
    try {
      const response = await apiClient.put<Role>(`/roles/${roleId}`, data)
      if (response.success && response.data) {
        setRoles((prev) => prev.map((role) => (role.id === roleId ? response.data! : role)))
        if (currentRole?.id === roleId) {
          setCurrentRole(response.data)
        }
        return { success: true, data: response.data }
      }
      return { success: false, error: "Failed to update role" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  useEffect(() => {
    if (organizationId) {
      fetchRoles(organizationId)
    }
  }, [fetchRoles, organizationId])

  return {
    roles,
    currentRole,
    isLoading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    setCurrentRole,
  }
}
