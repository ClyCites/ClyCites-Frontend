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
import { AlertTriangle, Clock, CheckCircle } from "lucide-react"
import { weatherAlertApi, type WeatherAlert } from "@/lib/api/weather-alert-api"

interface AlertCardProps {
  alert: WeatherAlert
  onUpdate: () => void
}

export function AlertCard({ alert, onUpdate }: AlertCardProps) {
  const [updating, setUpdating] = useState(false)

  const acknowledgeAlert = async () => {
    try {
      setUpdating(true)
      await weatherAlertApi.acknowledgeWeatherAlert(alert._id)
      onUpdate()
    } catch (error) {
      console.error("Error acknowledging alert:", error)
    } finally {
      setUpdating(false)
    }
  }

  const createTasks = async (selectedActions?: string[]) => {
    try {
      setUpdating(true)
      await weatherAlertApi.createTasksFromAlert(alert._id, selectedActions)
      onUpdate()
    } catch (error) {
      console.error("Error creating tasks:", error)
    } finally {
      setUpdating(false)
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "emergency":
        return "destructive"
      case "warning":
        return "destructive"
      case "watch":
        return "default"
      case "advisory":
        return "default"
      case "info":
        return "secondary"
      default:
        return "default"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "emergency":
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
    }
  }

  return (
    <Card
      className={`border-l-4 ${
        alert.severity === "emergency" || alert.severity === "warning" ? "border-l-red-500" : "border-l-orange-500"
      }`}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              {getSeverityIcon(alert.severity)}
              {alert.title}
            </CardTitle>
            <CardDescription className="mt-1">{alert.message}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Badge variant={getSeverityColor(alert.severity)}>{alert.severity}</Badge>
            <Badge variant="outline">{alert.alertType.replace("_", " ")}</Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Valid until {new Date(alert.validUntil).toLocaleString()}</span>
            </div>

            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4" />
              <span>Confidence: {alert.confidence}%</span>
            </div>
          </div>

          {alert.recommendedActions.length > 0 && (
            <div>
              <h4 className="font-medium text-sm mb-2">Recommended Actions</h4>
              <div className="space-y-2">
                {alert.recommendedActions.slice(0, 3).map((action, index) => (
                  <div key={index} className="flex items-start gap-2 p-2 bg-muted rounded">
                    <Badge variant="outline" className="text-xs">
                      {action.priority}
                    </Badge>
                    <div className="flex-1">
                      <p className="text-sm">{action.action}</p>
                      <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                        <span>Timeframe: {action.timeframe}</span>
                        {action.estimatedCost && <span>Cost: ${action.estimatedCost}</span>}
                        {action.potentialLoss && <span className="text-red-600">Risk: ${action.potentialLoss}</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            {!alert.acknowledged && (
              <Button size="sm" onClick={acknowledgeAlert} disabled={updating}>
                Acknowledge
              </Button>
            )}

            {alert.acknowledged && (
              <Badge variant="outline" className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Acknowledged
              </Badge>
            )}

            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline">
                  Create Tasks
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create Tasks from Alert</DialogTitle>
                  <DialogDescription>Select which recommended actions to convert into tasks</DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  {alert.recommendedActions.map((action, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 border rounded">
                      <input type="checkbox" defaultChecked className="mt-1" id={`action-${index}`} />
                      <label htmlFor={`action-${index}`} className="flex-1">
                        <p className="font-medium">{action.action}</p>
                        <div className="flex gap-2 text-xs text-muted-foreground mt-1">
                          <Badge variant="outline">{action.priority}</Badge>
                          <span>{action.timeframe}</span>
                          {action.estimatedCost && <span>Cost: ${action.estimatedCost}</span>}
                        </div>
                      </label>
                    </div>
                  ))}

                  <Button onClick={() => createTasks()} disabled={updating} className="w-full">
                    Create Selected Tasks
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
