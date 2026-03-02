"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function InvoicesEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="invoices"
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
