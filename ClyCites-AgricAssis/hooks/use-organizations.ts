"use client"

import { useState, useEffect, useCallback } from "react"
import {
  organizationApi,
  type Organization,
  type CreateOrganizationData,
  type OrganizationFilters,
} from "@/lib/api/organization-api"
import { toast } from "sonner"

interface UseOrganizationsOptions {
  autoLoad?: boolean
  filters?: OrganizationFilters
  pageSize?: number
}

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface UseOrganizationsReturn {
  organizations: Organization[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  createOrganization: (data: CreateOrganizationData) => Promise<Organization | null>
  updateOrganization: (id: string, data: Partial<CreateOrganizationData>) => Promise<Organization | null>
  deleteOrganization: (id: string) => Promise<boolean>
  refreshOrganizations: () => Promise<void>
  loadMore: () => Promise<void>
  setFilters: (filters: OrganizationFilters) => void
}

const initialPagination: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false,
}

export function useOrganizations(options: UseOrganizationsOptions = {}): UseOrganizationsReturn {
  const { autoLoad = true, filters: initialFilters = {}, pageSize = 10 } = options

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<OrganizationFilters>(initialFilters)
  const [pagination, setPagination] = useState<PaginationState>({
    ...initialPagination,
    limit: pageSize,
  })

  const loadOrganizations = useCallback(
    async (page = 1, append = false) => {
      try {
        setLoading(true)
        setError(null)

        const response = await organizationApi.getOrganizations(filters, { page, limit: pageSize })

        if (response.success) {
          if (append) {
            setOrganizations((prev) => [...prev, ...response.data])
          } else {
            setOrganizations(response.data)
          }

          setPagination(response.pagination || initialPagination)
        } else {
          throw new Error(response.message || "Failed to load organizations")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load organizations"
        setError(errorMessage)
        console.error("Error loading organizations:", err)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [filters, pageSize],
  )

  const refreshOrganizations = useCallback(async () => {
    await loadOrganizations(1, false)
  }, [loadOrganizations])

  const loadMore = useCallback(async () => {
    if (pagination?.hasMore && !loading) {
      await loadOrganizations(pagination.page + 1, true)
    }
  }, [loadOrganizations, pagination?.hasMore, pagination?.page, loading])

  const createOrganization = useCallback(async (data: CreateOrganizationData): Promise<Organization | null> => {
    try {
      setError(null)
      const response = await organizationApi.createOrganization(data)

      if (response.success && response.data) {
        const newOrganization = response.data
        // Add to the beginning of the list
        setOrganizations((prev) => [newOrganization, ...prev])
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }))
        toast.success("Organization created successfully")
        return newOrganization
      } else {
        throw new Error(response.message || "Failed to create organization")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create organization"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  const updateOrganization = useCallback(
    async (id: string, data: Partial<CreateOrganizationData>): Promise<Organization | null> => {
      try {
        setError(null)
        const response = await organizationApi.updateOrganization(id, data)

        if (response.success && response.data) {
          const updatedOrganization = response.data
          // Update in the list
          setOrganizations((prev) => prev.map((org) => (org._id === id ? updatedOrganization : org)))
          toast.success("Organization updated successfully")
          return updatedOrganization
        } else {
          throw new Error(response.message || "Failed to update organization")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update organization"
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      }
    },
    [],
  )

  const deleteOrganization = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await organizationApi.deleteOrganization(id)

      if (response.success) {
        // Remove from the list
        setOrganizations((prev) => prev.filter((org) => org._id !== id))
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
        toast.success("Organization deleted successfully")
        return true
      } else {
        throw new Error(response.message || "Failed to delete organization")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete organization"
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }, [])

  const updateFilters = useCallback((newFilters: OrganizationFilters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, page: 1 }))
  }, [])

  // Load organizations when filters change or on mount
  useEffect(() => {
    if (autoLoad) {
      loadOrganizations(1, false)
    }
  }, [loadOrganizations, autoLoad])

  return {
    organizations,
    loading,
    error,
    pagination,
    createOrganization,
    updateOrganization,
    deleteOrganization,
    refreshOrganizations,
    loadMore,
    setFilters: updateFilters,
  }
}

// Hook for organization selector with persistence
interface UseOrganizationSelectorOptions {
  autoSelectFirst?: boolean
  persistSelection?: boolean
  storageKey?: string
}

interface UseOrganizationSelectorReturn {
  organizations: Organization[]
  selectedOrganization: Organization | null
  loading: boolean
  error: string | null
  selectOrganization: (organization: Organization | null) => void
  refreshOrganizations: () => Promise<void>
}

export function useOrganizationSelector(options: UseOrganizationSelectorOptions = {}): UseOrganizationSelectorReturn {
  const { autoSelectFirst = false, persistSelection = true, storageKey = "selected_organization_id" } = options

  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null)

  // Use getUserOrganizations instead of getOrganizations for selector
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUserOrganizations = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const response = await organizationApi.getUserOrganizations()

      if (response.success && response.data) {
        setOrganizations(response.data)
      } else {
        throw new Error(response.message || "Failed to load organizations")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load organizations"
      setError(errorMessage)
      console.error("Error loading user organizations:", err)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshOrganizations = useCallback(async () => {
    await loadUserOrganizations()
  }, [loadUserOrganizations])

  // Load persisted selection
  useEffect(() => {
    if (persistSelection && typeof window !== "undefined") {
      const savedId = localStorage.getItem(storageKey)
      if (savedId && organizations.length > 0) {
        const savedOrg = organizations.find((org) => org._id === savedId)
        if (savedOrg) {
          setSelectedOrganization(savedOrg)
          return
        }
      }
    }

    // Auto-select first organization if enabled and no selection
    if (autoSelectFirst && organizations.length > 0 && !selectedOrganization) {
      setSelectedOrganization(organizations[0])
    }
  }, [organizations, autoSelectFirst, persistSelection, storageKey, selectedOrganization])

  const selectOrganization = useCallback(
    (organization: Organization | null) => {
      setSelectedOrganization(organization)

      if (persistSelection && typeof window !== "undefined") {
        if (organization) {
          localStorage.setItem(storageKey, organization._id)
        } else {
          localStorage.removeItem(storageKey)
        }
      }
    },
    [persistSelection, storageKey],
  )

  // Load user organizations on mount
  useEffect(() => {
    loadUserOrganizations()
  }, [loadUserOrganizations])

  return {
    organizations,
    selectedOrganization,
    loading,
    error,
    selectOrganization,
    refreshOrganizations,
  }
}
