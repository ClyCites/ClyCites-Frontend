"use client";

import { FarmerEntityPage } from "@/components/entities/farmer/FarmerEntityPage";

export function InputsEntityPage() {
  return (
    <FarmerEntityPage
      entityKey="inputs"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}

