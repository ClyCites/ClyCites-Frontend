"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function PriceEstimationsEntityPage() {
  return (
    <PricesEntityPage
      entityKey="priceEstimations"
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
