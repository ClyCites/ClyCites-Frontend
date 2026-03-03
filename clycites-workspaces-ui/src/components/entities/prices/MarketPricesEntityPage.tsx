"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function MarketPricesEntityPage() {
  return (
    <PricesEntityPage
      entityKey="marketPrices"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
