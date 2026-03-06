"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function PricePredictionsEntityPage() {
  return (
    <PricesEntityPage
      entityKey="pricePredictions"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
