"use client";

import { WeatherEntityPage } from "@/components/entities/weather/WeatherEntityPage";

export function AlertRulesEntityPage() {
  return (
    <WeatherEntityPage
      entityKey="alertRules"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["activate-rule", "disable-rule"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
