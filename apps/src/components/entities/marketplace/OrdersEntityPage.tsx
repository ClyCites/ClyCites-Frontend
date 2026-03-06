"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function OrdersEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="orders"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
