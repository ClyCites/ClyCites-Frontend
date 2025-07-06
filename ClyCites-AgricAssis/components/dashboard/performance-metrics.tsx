"use client"

import type React from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Target, TrendingUp, Calendar, DollarSign, Droplets, Sprout, Zap, Award } from "lucide-react"

interface MetricCardProps {
  title: string
  current: number
  target: number
  unit: string
  trend: number
  icon: React.ReactNode
  color: string
}

function MetricCard({ title, current, target, unit, trend, icon, color }: MetricCardProps) {
  const percentage = Math.round((current / target) * 100)
  const isOnTrack = percentage >= 80

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <div className={`text-${color}-500`}>{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-baseline space-x-2">
            <span className="text-2xl font-bold">{current}</span>
            <span className="text-sm text-muted-foreground">
              / {target} {unit}
            </span>
          </div>

          <Progress value={percentage} className="h-2" />

          <div className="flex items-center justify-between">
            <Badge variant={isOnTrack ? "default" : "secondary"}>{percentage}% of target</Badge>
            <div className="flex items-center space-x-1">
              <TrendingUp className={`h-3 w-3 ${trend > 0 ? "text-green-500" : "text-red-500"}`} />
              <span className={`text-xs ${trend > 0 ? "text-green-500" : "text-red-500"}`}>
                {trend > 0 ? "+" : ""}
                {trend}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function PerformanceMetrics() {
  const seasonalMetrics = [
    {
      title: "Yield Target",
      current: 2.4,
      target: 3.0,
      unit: "tons/ha",
      trend: 12.5,
      icon: <Sprout className="h-4 w-4" />,
      color: "green",
    },
    {
      title: "Revenue Goal",
      current: 12450,
      target: 15000,
      unit: "USD",
      trend: 8.2,
      icon: <DollarSign className="h-4 w-4" />,
      color: "blue",
    },
    {
      title: "Water Efficiency",
      current: 85,
      target: 90,
      unit: "%",
      trend: -2.1,
      icon: <Droplets className="h-4 w-4" />,
      color: "cyan",
    },
    {
      title: "Energy Savings",
      current: 320,
      target: 400,
      unit: "kWh",
      trend: 15.3,
      icon: <Zap className="h-4 w-4" />,
      color: "yellow",
    },
  ]

  const monthlyMetrics = [
    {
      title: "Production",
      current: 180,
      target: 200,
      unit: "tons",
      trend: 5.2,
      icon: <Target className="h-4 w-4" />,
      color: "green",
    },
    {
      title: "Sales",
      current: 2800,
      target: 3200,
      unit: "USD",
      trend: 12.1,
      icon: <DollarSign className="h-4 w-4" />,
      color: "blue",
    },
    {
      title: "Quality Score",
      current: 92,
      target: 95,
      unit: "%",
      trend: 3.2,
      icon: <Award className="h-4 w-4" />,
      color: "purple",
    },
    {
      title: "Efficiency",
      current: 78,
      target: 85,
      unit: "%",
      trend: -1.5,
      icon: <Zap className="h-4 w-4" />,
      color: "orange",
    },
  ]

  const weeklyMetrics = [
    {
      title: "Daily Output",
      current: 25,
      target: 30,
      unit: "tons",
      trend: 8.5,
      icon: <Target className="h-4 w-4" />,
      color: "green",
    },
    {
      title: "Labor Hours",
      current: 320,
      target: 400,
      unit: "hours",
      trend: -5.2,
      icon: <Calendar className="h-4 w-4" />,
      color: "blue",
    },
    {
      title: "Resource Use",
      current: 88,
      target: 90,
      unit: "%",
      trend: 2.1,
      icon: <Droplets className="h-4 w-4" />,
      color: "cyan",
    },
    {
      title: "Cost Control",
      current: 1250,
      target: 1500,
      unit: "USD",
      trend: -8.3,
      icon: <DollarSign className="h-4 w-4" />,
      color: "red",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Performance Metrics</CardTitle>
        <CardDescription>Track your progress against key targets</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="seasonal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="weekly">Weekly</TabsTrigger>
          </TabsList>

          <TabsContent value="seasonal" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {seasonalMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="monthly" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {monthlyMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="weekly" className="mt-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {weeklyMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
