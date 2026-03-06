"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function RfqsEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="rfqs"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
