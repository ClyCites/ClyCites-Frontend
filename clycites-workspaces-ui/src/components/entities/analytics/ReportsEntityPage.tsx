"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function ReportsEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="reports"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
