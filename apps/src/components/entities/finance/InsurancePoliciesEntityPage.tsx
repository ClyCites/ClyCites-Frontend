"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function InsurancePoliciesEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="insurancePolicies"
      features={{
        allowCreate: true,
        allowEdit: true,
        allowDelete: true,
        allowStatus: false,
      }}
    />
  );
}
