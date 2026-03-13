"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function UsersEntityPage() {
  return (
    <AdminEntityPage
      entityKey="users"
      features={{
        allowCreate: false,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["unlock-user", "restore-user", "impersonate-user"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
