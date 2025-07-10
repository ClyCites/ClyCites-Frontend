import { apiClient } from "./api-client"

export interface WeatherData {
  location: {
    latitude: number
    longitude: number
    timezone: string
    timezoneAbbreviation: string
    elevation: number
  }
  timestamp: Date
  type: string
  data: Record<string, any>
  source: string
  units: {
    temperature: string
    precipitation: string
    windSpeed: string
    pressure: string
  }
}

export interface LocationData {
  name: string
  country: string
  region: string
  lat: number
  lon: number
  latitude: number
  longitude: number
}

export interface ForecastData {
  location: {
    latitude: number
    longitude: number
    timezone: string
    timezoneAbbreviation: string
    elevation: number
  }
  hourly: Array<{
    location: any
    timestamp: Date
    data: Record<string, any>
    source: string
  }>
  daily: Array<{
    date: string
    data: Record<string, any>
  }>
  units: {
    temperature: string
    precipitation: string
    windSpeed: string
    pressure: string
  }
}

export interface CurrentWeatherData {
  location: {
    latitude: number
    longitude: number
    timezone: string
    timezoneAbbreviation: string
    elevation: number
  }
  timestamp: Date
  data: Record<string, any>
  source: string
  units: {
    temperature: string
    precipitation: string
    windSpeed: string
    pressure: string
  }
}

export interface WeatherForecastData {
  location: {
    latitude: number
    longitude: number
    timezone: string
    timezoneAbbreviation: string
    elevation: number
  }
  hourly: Array<{
    timestamp: Date
    data: Record<string, any>
  }>
  daily: Array<{
    date: string
    data: Record<string, any>
  }>
  units: {
    temperature: string
    precipitation: string
    windSpeed: string
    pressure: string
  }
}

export interface WeatherOptions {
  timezone?: string
  temperatureUnit?: "celsius" | "fahrenheit"
  windSpeedUnit?: "kmh" | "ms" | "mph" | "kn"
  precipitationUnit?: "mm" | "inch"
}

export interface ForecastParams {
  hourlyVariables?: string[]
  dailyVariables?: string[]
  days?: number
}

export interface HistoricalParams {
  hourlyVariables?: string[]
  dailyVariables?: string[]
}

export interface ClimateParams {
  variables?: string[]
}

class WeatherAPI {
  // Get available weather variables
  async getWeatherVariables(): Promise<{
    success: boolean
    message: string
    data: {
      hourly: string[]
      daily: string[]
      climate: string[]
    }
  }> {
    try {
      const response = await apiClient.get("/weather/variables")
      return response.data
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Failed to fetch weather variables")
    }
  }

  // Get current weather using Open-Meteo API directly
  async getCurrentWeather(
    latitude: number,
    longitude: number,
    variables: string[] = [
      "temperature_2m",
      "relative_humidity_2m",
      "apparent_temperature",
      "precipitation",
      "weather_code",
      "cloud_cover",
      "surface_pressure",
      "wind_speed_10m",
      "wind_direction_10m",
    ],
    options: WeatherOptions = {},
    signal?: AbortSignal,
  ): Promise<CurrentWeatherData> {
    try {
      const params = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        current: variables.join(","),
        timezone: options.timezone || "auto",
      })

      if (options.temperatureUnit === "fahrenheit") {
        params.append("temperature_unit", "fahrenheit")
      }
      if (options.windSpeedUnit) {
        params.append("wind_speed_unit", options.windSpeedUnit)
      }
      if (options.precipitationUnit === "inch") {
        params.append("precipitation_unit", "inch")
      }

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${params.toString()}`, { signal })

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      if (!data.current) {
        throw new Error("No current weather data available")
      }

      // Transform the data to match our interface
      const currentData: Record<string, any> = {}
      variables.forEach((variable, index) => {
        if (data.current[variable] !== undefined) {
          currentData[variable] = data.current[variable]
        }
      })

      return {
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          timezoneAbbreviation: data.timezone_abbreviation,
          elevation: data.elevation,
        },
        timestamp: new Date(data.current.time),
        data: currentData,
        source: "Open-Meteo",
        units: {
          temperature: options.temperatureUnit === "fahrenheit" ? "°F" : "°C",
          precipitation: options.precipitationUnit === "inch" ? "inch" : "mm",
          windSpeed: options.windSpeedUnit || "km/h",
          pressure: "hPa",
        },
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      throw new Error(error.message || "Failed to fetch current weather")
    }
  }

  // Get weather forecast using Open-Meteo API directly
  async getWeatherForecast(
    latitude: number,
    longitude: number,
    params: ForecastParams = {},
    options: WeatherOptions = {},
    signal?: AbortSignal,
  ): Promise<WeatherForecastData> {
    try {
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        timezone: options.timezone || "auto",
      })

      const hourlyVars = params.hourlyVariables || [
        "temperature_2m",
        "precipitation",
        "wind_speed_10m",
        "relative_humidity_2m",
      ]
      const dailyVars = params.dailyVariables || [
        "temperature_2m_max",
        "temperature_2m_min",
        "precipitation_sum",
        "wind_speed_10m_max",
      ]
      const days = params.days || 7

      if (hourlyVars.length > 0) {
        queryParams.append("hourly", hourlyVars.join(","))
      }
      if (dailyVars.length > 0) {
        queryParams.append("daily", dailyVars.join(","))
      }
      queryParams.append("forecast_days", days.toString())

      if (options.temperatureUnit === "fahrenheit") {
        queryParams.append("temperature_unit", "fahrenheit")
      }
      if (options.windSpeedUnit) {
        queryParams.append("wind_speed_unit", options.windSpeedUnit)
      }
      if (options.precipitationUnit === "inch") {
        queryParams.append("precipitation_unit", "inch")
      }

      const response = await fetch(`https://api.open-meteo.com/v1/forecast?${queryParams.toString()}`, { signal })

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`)
      }

      const data = await response.json()

      // Transform hourly data
      const hourly = []
      if (data.hourly && data.hourly.time) {
        for (let i = 0; i < data.hourly.time.length; i++) {
          const hourlyData: Record<string, any> = {}
          hourlyVars.forEach((variable) => {
            if (data.hourly[variable] && data.hourly[variable][i] !== undefined) {
              hourlyData[variable] = data.hourly[variable][i]
            }
          })
          hourly.push({
            timestamp: new Date(data.hourly.time[i]),
            data: hourlyData,
          })
        }
      }

      // Transform daily data
      const daily = []
      if (data.daily && data.daily.time) {
        for (let i = 0; i < data.daily.time.length; i++) {
          const dailyData: Record<string, any> = {}
          dailyVars.forEach((variable) => {
            if (data.daily[variable] && data.daily[variable][i] !== undefined) {
              dailyData[variable] = data.daily[variable][i]
            }
          })
          daily.push({
            date: data.daily.time[i],
            data: dailyData,
          })
        }
      }

      return {
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          timezoneAbbreviation: data.timezone_abbreviation,
          elevation: data.elevation,
        },
        hourly,
        daily,
        units: {
          temperature: options.temperatureUnit === "fahrenheit" ? "°F" : "°C",
          precipitation: options.precipitationUnit === "inch" ? "inch" : "mm",
          windSpeed: options.windSpeedUnit || "km/h",
          pressure: "hPa",
        },
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      throw new Error(error.message || "Failed to fetch weather forecast")
    }
  }

  // Get historical weather with customizable variables
  async getHistoricalWeather(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
    params: HistoricalParams = {},
    options: WeatherOptions = {},
    signal?: AbortSignal,
  ): Promise<ForecastData> {
    try {
      const queryParams = new URLSearchParams({
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        start_date: startDate,
        end_date: endDate,
      })

      if (params.hourlyVariables?.length) {
        queryParams.append("hourly", params.hourlyVariables.join(","))
      }
      if (params.dailyVariables?.length) {
        queryParams.append("daily", params.dailyVariables.join(","))
      }

      if (options.timezone) queryParams.append("timezone", options.timezone)
      if (options.temperatureUnit === "fahrenheit") {
        queryParams.append("temperature_unit", "fahrenheit")
      }
      if (options.windSpeedUnit) {
        queryParams.append("wind_speed_unit", options.windSpeedUnit)
      }
      if (options.precipitationUnit === "inch") {
        queryParams.append("precipitation_unit", "inch")
      }

      const response = await fetch(`https://archive-api.open-meteo.com/v1/archive?${queryParams.toString()}`, {
        signal,
      })

      if (!response.ok) {
        throw new Error(`Historical weather API error: ${response.status}`)
      }

      const data = await response.json()

      return {
        location: {
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          timezoneAbbreviation: data.timezone_abbreviation,
          elevation: data.elevation,
        },
        hourly: [],
        daily: [],
        units: {
          temperature: options.temperatureUnit === "fahrenheit" ? "°F" : "°C",
          precipitation: options.precipitationUnit === "inch" ? "inch" : "mm",
          windSpeed: options.windSpeedUnit || "km/h",
          pressure: "hPa",
        },
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      throw new Error(error.message || "Failed to fetch historical weather")
    }
  }

  // Get climate projection data with customizable variables
  async getClimateProjection(
    latitude: number,
    longitude: number,
    startDate: string,
    endDate: string,
    params: ClimateParams = {},
    options: WeatherOptions = {},
    signal?: AbortSignal,
  ): Promise<{
    location: any
    daily: Array<{ date: string; data: Record<string, any> }>
    units: any
  }> {
    try {
      return {
        location: {
          latitude,
          longitude,
          timezone: options.timezone || "auto",
        },
        daily: [],
        units: {
          temperature: options.temperatureUnit === "fahrenheit" ? "°F" : "°C",
          precipitation: options.precipitationUnit === "inch" ? "inch" : "mm",
          windSpeed: options.windSpeedUnit || "km/h",
          pressure: "hPa",
        },
      }
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      throw new Error(error.message || "Failed to fetch climate projection")
    }
  }

  // Search locations using OpenStreetMap Nominatim API
  async searchLocations(query: string, signal?: AbortSignal): Promise<LocationData[]> {
    try {
      if (!query || query.trim().length < 2) {
        return []
      }

      // Use OpenStreetMap Nominatim API for location search
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query.trim())}&format=json&limit=5&addressdetails=1`,
        {
          signal,
          headers: {
            "User-Agent": "WeatherApp/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to search locations")
      }

      const data = await response.json()

      if (!Array.isArray(data)) {
        return []
      }

      return data
        .map((item: any) => ({
          name: item.display_name?.split(",")[0] || item.name || "Unknown Location",
          country: item.address?.country || "",
          region: item.address?.state || item.address?.region || "",
          lat: Number.parseFloat(item.lat),
          lon: Number.parseFloat(item.lon),
          latitude: Number.parseFloat(item.lat),
          longitude: Number.parseFloat(item.lon),
        }))
        .filter((location) => !isNaN(location.lat) && !isNaN(location.lon))
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      console.error("Location search error:", error)
      throw new Error("Failed to search locations")
    }
  }

  // Reverse geocode coordinates to get location name
  async reverseGeocode(latitude: number, longitude: number, signal?: AbortSignal): Promise<LocationData[]> {
    try {
      // Use OpenStreetMap Nominatim API for reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
        {
          signal,
          headers: {
            "User-Agent": "WeatherApp/1.0",
          },
        },
      )

      if (!response.ok) {
        throw new Error("Failed to reverse geocode location")
      }

      const data = await response.json()

      if (!data || !data.display_name) {
        return [
          {
            name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
            country: "",
            region: "",
            lat: latitude,
            lon: longitude,
            latitude,
            longitude,
          },
        ]
      }

      return [
        {
          name: data.display_name.split(",")[0] || data.name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          country: data.address?.country || "",
          region: data.address?.state || data.address?.region || "",
          lat: latitude,
          lon: longitude,
          latitude,
          longitude,
        },
      ]
    } catch (error: any) {
      if (error.name === "AbortError") {
        throw error
      }
      // Return fallback location data if reverse geocoding fails
      return [
        {
          name: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
          country: "",
          region: "",
          lat: latitude,
          lon: longitude,
          latitude,
          longitude,
        },
      ]
    }
  }
}

export const weatherApi = new WeatherAPI()
