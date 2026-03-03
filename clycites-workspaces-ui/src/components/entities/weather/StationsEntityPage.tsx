"use client";

import { WeatherEntityPage } from "@/components/entities/weather/WeatherEntityPage";

export function StationsEntityPage() {
  return (
    <WeatherEntityPage
      entityKey="stations"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["refresh-profile-weather"],
        enabledToolbarActionIds: [
          "refresh-weather-admin",
          "check-weather-providers",
          "retry-weather-deliveries",
          "expire-weather-alerts",
          "prune-weather-snapshots",
        ],
      }}
    />
  );
}
