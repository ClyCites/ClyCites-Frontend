"use client";

import { AggregationEntityPage } from "@/components/entities/aggregation/AggregationEntityPage";

export function SpoilageReportsEntityPage() {
  return (
    <AggregationEntityPage
      entityKey="spoilageReports"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
