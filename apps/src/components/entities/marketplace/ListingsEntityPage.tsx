"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function ListingsEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="listings"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledToolbarActionIds: ["fetch-linked-media"],
      }}
    />
  );
}
