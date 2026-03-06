"use client";

import { AggregationEntityPage } from "@/components/entities/aggregation/AggregationEntityPage";

export function BatchesEntityPage() {
  return (
    <AggregationEntityPage
      entityKey="batches"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
