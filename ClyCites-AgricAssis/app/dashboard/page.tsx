"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, AlertTriangle, Plus, Settings, PointerIcon as SidebarTrigger } from "lucide-react"
import type { Farm } from "@/lib/api/farm-api"
import { FarmDashboard } from "@/components/farm/farm-dashboard"
import { KPISection } from "@/components/dashboard/kpi-cards"
import { InteractiveCharts } from "@/components/dashboard/interactive-charts"
import { RealTimeAlerts } from "@/components/dashboard/real-time-alerts"
import { AdvisoryCard } from "@/components/dashboard/advisory-card"
import { EnhancedWeatherCard } from "@/components/dashboard/enhanced-weather-card"
import { MarketPricesChart } from "@/components/dashboard/market-prices-chart"
import { Separator } from "@/components/ui/separator"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function DashboardPage() {
  const [farms, setFarms] = useState<Farm[]>([])
  const [selectedFarm, setSelectedFarm] = useState<Farm | null>(null)
  const [aiStatus, setAiStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dashboardView, setDashboardView] = useState<"overview" | "farm">("overview")

  useEffect(() => {
    loadInitialData()
  }, [])

  const loadInitialData = async () => {
    try {
      setLoading(true)
      setError(null)

      // Mock data for demonstration
      const mockFarms: Farm[] = [
        {
          _id: "farm1",
          name: "Green Valley Farm",
          farmType: "mixed",
          size: { value: 50, unit: "hectares" },
          location: { latitude: -1.2921, longitude: 36.8219, address: "Nairobi, Kenya" },
          crops: [],
          livestock: [],
          owner: "user1",
          managers: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          _id: "farm2",
          name: "Sunrise Agriculture",
          farmType: "crop",
          size: { value: 75, unit: "hectares" },
          location: { latitude: 6.5244, longitude: 3.3792, address: "Lagos, Nigeria" },
          crops: [],
          livestock: [],
          owner: "user1",
          managers: [],
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ]

      setFarms(mockFarms)
      setSelectedFarm(mockFarms[0])

      // Mock AI status
      setAiStatus({
        configured: true,
        connected: true,
        error: null,
      })
    } catch (err) {
      console.error("Error loading initial data:", err)
      setError("Failed to load dashboard data. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const testAIService = async () => {
    try {
      // Mock AI service test
      setAiStatus({
        configured: true,
        connected: true,
        error: null,
      })
    } catch (err) {
      console.error("Error testing AI service:", err)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
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

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center gap-2">
        <div className="flex items-center gap-2 px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>{dashboardView === "overview" ? "Overview" : selectedFarm?.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="ml-auto flex items-center gap-2 px-4">
          <Select value={dashboardView} onValueChange={(value: "overview" | "farm") => setDashboardView(value)}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="overview">Overview Dashboard</SelectItem>
              <SelectItem value="farm">Farm Management</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Farm
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </header>

      {/* Dashboard Content */}
      <div className="flex-1 space-y-6 p-4">
        {dashboardView === "overview" ? (
          <>
            {/* Welcome Section */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
              <p className="text-muted-foreground">Here's what's happening with your agricultural operations today.</p>
            </div>

            {/* AI Service Status */}
            {aiStatus && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    AI Service Status
                    {aiStatus.configured ? (
                      <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                    ) : (
                      <span className="h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm">Status: {aiStatus.configured ? "Configured" : "Not Configured"}</p>
                      {aiStatus.connected !== undefined && (
                        <p className="text-sm">Connection: {aiStatus.connected ? "Connected" : "Disconnected"}</p>
                      )}
                      {aiStatus.error && <p className="text-sm text-red-600">Error: {aiStatus.error}</p>}
                    </div>
                    <Button onClick={testAIService} size="sm">
                      Test Connection
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* KPI Cards */}
            <KPISection />

            {/* Main Dashboard Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
              {/* Weather Card */}
              <div className="col-span-full lg:col-span-4">
                <EnhancedWeatherCard />
              </div>

              {/* Real-time Alerts */}
              <div className="col-span-full lg:col-span-3">
                <RealTimeAlerts />
              </div>

              {/* AI Advisory */}
              <div className="col-span-full">
                <AdvisoryCard />
              </div>

              {/* Market Prices */}
              <div className="col-span-full lg:col-span-4">
                <MarketPricesChart />
              </div>

              {/* Interactive Charts */}
              <div className="col-span-full">
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Analytics</CardTitle>
                    <CardDescription>Interactive charts and data visualization</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <InteractiveCharts />
                  </CardContent>
                </Card>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Farm Management View */}
            {farms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Select Farm</CardTitle>
                  <CardDescription>Choose a farm to view its detailed management dashboard</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select
                    value={selectedFarm?._id || ""}
                    onValueChange={(farmId) => {
                      const farm = farms.find((f) => f._id === farmId)
                      setSelectedFarm(farm || null)
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a farm" />
                    </SelectTrigger>
                    <SelectContent>
                      {farms.map((farm) => (
                        <SelectItem key={farm._id} value={farm._id}>
                          <div className="flex items-center gap-2">
                            <span>{farm.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({farm.farmType} - {farm.size.value} {farm.size.unit})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            )}

            {/* Farm Dashboard */}
            {selectedFarm ? (
              <FarmDashboard farmId={selectedFarm._id} farmName={selectedFarm.name} />
            ) : farms.length === 0 ? (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-4">No farms found</p>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create Your First Farm
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </>
        )}
      </div>
    </div>
  )
}
