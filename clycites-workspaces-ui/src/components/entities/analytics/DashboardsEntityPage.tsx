"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function DashboardsEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="dashboards"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: true,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
