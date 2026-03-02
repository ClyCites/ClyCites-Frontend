"use client";

import { LogisticsEntityPage } from "@/components/entities/logistics/LogisticsEntityPage";

export function RoutesEntityPage() {
  return (
    <LogisticsEntityPage
      entityKey="routes"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
