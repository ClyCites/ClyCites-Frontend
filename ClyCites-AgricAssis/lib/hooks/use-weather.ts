"use client"

import { useState, useEffect, useCallback, useRef, useMemo } from "react"
import {
  weatherApi,
  type LocationData,
  type WeatherOptions,
  type ForecastParams,
  type CurrentWeatherData,
  type WeatherForecastData,
} from "../api/weather-api"

export interface Location {
  name: string
  country: string
  region: string
  lat: number
  lon: number
  latitude: number
  longitude: number
}

// Global cache to prevent duplicate requests across component instances
const weatherCache = new Map<string, { data: CurrentWeatherData; timestamp: number }>()
const locationCache = new Map<string, { data: LocationData[]; timestamp: number }>()
const forecastCache = new Map<string, { data: WeatherForecastData; timestamp: number }>()
const pendingRequests = new Map<string, Promise<any>>()

const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes
const DEBOUNCE_DELAY = 300 // 300ms for search
const WEATHER_DEBOUNCE_DELAY = 100 // 100ms for weather updates
const REQUEST_TIMEOUT = 10000 // 10 seconds
const MIN_REQUEST_INTERVAL = 1000 // Minimum 1 second between requests

// Cleanup expired cache entries
const cleanupCache = () => {
  const now = Date.now()
  for (const [key, value] of weatherCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      weatherCache.delete(key)
    }
  }
  for (const [key, value] of locationCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      locationCache.delete(key)
    }
  }
  for (const [key, value] of forecastCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      forecastCache.delete(key)
    }
  }
}

// Run cleanup every 5 minutes
setInterval(cleanupCache, CACHE_DURATION)

export function useLocationSearch() {
  const [locations, setLocations] = useState<LocationData[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastRequestTimeRef = useRef<number>(0)

  const createCacheKey = useCallback((query: string) => `locations_${query.toLowerCase().trim()}`, [])

  const searchLocationsWithCache = useCallback(
    async (query: string): Promise<LocationData[]> => {
      if (!query.trim() || query.length < 2) return []

      const cacheKey = createCacheKey(query)

      // Check cache first
      const cached = locationCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }

      // Check for pending request
      if (pendingRequests.has(cacheKey)) {
        return pendingRequests.get(cacheKey)!
      }

      // Throttle requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTimeRef.current
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
      }

      const requestPromise = (async () => {
        try {
          // Cancel previous request
          if (abortControllerRef.current) {
            abortControllerRef.current.abort()
          }

          abortControllerRef.current = new AbortController()
          const timeoutId = setTimeout(() => abortControllerRef.current?.abort(), REQUEST_TIMEOUT)

          lastRequestTimeRef.current = Date.now()
          const data = await weatherApi.searchLocations(query, abortControllerRef.current.signal)

          clearTimeout(timeoutId)

          // Cache the result
          locationCache.set(cacheKey, { data, timestamp: Date.now() })

          return data
        } catch (error: any) {
          if (error.name === "AbortError") {
            throw new Error("Search was cancelled")
          }
          throw error
        } finally {
          pendingRequests.delete(cacheKey)
        }
      })()

      pendingRequests.set(cacheKey, requestPromise)
      return requestPromise
    },
    [createCacheKey],
  )

  const searchLocations = useCallback(
    async (query: string) => {
      if (!query.trim() || query.length < 2) {
        setLocations([])
        return
      }

      try {
        setLoading(true)
        setError(null)

        const data = await searchLocationsWithCache(query)
        setLocations(data)
      } catch (err: any) {
        console.error("Location search error:", err)
        if (!err.message.includes("cancelled")) {
          setError(err.message || "Failed to search locations")
          setLocations([])
        }
      } finally {
        setLoading(false)
      }
    },
    [searchLocationsWithCache],
  )

  const debouncedSearchLocations = useCallback(
    (query: string) => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }

      debounceTimeoutRef.current = setTimeout(() => {
        searchLocations(query)
      }, DEBOUNCE_DELAY)
    },
    [searchLocations],
  )

  const clearLocations = useCallback(() => {
    setLocations([])
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current)
      }
    }
  }, [])

  return useMemo(
    () => ({
      locations,
      loading,
      error,
      searchLocations: debouncedSearchLocations,
      clearLocations,
    }),
    [locations, loading, error, debouncedSearchLocations, clearLocations],
  )
}

export function useCurrentLocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getCurrentLocation = useCallback(async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by this browser")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        })
      })

      // Reverse geocode to get location name
      try {
        const locations = await weatherApi.reverseGeocode(position.coords.latitude, position.coords.longitude)

        if (locations && locations.length > 0) {
          setLocation(locations[0])
        } else {
          // Fallback if reverse geocoding fails
          setLocation({
            name: "Current Location",
            country: "",
            region: "",
            lat: position.coords.latitude,
            lon: position.coords.longitude,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        }
      } catch {
        // Fallback if reverse geocoding fails
        setLocation({
          name: "Current Location",
          country: "",
          region: "",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      }
    } catch (err: any) {
      let errorMessage = "Failed to get current location"

      switch (err.code) {
        case err.PERMISSION_DENIED:
          errorMessage = "Location access denied by user"
          break
        case err.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable"
          break
        case err.TIMEOUT:
          errorMessage = "Location request timed out"
          break
      }

      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }, [])

  return useMemo(
    () => ({
      location,
      isLoading,
      error,
      getCurrentLocation,
    }),
    [location, isLoading, error, getCurrentLocation],
  )
}

export function useCurrentWeather(location: Location | null, variables: string[] = [], options: WeatherOptions = {}) {
  const [data, setData] = useState<CurrentWeatherData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const lastRequestTimeRef = useRef<number>(0)

  const createCacheKey = useCallback(
    (loc: Location, vars: string[], opts: WeatherOptions) =>
      `current_${loc.lat}_${loc.lon}_${vars.join(",")}_${JSON.stringify(opts)}`,
    [],
  )

  const fetchWeather = useCallback(
    async (loc: Location, vars: string[], opts: WeatherOptions) => {
      const cacheKey = createCacheKey(loc, vars, opts)

      // Check cache first
      const cached = weatherCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }

      // Throttle requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTimeRef.current
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      lastRequestTimeRef.current = Date.now()

      const weatherData = await weatherApi.getCurrentWeather(
        loc.lat,
        loc.lon,
        vars,
        opts,
        abortControllerRef.current.signal,
      )

      // Cache the result
      weatherCache.set(cacheKey, { data: weatherData, timestamp: Date.now() })

      return weatherData
    },
    [createCacheKey],
  )

  const refetch = useCallback(async () => {
    if (!location) return

    try {
      setIsLoading(true)
      setError(null)

      const weatherData = await fetchWeather(location, variables, options)
      setData(weatherData)
    } catch (err: any) {
      if (!err.message.includes("cancelled")) {
        setError(err.message || "Failed to fetch weather data")
      }
    } finally {
      setIsLoading(false)
    }
  }, [location, variables, options, fetchWeather])

  // Auto-fetch when location or parameters change
  useEffect(() => {
    if (location) {
      refetch()
    }
  }, [location, refetch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      refetch,
    }),
    [data, isLoading, error, refetch],
  )
}

export function useWeatherForecast(
  location: Location | null,
  params: ForecastParams = {},
  options: WeatherOptions = {},
) {
  const [data, setData] = useState<WeatherForecastData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const abortControllerRef = useRef<AbortController | null>(null)
  const lastRequestTimeRef = useRef<number>(0)

  const createCacheKey = useCallback(
    (loc: Location, p: ForecastParams, opts: WeatherOptions) =>
      `forecast_${loc.lat}_${loc.lon}_${JSON.stringify(p)}_${JSON.stringify(opts)}`,
    [],
  )

  const fetchForecast = useCallback(
    async (loc: Location, p: ForecastParams, opts: WeatherOptions) => {
      const cacheKey = createCacheKey(loc, p, opts)

      // Check cache first
      const cached = forecastCache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.data
      }

      // Throttle requests
      const now = Date.now()
      const timeSinceLastRequest = now - lastRequestTimeRef.current
      if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise((resolve) => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }

      abortControllerRef.current = new AbortController()
      lastRequestTimeRef.current = Date.now()

      const forecastData = await weatherApi.getWeatherForecast(
        loc.lat,
        loc.lon,
        p,
        opts,
        abortControllerRef.current.signal,
      )

      // Cache the result
      forecastCache.set(cacheKey, { data: forecastData, timestamp: Date.now() })

      return forecastData
    },
    [createCacheKey],
  )

  const refetch = useCallback(async () => {
    if (!location) return

    try {
      setIsLoading(true)
      setError(null)

      const forecastData = await fetchForecast(location, params, options)
      setData(forecastData)
    } catch (err: any) {
      if (!err.message.includes("cancelled")) {
        setError(err.message || "Failed to fetch forecast data")
      }
    } finally {
      setIsLoading(false)
    }
  }, [location, params, options, fetchForecast])

  // Auto-fetch when location or parameters change
  useEffect(() => {
    if (location) {
      refetch()
    }
  }, [location, refetch])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  return useMemo(
    () => ({
      data,
      isLoading,
      error,
      refetch,
    }),
    [data, isLoading, error, refetch],
  )
}
