"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function WalletsEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="wallets"
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
