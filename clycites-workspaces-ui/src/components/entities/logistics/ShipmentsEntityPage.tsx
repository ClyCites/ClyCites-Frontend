"use client";

import { LogisticsEntityPage } from "@/components/entities/logistics/LogisticsEntityPage";

export function ShipmentsEntityPage() {
  return (
    <LogisticsEntityPage
      entityKey="shipments"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
      }}
    />
  );
}
