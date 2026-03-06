"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function CommoditiesEntityPage() {
  return (
    <PricesEntityPage
      entityKey="commodities"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledWorkflowActionIds: ["fetch-market-insights", "fetch-market-trends", "compare-market-regions"],
      }}
    />
  );
}
