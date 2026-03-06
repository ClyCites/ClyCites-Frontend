"use client";

import { LogisticsEntityPage } from "@/components/entities/logistics/LogisticsEntityPage";

export function DriversEntityPage() {
  return (
    <LogisticsEntityPage
      entityKey="drivers"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
