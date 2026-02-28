"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function AdvisoriesEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="advisories"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["publish", "acknowledge"],
      }}
    />
  );
}

