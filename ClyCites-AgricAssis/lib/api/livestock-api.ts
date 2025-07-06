import { makeAuthenticatedRequest } from "./api-client"

export interface Livestock {
  _id: string
  farm: string
  animalType: "cattle" | "goats" | "sheep" | "pigs" | "poultry" | "rabbits" | "fish" | "other"
  breed?: string
  herdName: string
  totalAnimals: number
  animalDetails?: {
    averageWeight?: number
    averageAge?: number
    healthStatus?: string
  }
  housing?: {
    type?: string
    capacity?: number
    condition?: string
  }
  feeding?: {
    feedType?: string
    dailyAmount?: number
    feedingSchedule?: string[]
  }
  health?: {
    lastVetVisit?: string
    vaccinations?: Array<{
      vaccine: string
      lastGiven: string
      nextDue: string
    }>
    healthIssues?: string[]
  }
  production: {
    purpose: "meat" | "milk" | "eggs" | "breeding" | "draft" | "manure" | "mixed"
    dailyProduction?: {
      milk?: number
      eggs?: number
    }
    monthlyProduction?: {
      milk?: number
      eggs?: number
    }
  }
  economics?: {
    purchasePrice?: number
    monthlyExpenses?: number
    monthlyIncome?: number
  }
  records: Array<{
    date: string
    type: "feeding" | "health" | "production" | "breeding" | "death" | "sale" | "purchase" | "other"
    description: string
    quantity?: number
    cost?: number
    income?: number
    notes?: string
    performedBy: string
  }>
  isActive: boolean
  totalMonthlyExpenses: number
  totalMonthlyIncome: number
  monthlyProfit: number
  upcomingVaccinations: Array<{
    vaccine: string
    nextDue: string
  }>
  createdAt: string
  updatedAt: string
}

export interface CreateLivestockData {
  animalType: Livestock["animalType"]
  breed?: string
  herdName: string
  totalAnimals: number
  animalDetails?: Livestock["animalDetails"]
  housing?: Livestock["housing"]
  feeding?: Livestock["feeding"]
  health?: Livestock["health"]
  production: Livestock["production"]
  economics?: Livestock["economics"]
  weatherSensitivity?: Record<string, any>
  metadata?: Record<string, any>
}

export const livestockApi = {
  // Get farm livestock
  getFarmLivestock: async (farmId: string, page = 1, limit = 20, animalType?: string) => {
    const params = new URLSearchParams({ page: page.toString(), limit: limit.toString() })
    if (animalType) params.append("animalType", animalType)
    return makeAuthenticatedRequest(`/farms/${farmId}/livestock?${params}`)
  },

  // Create livestock
  createLivestock: async (farmId: string, data: CreateLivestockData) => {
    return makeAuthenticatedRequest(`/farms/${farmId}/livestock`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Get livestock details
  getLivestockDetails: async (livestockId: string) => {
    return makeAuthenticatedRequest(`/livestock/${livestockId}`)
  },

  // Update livestock
  updateLivestock: async (livestockId: string, data: Partial<CreateLivestockData>) => {
    return makeAuthenticatedRequest(`/livestock/${livestockId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    })
  },

  // Add livestock record
  addLivestockRecord: async (
    livestockId: string,
    record: {
      type: "feeding" | "health" | "production" | "breeding" | "death" | "sale" | "purchase" | "other"
      description: string
      quantity?: number
      cost?: number
      income?: number
      notes?: string
    },
  ) => {
    return makeAuthenticatedRequest(`/livestock/${livestockId}/records`, {
      method: "POST",
      body: JSON.stringify(record),
    })
  },
}
