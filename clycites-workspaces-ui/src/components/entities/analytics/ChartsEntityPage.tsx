"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function ChartsEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="charts"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
