"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function ContractsEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="contracts"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["open-dispute", "resolve-dispute", "close-dispute"],
      }}
    />
  );
}
