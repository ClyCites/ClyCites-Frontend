import { makeAuthenticatedRequest } from "./api-client"

export interface WeatherLocation {
  latitude: number
  longitude: number
  name?: string
  country?: string
  timezone?: string
}

export interface WeatherOptions {
  temperatureUnit?: "celsius" | "fahrenheit"
  windSpeedUnit?: "kmh" | "ms" | "mph" | "kn"
  precipitationUnit?: "mm" | "inch"
  timezone?: string
}

export interface WeatherVariables {
  hourly?: string[]
  daily?: string[]
}

export interface WeatherResponse {
  success: boolean
  message: string
  data: any
}

class WeatherAPI {
  private baseURL = "/weather"

  async getAvailableVariables(): Promise<any> {
    const response = await makeAuthenticatedRequest(`${this.baseURL}/variables`)
    return response.data
  }

  async getCurrentWeather(location: WeatherLocation, variables?: string[], options?: WeatherOptions): Promise<any> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
    })

    if (variables && variables.length > 0) {
      params.append("variables", variables.join(","))
    }

    if (options?.temperatureUnit) {
      params.append("temperatureUnit", options.temperatureUnit)
    }
    if (options?.windSpeedUnit) {
      params.append("windSpeedUnit", options.windSpeedUnit)
    }
    if (options?.precipitationUnit) {
      params.append("precipitationUnit", options.precipitationUnit)
    }
    if (options?.timezone) {
      params.append("timezone", options.timezone)
    }

    const response = await makeAuthenticatedRequest(`${this.baseURL}/current?${params}`)
    return response.data
  }

  async getForecast(
    location: WeatherLocation,
    variables?: WeatherVariables,
    days = 7,
    options?: WeatherOptions,
  ): Promise<any> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      days: days.toString(),
    })

    if (variables?.hourly && variables.hourly.length > 0) {
      params.append("hourlyVariables", variables.hourly.join(","))
    }
    if (variables?.daily && variables.daily.length > 0) {
      params.append("dailyVariables", variables.daily.join(","))
    }

    if (options?.temperatureUnit) {
      params.append("temperatureUnit", options.temperatureUnit)
    }
    if (options?.windSpeedUnit) {
      params.append("windSpeedUnit", options.windSpeedUnit)
    }
    if (options?.precipitationUnit) {
      params.append("precipitationUnit", options.precipitationUnit)
    }
    if (options?.timezone) {
      params.append("timezone", options.timezone)
    }

    const response = await makeAuthenticatedRequest(`${this.baseURL}/forecast?${params}`)
    return response.data
  }

  async getHistoricalWeather(
    location: WeatherLocation,
    startDate: string,
    endDate: string,
    variables?: WeatherVariables,
    options?: WeatherOptions,
  ): Promise<any> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      startDate,
      endDate,
    })

    if (variables?.hourly && variables.hourly.length > 0) {
      params.append("hourlyVariables", variables.hourly.join(","))
    }
    if (variables?.daily && variables.daily.length > 0) {
      params.append("dailyVariables", variables.daily.join(","))
    }

    if (options?.temperatureUnit) {
      params.append("temperatureUnit", options.temperatureUnit)
    }
    if (options?.windSpeedUnit) {
      params.append("windSpeedUnit", options.windSpeedUnit)
    }
    if (options?.precipitationUnit) {
      params.append("precipitationUnit", options.precipitationUnit)
    }
    if (options?.timezone) {
      params.append("timezone", options.timezone)
    }

    const response = await makeAuthenticatedRequest(`${this.baseURL}/historical?${params}`)
    return response.data
  }

  async getClimateProjection(
    location: WeatherLocation,
    startDate: string,
    endDate: string,
    variables?: string[],
    options?: WeatherOptions,
  ): Promise<any> {
    const params = new URLSearchParams({
      latitude: location.latitude.toString(),
      longitude: location.longitude.toString(),
      startDate,
      endDate,
    })

    if (variables && variables.length > 0) {
      params.append("variables", variables.join(","))
    }

    if (options?.temperatureUnit) {
      params.append("temperatureUnit", options.temperatureUnit)
    }
    if (options?.windSpeedUnit) {
      params.append("windSpeedUnit", options.windSpeedUnit)
    }
    if (options?.precipitationUnit) {
      params.append("precipitationUnit", options.precipitationUnit)
    }
    if (options?.timezone) {
      params.append("timezone", options.timezone)
    }

    const response = await makeAuthenticatedRequest(`${this.baseURL}/climate?${params}`)
    return response.data
  }

  async searchLocations(query: string): Promise<WeatherLocation[]> {
    const params = new URLSearchParams({ q: query })
    const response = await makeAuthenticatedRequest(`${this.baseURL}/locations/search?${params}`)
    return response.data
  }

  async getLocationByCoords(latitude: number, longitude: number): Promise<WeatherLocation> {
    const params = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
    })
    const response = await makeAuthenticatedRequest(`${this.baseURL}/locations/reverse?${params}`)
    return response.data
  }
}

export const weatherAPI = new WeatherAPI()
