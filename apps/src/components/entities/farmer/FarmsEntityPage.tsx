"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function FarmsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="farms"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}

