"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Gauge,
  MapPin,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Cpu,
  Thermometer,
  Navigation,
  Wifi,
  WifiOff,
  Loader2,
  Settings,
} from "lucide-react"
import { useGeolocation } from "@/lib/hooks/use-geolocation"
import { useAIStatus } from "@/hooks/use-ai-status"
import { weatherApi } from "@/lib/api/weather-api"
import { WeatherSettingsDialog } from "./weather-settings-dialog"
import type { CurrentWeatherData, WeatherForecastData } from "@/lib/api/weather-api"
import type { WeatherSettings } from "./weather-settings-dialog"
import { cn } from "@/lib/utils"

interface WeatherState {
  current: CurrentWeatherData | null
  forecast: WeatherForecastData | null
  location: string
  loading: boolean
  error: string | null
  lastUpdated: Date | null
}

const getWeatherIcon = (weatherCode?: number, temperature?: number) => {
  if (weatherCode) {
    // Open-Meteo weather codes
    if (weatherCode === 0) return <Sun className="h-8 w-8 text-yellow-500" />
    if (weatherCode === 1 || weatherCode === 2 || weatherCode === 3) return <Cloud className="h-8 w-8 text-gray-500" />
    if (weatherCode >= 45 && weatherCode <= 48) return <Cloud className="h-8 w-8 text-gray-400" />
    if (weatherCode >= 51 && weatherCode <= 67) return <CloudRain className="h-8 w-8 text-blue-500" />
    if (weatherCode >= 71 && weatherCode <= 77) return <CloudRain className="h-8 w-8 text-blue-200" />
    if (weatherCode >= 80 && weatherCode <= 82) return <CloudRain className="h-8 w-8 text-blue-600" />
    if (weatherCode >= 85 && weatherCode <= 86) return <CloudRain className="h-8 w-8 text-blue-300" />
    if (weatherCode >= 95 && weatherCode <= 99) return <CloudRain className="h-8 w-8 text-purple-500" />
  }

  // Fallback based on temperature
  return temperature && temperature > 20 ? (
    <Sun className="h-8 w-8 text-yellow-500" />
  ) : (
    <Cloud className="h-8 w-8 text-gray-500" />
  )
}

const formatTime = (date: Date) => {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString([], {
    weekday: "short",
    month: "short",
    day: "numeric",
  })
}

export function AIWeatherStatusCard() {
  const [weather, setWeather] = useState<WeatherState>({
    current: null,
    forecast: null,
    location: "",
    loading: false,
    error: null,
    lastUpdated: null,
  })

  const [weatherSettings, setWeatherSettings] = useState<WeatherSettings>({
    currentVariables: [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "wind_speed_10m",
      "surface_pressure",
      "cloud_cover",
      "precipitation",
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
  })

  const {
    position,
    error: geoError,
    loading: geoLoading,
    getCurrentPosition,
    reset: resetGeolocation,
  } = useGeolocation()

  const {
    status: aiStatus,
    loading: aiLoading,
    error: aiError,
    lastChecked: aiLastChecked,
    checkStatus: checkAIStatus,
    testConnection: testAIConnection,
    isConfigured,
    isConnected,
  } = useAIStatus()

  // Fetch weather data when position is available
  const fetchWeatherData = useCallback(
    async (lat: number, lng: number) => {
      setWeather((prev) => ({ ...prev, loading: true, error: null }))

      try {
        // Get location name first with proper error handling
        let locationName = `${lat.toFixed(2)}, ${lng.toFixed(2)}`

        try {
          if (weatherApi && typeof weatherApi.reverseGeocode === "function") {
            const locations = await weatherApi.reverseGeocode(lat, lng)
            if (locations && locations.length > 0 && locations[0]?.name) {
              locationName = locations[0].name
            }
          }
        } catch (reverseGeocodeError) {
          console.warn("Reverse geocoding failed, using coordinates:", reverseGeocodeError)
          // Continue with coordinate-based location name
        }

        // Fetch current weather and forecast in parallel
        const weatherPromises = []

        // Add current weather promise
        if (weatherApi && typeof weatherApi.getCurrentWeather === "function") {
          weatherPromises.push(
            weatherApi.getCurrentWeather(lat, lng, weatherSettings.currentVariables, weatherSettings.options),
          )
        } else {
          throw new Error("Weather API getCurrentWeather method not available")
        }

        // Add forecast promise
        if (weatherApi && typeof weatherApi.getWeatherForecast === "function") {
          weatherPromises.push(
            weatherApi.getWeatherForecast(
              lat,
              lng,
              {
                hourlyVariables: weatherSettings.hourlyVariables,
                dailyVariables: weatherSettings.dailyVariables,
                days: weatherSettings.forecastDays,
              },
              weatherSettings.options,
            ),
          )
        } else {
          throw new Error("Weather API getWeatherForecast method not available")
        }

        const [current, forecast] = await Promise.all(weatherPromises)

        setWeather({
          current: current || null,
          forecast: forecast || null,
          location: locationName,
          loading: false,
          error: null,
          lastUpdated: new Date(),
        })
      } catch (error) {
        console.error("Weather fetch error:", error)
        const errorMessage = error instanceof Error ? error.message : "Failed to fetch weather data"
        setWeather((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }))
      }
    },
    [weatherSettings],
  )

  // Auto-fetch weather when position changes
  useEffect(() => {
    if (position) {
      fetchWeatherData(position.latitude, position.longitude)
    }
  }, [position, fetchWeatherData])

  const handleGetLocation = useCallback(async () => {
    try {
      await getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
      })
    } catch (error) {
      console.error("Geolocation error:", error)
    }
  }, [getCurrentPosition])

  const handleRefreshAll = useCallback(async () => {
    // Refresh AI status
    if (checkAIStatus) {
      checkAIStatus()
    }

    // Refresh weather if we have position
    if (position) {
      fetchWeatherData(position.latitude, position.longitude)
    } else {
      // Try to get location again
      handleGetLocation()
    }
  }, [checkAIStatus, position, fetchWeatherData, handleGetLocation])

  const handleTestAI = useCallback(async () => {
    try {
      if (testAIConnection) {
        await testAIConnection()
      }
    } catch (error) {
      console.error("AI test error:", error)
    }
  }, [testAIConnection])

  const handleSettingsChange = useCallback(
    (newSettings: WeatherSettings) => {
      setWeatherSettings(newSettings)
      // Refresh weather data with new settings if we have position
      if (position) {
        fetchWeatherData(position.latitude, position.longitude)
      }
    },
    [position, fetchWeatherData],
  )

  // Auto-get location on mount
  useEffect(() => {
    handleGetLocation()
  }, [handleGetLocation])

  const isDataStale = weather.lastUpdated && Date.now() - weather.lastUpdated.getTime() > 300000 // 5 minutes

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CardTitle className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Cpu className="h-5 w-5 text-blue-500" />
                <Thermometer className="h-5 w-5 text-orange-500" />
              </div>
              AI & Weather Status
            </CardTitle>
            {isDataStale && (
              <Badge variant="outline" className="text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Stale
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <WeatherSettingsDialog settings={weatherSettings} onSettingsChange={handleSettingsChange}>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </WeatherSettingsDialog>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefreshAll}
              disabled={weather.loading || aiLoading || geoLoading}
            >
              <RefreshCw className={cn("h-4 w-4", (weather.loading || aiLoading || geoLoading) && "animate-spin")} />
            </Button>
          </div>
        </div>
        <CardDescription>Real-time AI service monitoring and location-based weather information</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* AI Service Status Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Cpu className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">AI Service Status</h3>
          </div>

          {aiLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : aiStatus ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {isConfigured ? (
                    isConnected ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-yellow-500" />
                    )
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium">
                      {isConfigured ? (isConnected ? "Connected" : "Configured but Disconnected") : "Not Configured"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {aiLastChecked ? `Last checked: ${formatTime(aiLastChecked)}` : "Never checked"}
                    </div>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={handleTestAI} disabled={aiLoading}>
                  {aiLoading ? (
                    <>
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                      Testing
                    </>
                  ) : (
                    "Test"
                  )}
                </Button>
              </div>

              {aiStatus.testResponse && (
                <div className="p-2 rounded bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800">
                  <div className="text-xs text-green-700 dark:text-green-300">
                    <strong>Test Response:</strong> {aiStatus.testResponse}
                  </div>
                </div>
              )}

              {(aiStatus.error || aiError) && (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-xs">{aiStatus.error || aiError}</AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>Unable to check AI service status</AlertDescription>
            </Alert>
          )}
        </div>

        <Separator />

        {/* Weather Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Thermometer className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold">Weather Information</h3>
          </div>

          {/* Location Status */}
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              {geoLoading ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
              ) : position ? (
                <Navigation className="h-5 w-5 text-green-500" />
              ) : (
                <MapPin className="h-5 w-5 text-gray-500" />
              )}
              <div>
                <div className="font-medium">
                  {geoLoading
                    ? "Getting location..."
                    : position
                      ? weather.location || `${position.latitude.toFixed(2)}, ${position.longitude.toFixed(2)}`
                      : "Location not available"}
                </div>
                {position && (
                  <div className="text-xs text-muted-foreground">Accuracy: ±{Math.round(position.accuracy)}m</div>
                )}
              </div>
            </div>
            {!position && !geoLoading && (
              <Button size="sm" variant="outline" onClick={handleGetLocation}>
                <Navigation className="h-3 w-3 mr-1" />
                Get Location
              </Button>
            )}
          </div>

          {/* Location/Weather Errors */}
          {(geoError || weather.error) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                {geoError?.message || weather.error}
                {geoError?.code === 1 && (
                  <div className="mt-1">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={resetGeolocation}
                      className="h-6 text-xs bg-transparent"
                    >
                      Reset & Try Again
                    </Button>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          {/* Current Weather Display */}
          {weather.loading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            </div>
          ) : weather.current ? (
            <div className="space-y-4">
              {/* Main Weather Display */}
              <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
                {getWeatherIcon(weather.current.data.weather_code, weather.current.data.temperature_2m)}
                <div>
                  <div className="text-2xl font-bold">
                    {weather.current.data.temperature_2m
                      ? `${Math.round(weather.current.data.temperature_2m)}°${weatherSettings.options.temperatureUnit === "fahrenheit" ? "F" : "C"}`
                      : "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Feels like{" "}
                    {weather.current.data.apparent_temperature
                      ? `${Math.round(weather.current.data.apparent_temperature)}°${weatherSettings.options.temperatureUnit === "fahrenheit" ? "F" : "C"}`
                      : "N/A"}
                  </div>
                  {weather.lastUpdated && (
                    <div className="text-xs text-muted-foreground">Updated: {formatTime(weather.lastUpdated)}</div>
                  )}
                </div>
              </div>

              {/* Weather Metrics */}
              <div className="grid grid-cols-2 gap-3">
                {weather.current.data.relative_humidity_2m !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                    <Droplets className="h-4 w-4 text-blue-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Humidity</div>
                      <div className="text-sm font-medium">
                        {Math.round(weather.current.data.relative_humidity_2m)}%
                      </div>
                    </div>
                  </div>
                )}

                {weather.current.data.wind_speed_10m !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                    <Wind className="h-4 w-4 text-gray-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Wind</div>
                      <div className="text-sm font-medium">
                        {Math.round(weather.current.data.wind_speed_10m)} {weatherSettings.options.windSpeedUnit}
                      </div>
                    </div>
                  </div>
                )}

                {weather.current.data.surface_pressure !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                    <Gauge className="h-4 w-4 text-purple-500" />
                    <div>
                      <div className="text-xs text-muted-foreground">Pressure</div>
                      <div className="text-sm font-medium">{Math.round(weather.current.data.surface_pressure)} hPa</div>
                    </div>
                  </div>
                )}

                {weather.current.data.cloud_cover !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded bg-muted/30">
                    <Cloud className="h-4 w-4 text-gray-400" />
                    <div>
                      <div className="text-xs text-muted-foreground">Clouds</div>
                      <div className="text-sm font-medium">{Math.round(weather.current.data.cloud_cover)}%</div>
                    </div>
                  </div>
                )}
              </div>

              {/* Forecast */}
              {weather.forecast?.daily && weather.forecast.daily.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">{weatherSettings.forecastDays}-Day Forecast</h4>
                  <div className="space-y-1">
                    {weather.forecast.daily.slice(0, Math.min(5, weatherSettings.forecastDays)).map((day, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 rounded hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="text-xs font-medium w-12">
                            {index === 0 ? "Today" : formatDate(new Date(day.date))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="font-medium">
                            {day.data.temperature_2m_max ? Math.round(day.data.temperature_2m_max) : "--"}°
                          </span>
                          <span className="text-muted-foreground">
                            {day.data.temperature_2m_min ? Math.round(day.data.temperature_2m_min) : "--"}°
                          </span>
                          {day.data.precipitation_sum && day.data.precipitation_sum > 0 && (
                            <span className="text-xs text-blue-500">
                              {Math.round(day.data.precipitation_sum)}
                              {weatherSettings.options.precipitationUnit}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : position ? (
            <div className="text-center py-4">
              <Cloud className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">No weather data available</p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => fetchWeatherData(position.latitude, position.longitude)}
                className="mt-2"
              >
                Retry
              </Button>
            </div>
          ) : null}
        </div>

        {/* Connection Status Indicator */}
        <div className="flex items-center justify-center gap-4 pt-2 border-t">
          <div className="flex items-center gap-1 text-xs">
            {isConnected ? <Wifi className="h-3 w-3 text-green-500" /> : <WifiOff className="h-3 w-3 text-red-500" />}
            <span className="text-muted-foreground">AI: {isConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex items-center gap-1 text-xs">
            {position ? <Navigation className="h-3 w-3 text-green-500" /> : <MapPin className="h-3 w-3 text-red-500" />}
            <span className="text-muted-foreground">Location: {position ? "Available" : "Unavailable"}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
