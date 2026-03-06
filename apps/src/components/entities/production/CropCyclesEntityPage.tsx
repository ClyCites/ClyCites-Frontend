"use client";

import { ProductionEntityPage } from "@/components/entities/production/ProductionEntityPage";

export function CropCyclesEntityPage() {
  return (
    <ProductionEntityPage
      entityKey="cropCycles"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
