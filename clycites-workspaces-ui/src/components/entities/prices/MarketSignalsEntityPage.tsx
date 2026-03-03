"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function MarketSignalsEntityPage() {
  return (
    <PricesEntityPage
      entityKey="marketSignals"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
      }}
    />
  );
}
