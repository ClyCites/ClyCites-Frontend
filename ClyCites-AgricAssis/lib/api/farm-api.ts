import { makeAuthenticatedRequest, type PaginatedApiResponse, type ApiResponse } from "./api-client"

export interface Farm {
  _id: string
  name: string
  description?: string
  organizationId: string
  location: {
    address: string
    coordinates?: {
      latitude: number
      longitude: number
    }
    city?: string
    state?: string
    country?: string
    zipCode?: string
  }
  area: {
    total: number
    unit: "acres" | "hectares" | "square_meters" | "square_feet"
    cultivated?: number
    irrigated?: number
  }
  farmType: "crop" | "livestock" | "mixed" | "organic" | "conventional"
  crops?: string[]
  livestock?: string[]
  soilType?: string
  climateZone?: string
  waterSource?: string[]
  equipment?: {
    name: string
    type: string
    quantity: number
    condition: "excellent" | "good" | "fair" | "poor"
  }[]
  certifications?: {
    name: string
    issuedBy: string
    validUntil: string
    certificateNumber?: string
  }[]
  contacts?: {
    name: string
    role: string
    phone?: string
    email?: string
  }[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  lastActivity?: string
}

export interface CreateFarmData {
  name: string
  description?: string
  organizationId: string
  location: Farm["location"]
  area: Farm["area"]
  farmType: Farm["farmType"]
  crops?: string[]
  livestock?: string[]
  soilType?: string
  climateZone?: string
  waterSource?: string[]
  equipment?: Farm["equipment"]
  certifications?: Farm["certifications"]
  contacts?: Farm["contacts"]
}

export interface UpdateFarmData extends Partial<CreateFarmData> {
  isActive?: boolean
}

export interface FarmFilters {
  organizationId?: string
  farmType?: string
  isActive?: boolean
  search?: string
  location?: string
  minArea?: number
  maxArea?: number
  crops?: string[]
  livestock?: string[]
}

export interface PaginationParams {
  page?: number
  limit?: number
}

export interface FarmStats {
  totalFarms: number
  activeFarms: number
  totalArea: number
  averageArea: number
  farmsByType: Record<string, number>
  farmsByLocation: Record<string, number>
  recentActivity: {
    farmId: string
    farmName: string
    activity: string
    timestamp: string
  }[]
}

// Farm API functions
export const farmApi = {
  // Get all farms with optional filters and pagination
  getFarms: async (
    filters: FarmFilters = {},
    pagination: PaginationParams = {},
  ): Promise<PaginatedApiResponse<Farm>> => {
    const params = {
      ...filters,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
    }

    return makeAuthenticatedRequest<PaginatedApiResponse<Farm>>("/farms", {
      method: "GET",
      params,
    })
  },

  // Get farms by organization
  getFarmsByOrganization: async (
    organizationId: string,
    filters: Omit<FarmFilters, "organizationId"> = {},
    pagination: PaginationParams = {},
  ): Promise<PaginatedApiResponse<Farm>> => {
    const params = {
      ...filters,
      organizationId,
      page: pagination.page || 1,
      limit: pagination.limit || 10,
    }

    return makeAuthenticatedRequest<PaginatedApiResponse<Farm>>("/farms", {
      method: "GET",
      params,
    })
  },

  // Get a single farm by ID
  getFarm: async (id: string): Promise<ApiResponse<Farm>> => {
    return makeAuthenticatedRequest<ApiResponse<Farm>>(`/farms/${id}`)
  },

  // Create a new farm
  createFarm: async (data: CreateFarmData): Promise<ApiResponse<Farm>> => {
    return makeAuthenticatedRequest<ApiResponse<Farm>>("/farms", {
      method: "POST",
      body: data,
    })
  },

  // Update an existing farm
  updateFarm: async (id: string, data: UpdateFarmData): Promise<ApiResponse<Farm>> => {
    return makeAuthenticatedRequest<ApiResponse<Farm>>(`/farms/${id}`, {
      method: "PUT",
      body: data,
    })
  },

  // Delete a farm
  deleteFarm: async (id: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/farms/${id}`, {
      method: "DELETE",
    })
  },

  // Get farm statistics
  getFarmStats: async (organizationId?: string): Promise<ApiResponse<FarmStats>> => {
    const params = organizationId ? { organizationId } : {}
    return makeAuthenticatedRequest<ApiResponse<FarmStats>>("/farms/stats", {
      method: "GET",
      params,
    })
  },

  // Get farm activity log
  getFarmActivity: async (
    farmId: string,
    pagination: PaginationParams = {},
  ): Promise<
    PaginatedApiResponse<{
      _id: string
      farmId: string
      activity: string
      description?: string
      performedBy: string
      timestamp: string
      metadata?: Record<string, any>
    }>
  > => {
    const params = {
      page: pagination.page || 1,
      limit: pagination.limit || 20,
    }

    return makeAuthenticatedRequest<PaginatedApiResponse<any>>(`/farms/${farmId}/activity`, {
      method: "GET",
      params,
    })
  },

  // Add farm activity
  addFarmActivity: async (
    farmId: string,
    activity: {
      activity: string
      description?: string
      metadata?: Record<string, any>
    },
  ): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/farms/${farmId}/activity`, {
      method: "POST",
      body: activity,
    })
  },

  // Get nearby farms
  getNearbyFarms: async (
    latitude: number,
    longitude: number,
    radius = 50,
    limit = 10,
  ): Promise<ApiResponse<Farm[]>> => {
    const params = {
      latitude,
      longitude,
      radius,
      limit,
    }

    return makeAuthenticatedRequest<ApiResponse<Farm[]>>("/farms/nearby", {
      method: "GET",
      params,
    })
  },

  // Get farm weather data
  getFarmWeather: async (farmId: string): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/weather`)
  },

  // Get farm soil data
  getFarmSoilData: async (farmId: string): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/soil`)
  },

  // Update farm soil data
  updateFarmSoilData: async (farmId: string, soilData: any): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/soil`, {
      method: "PUT",
      body: soilData,
    })
  },

  // Get farm crop data
  getFarmCrops: async (farmId: string): Promise<ApiResponse<any[]>> => {
    return makeAuthenticatedRequest<ApiResponse<any[]>>(`/farms/${farmId}/crops`)
  },

  // Add crop to farm
  addFarmCrop: async (farmId: string, cropData: any): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/crops`, {
      method: "POST",
      body: cropData,
    })
  },

  // Update farm crop
  updateFarmCrop: async (farmId: string, cropId: string, cropData: any): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/crops/${cropId}`, {
      method: "PUT",
      body: cropData,
    })
  },

  // Remove crop from farm
  removeFarmCrop: async (farmId: string, cropId: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/farms/${farmId}/crops/${cropId}`, {
      method: "DELETE",
    })
  },

  // Get farm livestock data
  getFarmLivestock: async (farmId: string): Promise<ApiResponse<any[]>> => {
    return makeAuthenticatedRequest<ApiResponse<any[]>>(`/farms/${farmId}/livestock`)
  },

  // Add livestock to farm
  addFarmLivestock: async (farmId: string, livestockData: any): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/livestock`, {
      method: "POST",
      body: livestockData,
    })
  },

  // Update farm livestock
  updateFarmLivestock: async (farmId: string, livestockId: string, livestockData: any): Promise<ApiResponse<any>> => {
    return makeAuthenticatedRequest<ApiResponse<any>>(`/farms/${farmId}/livestock/${livestockId}`, {
      method: "PUT",
      body: livestockData,
    })
  },

  // Remove livestock from farm
  removeFarmLivestock: async (farmId: string, livestockId: string): Promise<ApiResponse<void>> => {
    return makeAuthenticatedRequest<ApiResponse<void>>(`/farms/${farmId}/livestock/${livestockId}`, {
      method: "DELETE",
    })
  },
}
