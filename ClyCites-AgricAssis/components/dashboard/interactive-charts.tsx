"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, PieChart, Pie } from "recharts"
import { TrendingUp, Download, RefreshCw } from "lucide-react"

// Type definitions for chart data
interface YieldDataPoint {
  date: string
  maize: number
  rice: number
  cassava: number
  target: number
}

interface ResourceDataPoint {
  name: string
  used: number
  allocated: number
  efficiency: number
}

interface CropDistributionPoint {
  name: string
  value: number
  fill: string
}

interface RevenueDataPoint {
  month: string
  revenue: number
  expenses: number
  profit: number
}

// Chart configurations for shadcn/ui charts
const yieldChartConfig = {
  maize: {
    label: "Maize",
    color: "hsl(var(--chart-1))",
  },
  rice: {
    label: "Rice",
    color: "hsl(var(--chart-2))",
  },
  cassava: {
    label: "Cassava",
    color: "hsl(var(--chart-3))",
  },
  target: {
    label: "Target",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const resourceChartConfig = {
  used: {
    label: "Used",
    color: "hsl(var(--chart-1))",
  },
  allocated: {
    label: "Allocated",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const cropChartConfig = {
  maize: {
    label: "Maize",
    color: "hsl(var(--chart-1))",
  },
  rice: {
    label: "Rice",
    color: "hsl(var(--chart-2))",
  },
  cassava: {
    label: "Cassava",
    color: "hsl(var(--chart-3))",
  },
  vegetables: {
    label: "Vegetables",
    color: "hsl(var(--chart-4))",
  },
} satisfies ChartConfig

const revenueChartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--chart-1))",
  },
  expenses: {
    label: "Expenses",
    color: "hsl(var(--chart-2))",
  },
  profit: {
    label: "Profit",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig

// Mock data generators with proper typing
const generateYieldData = (days: number): YieldDataPoint[] => {
  const data: YieldDataPoint[] = []
  const startDate = new Date()
  startDate.setDate(startDate.getDate() - days)

  for (let i = 0; i <= days; i += 7) {
    const date = new Date(startDate)
    date.setDate(date.getDate() + i)

    data.push({
      date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      maize: Number((2.0 + Math.random() * 0.8).toFixed(2)),
      rice: Number((2.5 + Math.random() * 0.6).toFixed(2)),
      cassava: Number((8.0 + Math.random() * 2.0).toFixed(2)),
      target: 2.5,
    })
  }

  console.log("Generated yield data:", data)
  return data
}

const generateResourceData = (): ResourceDataPoint[] => {
  const data: ResourceDataPoint[] = [
    { name: "Water", used: 450, allocated: 600, efficiency: 75 },
    { name: "Fertilizer", used: 120, allocated: 150, efficiency: 80 },
    { name: "Seeds", used: 85, allocated: 100, efficiency: 85 },
    { name: "Labor Hours", used: 320, allocated: 400, efficiency: 80 },
  ]
  console.log("Generated resource data:", data)
  return data
}

const generateCropDistribution = (): CropDistributionPoint[] => {
  const data: CropDistributionPoint[] = [
    { name: "maize", value: 40, fill: "var(--color-maize)" },
    { name: "rice", value: 25, fill: "var(--color-rice)" },
    { name: "cassava", value: 20, fill: "var(--color-cassava)" },
    { name: "vegetables", value: 15, fill: "var(--color-vegetables)" },
  ]
  console.log("Generated crop distribution data:", data)
  return data
}

const generateRevenueData = (months: number): RevenueDataPoint[] => {
  const data: RevenueDataPoint[] = []
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - months)

  for (let i = 0; i <= months; i++) {
    const date = new Date(startDate)
    date.setMonth(date.getMonth() + i)

    const revenue = Number((8000 + Math.random() * 4000).toFixed(2))
    const expenses = Number((5000 + Math.random() * 2000).toFixed(2))
    const profit = Number((revenue - expenses).toFixed(2))

    data.push({
      month: date.toLocaleDateString("en-US", { month: "short" }),
      revenue,
      expenses,
      profit,
    })
  }

  console.log("Generated revenue data:", data)
  return data
}

export function InteractiveCharts() {
  const [yieldData, setYieldData] = useState<YieldDataPoint[]>([])
  const [resourceData, setResourceData] = useState<ResourceDataPoint[]>([])
  const [cropDistribution, setCropDistribution] = useState<CropDistributionPoint[]>([])
  const [revenueData, setRevenueData] = useState<RevenueDataPoint[]>([])
  const [selectedTimeframe, setSelectedTimeframe] = useState("90")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Function to refresh data
  const refreshData = async () => {
    console.log("Refreshing data with timeframe:", selectedTimeframe)
    setIsLoading(true)
    setError(null)

    try {
      // Short delay to show loading state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Generate new data based on timeframe
      const days = Number.parseInt(selectedTimeframe)
      const newYieldData = generateYieldData(days)
      const newResourceData = generateResourceData()
      const newCropDistribution = generateCropDistribution()
      const newRevenueData = generateRevenueData(12)

      // Update state with new data
      setYieldData(newYieldData)
      setResourceData(newResourceData)
      setCropDistribution(newCropDistribution)
      setRevenueData(newRevenueData)

      console.log("Data refreshed successfully")
    } catch (err) {
      console.error("Failed to refresh data:", err)
      setError("Failed to refresh chart data. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Initialize data on component mount
  useEffect(() => {
    refreshData()
  }, [])

  // Handle timeframe changes
  useEffect(() => {
    if (!isLoading && yieldData.length > 0) {
      refreshData()
    }
  }, [selectedTimeframe])

  // Show loading state
  if (isLoading && yieldData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="flex items-center space-x-2">
            <RefreshCw className="h-6 w-6 animate-spin" />
            <span>Loading charts...</span>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={refreshData}>Try Again</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="30">Last 30 days</SelectItem>
              <SelectItem value="90">Last 90 days</SelectItem>
              <SelectItem value="180">Last 6 months</SelectItem>
              <SelectItem value="365">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={refreshData} disabled={isLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export Data
        </Button>
      </div>

      {/* Debug Info */}
      <div className="text-xs text-muted-foreground">
        Data points: Yield({yieldData.length}), Resources({resourceData.length}), Crops({cropDistribution.length}),
        Revenue({revenueData.length})
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Yield Performance Chart */}
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Crop Yield Performance</CardTitle>
                <CardDescription>Yield trends across different crops (tons/hectare)</CardDescription>
              </div>
              <Badge variant="outline" className="flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +12% vs target
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ChartContainer config={yieldChartConfig}>
              <LineChart
                accessibilityLayer
                data={yieldData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `${value}`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="maize" type="monotone" stroke="var(--color-maize)" strokeWidth={2} dot={false} />
                <Line dataKey="rice" type="monotone" stroke="var(--color-rice)" strokeWidth={2} dot={false} />
                <Line dataKey="cassava" type="monotone" stroke="var(--color-cassava)" strokeWidth={2} dot={false} />
                <Line
                  dataKey="target"
                  type="monotone"
                  stroke="var(--color-target)"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Resource Utilization */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Utilization</CardTitle>
            <CardDescription>Current usage vs allocated resources</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={resourceChartConfig}>
              <BarChart
                accessibilityLayer
                data={resourceData}
                margin={{
                  top: 20,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="name"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
                <Bar dataKey="used" fill="var(--color-used)" radius={4} />
                <Bar dataKey="allocated" fill="var(--color-allocated)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Crop Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Crop Distribution</CardTitle>
            <CardDescription>Land allocation by crop type</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 pb-0">
            <ChartContainer config={cropChartConfig} className="mx-auto aspect-square max-h-[250px]">
              <PieChart>
                <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                <Pie data={cropDistribution} dataKey="value" nameKey="name" innerRadius={60} strokeWidth={5}>
                  <ChartLegend
                    content={<ChartLegendContent nameKey="name" />}
                    className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Financial Performance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Financial Performance</CardTitle>
            <CardDescription>Monthly revenue, expenses, and profit trends</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueChartConfig}>
              <LineChart
                accessibilityLayer
                data={revenueData}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value.slice(0, 3)}
                />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => `$${value}`} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Line dataKey="revenue" type="monotone" stroke="var(--color-revenue)" strokeWidth={2} dot={false} />
                <Line dataKey="expenses" type="monotone" stroke="var(--color-expenses)" strokeWidth={2} dot={false} />
                <Line dataKey="profit" type="monotone" stroke="var(--color-profit)" strokeWidth={3} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
