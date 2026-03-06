"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function FarmersEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="farmers"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["submit-verification", "verify-profile", "reject-profile"],
      }}
    />
  );
}

