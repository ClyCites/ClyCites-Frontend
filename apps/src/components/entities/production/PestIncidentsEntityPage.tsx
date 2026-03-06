"use client";

import { ProductionEntityPage } from "@/components/entities/production/ProductionEntityPage";

export function PestIncidentsEntityPage() {
  return (
    <ProductionEntityPage
      entityKey="pestIncidents"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["resolve-incident", "close-incident"],
      }}
    />
  );
}
