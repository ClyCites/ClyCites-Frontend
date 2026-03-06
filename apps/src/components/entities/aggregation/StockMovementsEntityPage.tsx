"use client";

import { AggregationEntityPage } from "@/components/entities/aggregation/AggregationEntityPage";

export function StockMovementsEntityPage() {
  return (
    <AggregationEntityPage
      entityKey="stockMovements"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
