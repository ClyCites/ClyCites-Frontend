"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function TransactionsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="transactions"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
