"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
  Search,
  Navigation,
  Settings,
  Thermometer,
  Loader2,
} from "lucide-react"
import {
  useLocationSearch,
  useCurrentLocation,
  useCurrentWeather,
  useWeatherForecast,
  type Location,
} from "@/lib/hooks/use-weather"
import { WeatherSettingsDialog, type WeatherSettings } from "./weather-settings-dialog"
import { cn } from "@/lib/utils"

const getWeatherIcon = (weatherCode?: number, temperature?: number) => {
  if (weatherCode !== undefined) {
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

export function EnhancedWeatherCard() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchOpen, setSearchOpen] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const [weatherSettings, setWeatherSettings] = useState<WeatherSettings>({
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
  })

  // Location search
  const { locations, loading: searchLoading, searchLocations, clearLocations } = useLocationSearch()

  // Current location
  const { location: currentLocation, isLoading: locationLoading, getCurrentLocation } = useCurrentLocation()

  // Weather data
  const {
    data: weather,
    isLoading: weatherLoading,
    error: weatherError,
    refetch: refetchWeather,
  } = useCurrentWeather(selectedLocation || currentLocation, weatherSettings.currentVariables, weatherSettings.options)

  // Forecast data
  const {
    data: forecast,
    isLoading: forecastLoading,
    error: forecastError,
    refetch: refetchForecast,
  } = useWeatherForecast(
    selectedLocation || currentLocation,
    {
      hourlyVariables: weatherSettings.hourlyVariables,
      dailyVariables: weatherSettings.dailyVariables,
      days: weatherSettings.forecastDays,
    },
    weatherSettings.options,
  )

  // Handle location search
  const handleSearch = useCallback(
    (query: string) => {
      setSearchQuery(query)
      if (query.length > 2) {
        searchLocations(query)
      } else {
        clearLocations()
      }
    },
    [searchLocations, clearLocations],
  )

  // Handle location selection
  const handleLocationSelect = useCallback(
    (location: Location) => {
      setSelectedLocation(location)
      setSearchOpen(false)
      setSearchQuery(location.name)
      clearLocations()
      setLastUpdated(new Date())
    },
    [clearLocations],
  )

  // Handle current location
  const handleCurrentLocation = useCallback(async () => {
    try {
      await getCurrentLocation()
      setSelectedLocation(null)
      setSearchQuery("Current Location")
      setLastUpdated(new Date())
    } catch (error) {
      console.error("Failed to get current location:", error)
    }
  }, [getCurrentLocation])

  // Handle refresh
  const handleRefresh = useCallback(async () => {
    await Promise.all([refetchWeather(), refetchForecast()])
    setLastUpdated(new Date())
  }, [refetchWeather, refetchForecast])

  // Handle settings change
  const handleSettingsChange = useCallback((newSettings: WeatherSettings) => {
    setWeatherSettings(newSettings)
    setLastUpdated(new Date())
  }, [])

  // Auto-get current location on mount
  useEffect(() => {
    handleCurrentLocation()
  }, [handleCurrentLocation])

  const isLoading = weatherLoading || forecastLoading
  const hasLocation = selectedLocation || currentLocation
  const locationName = selectedLocation?.name || (currentLocation ? "Current Location" : "No location")
  const hasError = weatherError || forecastError

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Thermometer className="h-5 w-5 text-orange-500" />
            Weather Forecast
          </CardTitle>
          <div className="flex items-center gap-2">
            <WeatherSettingsDialog settings={weatherSettings} onSettingsChange={handleSettingsChange}>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </WeatherSettingsDialog>
            <Button variant="ghost" size="sm" onClick={handleRefresh} disabled={isLoading}>
              <RefreshCw className={cn("h-4 w-4", isLoading && "animate-spin")} />
            </Button>
          </div>
        </div>
        <CardDescription>Real-time weather information and forecasts</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Location Search */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={searchOpen}
                  className="flex-1 justify-between bg-transparent"
                >
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span className="truncate">{searchQuery || "Search location..."}</span>
                  </div>
                  <Search className="h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0" align="start">
                <Command>
                  <CommandInput placeholder="Search locations..." value={searchQuery} onValueChange={handleSearch} />
                  <CommandList>
                    {searchLoading ? (
                      <div className="p-2">
                        <Loader2 className="h-4 w-4 animate-spin mx-auto" />
                      </div>
                    ) : locations.length > 0 ? (
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={`${location.latitude}-${location.longitude}`}
                            value={location.name}
                            onSelect={() => handleLocationSelect(location)}
                            className="cursor-pointer"
                          >
                            <MapPin className="h-4 w-4 mr-2" />
                            <div>
                              <div className="font-medium">{location.name}</div>
                              {location.country && (
                                <div className="text-xs text-muted-foreground">
                                  {location.region && `${location.region}, `}
                                  {location.country}
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    ) : searchQuery.length > 2 ? (
                      <CommandEmpty>No locations found.</CommandEmpty>
                    ) : null}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCurrentLocation}
              disabled={locationLoading}
              title="Use current location"
            >
              {locationLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Navigation className="h-4 w-4" />}
            </Button>
          </div>

          {/* Location Info */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-3 w-3" />
              <span>{locationName}</span>
            </div>
            {lastUpdated && <div className="text-xs text-muted-foreground">Updated: {formatTime(lastUpdated)}</div>}
          </div>
        </div>

        <Separator />

        {/* Weather Display */}
        {!hasLocation ? (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Please select a location or enable location services to view weather information.
            </AlertDescription>
          </Alert>
        ) : hasError ? (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {weatherError || forecastError}
              <Button onClick={handleRefresh} className="mt-2 w-full bg-transparent" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        ) : isLoading ? (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-16 w-16 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        ) : weather ? (
          <div className="space-y-6">
            {/* Current Weather */}
            <div className="flex items-center gap-4 p-4 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
              {getWeatherIcon(weather.data.weather_code, weather.data.temperature_2m)}
              <div className="flex-1">
                <div className="text-3xl font-bold">
                  {weather.data.temperature_2m !== undefined
                    ? `${Math.round(weather.data.temperature_2m)}°${weatherSettings.options.temperatureUnit === "fahrenheit" ? "F" : "C"}`
                    : "N/A"}
                </div>
                <div className="text-muted-foreground">
                  Feels like{" "}
                  {weather.data.apparent_temperature !== undefined
                    ? `${Math.round(weather.data.apparent_temperature)}°${weatherSettings.options.temperatureUnit === "fahrenheit" ? "F" : "C"}`
                    : "N/A"}
                </div>
              </div>
            </div>

            {/* Weather Metrics */}
            <div className="grid grid-cols-2 gap-4">
              {weather.data.relative_humidity_2m !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Droplets className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Humidity</div>
                    <div className="font-semibold">{Math.round(weather.data.relative_humidity_2m)}%</div>
                  </div>
                </div>
              )}

              {weather.data.wind_speed_10m !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Wind className="h-5 w-5 text-gray-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Wind Speed</div>
                    <div className="font-semibold">
                      {Math.round(weather.data.wind_speed_10m)} {weatherSettings.options.windSpeedUnit}
                    </div>
                  </div>
                </div>
              )}

              {weather.data.surface_pressure !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Gauge className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-sm text-muted-foreground">Pressure</div>
                    <div className="font-semibold">{Math.round(weather.data.surface_pressure)} hPa</div>
                  </div>
                </div>
              )}

              {weather.data.cloud_cover !== undefined && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30">
                  <Cloud className="h-5 w-5 text-gray-400" />
                  <div>
                    <div className="text-sm text-muted-foreground">Cloud Cover</div>
                    <div className="font-semibold">{Math.round(weather.data.cloud_cover)}%</div>
                  </div>
                </div>
              )}
            </div>

            {/* Forecast */}
            {forecast?.daily && forecast.daily.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">{weatherSettings.forecastDays}-Day Forecast</h3>
                <div className="space-y-2">
                  {forecast.daily.slice(0, Math.min(5, weatherSettings.forecastDays)).map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="text-sm font-medium w-16">
                          {index === 0 ? "Today" : formatDate(new Date(day.date))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="font-semibold">
                            {day.data.temperature_2m_max !== undefined ? Math.round(day.data.temperature_2m_max) : "--"}
                            °
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {day.data.temperature_2m_min !== undefined ? Math.round(day.data.temperature_2m_min) : "--"}
                            °
                          </div>
                        </div>
                        {day.data.precipitation_sum !== undefined && day.data.precipitation_sum > 0 && (
                          <Badge variant="secondary" className="text-xs">
                            {Math.round(day.data.precipitation_sum)}
                            {weatherSettings.options.precipitationUnit}
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Unable to load weather data. Please try refreshing or selecting a different location.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
