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
  getAIStatus: async (): Promise<{ status: string; data: { aiService: AIServiceStatus; timestamp: string } }> => {
    try {
      const response = await apiClient.get("/ai/status")
      return response.data as { status: string; data: { aiService: AIServiceStatus; timestamp: string } }
    } catch (error: any) {
      // Return a fallback status if the API is not available
      return {
        status: "error",
        data: {
          aiService: {
            configured: false,
            connected: false,
            error: error.message || "AI service unavailable",
            timestamp: new Date().toISOString(),
          },
          timestamp: new Date().toISOString(),
        },
      }
    }
  },

  // Test AI service connectivity
  testAIService: async (): Promise<{
    status: string
    message: string
    data: AIServiceStatus
  }> => {
    try {
      const response = await apiClient.post("/ai/test")
      return response.data as {
        status: string
        message: string
        data: AIServiceStatus
      }
    } catch (error: any) {
      return {
        status: "error",
        message: error.message || "AI service test failed",
        data: {
          configured: false,
          connected: false,
          error: error.message || "AI service test failed",
          timestamp: new Date().toISOString(),
        },
      }
    }
  },
}
