"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Thermometer, Droplets, Wind, Gauge } from "lucide-react"

interface WeatherCardProps {
  weather: {
    current: Record<string, any>
    forecast: Array<Record<string, any>>
    summary: string
    alerts: Array<any>
  }
  detailed?: boolean
}

export function WeatherCard({ weather, detailed = false }: WeatherCardProps) {
  const current = weather.current

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Current Weather
        </CardTitle>
        <CardDescription>{weather.summary}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-red-500" />
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="font-medium">{current.temperature_2m}°C</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm text-muted-foreground">Humidity</p>
              <p className="font-medium">{current.relative_humidity_2m}%</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <div>
              <p className="text-sm text-muted-foreground">Wind Speed</p>
              <p className="font-medium">{current.wind_speed_10m} km/h</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Droplets className="h-4 w-4 text-blue-600" />
            <div>
              <p className="text-sm text-muted-foreground">Precipitation</p>
              <p className="font-medium">{current.precipitation || 0}mm</p>
            </div>
          </div>

          {detailed && current.soil_moisture_0_1cm && (
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brown-500" />
              <div>
                <p className="text-sm text-muted-foreground">Soil Moisture</p>
                <p className="font-medium">{current.soil_moisture_0_1cm}%</p>
              </div>
            </div>
          )}
        </div>

        {weather.alerts.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-medium mb-2">Active Alerts</p>
            <div className="flex flex-wrap gap-1">
              {weather.alerts.map((alert, index) => (
                <Badge key={index} variant="destructive" className="text-xs">
                  {alert.title}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
