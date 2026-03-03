"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function ReviewQueueEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="reviewQueue"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["approve-review", "reject-review"],
      }}
    />
  );
}
