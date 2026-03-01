"use client";

import { AggregationEntityPage } from "@/components/entities/aggregation/AggregationEntityPage";

export function StorageBinsEntityPage() {
  return (
    <AggregationEntityPage
      entityKey="storageBins"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
