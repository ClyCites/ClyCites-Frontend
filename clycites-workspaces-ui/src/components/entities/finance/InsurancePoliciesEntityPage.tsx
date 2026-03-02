"use client";

import { FinanceEntityPage } from "@/components/entities/finance/FinanceEntityPage";

export function InsurancePoliciesEntityPage() {
  return (
    <FinanceEntityPage
      entityKey="insurancePolicies"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
      }}
    />
  );
}
