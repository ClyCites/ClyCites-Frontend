"use client"

import { useState, useEffect } from "react"
import { weatherAPI, type WeatherLocation, type WeatherOptions, type WeatherVariables } from "@/lib/api/weather-api"

export function useWeatherVariables() {
  const [variables, setVariables] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await weatherAPI.getAvailableVariables()
        setVariables(data)
      } catch (err) {
        console.error("Failed to fetch weather variables:", err)
        setError(err instanceof Error ? err.message : "Failed to fetch weather variables")
        // Fallback to default variables if API fails
        setVariables({
          hourly: [
            "temperature_2m",
            "relative_humidity_2m",
            "dew_point_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "showers",
            "snowfall",
            "weather_code",
            "pressure_msl",
            "surface_pressure",
            "cloud_cover",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
          ],
          daily: [
            "temperature_2m_max",
            "temperature_2m_min",
            "apparent_temperature_max",
            "apparent_temperature_min",
            "precipitation_sum",
            "rain_sum",
            "showers_sum",
            "snowfall_sum",
            "precipitation_hours",
            "sunrise",
            "sunset",
            "windspeed_10m_max",
            "windgusts_10m_max",
            "winddirection_10m_dominant",
          ],
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchVariables()
  }, [])

  return { variables, isLoading, error }
}

export function useCurrentWeather(location: WeatherLocation | null, variables?: string[], options?: WeatherOptions) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCurrentWeather = async () => {
    if (!location) return

    try {
      setIsLoading(true)
      setError(null)
      const weatherData = await weatherAPI.getCurrentWeather(location, variables, options)
      setData(weatherData)
    } catch (err) {
      console.error("Failed to fetch current weather:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch current weather")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchCurrentWeather()
  }, [location, variables?.join(","), JSON.stringify(options)])

  return { data, isLoading, error, refetch: fetchCurrentWeather }
}

export function useWeatherForecast(
  location: WeatherLocation | null,
  variables?: WeatherVariables,
  days = 7,
  options?: WeatherOptions,
) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchForecast = async () => {
    if (!location) return

    try {
      setIsLoading(true)
      setError(null)
      const forecastData = await weatherAPI.getForecast(location, variables, days, options)
      setData(forecastData)
    } catch (err) {
      console.error("Failed to fetch weather forecast:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch weather forecast")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchForecast()
  }, [location, JSON.stringify(variables), days, JSON.stringify(options)])

  return { data, isLoading, error, refetch: fetchForecast }
}

export function useHistoricalWeather(
  location: WeatherLocation | null,
  startDate: string,
  endDate: string,
  variables?: WeatherVariables,
  options?: WeatherOptions,
) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchHistoricalWeather = async () => {
    if (!location || !startDate || !endDate) return

    try {
      setIsLoading(true)
      setError(null)
      const historicalData = await weatherAPI.getHistoricalWeather(location, startDate, endDate, variables, options)
      setData(historicalData)
    } catch (err) {
      console.error("Failed to fetch historical weather:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch historical weather")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchHistoricalWeather()
  }, [location, startDate, endDate, JSON.stringify(variables), JSON.stringify(options)])

  return { data, isLoading, error, refetch: fetchHistoricalWeather }
}

export function useClimateProjection(
  location: WeatherLocation | null,
  startDate: string,
  endDate: string,
  variables?: string[],
  options?: WeatherOptions,
) {
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchClimateProjection = async () => {
    if (!location || !startDate || !endDate) return

    try {
      setIsLoading(true)
      setError(null)
      const climateData = await weatherAPI.getClimateProjection(location, startDate, endDate, variables, options)
      setData(climateData)
    } catch (err) {
      console.error("Failed to fetch climate projection:", err)
      setError(err instanceof Error ? err.message : "Failed to fetch climate projection")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchClimateProjection()
  }, [location, startDate, endDate, variables?.join(","), JSON.stringify(options)])

  return { data, isLoading, error, refetch: fetchClimateProjection }
}

export function useLocationSearch() {
  const [locations, setLocations] = useState<WeatherLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const searchLocations = async (query: string) => {
    if (!query.trim()) {
      setLocations([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const results = await weatherAPI.searchLocations(query)
      setLocations(results)
    } catch (err) {
      console.error("Failed to search locations:", err)
      setError(err instanceof Error ? err.message : "Failed to search locations")
      setLocations([])
    } finally {
      setIsLoading(false)
    }
  }

  return { locations, isLoading, error, searchLocations }
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<WeatherLocation | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
      })

      const { latitude, longitude } = position.coords
      const locationData = await weatherAPI.getLocationByCoords(latitude, longitude)
      setLocation(locationData)
    } catch (err) {
      console.error("Failed to get current location:", err)
      setError(err instanceof Error ? err.message : "Failed to get current location")
    } finally {
      setIsLoading(false)
    }
  }

  return { location, isLoading, error, getCurrentLocation }
}
