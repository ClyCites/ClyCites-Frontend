import { apiClient } from "./api-client"

export interface AIServiceStatus {
  configured: boolean
  connected?: boolean
  testResponse?: string
  error?: string
  timestamp: string
}

export const aiStatusApi = {
  // Get AI service status
  getAIStatus: async () => {
    const response = await apiClient.get("/ai/status")
    return response.data as { status: string; data: { aiService: AIServiceStatus; timestamp: string } }
  },

  // Test AI service connectivity
  testAIService: async () => {
    const response = await apiClient.post("/ai/test")
    return response.data as {
      status: string
      message: string
      data: AIServiceStatus
    }
  },
}
