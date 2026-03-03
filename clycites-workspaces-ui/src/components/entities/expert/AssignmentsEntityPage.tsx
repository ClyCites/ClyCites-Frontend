"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function AssignmentsEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="assignments"
      features={{
        allowCreate: false,
        allowEdit: true,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
