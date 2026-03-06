"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function WeatherAlertsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="weatherAlerts"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["acknowledge", "resolve"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}

