"use client";

import { WeatherEntityPage } from "@/components/entities/weather/WeatherEntityPage";

export function ForecastsEntityPage() {
  return (
    <WeatherEntityPage
      entityKey="forecasts"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: ["refresh-forecast"],
      }}
    />
  );
}
