"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function PlotsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="plots"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}

