import { makeAuthenticatedRequest } from "./api-client"

export interface AIRecommendation {
  _id: string
  farm: string
  crop?: string
  livestock?: string
  user: string
  type:
    | "irrigation"
    | "fertilization"
    | "pest_management"
    | "disease_prevention"
    | "harvest_timing"
    | "planting_schedule"
    | "weather_alert"
    | "market_advisory"
    | "soil_management"
    | "general"
  priority: "low" | "medium" | "high" | "critical"
  title: string
  description: string
  actionRequired: boolean
  recommendedAction?: string
  timeframe: "immediate" | "within_24h" | "within_week" | "within_month" | "seasonal"
  confidence: number
  status: "active" | "acknowledged" | "implemented" | "dismissed" | "expired"
  dataSource: {
    weather: boolean
    soilData: boolean
    cropStage: boolean
    historicalData: boolean
    marketData: boolean
    satelliteImagery: boolean
  }
  weatherContext?: {
    currentConditions?: Record<string, any>
    forecast?: Array<Record<string, any>>
    alerts?: string[]
  }
  economicImpact?: {
    potentialLoss?: number
    potentialGain?: number
    costOfAction?: number
    roi?: number
  }
  userFeedback?: {
    rating?: number
    helpful?: boolean
    comments?: string
    implementationResult?: string
  }
  aiModel: {
    name: string
    version: string
  }
  expiresAt: string
  createdAt: string
  updatedAt: string
}

export const aiRecommendationApi = {
  // Get active recommendations
  getActiveRecommendations: async (
    farmId?: string,
    filters?: {
      type?: string
      priority?: string
      limit?: number
    },
  ) => {
    const params = new URLSearchParams()
    if (farmId) params.append("farmId", farmId)
    if (filters?.type) params.append("type", filters.type)
    if (filters?.priority) params.append("priority", filters.priority)
    if (filters?.limit) params.append("limit", filters.limit.toString())

    const queryString = params.toString() ? `?${params}` : ""
    return makeAuthenticatedRequest(`/recommendations${queryString}`)
  },

  // Update recommendation status
  updateRecommendationStatus: async (
    recommendationId: string,
    status: AIRecommendation["status"],
    feedback?: {
      rating?: number
      helpful?: boolean
      comments?: string
      implementationResult?: string
    },
  ) => {
    return makeAuthenticatedRequest(`/recommendations/${recommendationId}`, {
      method: "PUT",
      body: JSON.stringify({ status, feedback }),
    })
  },

  // Generate recommendations for farm
  generateFarmRecommendations: async (farmId: string) => {
    return makeAuthenticatedRequest(`/recommendations/generate/${farmId}`, {
      method: "POST",
    })
  },
}
