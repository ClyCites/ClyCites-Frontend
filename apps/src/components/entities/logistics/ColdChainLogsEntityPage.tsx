"use client";

import { LogisticsEntityPage } from "@/components/entities/logistics/LogisticsEntityPage";

export function ColdChainLogsEntityPage() {
  return (
    <LogisticsEntityPage
      entityKey="coldChainLogs"
      features={{
        allowCreate: false,
        allowEdit: false,
        allowDelete: false,
        allowStatus: false,
        enabledToolbarActionIds: ["flag-violations"],
      }}
    />
  );
}
