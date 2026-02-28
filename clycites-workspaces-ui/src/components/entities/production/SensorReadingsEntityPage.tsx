"use client";

import { ProductionEntityPage } from "@/components/entities/production/ProductionEntityPage";

export function SensorReadingsEntityPage() {
  return (
    <ProductionEntityPage
      entityKey="sensorReadings"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
