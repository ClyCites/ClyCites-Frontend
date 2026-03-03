"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function AdvisoriesEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="advisories"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["submit-review", "approve", "reject", "publish", "acknowledge"],
      }}
    />
  );
}
