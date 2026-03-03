"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function CreditsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="credits"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: true,
        enabledWorkflowActionIds: ["approve-credit", "reject-credit", "disburse-credit"],
      }}
    />
  );
}
