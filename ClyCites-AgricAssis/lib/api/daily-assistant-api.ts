import { makeAuthenticatedRequest } from "./api-client"

export interface DailyTask {
  _id: string
  farm: string
  user: string
  crop?: {
    _id: string
    name: string
    category: string
    growthStage: string
  }
  livestock?: {
    _id: string
    herdName: string
    animalType: string
    totalAnimals: number
  }
  taskDate: string
  category:
    | "irrigation"
    | "fertilization"
    | "pest_control"
    | "disease_control"
    | "planting"
    | "harvesting"
    | "feeding"
    | "health_check"
    | "vaccination"
    | "breeding"
    | "cleaning"
    | "maintenance"
    | "monitoring"
    | "marketing"
    | "weather_response"
    | "general"
  title: string
  description: string
  priority: "low" | "medium" | "high" | "critical"
  status: "pending" | "in_progress" | "completed" | "skipped" | "postponed" | "cancelled"
  estimatedDuration?: {
    value: number
    unit: "minutes" | "hours"
  }
  weatherDependent?: boolean
  weatherConditions?: {
    avoidConditions?: string[]
    idealConditions?: string[]
  }
  resources?: string[]
  instructions?: Array<{
    step: number
    description: string
    duration?: number
  }>
  reminders?: Array<{
    time: string
    message: string
  }>
  completion?: {
    completedAt: string
    completedBy: string
    actualDuration?: number
    notes?: string
    photos?: string[]
  }
  aiGenerated: boolean
  aiConfidence?: number
  isOverdue: boolean
  daysOverdue: number
  urgencyScore: number
  createdAt: string
  updatedAt: string
}

export interface DailySummary {
  date: string
  farm: {
    id: string
    name: string
    location: {
      latitude: number
      longitude: number
      address?: string
    }
  }
  weather: {
    current: Record<string, any>
    forecast: Array<Record<string, any>>
    summary: string
    alerts: Array<any>
  }
  tasks: {
    existing: DailyTask[]
    generated: DailyTask[]
    total: number
    byPriority: {
      critical: number
      high: number
      medium: number
      low: number
    }
  }
  recommendations: Array<{
    priority: number
    action: string
    reason: string
    timeframe: string
  }>
  farmStatus: {
    activeCrops: number
    activeLivestock: number
    totalAnimals: number
  }
  insights: Array<{
    type: string
    message: string
    priority: string
  }>
}

export interface CreateTaskData {
  title: string
  description: string
  category: DailyTask["category"]
  priority: DailyTask["priority"]
  taskDate: string
  estimatedDuration?: {
    value: number
    unit: "minutes" | "hours"
  }
  crop?: string
  livestock?: string
  weatherDependent?: boolean
  weatherConditions?: {
    avoidConditions?: string[]
    idealConditions?: string[]
  }
  resources?: string[]
  instructions?: Array<{
    step: number
    description: string
    duration?: number
  }>
  reminders?: Array<{
    time: string
    message: string
  }>
}

export const dailyAssistantApi = {
  // Get daily summary
  getDailySummary: async (farmId: string, date?: string) => {
    const params = date ? `?date=${date}` : ""
    return makeAuthenticatedRequest(`/farms/${farmId}/daily-summary${params}`)
  },

  // Get farm tasks
  getFarmTasks: async (farmId: string, date?: string, status?: string) => {
    const params = new URLSearchParams()
    if (date) params.append("date", date)
    if (status) params.append("status", status)
    const queryString = params.toString() ? `?${params}` : ""
    return makeAuthenticatedRequest(`/farms/${farmId}/tasks${queryString}`)
  },

  // Create custom task
  createCustomTask: async (farmId: string, data: CreateTaskData) => {
    return makeAuthenticatedRequest(`/farms/${farmId}/tasks`, {
      method: "POST",
      body: JSON.stringify(data),
    })
  },

  // Update task status
  updateTaskStatus: async (taskId: string, status: DailyTask["status"], completionData?: any) => {
    return makeAuthenticatedRequest(`/tasks/${taskId}/status`, {
      method: "PUT",
      body: JSON.stringify({ status, completionData }),
    })
  },

  // Get weather alerts
  getWeatherAlerts: async (farmId: string) => {
    return makeAuthenticatedRequest(`/farms/${farmId}/alerts`)
  },

  // Acknowledge alert
  acknowledgeAlert: async (alertId: string) => {
    return makeAuthenticatedRequest(`/alerts/${alertId}/acknowledge`, {
      method: "PUT",
    })
  },

  // Get task statistics
  getTaskStatistics: async (farmId: string, period = "week") => {
    const params = new URLSearchParams({ period })
    return makeAuthenticatedRequest(`/farms/${farmId}/task-stats?${params}`)
  },
}
