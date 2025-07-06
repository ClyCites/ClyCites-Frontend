import { makeAuthenticatedRequest } from "./api-client"

export interface WeatherAlert {
  _id: string
  farm: string
  user: string
  alertType:
    | "extreme_heat"
    | "heavy_rain"
    | "drought"
    | "frost"
    | "strong_wind"
    | "flood_risk"
    | "optimal_planting"
    | "optimal_harvesting"
    | "irrigation_needed"
    | "pest_risk"
  severity: "info" | "advisory" | "watch" | "warning" | "emergency"
  title: string
  message: string
  weatherData: {
    current?: Record<string, any>
    forecast?: Array<Record<string, any>>
  }
  affectedCrops?: Array<{
    _id: string
    name: string
    category: string
  }>
  affectedLivestock?: Array<{
    _id: string
    herdName: string
    animalType: string
  }>
  recommendedActions: Array<{
    action: string
    priority: "low" | "medium" | "high" | "critical"
    timeframe: string
    estimatedCost?: number
    potentialLoss?: number
  }>
  validFrom: string
  validUntil: string
  isActive: boolean
  acknowledged?: {
    acknowledgedAt: string
    acknowledgedBy: string
  }
  actionsImplemented: Array<{
    action: string
    implementedAt: string
    implementedBy: string
    cost?: number
    effectiveness?: number
    notes?: string
  }>
  relatedTasks: string[]
  confidence: number
  timeRemaining: number
  isExpired: boolean
  createdAt: string
  updatedAt: string
}

export const weatherAlertApi = {
  // Get weather alerts for farm
  getWeatherAlerts: async (
    farmId: string,
    params?: {
      isActive?: boolean
      severity?: string
      alertType?: string
      limit?: number
    },
  ) => {
    const searchParams = new URLSearchParams()
    if (params?.isActive !== undefined) searchParams.append("isActive", params.isActive.toString())
    if (params?.severity) searchParams.append("severity", params.severity)
    if (params?.alertType) searchParams.append("alertType", params.alertType)
    if (params?.limit) searchParams.append("limit", params.limit.toString())

    const queryString = searchParams.toString() ? `?${searchParams}` : ""
    return makeAuthenticatedRequest(`/farms/${farmId}/weather-alerts${queryString}`)
  },

  // Get specific weather alert
  getWeatherAlert: async (alertId: string) => {
    return makeAuthenticatedRequest(`/weather-alerts/${alertId}`)
  },

  // Acknowledge weather alert
  acknowledgeWeatherAlert: async (alertId: string) => {
    return makeAuthenticatedRequest(`/weather-alerts/${alertId}/acknowledge`, {
      method: "PUT",
    })
  },

  // Implement alert action
  implementAlertAction: async (
    alertId: string,
    actionData: {
      action: string
      cost?: number
      effectiveness?: number
      notes?: string
    },
  ) => {
    return makeAuthenticatedRequest(`/weather-alerts/${alertId}/implement-action`, {
      method: "POST",
      body: JSON.stringify(actionData),
    })
  },

  // Create tasks from alert
  createTasksFromAlert: async (alertId: string, selectedActions?: string[]) => {
    return makeAuthenticatedRequest(`/weather-alerts/${alertId}/create-tasks`, {
      method: "POST",
      body: JSON.stringify({ selectedActions }),
    })
  },

  // Get alert statistics
  getAlertStatistics: async (farmId: string, period = "month") => {
    const params = new URLSearchParams({ period })
    return makeAuthenticatedRequest(`/farms/${farmId}/weather-alerts/stats?${params}`)
  },
}
