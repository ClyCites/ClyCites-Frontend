"use client";

import { useMemo } from "react";
import { useQueries, useQuery } from "@tanstack/react-query";
import { entityServices } from "@/lib/api";
import type { EntityKey, ListParams, ListResult } from "@/lib/store/types";
import { WorkspaceInsightsCharts } from "@/components/charts/WorkspaceInsightsCharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiRequest, unwrapApiData } from "@/lib/api/real/http";

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

async function fetchFarmerStats(): Promise<Record<string, unknown>> {
  const payload = await apiRequest<unknown>("/api/v1/farmers/stats", { method: "GET" }, { auth: true });
  const unwrapped = unwrapApiData<unknown>(payload);
  return (typeof unwrapped === "object" && unwrapped !== null ? unwrapped : {}) as Record<string, unknown>;
}

export function FarmerWorkspaceInsights() {
  const countQueries = useQueries({
    queries: INSIGHT_ENTITIES.map((entity) => ({
      queryKey: ["farmer-insight-count", entity.key],
      queryFn: () => fetchEntityCount(entity.key),
      staleTime: 60_000,
    })),
  });

  const farmerStatsQuery = useQuery({
    queryKey: ["farmer-module-stats"],
    queryFn: fetchFarmerStats,
    staleTime: 60_000,
  });

  const metrics = useMemo(
    () =>
      INSIGHT_ENTITIES.map((entity, index) => ({
        name: entity.label,
        total: Number(countQueries[index]?.data ?? 0),
      })),
    [countQueries]
  );

  const stats = farmerStatsQuery.data ?? {};
  const byStatusRaw = Array.isArray(stats.byVerificationStatus) ? stats.byVerificationStatus : [];
  const trend =
    byStatusRaw.length > 0
      ? byStatusRaw.map((item, index) => {
          const row = (typeof item === "object" && item !== null ? item : {}) as Record<string, unknown>;
          return {
            period: String(row.status ?? `status-${index + 1}`),
            records: Number(row.count ?? 0),
            alerts: 0,
          };
        })
      : metrics.slice(0, 5).map((item) => ({ period: item.name, records: item.total, alerts: 0 }));

  const totalFarmers = Number(stats.totalFarmers ?? 0);
  const verifiedFarmers = Number(stats.verifiedFarmers ?? 0);
  const totalFarmSize = Number(stats.totalFarmSize ?? 0);
  const averageFarmSize = Number(stats.averageFarmSize ?? 0);

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
