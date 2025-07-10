"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, RotateCcw } from "lucide-react"

export interface WeatherSettings {
  currentVariables: string[]
  hourlyVariables: string[]
  dailyVariables: string[]
  forecastDays: number
  options: {
    temperatureUnit: "celsius" | "fahrenheit"
    windSpeedUnit: "kmh" | "mph" | "ms"
    precipitationUnit: "mm" | "inch"
    timezone: string
  }
}

interface WeatherSettingsDialogProps {
  settings: WeatherSettings
  onSettingsChange: (settings: WeatherSettings) => void
  children: React.ReactNode
}

const CURRENT_VARIABLES = [
  { key: "temperature_2m", label: "Temperature", description: "Air temperature at 2 meters" },
  { key: "relative_humidity_2m", label: "Humidity", description: "Relative humidity at 2 meters" },
  { key: "apparent_temperature", label: "Feels Like", description: "Apparent temperature" },
  { key: "precipitation", label: "Precipitation", description: "Current precipitation" },
  { key: "weather_code", label: "Weather Code", description: "Weather condition code" },
  { key: "cloud_cover", label: "Cloud Cover", description: "Total cloud cover percentage" },
  { key: "surface_pressure", label: "Pressure", description: "Surface air pressure" },
  { key: "wind_speed_10m", label: "Wind Speed", description: "Wind speed at 10 meters" },
  { key: "wind_direction_10m", label: "Wind Direction", description: "Wind direction at 10 meters" },
  { key: "wind_gusts_10m", label: "Wind Gusts", description: "Wind gusts at 10 meters" },
]

const HOURLY_VARIABLES = [
  { key: "temperature_2m", label: "Temperature", description: "Hourly temperature" },
  { key: "relative_humidity_2m", label: "Humidity", description: "Hourly humidity" },
  { key: "precipitation", label: "Precipitation", description: "Hourly precipitation" },
  { key: "weather_code", label: "Weather Code", description: "Hourly weather conditions" },
  { key: "cloud_cover", label: "Cloud Cover", description: "Hourly cloud cover" },
  { key: "wind_speed_10m", label: "Wind Speed", description: "Hourly wind speed" },
  { key: "wind_direction_10m", label: "Wind Direction", description: "Hourly wind direction" },
  { key: "surface_pressure", label: "Pressure", description: "Hourly surface pressure" },
]

const DAILY_VARIABLES = [
  { key: "temperature_2m_max", label: "Max Temperature", description: "Daily maximum temperature" },
  { key: "temperature_2m_min", label: "Min Temperature", description: "Daily minimum temperature" },
  { key: "precipitation_sum", label: "Precipitation", description: "Daily precipitation sum" },
  { key: "weather_code", label: "Weather Code", description: "Daily weather conditions" },
  { key: "wind_speed_10m_max", label: "Max Wind Speed", description: "Daily maximum wind speed" },
  { key: "wind_direction_10m_dominant", label: "Wind Direction", description: "Daily dominant wind direction" },
  { key: "sunrise", label: "Sunrise", description: "Daily sunrise time" },
  { key: "sunset", label: "Sunset", description: "Daily sunset time" },
]

const DEFAULT_SETTINGS: WeatherSettings = {
  currentVariables: [
    "temperature_2m",
    "relative_humidity_2m",
    "apparent_temperature",
    "wind_speed_10m",
    "surface_pressure",
    "cloud_cover",
    "precipitation",
    "weather_code",
  ],
  hourlyVariables: ["temperature_2m", "precipitation", "wind_speed_10m", "relative_humidity_2m"],
  dailyVariables: ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max"],
  forecastDays: 7,
  options: {
    temperatureUnit: "celsius",
    windSpeedUnit: "kmh",
    precipitationUnit: "mm",
    timezone: "auto",
  },
}

export function WeatherSettingsDialog({ settings, onSettingsChange, children }: WeatherSettingsDialogProps) {
  const [localSettings, setLocalSettings] = useState<WeatherSettings>(settings)
  const [open, setOpen] = useState(false)

  const handleVariableToggle = (
    category: "currentVariables" | "hourlyVariables" | "dailyVariables",
    variable: string,
  ) => {
    setLocalSettings((prev) => ({
      ...prev,
      [category]: prev[category].includes(variable)
        ? prev[category].filter((v) => v !== variable)
        : [...prev[category], variable],
    }))
  }

  const handleOptionChange = (key: keyof WeatherSettings["options"], value: string) => {
    setLocalSettings((prev) => ({
      ...prev,
      options: {
        ...prev.options,
        [key]: value,
      },
    }))
  }

  const handleForecastDaysChange = (days: number) => {
    setLocalSettings((prev) => ({
      ...prev,
      forecastDays: Math.max(1, Math.min(16, days)),
    }))
  }

  const handleSave = () => {
    onSettingsChange(localSettings)
    setOpen(false)
  }

  const handleReset = () => {
    setLocalSettings(DEFAULT_SETTINGS)
  }

  const handleCancel = () => {
    setLocalSettings(settings)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Weather Settings
          </DialogTitle>
          <DialogDescription>
            Customize which weather parameters to fetch and display. Changes will apply to new weather requests.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Units Configuration */}
            <div className="space-y-4">
              <h3 className="font-semibold">Units</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Temperature</Label>
                  <Select
                    value={localSettings.options.temperatureUnit}
                    onValueChange={(value) => handleOptionChange("temperatureUnit", value as "celsius" | "fahrenheit")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="celsius">Celsius (°C)</SelectItem>
                      <SelectItem value="fahrenheit">Fahrenheit (°F)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Wind Speed</Label>
                  <Select
                    value={localSettings.options.windSpeedUnit}
                    onValueChange={(value) => handleOptionChange("windSpeedUnit", value as "kmh" | "mph" | "ms")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="kmh">km/h</SelectItem>
                      <SelectItem value="mph">mph</SelectItem>
                      <SelectItem value="ms">m/s</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Precipitation</Label>
                  <Select
                    value={localSettings.options.precipitationUnit}
                    onValueChange={(value) => handleOptionChange("precipitationUnit", value as "mm" | "inch")}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mm">Millimeters (mm)</SelectItem>
                      <SelectItem value="inch">Inches (in)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Forecast Days</Label>
                  <Select
                    value={localSettings.forecastDays.toString()}
                    onValueChange={(value) => handleForecastDaysChange(Number.parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[...Array(16)].map((_, i) => (
                        <SelectItem key={i + 1} value={(i + 1).toString()}>
                          {i + 1} day{i + 1 > 1 ? "s" : ""}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Current Weather Variables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Current Weather Variables</h3>
                <Badge variant="secondary">{localSettings.currentVariables.length} selected</Badge>
              </div>
              <div className="grid gap-3">
                {CURRENT_VARIABLES.map((variable) => (
                  <div key={variable.key} className="flex items-center justify-between space-x-2">
                    <div className="flex-1">
                      <Label className="font-medium">{variable.label}</Label>
                      <p className="text-xs text-muted-foreground">{variable.description}</p>
                    </div>
                    <Switch
                      checked={localSettings.currentVariables.includes(variable.key)}
                      onCheckedChange={() => handleVariableToggle("currentVariables", variable.key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Hourly Variables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Hourly Forecast Variables</h3>
                <Badge variant="secondary">{localSettings.hourlyVariables.length} selected</Badge>
              </div>
              <div className="grid gap-3">
                {HOURLY_VARIABLES.map((variable) => (
                  <div key={variable.key} className="flex items-center justify-between space-x-2">
                    <div className="flex-1">
                      <Label className="font-medium">{variable.label}</Label>
                      <p className="text-xs text-muted-foreground">{variable.description}</p>
                    </div>
                    <Switch
                      checked={localSettings.hourlyVariables.includes(variable.key)}
                      onCheckedChange={() => handleVariableToggle("hourlyVariables", variable.key)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Daily Variables */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold">Daily Forecast Variables</h3>
                <Badge variant="secondary">{localSettings.dailyVariables.length} selected</Badge>
              </div>
              <div className="grid gap-3">
                {DAILY_VARIABLES.map((variable) => (
                  <div key={variable.key} className="flex items-center justify-between space-x-2">
                    <div className="flex-1">
                      <Label className="font-medium">{variable.label}</Label>
                      <p className="text-xs text-muted-foreground">{variable.description}</p>
                    </div>
                    <Switch
                      checked={localSettings.dailyVariables.includes(variable.key)}
                      onCheckedChange={() => handleVariableToggle("dailyVariables", variable.key)}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="flex items-center justify-between">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Reset to Defaults
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Changes</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
