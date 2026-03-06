"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function PermissionsEntityPage() {
  return (
    <AdminEntityPage
      entityKey="permissions"
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
