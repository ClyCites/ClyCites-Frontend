import { apiClient } from "./api-client"

export interface AIStatusResponse {
  configured: boolean
  connected: boolean
  timestamp: string
  error?: string
}

export interface AITestResponse {
  success: boolean
  message: string
  timestamp: string
}

class AIStatusAPI {
  async getStatus(): Promise<AIStatusResponse> {
    try {
      const response = await apiClient.get("/ai/status")
      return response.data as AIStatusResponse
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error("Access denied. No token provided.")
      }

      throw new Error(error.response?.data?.message || error.message || "Failed to get AI status")
    }
  }

  async testConnection(): Promise<AITestResponse> {
    try {
      const response = await apiClient.post("/ai/test")
      return response.data as AITestResponse
    } catch (error: any) {
      // Handle authentication errors
      if (error.response?.status === 401) {
        throw new Error("Access denied. No token provided.")
      }

      throw new Error(error.response?.data?.message || error.message || "Failed to test AI connection")
    }
  }
}

export const aiStatusApi = new AIStatusAPI()
