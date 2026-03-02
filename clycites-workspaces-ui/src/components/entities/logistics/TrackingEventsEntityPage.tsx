"use client";

import { LogisticsEntityPage } from "@/components/entities/logistics/LogisticsEntityPage";

export function TrackingEventsEntityPage() {
  return (
    <LogisticsEntityPage
      entityKey="trackingEvents"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
