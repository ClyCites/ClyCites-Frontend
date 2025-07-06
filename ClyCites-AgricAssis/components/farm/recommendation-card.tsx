"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Star, Brain, Clock, DollarSign, TrendingUp } from "lucide-react"
import { aiRecommendationApi, type AIRecommendation } from "@/lib/api/ai-recommendation-api"

interface RecommendationCardProps {
  recommendation: AIRecommendation
  onUpdate: () => void
}

export function RecommendationCard({ recommendation, onUpdate }: RecommendationCardProps) {
  const [updating, setUpdating] = useState(false)
  const [feedback, setFeedback] = useState({
    rating: 0,
    helpful: true,
    comments: "",
    implementationResult: "",
  })

  const updateStatus = async (status: AIRecommendation["status"], feedbackData?: any) => {
    try {
      setUpdating(true)
      await aiRecommendationApi.updateRecommendationStatus(recommendation._id, status, feedbackData)
      onUpdate()
    } catch (error) {
      console.error("Error updating recommendation:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "destructive"
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getTimeframeColor = (timeframe: string) => {
    switch (timeframe) {
      case "immediate":
        return "destructive"
      case "within_24h":
        return "destructive"
      case "within_week":
        return "default"
      default:
        return "secondary"
    }
  }

  return (
    <Card className="relative">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-blue-500" />
              {recommendation.title}
            </CardTitle>
            <CardDescription className="mt-1">{recommendation.description}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getPriorityColor(recommendation.priority)}>{recommendation.priority}</Badge>
            <Badge variant={getTimeframeColor(recommendation.timeframe)}>
              {recommendation.timeframe.replace("_", " ")}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {recommendation.recommendedAction && (
            <div>
              <h4 className="font-medium text-sm mb-1">Recommended Action</h4>
              <p className="text-sm text-muted-foreground">{recommendation.recommendedAction}</p>
            </div>
          )}

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span>Confidence: {recommendation.confidence}%</span>
            </div>

            {recommendation.economicImpact && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4 text-green-500" />
                <span>ROI: {recommendation.economicImpact.roi}%</span>
              </div>
            )}

            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>{recommendation.aiModel.name}</span>
            </div>
          </div>

          {recommendation.economicImpact && (
            <div className="grid grid-cols-3 gap-4 p-3 bg-muted rounded-lg">
              {recommendation.economicImpact.potentialLoss && (
                <div>
                  <p className="text-xs text-muted-foreground">Potential Loss</p>
                  <p className="font-medium text-red-600">${recommendation.economicImpact.potentialLoss}</p>
                </div>
              )}

              {recommendation.economicImpact.costOfAction && (
                <div>
                  <p className="text-xs text-muted-foreground">Action Cost</p>
                  <p className="font-medium">${recommendation.economicImpact.costOfAction}</p>
                </div>
              )}

              {recommendation.economicImpact.potentialGain && (
                <div>
                  <p className="text-xs text-muted-foreground">Potential Gain</p>
                  <p className="font-medium text-green-600">${recommendation.economicImpact.potentialGain}</p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {recommendation.status === "active" && (
              <>
                <Button size="sm" onClick={() => updateStatus("acknowledged")} disabled={updating}>
                  Acknowledge
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline">
                      Mark Implemented
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Implementation Feedback</DialogTitle>
                      <DialogDescription>Please provide feedback on implementing this recommendation</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium">Rating</label>
                        <div className="flex gap-1 mt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setFeedback((prev) => ({ ...prev, rating: star }))}
                              className={`p-1 ${feedback.rating >= star ? "text-yellow-500" : "text-gray-300"}`}
                            >
                              <Star className="h-4 w-4 fill-current" />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm font-medium">Implementation Result</label>
                        <Textarea
                          placeholder="How did the implementation go? What were the results?"
                          value={feedback.implementationResult}
                          onChange={(e) =>
                            setFeedback((prev) => ({
                              ...prev,
                              implementationResult: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium">Additional Comments</label>
                        <Textarea
                          placeholder="Any additional feedback or suggestions?"
                          value={feedback.comments}
                          onChange={(e) =>
                            setFeedback((prev) => ({
                              ...prev,
                              comments: e.target.value,
                            }))
                          }
                          className="mt-1"
                        />
                      </div>

                      <Button
                        onClick={() => updateStatus("implemented", feedback)}
                        disabled={updating}
                        className="w-full"
                      >
                        Submit Feedback
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                <Button size="sm" variant="ghost" onClick={() => updateStatus("dismissed")} disabled={updating}>
                  Dismiss
                </Button>
              </>
            )}

            {recommendation.status !== "active" && <Badge variant="outline">{recommendation.status}</Badge>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
