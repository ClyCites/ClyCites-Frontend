"use client";

import { WeatherEntityPage } from "@/components/entities/weather/WeatherEntityPage";

export function WeatherAlertsEntityPage() {
  return (
    <WeatherEntityPage
      entityKey="weatherAlerts"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["acknowledge", "escalate", "resolve"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
