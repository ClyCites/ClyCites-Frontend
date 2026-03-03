"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function RolesEntityPage() {
  return (
    <AdminEntityPage
      entityKey="roles"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
