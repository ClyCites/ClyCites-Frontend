"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Skeleton } from "@/components/ui/skeleton"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  useCurrentWeather,
  useWeatherForecast,
  useHistoricalWeather,
  useWeatherVariables,
  useLocationSearch,
  useCurrentLocation,
} from "@/lib/hooks/use-weather"
import type { WeatherLocation, WeatherOptions } from "@/lib/api/weather-api"
import {
  Cloud,
  CloudRain,
  Sun,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  RefreshCw,
  MapPin,
  Calendar,
  AlertTriangle,
  Settings,
  Search,
  Navigation,
  Plus,
} from "lucide-react"
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Default weather variables by category
const DEFAULT_CURRENT_VARIABLES = [
  "temperature_2m",
  "relative_humidity_2m",
  "precipitation",
  "wind_speed_10m",
  "wind_direction_10m",
  "surface_pressure",
  "cloud_cover",
]

const DEFAULT_HOURLY_VARIABLES = ["temperature_2m", "precipitation", "wind_speed_10m", "relative_humidity_2m"]

const DEFAULT_DAILY_VARIABLES = ["temperature_2m_max", "temperature_2m_min", "precipitation_sum", "wind_speed_10m_max"]

// Weather variable display configuration
const VARIABLE_DISPLAY_CONFIG: Record<
  string,
  { icon: any; label: string; color: string; unit: string; formatter?: (value: number) => string }
> = {
  temperature_2m: {
    icon: Thermometer,
    label: "Temperature",
    color: "text-red-500",
    unit: "°C",
    formatter: (value) => `${Math.round(value)}°C`,
  },
  temperature_2m_max: {
    icon: Thermometer,
    label: "Max Temperature",
    color: "text-red-500",
    unit: "°C",
    formatter: (value) => `${Math.round(value)}°C`,
  },
  temperature_2m_min: {
    icon: Thermometer,
    label: "Min Temperature",
    color: "text-blue-500",
    unit: "°C",
    formatter: (value) => `${Math.round(value)}°C`,
  },
  relative_humidity_2m: {
    icon: Droplets,
    label: "Humidity",
    color: "text-blue-500",
    unit: "%",
    formatter: (value) => `${Math.round(value)}%`,
  },
  precipitation: {
    icon: CloudRain,
    label: "Precipitation",
    color: "text-blue-600",
    unit: "mm",
    formatter: (value) => `${value.toFixed(1)} mm`,
  },
  precipitation_sum: {
    icon: CloudRain,
    label: "Total Precipitation",
    color: "text-blue-600",
    unit: "mm",
    formatter: (value) => `${value.toFixed(1)} mm`,
  },
  wind_speed_10m: {
    icon: Wind,
    label: "Wind Speed",
    color: "text-green-500",
    unit: "km/h",
    formatter: (value) => `${Math.round(value)} km/h`,
  },
  wind_speed_10m_max: {
    icon: Wind,
    label: "Max Wind Speed",
    color: "text-green-500",
    unit: "km/h",
    formatter: (value) => `${Math.round(value)} km/h`,
  },
  windspeed_10m_max: {
    icon: Wind,
    label: "Max Wind Speed",
    color: "text-green-500",
    unit: "km/h",
    formatter: (value) => `${Math.round(value)} km/h`,
  },
  wind_direction_10m: {
    icon: Wind,
    label: "Wind Direction",
    color: "text-green-500",
    unit: "°",
    formatter: (value) => `${Math.round(value)}°`,
  },
  surface_pressure: {
    icon: Gauge,
    label: "Pressure",
    color: "text-purple-500",
    unit: "hPa",
    formatter: (value) => `${Math.round(value)} hPa`,
  },
  pressure_msl: {
    icon: Gauge,
    label: "Sea Level Pressure",
    color: "text-purple-500",
    unit: "hPa",
    formatter: (value) => `${Math.round(value)} hPa`,
  },
  cloud_cover: {
    icon: Cloud,
    label: "Cloud Cover",
    color: "text-gray-500",
    unit: "%",
    formatter: (value) => `${Math.round(value)}%`,
  },
}

const getWeatherIcon = (condition: string, size = 6) => {
  switch (condition?.toLowerCase()) {
    case "sunny":
    case "clear":
      return <Sun className={`h-${size} w-${size} text-yellow-500`} />
    case "cloudy":
    case "overcast":
      return <Cloud className={`h-${size} w-${size} text-gray-500`} />
    case "rainy":
    case "rain":
      return <CloudRain className={`h-${size} w-${size} text-blue-500`} />
    default:
      return <Sun className={`h-${size} w-${size} text-yellow-500`} />
  }
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  })
}

export function EnhancedWeatherCard() {
  const [selectedLocation, setSelectedLocation] = useState<WeatherLocation | null>(null)
  const [selectedTab, setSelectedTab] = useState("current")
  const [historicalRange, setHistoricalRange] = useState({
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })

  // User preferences for weather variables
  const [selectedCurrentVariables, setSelectedCurrentVariables] = useState<string[]>(DEFAULT_CURRENT_VARIABLES)
  const [selectedHourlyVariables, setSelectedHourlyVariables] = useState<string[]>(DEFAULT_HOURLY_VARIABLES)
  const [selectedDailyVariables, setSelectedDailyVariables] = useState<string[]>(DEFAULT_DAILY_VARIABLES)

  // Units preferences
  const [units, setUnits] = useState<WeatherOptions>({
    temperatureUnit: "celsius",
    windSpeedUnit: "kmh",
    precipitationUnit: "mm",
  })

  // Location search
  const [locationSearchOpen, setLocationSearchOpen] = useState(false)
  const [locationSearchQuery, setLocationSearchQuery] = useState("")
  const { locations, isLoading: searchLoading, searchLocations } = useLocationSearch()
  const { location: currentLocation, getCurrentLocation, isLoading: currentLocationLoading } = useCurrentLocation()

  // Fetch available weather variables
  const { variables: availableVariables, isLoading: variablesLoading } = useWeatherVariables()

  // Current weather hook with user-selected variables
  const {
    data: currentWeather,
    isLoading: currentLoading,
    error: currentError,
    refetch: refetchCurrent,
  } = useCurrentWeather(selectedLocation, selectedCurrentVariables, units)

  // Weather forecast hook with user-selected variables
  const {
    data: forecastData,
    isLoading: forecastLoading,
    error: forecastError,
    refetch: refetchForecast,
  } = useWeatherForecast(
    selectedLocation,
    {
      dailyVariables: selectedDailyVariables,
      hourlyVariables: selectedHourlyVariables,
    },
    7,
    units,
  )

  // Historical weather hook with user-selected variables
  const {
    data: historicalData,
    isLoading: historicalLoading,
    error: historicalError,
    refetch: refetchHistorical,
  } = useHistoricalWeather(
    selectedLocation,
    historicalRange.startDate,
    historicalRange.endDate,
    {
      dailyVariables: selectedDailyVariables,
    },
    units,
  )

  // Set default location on mount
  useEffect(() => {
    if (!selectedLocation) {
      // Try to get current location first
      getCurrentLocation()
    }
  }, [])

  // Set current location when available
  useEffect(() => {
    if (currentLocation && !selectedLocation) {
      setSelectedLocation(currentLocation)
    }
  }, [currentLocation, selectedLocation])

  // Handle location search
  useEffect(() => {
    if (locationSearchQuery.trim()) {
      const timeoutId = setTimeout(() => {
        searchLocations(locationSearchQuery)
      }, 300)
      return () => clearTimeout(timeoutId)
    }
  }, [locationSearchQuery, searchLocations])

  const handleLocationSelect = (location: WeatherLocation) => {
    setSelectedLocation(location)
    setLocationSearchOpen(false)
    setLocationSearchQuery("")
  }

  const handleRefresh = () => {
    switch (selectedTab) {
      case "current":
        refetchCurrent()
        break
      case "forecast":
        refetchForecast()
        break
      case "historical":
        refetchHistorical()
        break
    }
  }

  // Format value based on variable type
  const formatValue = (variable: string, value: number) => {
    const config = VARIABLE_DISPLAY_CONFIG[variable]
    if (config?.formatter) {
      return config.formatter(value)
    }
    return `${value} ${config?.unit || ""}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Weather Analytics
            </CardTitle>
            <CardDescription>Real-time weather data and agricultural insights</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {/* Location Selector */}
            <Popover open={locationSearchOpen} onOpenChange={setLocationSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[250px] justify-start">
                  <MapPin className="mr-2 h-4 w-4" />
                  {selectedLocation
                    ? selectedLocation.name ||
                      `${selectedLocation.latitude.toFixed(2)}, ${selectedLocation.longitude.toFixed(2)}`
                    : "Select location..."}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <div className="flex items-center border-b px-3">
                    <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                    <Input
                      placeholder="Search locations..."
                      value={locationSearchQuery}
                      onChange={(e) => setLocationSearchQuery(e.target.value)}
                      className="border-0 focus-visible:ring-0"
                    />
                  </div>
                  <CommandList>
                    <CommandEmpty>{searchLoading ? "Searching..." : "No locations found."}</CommandEmpty>
                    <CommandGroup>
                      <CommandItem onSelect={() => getCurrentLocation()} disabled={currentLocationLoading}>
                        <Navigation className="mr-2 h-4 w-4" />
                        {currentLocationLoading ? "Getting location..." : "Use current location"}
                      </CommandItem>
                      {locations.map((location, index) => (
                        <CommandItem key={index} onSelect={() => handleLocationSelect(location)}>
                          <MapPin className="mr-2 h-4 w-4" />
                          {location.name || `${location.latitude.toFixed(2)}, ${location.longitude.toFixed(2)}`}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Settings Dialog for Parameter Selection */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Weather Parameters</DialogTitle>
                  <DialogDescription>
                    Customize which weather parameters you want to see in your dashboard.
                  </DialogDescription>
                </DialogHeader>

                <Tabs defaultValue="current-params" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="current-params">Current</TabsTrigger>
                    <TabsTrigger value="forecast-params">Forecast</TabsTrigger>
                    <TabsTrigger value="units-params">Units</TabsTrigger>
                  </TabsList>

                  <TabsContent value="current-params" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Current Weather Parameters</h4>
                      <ScrollArea className="h-[200px] rounded-md border p-2">
                        <div className="space-y-2">
                          {availableVariables?.hourly?.map((variable: string) => (
                            <div key={variable} className="flex items-center space-x-2">
                              <Checkbox
                                id={`current-${variable}`}
                                checked={selectedCurrentVariables.includes(variable)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedCurrentVariables([...selectedCurrentVariables, variable])
                                  } else {
                                    setSelectedCurrentVariables(selectedCurrentVariables.filter((v) => v !== variable))
                                  }
                                }}
                              />
                              <Label htmlFor={`current-${variable}`} className="text-sm">
                                {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="forecast-params" className="space-y-4">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Daily Forecast Parameters</h4>
                      <ScrollArea className="h-[120px] rounded-md border p-2">
                        <div className="space-y-2">
                          {availableVariables?.daily?.map((variable: string) => (
                            <div key={variable} className="flex items-center space-x-2">
                              <Checkbox
                                id={`daily-${variable}`}
                                checked={selectedDailyVariables.includes(variable)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedDailyVariables([...selectedDailyVariables, variable])
                                  } else {
                                    setSelectedDailyVariables(selectedDailyVariables.filter((v) => v !== variable))
                                  }
                                }}
                              />
                              <Label htmlFor={`daily-${variable}`} className="text-sm">
                                {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Hourly Forecast Parameters</h4>
                      <ScrollArea className="h-[120px] rounded-md border p-2">
                        <div className="space-y-2">
                          {availableVariables?.hourly?.map((variable: string) => (
                            <div key={variable} className="flex items-center space-x-2">
                              <Checkbox
                                id={`hourly-${variable}`}
                                checked={selectedHourlyVariables.includes(variable)}
                                onCheckedChange={(checked) => {
                                  if (checked) {
                                    setSelectedHourlyVariables([...selectedHourlyVariables, variable])
                                  } else {
                                    setSelectedHourlyVariables(selectedHourlyVariables.filter((v) => v !== variable))
                                  }
                                }}
                              />
                              <Label htmlFor={`hourly-${variable}`} className="text-sm">
                                {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                              </Label>
                            </div>
                          ))}
                        </div>
                      </ScrollArea>
                    </div>
                  </TabsContent>

                  <TabsContent value="units-params" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Temperature Unit</h4>
                        <RadioGroup
                          value={units.temperatureUnit}
                          onValueChange={(value) =>
                            setUnits({ ...units, temperatureUnit: value as "celsius" | "fahrenheit" })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="celsius" id="celsius" />
                            <Label htmlFor="celsius">Celsius (°C)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="fahrenheit" id="fahrenheit" />
                            <Label htmlFor="fahrenheit">Fahrenheit (°F)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Wind Speed Unit</h4>
                        <RadioGroup
                          value={units.windSpeedUnit}
                          onValueChange={(value) =>
                            setUnits({ ...units, windSpeedUnit: value as "kmh" | "mph" | "ms" | "kn" })
                          }
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="kmh" id="kmh" />
                            <Label htmlFor="kmh">Kilometers per hour (km/h)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mph" id="mph" />
                            <Label htmlFor="mph">Miles per hour (mph)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="ms" id="ms" />
                            <Label htmlFor="ms">Meters per second (m/s)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="kn" id="kn" />
                            <Label htmlFor="kn">Knots (kn)</Label>
                          </div>
                        </RadioGroup>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Precipitation Unit</h4>
                        <RadioGroup
                          value={units.precipitationUnit}
                          onValueChange={(value) => setUnits({ ...units, precipitationUnit: value as "mm" | "inch" })}
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="mm" id="mm" />
                            <Label htmlFor="mm">Millimeters (mm)</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="inch" id="inch" />
                            <Label htmlFor="inch">Inches (in)</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>

                <DialogFooter>
                  <Button
                    type="submit"
                    onClick={() => {
                      // Refresh data with new parameters
                      handleRefresh()
                    }}
                  >
                    Apply Changes
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <Button variant="outline" size="sm" onClick={handleRefresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {!selectedLocation ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <MapPin className="h-12 w-12 text-muted-foreground" />
            <div className="text-center">
              <h3 className="text-lg font-medium">No Location Selected</h3>
              <p className="text-sm text-muted-foreground">Please select a location to view weather data</p>
            </div>
            <Button onClick={() => setLocationSearchOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Select Location
            </Button>
          </div>
        ) : (
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="forecast">7-Day Forecast</TabsTrigger>
              <TabsTrigger value="historical">Historical</TabsTrigger>
            </TabsList>

            {/* Current Weather Tab */}
            <TabsContent value="current" className="space-y-4">
              {currentLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                </div>
              ) : currentError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{currentError}</AlertDescription>
                </Alert>
              ) : currentWeather ? (
                <div className="space-y-4">
                  {/* Main Weather Display */}
                  <div className="flex items-center justify-between p-6 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                    <div className="flex items-center gap-4">
                      {getWeatherIcon("sunny", 12)}
                      <div>
                        {currentWeather.temperature_2m !== undefined && (
                          <div className="text-3xl font-bold">
                            {formatValue("temperature_2m", currentWeather.temperature_2m)}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground">{new Date().toLocaleString()}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{selectedLocation.name || "Selected Location"}</div>
                      <div className="text-xs text-muted-foreground">
                        {selectedLocation.latitude.toFixed(2)}, {selectedLocation.longitude.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Weather Metrics Grid - Dynamically generated based on selected variables */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {Object.entries(currentWeather).map(([variable, value]) => {
                      // Skip temperature_2m as it's already shown in the main display
                      if (variable === "temperature_2m") return null

                      const config = VARIABLE_DISPLAY_CONFIG[variable]
                      if (!config) return null

                      const Icon = config.icon

                      return (
                        <Card key={variable}>
                          <CardContent className="p-4 text-center">
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                            <div className="text-sm text-muted-foreground">{config.label}</div>
                            <div className="text-lg font-semibold">{formatValue(variable, value as number)}</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {/* Selected Parameters Badge List */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Selected parameters:</span>
                    {selectedCurrentVariables.map((variable) => (
                      <Badge key={variable} variant="outline">
                        {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </TabsContent>

            {/* Forecast Tab */}
            <TabsContent value="forecast" className="space-y-4">
              {forecastLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
                  {[...Array(7)].map((_, i) => (
                    <Skeleton key={i} className="h-32 w-full" />
                  ))}
                </div>
              ) : forecastError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{forecastError}</AlertDescription>
                </Alert>
              ) : forecastData?.daily ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-7 gap-2">
                    {forecastData.daily.slice(0, 7).map((day: any, index: number) => (
                      <Card key={index} className="text-center">
                        <CardContent className="p-4">
                          <div className="text-sm font-medium mb-2">{formatDate(day.date)}</div>
                          <div className="flex justify-center mb-2">{getWeatherIcon("sunny", 6)}</div>
                          <div className="space-y-1">
                            {/* Dynamically render selected daily variables */}
                            {Object.entries(day).map(([variable, value]) => {
                              if (variable === "date") return null
                              const config = VARIABLE_DISPLAY_CONFIG[variable]
                              if (!config) return null

                              return (
                                <div key={variable} className={`text-sm ${config.color}`}>
                                  {formatValue(variable, value as number)}
                                </div>
                              )
                            })}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {/* Selected Parameters Badge List */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Selected parameters:</span>
                    {selectedDailyVariables.map((variable) => (
                      <Badge key={variable} variant="outline">
                        {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </TabsContent>

            {/* Historical Tab */}
            <TabsContent value="historical" className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">Date Range:</span>
                </div>
                <input
                  type="date"
                  value={historicalRange.startDate}
                  onChange={(e) => setHistoricalRange((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="px-3 py-1 border rounded text-sm"
                />
                <span className="text-sm">to</span>
                <input
                  type="date"
                  value={historicalRange.endDate}
                  onChange={(e) => setHistoricalRange((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="px-3 py-1 border rounded text-sm"
                />
                <Button variant="outline" size="sm" onClick={() => refetchHistorical()}>
                  Apply
                </Button>
              </div>

              {historicalLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : historicalError ? (
                <Alert variant="destructive">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{historicalError}</AlertDescription>
                </Alert>
              ) : historicalData?.daily ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Dynamically generate summary cards based on selected variables */}
                    {selectedDailyVariables.slice(0, 3).map((variable) => {
                      const config = VARIABLE_DISPLAY_CONFIG[variable]
                      if (!config) return null

                      const Icon = config.icon
                      let value: number

                      // Calculate average or sum based on variable type
                      if (variable.includes("sum")) {
                        value = historicalData.daily.reduce((sum: number, day: any) => sum + (day[variable] || 0), 0)
                      } else {
                        value =
                          historicalData.daily.reduce((sum: number, day: any) => sum + (day[variable] || 0), 0) /
                          historicalData.daily.length
                      }

                      return (
                        <Card key={variable}>
                          <CardContent className="p-4 text-center">
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${config.color}`} />
                            <div className="text-sm text-muted-foreground">
                              {variable.includes("sum") ? `Total ${config.label}` : `Avg ${config.label}`}
                            </div>
                            <div className="text-lg font-semibold">{formatValue(variable, value)}</div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  <div className="text-sm text-muted-foreground">
                    Showing data for {historicalData.daily.length} days from {historicalRange.startDate} to{" "}
                    {historicalRange.endDate}
                  </div>

                  {/* Selected Parameters Badge List */}
                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="text-sm text-muted-foreground">Selected parameters:</span>
                    {selectedDailyVariables.map((variable) => (
                      <Badge key={variable} variant="outline">
                        {VARIABLE_DISPLAY_CONFIG[variable]?.label || variable}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : null}
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}
