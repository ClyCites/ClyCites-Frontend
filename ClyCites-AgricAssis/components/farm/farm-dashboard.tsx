"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Clock, TrendingUp, Droplets } from "lucide-react"
import { dailyAssistantApi, type DailySummary } from "@/lib/api/daily-assistant-api"
import { aiRecommendationApi, type AIRecommendation } from "@/lib/api/ai-recommendation-api"
import { weatherAlertApi, type WeatherAlert } from "@/lib/api/weather-alert-api"
import { TaskList } from "./task-list"
import { WeatherCard } from "./weather-card"
import { RecommendationCard } from "./recommendation-card"
import { AlertCard } from "./alert-card"

interface FarmDashboardProps {
  farmId: string
  farmName: string
}

export function FarmDashboard({ farmId, farmName }: FarmDashboardProps) {
  const [dailySummary, setDailySummary] = useState<DailySummary | null>(null)
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([])
  const [weatherAlerts, setWeatherAlerts] = useState<WeatherAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0])

  useEffect(() => {
    loadDashboardData()
  }, [farmId, selectedDate])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)

      const [summaryResponse, recommendationsResponse, alertsResponse] = await Promise.all([
        dailyAssistantApi.getDailySummary(farmId, selectedDate),
        aiRecommendationApi.getActiveRecommendations(farmId, { limit: 10 }),
        weatherAlertApi.getWeatherAlerts(farmId, { isActive: true, limit: 5 }),
      ])

      setDailySummary(summaryResponse.data)
      setRecommendations(recommendationsResponse.data.recommendations || [])
      setWeatherAlerts(alertsResponse.data.alerts || [])
    } catch (err) {
      console.error("Error loading dashboard data:", err)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const generateRecommendations = async () => {
    try {
      await aiRecommendationApi.generateFarmRecommendations(farmId)
      await loadDashboardData() // Reload to get new recommendations
    } catch (err) {
      console.error("Error generating recommendations:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading farm dashboard...</span>
      </div>
    )
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (!dailySummary) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>No Data</AlertTitle>
        <AlertDescription>No dashboard data available for this farm.</AlertDescription>
      </Alert>
    )
  }

  const priorityColors = {
    critical: "destructive",
    high: "destructive",
    medium: "default",
    low: "secondary",
  } as const

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{farmName} Dashboard</h1>
          <p className="text-muted-foreground">Daily overview for {new Date(selectedDate).toLocaleDateString()}</p>
        </div>
        <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-3 py-2 border rounded-md"
          />
          <Button onClick={generateRecommendations}>Generate AI Recommendations</Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Crops</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.farmStatus.activeCrops}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Animals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.farmStatus.totalAnimals}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Tasks</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dailySummary.tasks.total}</div>
            <div className="flex gap-1 mt-1">
              {dailySummary.tasks.byPriority.critical > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {dailySummary.tasks.byPriority.critical} Critical
                </Badge>
              )}
              {dailySummary.tasks.byPriority.high > 0 && (
                <Badge variant="destructive" className="text-xs">
                  {dailySummary.tasks.byPriority.high} High
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weather Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weatherAlerts.length}</div>
            {weatherAlerts.length > 0 && (
              <Badge variant="destructive" className="text-xs mt-1">
                {weatherAlerts.filter((a) => a.severity === "warning" || a.severity === "emergency").length} Urgent
              </Badge>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Weather Alerts */}
      {weatherAlerts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-500" />
              Active Weather Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {weatherAlerts.map((alert) => (
                <AlertCard key={alert._id} alert={alert} onUpdate={loadDashboardData} />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Weather Summary */}
            <WeatherCard weather={dailySummary.weather} />

            {/* Priority Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Priority Actions Today</CardTitle>
                <CardDescription>AI-recommended actions based on current conditions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {dailySummary.recommendations.slice(0, 5).map((rec, index) => {
                    // Map numeric priority to string
                    const priorityMap: Record<number, "critical" | "high" | "medium" | "low"> = {
                      1: "critical",
                      2: "high",
                      3: "medium",
                      4: "low",
                    }
                    const priorityKey = priorityMap[rec.priority as number] ?? "medium"
                    return (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <Badge variant={priorityColors[priorityKey]} className="mt-1">
                          P{rec.priority}
                        </Badge>
                        <div className="flex-1">
                          <p className="font-medium">{rec.action}</p>
                          <p className="text-sm text-muted-foreground">{rec.reason}</p>
                          <p className="text-xs text-muted-foreground mt-1">Timeframe: {rec.timeframe}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Farm Insights */}
          {dailySummary.insights.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Farm Insights</CardTitle>
                <CardDescription>AI-generated insights for your farm</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {dailySummary.insights.map((insight, index) => (
                    <Alert key={index}>
                      <AlertDescription>{insight.message}</AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="tasks">
          <TaskList
            tasks={[...dailySummary.tasks.existing, ...dailySummary.tasks.generated]}
            onTaskUpdate={loadDashboardData}
            farmId={farmId}
          />
        </TabsContent>

        <TabsContent value="recommendations">
          <div className="space-y-4">
            {recommendations.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No active recommendations</p>
                    <Button onClick={generateRecommendations}>Generate AI Recommendations</Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              recommendations.map((recommendation) => (
                <RecommendationCard
                  key={recommendation._id}
                  recommendation={recommendation}
                  onUpdate={loadDashboardData}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="weather">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeatherCard weather={dailySummary.weather} detailed />

            <Card>
              <CardHeader>
                <CardTitle>3-Day Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {dailySummary.weather.forecast.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Day {index + 1}</p>
                        <p className="text-sm text-muted-foreground">
                          {day.data.temperature_2m_min}°C - {day.data.temperature_2m_max}°C
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Droplets className="h-4 w-4 text-blue-500" />
                          <span className="text-sm">{day.data.precipitation_sum}mm</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
