"use client";

import { AdminEntityPage } from "@/components/entities/admin/AdminEntityPage";

export function ApiTokensEntityPage() {
  return (
    <AdminEntityPage
      entityKey="apiTokens"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["revoke-token", "rotate-token-secret", "view-token-usage"],
        enabledToolbarActionIds: [],
      }}
    />
  );
}
