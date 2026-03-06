"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function ResearchReportsEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="researchReports"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["submit-report", "publish-report", "archive-report"],
      }}
    />
  );
}
