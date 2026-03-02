"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function PayoutsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="payouts"
      features={{
        allowCreate: true,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
