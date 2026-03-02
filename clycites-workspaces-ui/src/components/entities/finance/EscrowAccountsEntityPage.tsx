"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function EscrowAccountsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="escrowAccounts"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: true,
        enabledWorkflowActionIds: ["release-escrow", "refund-escrow"],
      }}
    />
  );
}
