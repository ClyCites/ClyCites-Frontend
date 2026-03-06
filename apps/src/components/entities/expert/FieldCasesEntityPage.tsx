"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function FieldCasesEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="fieldCases"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["assign-case", "start-visit", "resolve-case", "close-case"],
      }}
    />
  );
}
