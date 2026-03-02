"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function CreditsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="credits"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
