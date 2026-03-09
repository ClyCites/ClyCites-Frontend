"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function DashboardsEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="dashboards"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledWorkflowActionIds: ["publish-dashboard", "archive-dashboard"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
