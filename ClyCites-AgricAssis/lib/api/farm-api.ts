import { makeAuthenticatedRequest } from "./api-client"

export interface Farm {
  _id: string
  name: string
  owner: {
    _id: string
    firstName: string
    lastName: string
    email: string
  }
  organization: {
    _id: string
    name: string
  }
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  size: {
    value: number
    unit: "hectares" | "acres" | "square_meters"
  }
  soilType?: string
  soilPH?: number
  irrigationSystem?: string
  farmType: "crop" | "livestock" | "mixed" | "aquaculture" | "poultry" | "dairy"
  certifications?: string[]
  weatherStationId?: string
  metadata?: Record<string, any>
  isActive: boolean
  createdAt: string
  updatedAt: string
  statistics?: {
    activeCrops: number
    activeActivities: number
    activeRecommendations: number
  }
}

export interface CreateFarmData {
  name: string
  location: {
    latitude: number
    longitude: number
    address?: string
  }
  size: {
    value: number
    unit: "hectares" | "acres" | "square_meters"
  }
  soilType?: string
  soilPH?: number
  irrigationSystem?: string
  farmType: "crop" | "livestock" | "mixed" | "aquaculture" | "poultry" | "dairy"
  certifications?: string[]
  weatherStationId?: string
  metadata?: Record<string, any>
}

export const farmApi = {
  // Get organization farms
  getOrganizationFarms: async (orgId: string, page = 1, limit = 20) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    return makeAuthenticatedRequest(`/organizations/${orgId}/farms?${params}`)
  },

  // Create farm
  createFarm: async (orgId: string, data: CreateFarmData) => {
    return makeAuthenticatedRequest(`/organizations/${orgId}/farms`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get farm details
  getFarmDetails: async (farmId: string) => {
    return makeAuthenticatedRequest(`/farms/${farmId}`)
  },

  // Update farm
  updateFarm: async (farmId: string, data: Partial<CreateFarmData>) => {
    return makeAuthenticatedRequest(`/farms/${farmId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Generate AI recommendations
  generateRecommendations: async (farmId: string) => {
    return makeAuthenticatedRequest(`/farms/${farmId}/recommendations`, {
      method: "POST",
    })
  },
}
