"use client";

import { AnalyticsEntityPage } from "@/components/entities/analytics/AnalyticsEntityPage";

export function TemplatesEntityPage() {
  return (
    <AnalyticsEntityPage
      entityKey="templates"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledWorkflowActionIds: ["publish-template", "archive-template"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
