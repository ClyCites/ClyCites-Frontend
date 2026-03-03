"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function OrgsEntityPage() {
  return (
    <AdminEntityPage
      entityKey="orgs"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: [],
      }}
    />
  );
}
