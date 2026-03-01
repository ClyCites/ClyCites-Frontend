"use client";

import { AggregationEntityPage } from "@/components/entities/aggregation/AggregationEntityPage";

export function QualityGradesEntityPage() {
  return (
    <AggregationEntityPage
      entityKey="qualityGrades"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
