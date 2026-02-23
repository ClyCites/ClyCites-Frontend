"use client";

import { Cloud, CloudRain, Sun, Wind } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function WeatherPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
          <Cloud className="h-8 w-8 text-blue-600" />
          Weather & Climate Intelligence
        </h1>
        <p className="text-muted-foreground mt-1">
          Forecasts, alerts, and agronomic recommendations
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Weather
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Sun className="h-10 w-10 text-yellow-500" />
              <div>
                <div className="text-3xl font-bold">28°C</div>
                <div className="text-xs text-muted-foreground">Kampala</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Precipitation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CloudRain className="h-10 w-10 text-blue-500" />
              <div>
                <div className="text-3xl font-bold">60%</div>
                <div className="text-xs text-muted-foreground">Chance of rain</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Wind Speed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <Wind className="h-10 w-10 text-gray-500" />
              <div>
                <div className="text-3xl font-bold">12</div>
                <div className="text-xs text-muted-foreground">km/h</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-lg">Coming Soon</CardTitle>
            <CardDescription>Full weather module</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              7-day forecasts, weather alerts, and climate data
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
