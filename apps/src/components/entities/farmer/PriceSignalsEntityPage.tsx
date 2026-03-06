"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function PriceSignalsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="priceSignals"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}

