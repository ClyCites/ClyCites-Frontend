"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function ModuleTogglesEntityPage() {
  return (
    <AdminEntityPage
      entityKey="moduleToggles"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: false,
        allowStatus: true,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
