"use client";

import { MarketplaceEntityPage } from "@/components/entities/marketplace/MarketplaceEntityPage";

export function ReviewsEntityPage() {
  return (
    <MarketplaceEntityPage
      entityKey="reviews"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
