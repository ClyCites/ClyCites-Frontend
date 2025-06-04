"use client"

import { useState, useCallback } from "react"
import { apiClient } from "@/lib/api"

interface User {
  id: string
  username: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  profilePicture?: string
  globalRole: string
  isActive: boolean
  isEmailVerified: boolean
  lastLogin: string
  createdAt: string
}

interface UserFilters {
  search?: string
  role?: string
  status?: "active" | "inactive"
  organization?: string
}

interface PaginationInfo {
  page: number
  limit: number
  total: number
  pages: number
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [organizationUsers, setOrganizationUsers] = useState<User[]>([])
  const [pagination, setPagination] = useState<PaginationInfo | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchAllUsers = useCallback(async (filters?: UserFilters & { page?: number; limit?: number }) => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams()

      if (filters?.page) queryParams.append("page", filters.page.toString())
      if (filters?.limit) queryParams.append("limit", filters.limit.toString())
      if (filters?.search) queryParams.append("search", filters.search)
      if (filters?.role) queryParams.append("role", filters.role)
      if (filters?.status) queryParams.append("status", filters.status)

      const response = await apiClient.get<{
        users: User[]
        pagination: PaginationInfo
      }>(`/users?${queryParams.toString()}`)

      if (response.success && response.data) {
        setUsers(response.data.users)
        setPagination(response.data.pagination)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const fetchOrganizationUsers = useCallback(async (orgId: string, filters?: UserFilters) => {
    try {
      setIsLoading(true)
      const queryParams = new URLSearchParams()

      if (filters?.search) queryParams.append("search", filters.search)
      if (filters?.role) queryParams.append("role", filters.role)
      if (filters?.status) queryParams.append("status", filters.status)

      const response = await apiClient.get<User[]>(`/organizations/${orgId}/users?${queryParams.toString()}`)

      if (response.success && response.data) {
        setOrganizationUsers(response.data)
      }
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const updateUserGlobalRole = async (userId: string, globalRole: string) => {
    try {
      const response = await apiClient.put(`/users/${userId}/global-role`, { globalRole })
      if (response.success) {
        // Update users in state
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, globalRole } : user)))
        return { success: true, message: response.message }
      }
      return { success: false, error: "Failed to update user role" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  const deactivateUser = async (userId: string) => {
    try {
      const response = await apiClient.put(`/users/${userId}/deactivate`)
      if (response.success) {
        // Update users in state
        setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, isActive: false } : user)))
        return { success: true, message: response.message }
      }
      return { success: false, error: "Failed to deactivate user" }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  return {
    users,
    organizationUsers,
    pagination,
    isLoading,
    error,
    fetchAllUsers,
    fetchOrganizationUsers,
    updateUserGlobalRole,
    deactivateUser,
  }
}
