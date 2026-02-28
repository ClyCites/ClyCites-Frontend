"use client";

import { ProductionEntityPage } from "@/components/entities/production/ProductionEntityPage";

export function GrowthStagesEntityPage() {
  return (
    <ProductionEntityPage
      entityKey="growthStages"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
