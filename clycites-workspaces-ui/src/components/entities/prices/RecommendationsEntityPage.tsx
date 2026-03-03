"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function RecommendationsEntityPage() {
  return (
    <PricesEntityPage
      entityKey="recommendations"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledWorkflowActionIds: [],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
