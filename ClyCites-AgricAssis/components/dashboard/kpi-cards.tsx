"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  TrendingUp,
  TrendingDown,
  Minus,
  DollarSign,
  Sprout,
  Droplets,
  AlertTriangle,
  Calendar,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface KPICardProps {
  title: string
  value: string | number
  change?: number
  changeLabel?: string
  icon: React.ReactNode
  trend?: "up" | "down" | "neutral"
  progress?: number
  target?: string
  status?: "success" | "warning" | "danger" | "info"
  className?: string
}

export function KPICard({
  title,
  value,
  change,
  changeLabel,
  icon,
  trend,
  progress,
  target,
  status,
  className,
}: KPICardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "down":
        return <TrendingDown className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = () => {
    switch (status) {
      case "success":
        return "text-green-600 dark:text-green-400"
      case "warning":
        return "text-yellow-600 dark:text-yellow-400"
      case "danger":
        return "text-red-600 dark:text-red-400"
      case "info":
        return "text-blue-600 dark:text-blue-400"
      default:
        return "text-foreground"
    }
  }

  return (
    <Card className={cn("relative overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div className="text-muted-foreground">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className={cn("text-2xl font-bold", getStatusColor())}>{value}</div>

          {target && <div className="text-xs text-muted-foreground">Target: {target}</div>}

          {progress !== undefined && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <div className="text-xs text-muted-foreground">{progress}% of target</div>
            </div>
          )}

          {change !== undefined && (
            <div className="flex items-center space-x-1">
              {getTrendIcon()}
              <span
                className={cn(
                  "text-xs font-medium",
                  trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600",
                )}
              >
                {change > 0 ? "+" : ""}
                {change}%
              </span>
              {changeLabel && <span className="text-xs text-muted-foreground">{changeLabel}</span>}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function KPISection() {
  const kpis = [
    {
      title: "Total Revenue",
      value: "$12,450",
      change: 8.2,
      changeLabel: "vs last month",
      icon: <DollarSign className="h-4 w-4" />,
      trend: "up" as const,
      status: "success" as const,
    },
    {
      title: "Crop Yield",
      value: "2.4 tons/ha",
      change: 12.5,
      changeLabel: "vs last season",
      icon: <Sprout className="h-4 w-4" />,
      trend: "up" as const,
      progress: 78,
      target: "3.0 tons/ha",
      status: "success" as const,
    },
    {
      title: "Water Usage",
      value: "450L/day",
      change: -5.3,
      changeLabel: "vs last week",
      icon: <Droplets className="h-4 w-4" />,
      trend: "down" as const,
      progress: 65,
      target: "400L/day",
      status: "warning" as const,
    },
    {
      title: "Risk Alerts",
      value: "3 Active",
      icon: <AlertTriangle className="h-4 w-4" />,
      status: "warning" as const,
    },
    {
      title: "Season Progress",
      value: "Week 12",
      icon: <Calendar className="h-4 w-4" />,
      progress: 60,
      target: "20 weeks",
      status: "info" as const,
    },
    {
      title: "Market Score",
      value: "85/100",
      change: 3.2,
      changeLabel: "this week",
      icon: <BarChart3 className="h-4 w-4" />,
      trend: "up" as const,
      progress: 85,
      status: "success" as const,
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {kpis.map((kpi, index) => (
        <KPICard key={index} {...kpi} />
      ))}
    </div>
  )
}
