"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function NegotiationsEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="negotiations"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: ["send-message"],
      }}
    />
  );
}
