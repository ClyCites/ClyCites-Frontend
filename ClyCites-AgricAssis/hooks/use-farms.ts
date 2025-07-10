"use client"

import { useState, useEffect, useCallback } from "react"
import { farmApi, type Farm, type CreateFarmData, type FarmFilters } from "@/lib/api/farm-api"
import { toast } from "sonner"

interface UseFarmsOptions {
  autoLoad?: boolean
  organizationId?: string
  filters?: FarmFilters
  pageSize?: number
}

interface PaginationState {
  page: number
  limit: number
  total: number
  totalPages: number
  hasMore: boolean
}

interface UseFarmsReturn {
  farms: Farm[]
  loading: boolean
  error: string | null
  pagination: PaginationState
  createFarm: (data: CreateFarmData) => Promise<Farm | null>
  updateFarm: (id: string, data: Partial<CreateFarmData>) => Promise<Farm | null>
  deleteFarm: (id: string) => Promise<boolean>
  refreshFarms: () => Promise<void>
  loadMore: () => Promise<void>
  setFilters: (filters: FarmFilters) => void
}

const initialPagination: PaginationState = {
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  hasMore: false,
}

export function useFarms(options: UseFarmsOptions = {}): UseFarmsReturn {
  const { autoLoad = true, organizationId, filters: initialFilters = {}, pageSize = 10 } = options

  const [farms, setFarms] = useState<Farm[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [filters, setFilters] = useState<FarmFilters>({
    ...initialFilters,
    ...(organizationId && { organizationId }),
  })
  const [pagination, setPagination] = useState<PaginationState>({
    ...initialPagination,
    limit: pageSize,
  })

  const loadFarms = useCallback(
    async (page = 1, append = false) => {
      try {
        setLoading(true)
        setError(null)

        let response
        if (organizationId) {
          response = await farmApi.getFarmsByOrganization(organizationId, filters, { page, limit: pageSize })
        } else {
          response = await farmApi.getFarms(filters, { page, limit: pageSize })
        }

        if (response.success) {
          if (append) {
            setFarms((prev) => [...prev, ...response.data])
          } else {
            setFarms(response.data)
          }

          setPagination(response.pagination || initialPagination)
        } else {
          throw new Error(response.message || "Failed to load farms")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load farms"
        setError(errorMessage)
        console.error("Error loading farms:", err)
        toast.error(errorMessage)
      } finally {
        setLoading(false)
      }
    },
    [filters, pageSize, organizationId],
  )

  const refreshFarms = useCallback(async () => {
    await loadFarms(1, false)
  }, [loadFarms])

  const loadMore = useCallback(async () => {
    if (pagination?.hasMore && !loading) {
      await loadFarms(pagination.page + 1, true)
    }
  }, [loadFarms, pagination?.hasMore, pagination?.page, loading])

  const createFarm = useCallback(async (data: CreateFarmData): Promise<Farm | null> => {
    try {
      setError(null)
      const response = await farmApi.createFarm(data)

      if (response.success && response.data) {
        const newFarm = response.data
        // Add to the beginning of the list
        setFarms((prev) => [newFarm, ...prev])
        setPagination((prev) => ({ ...prev, total: prev.total + 1 }))
        toast.success("Farm created successfully")
        return newFarm
      } else {
        throw new Error(response.message || "Failed to create farm")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create farm"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  const updateFarm = useCallback(async (id: string, data: Partial<CreateFarmData>): Promise<Farm | null> => {
    try {
      setError(null)
      const response = await farmApi.updateFarm(id, data)

      if (response.success && response.data) {
        const updatedFarm = response.data
        // Update in the list
        setFarms((prev) => prev.map((farm) => (farm._id === id ? updatedFarm : farm)))
        toast.success("Farm updated successfully")
        return updatedFarm
      } else {
        throw new Error(response.message || "Failed to update farm")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update farm"
      setError(errorMessage)
      toast.error(errorMessage)
      return null
    }
  }, [])

  const deleteFarm = useCallback(async (id: string): Promise<boolean> => {
    try {
      setError(null)
      const response = await farmApi.deleteFarm(id)

      if (response.success) {
        // Remove from the list
        setFarms((prev) => prev.filter((farm) => farm._id !== id))
        setPagination((prev) => ({ ...prev, total: prev.total - 1 }))
        toast.success("Farm deleted successfully")
        return true
      } else {
        throw new Error(response.message || "Failed to delete farm")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to delete farm"
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }, [])

  const updateFilters = useCallback(
    (newFilters: FarmFilters) => {
      setFilters({
        ...newFilters,
        ...(organizationId && { organizationId }),
      })
      setPagination((prev) => ({ ...prev, page: 1 }))
    },
    [organizationId],
  )

  // Load farms when filters change or on mount
  useEffect(() => {
    if (autoLoad) {
      loadFarms(1, false)
    }
  }, [loadFarms, autoLoad])

  // Update filters when organizationId changes
  useEffect(() => {
    if (organizationId) {
      setFilters((prev) => ({ ...prev, organizationId }))
    }
  }, [organizationId])

  return {
    farms,
    loading,
    error,
    pagination,
    createFarm,
    updateFarm,
    deleteFarm,
    refreshFarms,
    loadMore,
    setFilters: updateFilters,
  }
}

// Hook for single farm management
interface UseFarmOptions {
  farmId: string
  autoLoad?: boolean
}

interface UseFarmReturn {
  farm: Farm | null
  loading: boolean
  error: string | null
  updateFarm: (data: Partial<CreateFarmData>) => Promise<Farm | null>
  refreshFarm: () => Promise<void>
}

export function useFarm(options: UseFarmOptions): UseFarmReturn {
  const { farmId, autoLoad = true } = options

  const [farm, setFarm] = useState<Farm | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadFarm = useCallback(async () => {
    if (!farmId) return

    try {
      setLoading(true)
      setError(null)

      const response = await farmApi.getFarm(farmId)

      if (response.success && response.data) {
        setFarm(response.data)
      } else {
        throw new Error(response.message || "Failed to load farm")
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load farm"
      setError(errorMessage)
      console.error("Error loading farm:", err)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }, [farmId])

  const updateFarm = useCallback(
    async (data: Partial<CreateFarmData>): Promise<Farm | null> => {
      if (!farmId) return null

      try {
        setError(null)
        const response = await farmApi.updateFarm(farmId, data)

        if (response.success && response.data) {
          const updatedFarm = response.data
          setFarm(updatedFarm)
          toast.success("Farm updated successfully")
          return updatedFarm
        } else {
          throw new Error(response.message || "Failed to update farm")
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to update farm"
        setError(errorMessage)
        toast.error(errorMessage)
        return null
      }
    },
    [farmId],
  )

  const refreshFarm = useCallback(async () => {
    await loadFarm()
  }, [loadFarm])

  // Load farm on mount
  useEffect(() => {
    if (autoLoad && farmId) {
      loadFarm()
    }
  }, [loadFarm, autoLoad, farmId])

  return {
    farm,
    loading,
    error,
    updateFarm,
    refreshFarm,
  }
}
