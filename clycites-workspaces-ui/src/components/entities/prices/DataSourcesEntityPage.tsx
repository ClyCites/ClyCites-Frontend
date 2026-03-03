"use client";

import { PricesEntityPage } from "@/components/entities/prices/PricesEntityPage";

export function DataSourcesEntityPage() {
  return (
    <PricesEntityPage
      entityKey="dataSources"
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
