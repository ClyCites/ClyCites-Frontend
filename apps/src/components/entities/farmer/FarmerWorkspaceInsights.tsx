"use client";

import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { entityServices } from "@/lib/api";
import type { EntityKey, ListParams, ListResult } from "@/lib/store/types";
import { WorkspaceInsightsCharts } from "@/components/charts/WorkspaceInsightsCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFarmerStats } from "@/lib/hooks/useFarmers";
import type { FarmerStats } from "@/lib/types/farmer.types";

type FarmerInsightEntityKey = "farmers" | "farms" | "plots" | "crops" | "growthStages" | "yieldPredictions" | "inputs";

const INSIGHT_ENTITIES: Array<{ key: FarmerInsightEntityKey; label: string }> = [
  { key: "farmers", label: "Farmers" },
  { key: "farms", label: "Farms" },
  { key: "plots", label: "Plots" },
  { key: "crops", label: "Crops" },
  { key: "growthStages", label: "Growth Stages" },
  { key: "yieldPredictions", label: "Yield Predictions" },
  { key: "inputs", label: "Inputs" },
];

function listParams(): ListParams {
  return {
    pagination: { page: 1, pageSize: 1 },
    sort: { field: "updatedAt", direction: "desc" },
    filters: {},
  };
}

async function fetchEntityCount(entityKey: EntityKey): Promise<number> {
  const service = entityServices[entityKey] as {
    listX: (params: ListParams) => Promise<ListResult<unknown>>;
  };
  const result = await service.listX(listParams());
  return Number(result.pagination?.total ?? 0);
}

export function FarmerWorkspaceInsights() {
  const countQueries = useQueries({
    queries: INSIGHT_ENTITIES.map((entity) => ({
      queryKey: ["farmer-insight-count", entity.key],
      queryFn: () => fetchEntityCount(entity.key),
      staleTime: 60_000,
    })),
  });

  const farmerStatsQuery = useFarmerStats();

  const metrics = useMemo(
    () =>
      INSIGHT_ENTITIES.map((entity, index) => ({
        name: entity.label,
        total: Number(countQueries[index]?.data ?? 0),
      })),
    [countQueries]
  );

  const stats: FarmerStats = farmerStatsQuery.data ?? {
    totalFarmers: 0,
    verifiedFarmers: 0,
    totalFarmSize: 0,
    averageFarmSize: 0,
    byVerificationStatus: [],
  };
  const byStatusRaw = stats.byVerificationStatus;
  const trend =
    byStatusRaw.length > 0
      ? byStatusRaw.map((item, index) => {
          return {
            period: String(item.status ?? `status-${index + 1}`),
            records: Number(item.count ?? 0),
            alerts: 0,
          };
        })
      : metrics.slice(0, 5).map((item) => ({ period: item.name, records: item.total, alerts: 0 }));

  const totalFarmers = Number(stats.totalFarmers);
  const verifiedFarmers = Number(stats.verifiedFarmers);
  const totalFarmSize = Number(stats.totalFarmSize);
  const averageFarmSize = Number(stats.averageFarmSize);

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Farmers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{totalFarmers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Verified Farmers</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{verifiedFarmers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Total Farm Size</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{totalFarmSize.toFixed(1)}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Avg Farm Size</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-semibold">{averageFarmSize.toFixed(1)}</CardContent>
        </Card>
      </div>

      <WorkspaceInsightsCharts metrics={metrics} trend={trend} />
    </section>
  );
}
