"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function CropsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="crops"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}

