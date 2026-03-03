"use client";

import { ExpertEntityPage } from "@/components/entities/expert/ExpertEntityPage";

export function AssignmentsEntityPage() {
  return (
    <ExpertEntityPage
      entityKey="assignments"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
