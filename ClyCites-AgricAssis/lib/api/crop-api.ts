import { makeAuthenticatedRequest } from "./api-client"

export interface Crop {
  _id: string
  name: string
  scientificName?: string
  category: "cereals" | "legumes" | "vegetables" | "fruits" | "cash_crops" | "fodder" | "spices" | "other"
  variety?: string
  farm: string
  field: {
    area?: {
      value: number
      unit: "hectares" | "acres" | "square_meters"
    }
  }
  season?: string
  plantingDate: string
  expectedHarvestDate?: string
  actualHarvestDate?: string
  growthStage:
    | "seed"
    | "germination"
    | "seedling"
    | "vegetative"
    | "flowering"
    | "fruiting"
    | "maturity"
    | "harvest"
    | "post_harvest"
  plantingMethod?: "direct_seeding" | "transplanting" | "broadcasting" | "drilling"
  seedSource?: string
  expectedYield?: {
    value: number
    unit: string
  }
  actualYield?: {
    value: number
    unit: string
  }
  marketPrice?: {
    value: number
    currency: string
    unit: string
  }
  status: "planned" | "planted" | "growing" | "harvested" | "failed"
  notes?: string
  ageInDays: number
  daysToHarvest?: number
  createdAt: string
  updatedAt: string
  recentActivities?: any[]
}

export interface CreateCropData {
  name: string
  scientificName?: string
  category: Crop["category"]
  variety?: string
  field: {
    area?: {
      value: number
      unit: "hectares" | "acres" | "square_meters"
    }
  }
  season?: string
  plantingDate: string
  expectedHarvestDate?: string
  growthStage: Crop["growthStage"]
  plantingMethod?: Crop["plantingMethod"]
  seedSource?: string
  expectedYield?: {
    value: number
    unit: string
  }
  notes?: string
}

export const cropApi = {
  // Get farm crops
  getFarmCrops: async (farmId: string, page = 1, limit = 20, status?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (status) params.append("status", status)
    return makeAuthenticatedRequest(`/farms/${farmId}/crops?${params}`)
  },

  // Create crop
  createCrop: async (farmId: string, data: CreateCropData) => {
    return makeAuthenticatedRequest(`/farms/${farmId}/crops`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get crop details
  getCropDetails: async (cropId: string) => {
    return makeAuthenticatedRequest(`/crops/${cropId}`)
  },

  // Update crop
  updateCrop: async (cropId: string, data: Partial<CreateCropData>) => {
    return makeAuthenticatedRequest(`/crops/${cropId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },
}
