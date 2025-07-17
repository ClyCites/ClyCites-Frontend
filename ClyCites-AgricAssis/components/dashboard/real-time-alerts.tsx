"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { AlertTriangle, CheckCircle, Info, X, Bell, BellOff } from "lucide-react"
import { cn } from "@/lib/utils"

interface Alert {
  id: string
  type: "warning" | "info" | "success" | "danger"
  title: string
  message: string
  timestamp: Date
  category: "weather" | "market" | "crop" | "system"
  priority: "high" | "medium" | "low"
  actionRequired?: boolean
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "warning",
    title: "Heavy Rain Alert",
    message: "Heavy rainfall expected in the next 24 hours. Secure loose equipment and check drainage systems.",
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    category: "weather",
    priority: "high",
    actionRequired: true,
  },
  {
    id: "2",
    type: "info",
    title: "Market Price Update",
    message: "Maize prices increased by 5% in the Central Market. Consider selling current inventory.",
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    category: "market",
    priority: "medium",
  },
  {
    id: "3",
    type: "danger",
    title: "Pest Alert",
    message: "Fall armyworm detected in neighboring farms. Immediate inspection and treatment recommended.",
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    category: "crop",
    priority: "high",
    actionRequired: true,
  },
  {
    id: "4",
    type: "success",
    title: "Irrigation Complete",
    message: "Automated irrigation cycle completed successfully. Next cycle scheduled for tomorrow at 6 AM.",
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    category: "system",
    priority: "low",
  },
]

export function RealTimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>(mockAlerts)
  const [isEnabled, setIsEnabled] = useState(true)

  useEffect(() => {
    if (!isEnabled) return

    // Simulate real-time alerts
    const interval = setInterval(() => {
      const shouldAddAlert = Math.random() > 0.8 // 20% chance every 30 seconds

      if (shouldAddAlert) {
        const newAlert: Alert = {
          id: Date.now().toString(),
          type: ["info", "warning"][Math.floor(Math.random() * 2)] as "info" | "warning",
          title: "System Update",
          message: "New data available for your dashboard.",
          timestamp: new Date(),
          category: "system",
          priority: "low",
        }

        setAlerts((prev) => [newAlert, ...prev.slice(0, 9)]) // Keep only 10 most recent
      }
    }, 30000) // Every 30 seconds

    return () => clearInterval(interval)
  }, [isEnabled])

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "danger":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "info":
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getPriorityBadge = (priority: Alert["priority"]) => {
    const variants = {
      high: "destructive",
      medium: "default",
      low: "secondary",
    } as const

    return (
      <Badge variant={variants[priority]} className="text-xs">
        {priority.toUpperCase()}
      </Badge>
    )
  }

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date()
    const diff = now.getTime() - timestamp.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (days > 0) return `${days}d ago`
    if (hours > 0) return `${hours}h ago`
    if (minutes > 0) return `${minutes}m ago`
    return "Just now"
  }

  const dismissAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id))
  }

  const highPriorityCount = alerts.filter((alert) => alert.priority === "high").length

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base font-semibold">Real-time Alerts</CardTitle>
          <CardDescription>
            {highPriorityCount > 0 && (
              <span className="text-red-600 font-medium">
                {highPriorityCount} high priority alert{highPriorityCount > 1 ? "s" : ""}
              </span>
            )}
            {highPriorityCount === 0 && "All systems normal"}
          </CardDescription>
        </div>
        <Button variant="ghost" size="sm" onClick={() => setIsEnabled(!isEnabled)} className="h-8 w-8 p-0">
          {isEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="h-[300px] px-6 pb-6">
          <div className="space-y-3">
            {alerts.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground">
                <div className="text-center">
                  <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-sm">No active alerts</p>
                </div>
              </div>
            ) : (
              alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={cn(
                    "flex items-start space-x-3 p-3 rounded-lg border transition-colors",
                    alert.priority === "high" && "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950",
                    alert.priority === "medium" &&
                      "border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-950",
                    alert.priority === "low" && "border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-950",
                  )}
                >
                  <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-sm font-medium truncate">{alert.title}</h4>
                      <div className="flex items-center space-x-2">
                        {getPriorityBadge(alert.priority)}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => dismissAlert(alert.id)}
                          className="h-6 w-6 p-0 hover:bg-transparent"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{alert.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{formatTimestamp(alert.timestamp)}</span>
                      {alert.actionRequired && (
                        <Badge variant="outline" className="text-xs">
                          Action Required
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
