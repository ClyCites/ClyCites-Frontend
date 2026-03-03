"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function ResearchReportsEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="researchReports"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
