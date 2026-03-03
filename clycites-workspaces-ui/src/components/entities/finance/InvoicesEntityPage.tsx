"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function InvoicesEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="invoices"
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
