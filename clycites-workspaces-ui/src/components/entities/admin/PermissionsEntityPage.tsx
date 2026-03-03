"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function PermissionsEntityPage() {
  return (
    <AdminEntityPage
      entityKey="permissions"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
