"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function TasksEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="tasks"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}

