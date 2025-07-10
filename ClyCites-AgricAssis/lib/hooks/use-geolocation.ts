"use client"

import { useState, useCallback, useEffect } from "react"

interface GeolocationPosition {
  latitude: number
  longitude: number
  accuracy: number
  altitude?: number | null
  altitudeAccuracy?: number | null
  heading?: number | null
  speed?: number | null
  timestamp: number
}

interface GeolocationError {
  code: number
  message: string
}

interface UseGeolocationOptions {
  enableHighAccuracy?: boolean
  timeout?: number
  maximumAge?: number
}

interface UseGeolocationReturn {
  position: GeolocationPosition | null
  error: GeolocationError | null
  loading: boolean
  getCurrentPosition: (options?: UseGeolocationOptions) => Promise<GeolocationPosition>
  reset: () => void
  isSupported: boolean
  permissionState: PermissionState | null
}

export function useGeolocation(): UseGeolocationReturn {
  const [position, setPosition] = useState<GeolocationPosition | null>(null)
  const [error, setError] = useState<GeolocationError | null>(null)
  const [loading, setLoading] = useState(false)
  const [permissionState, setPermissionState] = useState<PermissionState | null>(null)

  const isSupported = typeof navigator !== "undefined" && "geolocation" in navigator

  // Check permission status
  useEffect(() => {
    if (!isSupported || !navigator.permissions) return

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        setPermissionState(result.state)

        result.addEventListener("change", () => {
          setPermissionState(result.state)
        })
      })
      .catch(() => {
        // Permission API not supported, ignore
      })
  }, [isSupported])

  const getCurrentPosition = useCallback(
    (options: UseGeolocationOptions = {}): Promise<GeolocationPosition> => {
      return new Promise((resolve, reject) => {
        if (!isSupported) {
          const error = {
            code: 0,
            message: "Geolocation is not supported by this browser",
          }
          setError(error)
          reject(error)
          return
        }

        setLoading(true)
        setError(null)

        const defaultOptions: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
          ...options,
        }

        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const position: GeolocationPosition = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
              altitude: pos.coords.altitude,
              altitudeAccuracy: pos.coords.altitudeAccuracy,
              heading: pos.coords.heading,
              speed: pos.coords.speed,
              timestamp: pos.timestamp,
            }

            setPosition(position)
            setLoading(false)
            resolve(position)
          },
          (err) => {
            const error: GeolocationError = {
              code: err.code,
              message: getGeolocationErrorMessage(err.code),
            }

            setError(error)
            setLoading(false)
            reject(error)
          },
          defaultOptions,
        )
      })
    },
    [isSupported],
  )

  const reset = useCallback(() => {
    setPosition(null)
    setError(null)
    setLoading(false)
  }, [])

  return {
    position,
    error,
    loading,
    getCurrentPosition,
    reset,
    isSupported,
    permissionState,
  }
}

function getGeolocationErrorMessage(code: number): string {
  switch (code) {
    case 1:
      return "Location access denied by user"
    case 2:
      return "Location information unavailable"
    case 3:
      return "Location request timed out"
    default:
      return "An unknown error occurred while retrieving location"
  }
}
