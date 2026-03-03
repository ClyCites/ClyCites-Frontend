"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function UsersEntityPage() {
  return (
    <AdminEntityPage
      entityKey="users"
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
