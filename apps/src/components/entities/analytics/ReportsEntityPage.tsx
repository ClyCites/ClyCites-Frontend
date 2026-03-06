"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function ReportsEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="reports"
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
