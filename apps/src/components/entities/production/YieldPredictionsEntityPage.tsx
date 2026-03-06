"use client";

import { ProductionEntityPage } from "@/components/entities/production/ProductionEntityPage";

export function YieldPredictionsEntityPage() {
  return (
    <ProductionEntityPage
      entityKey="yieldPredictions"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: ["refresh-prediction"],
      }}
    />
  );
}
