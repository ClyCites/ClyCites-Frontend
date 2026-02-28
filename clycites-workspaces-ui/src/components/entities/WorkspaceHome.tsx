"use client";

import Link from "next/link";
import { createElement, useMemo, useState } from "react";
import { useMutation, useQueries, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { WORKSPACE_ENTITY_MAP, getEntityDefinition, getWorkspaceDefinition } from "@/lib/store/catalog";
import { chartService, isRealApiMode } from "@/lib/api";
import type { ChartDefinition } from "@/lib/api/contracts";
import { entityServices } from "@/lib/api";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { queryKeys } from "@/lib/query/keys";
import { invalidateAnalyticsMutation } from "@/lib/query/invalidation";
import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceInsightsCharts } from "@/components/charts/WorkspaceInsightsCharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { fadeIn, scaleIn, staggerContainer } from "@/lib/motion";
import { getEntityIcon } from "@/components/layout/workspaces/workspace-icons";

interface WorkspaceHomeProps {
  workspaceId: WorkspaceId;
}

function buildSparkline(total: number, index: number): number[] {
  const seed = Math.max(total, 4) + index * 3;
  return Array.from({ length: 7 }, (_, position) => {
    const value = (seed + position * 2 + (position % 2 === 0 ? 4 : -2)) % 18;
    return 8 + value;
  });
}

function sparklinePath(values: number[]): string {
  const step = 100 / Math.max(1, values.length - 1);
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${Math.round(index * step)} ${36 - value}`)
    .join(" ");
}

export function WorkspaceHome({ workspaceId }: WorkspaceHomeProps) {
  const workspace = getWorkspaceDefinition(workspaceId);
  const entities = useMemo(() => WORKSPACE_ENTITY_MAP[workspaceId] ?? [], [workspaceId]);
  const workspaceLabel = workspace?.label ?? "Workspace";
  const workspaceDescription = workspace?.description ?? "Workspace overview";
  const { canAccessWorkspace } = useMockSession();
  const reducedMotion = useReducedMotion();
  const queryClient = useQueryClient();

  const cardsQuery = useQueries({
    queries: entities.map((entityKey) => ({
      queryKey: queryKeys.workspaceSummary.byEntity(workspaceId, entityKey),
      queryFn: () =>
        entityServices[entityKey].listX({
          pagination: { page: 1, pageSize: 1 },
          sort: { field: "updatedAt", direction: "desc" },
        }),
    })),
  });

  const summary = useMemo(
    () =>
      entities.map((entityKey, index) => {
        const definition = getEntityDefinition(entityKey);
        const total = cardsQuery[index].data?.pagination.total ?? 0;
        const trendValue = ((total + index * 5) % 13) - 6;

        return {
          entityKey,
          definition,
          total,
          trendValue,
          sparkline: buildSparkline(total, index),
          loading: cardsQuery[index].isLoading,
        };
      }),
    [cardsQuery, entities]
  );
  const [livePreviewRows, setLivePreviewRows] = useState<Array<Record<string, unknown>>>([]);

  const totalRecords = summary.reduce((acc, item) => acc + item.total, 0);
  const mostActive = [...summary].sort((a, b) => b.total - a.total)[0];
  const chartMetrics = summary.map((item) => ({
    name: item.definition?.label ?? item.entityKey,
    total: item.total,
  }));
  const chartTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((period, index) => ({
    period,
    records: Math.max(4, Math.round(totalRecords * (0.45 + index * 0.1))),
    alerts: Math.max(1, Math.round((mostActive?.total ?? 1) * (0.2 + index * 0.06))),
  }));
  const defaultDefinition = useMemo<ChartDefinition>(
    () => ({
      datasetId: "platform_health",
      chartType: "line",
      metrics: [{ type: "count", alias: "records" }],
      dimensions: [{ type: "date_month", alias: "month" }],
      vizOptions: {
        title: `${workspaceLabel} Health`,
        showLegend: true,
        colorScheme: "green",
      },
    }),
    [workspaceLabel]
  );

  const previewMutation = useMutation({
    mutationFn: () => chartService.previewChart(defaultDefinition),
    onSuccess: (result) => {
      setLivePreviewRows(result.rows);
      toast({
        title: "Chart preview ready",
        description: `${result.rows.length} rows loaded from ${isRealApiMode ? "real API" : "mock service"}.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Preview failed",
        description: error instanceof Error ? error.message : "Unable to preview chart.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      chartService.saveChart({
        name: `${workspaceLabel} Snapshot`,
        description: "Auto-saved from workspace home",
        definition: defaultDefinition,
        tags: [workspaceId, "workspace-home"],
        shareScope: "org_members",
      }),
    onSuccess: (result) => {
      void invalidateAnalyticsMutation(queryClient);
      toast({
        title: "Chart saved",
        description: `Saved chart "${result.name}" (${result.id}).`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Save failed",
        description: error instanceof Error ? error.message : "Unable to save chart.",
        variant: "destructive",
      });
    },
  });

  if (!workspace) {
    return <AccessDenied />;
  }

  if (!canAccessWorkspace(workspaceId)) {
    return <AccessDenied />;
  }

  return (
    <motion.div
      variants={staggerContainer(Boolean(reducedMotion), 0.05)}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <PageHeader
        title={workspaceLabel}
        subtitle={workspaceDescription}
        breadcrumbs={[{ label: "App", href: "/app" }, { label: workspaceLabel }]}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="success">{totalRecords} Records</Badge>
            {workspaceId === "analytics" && (
              <Button asChild variant="outline" size="sm">
                <Link href="/app/analytics/charts">Open Chart Workbench</Link>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => previewMutation.mutate()}
              loading={previewMutation.isPending}
            >
              Preview Chart
            </Button>
            <Button size="sm" onClick={() => saveMutation.mutate()} loading={saveMutation.isPending}>
              Save Chart
            </Button>
          </div>
        }
      />

      <motion.section variants={fadeIn(Boolean(reducedMotion))} className="grid grid-cols-12 gap-4">
        <Card className="col-span-12">
          <CardHeader className="pb-3">
            <CardTitle>Workspace Intelligence Summary</CardTitle>
            <CardDescription>
              Overview of active entities in {workspaceLabel}. Counts are powered by {isRealApiMode ? "live API reads with fallback." : "local mock persistence."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Total records</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{totalRecords}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Modules</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{entities.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Most active</p>
                <p className="mt-1 truncate text-base font-semibold tracking-tight">
                  {mostActive?.definition?.pluralLabel ?? "-"}
                </p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Refresh cadence</p>
                <p className="mt-1 text-base font-semibold tracking-tight">Live local query</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={staggerContainer(Boolean(reducedMotion), 0.04)} className="grid grid-cols-12 gap-4">
        {summary.map((item) => {
          const icon = getEntityIcon(item.entityKey);
          const TrendIcon = item.trendValue >= 0 ? TrendingUp : TrendingDown;

          return (
            <motion.div key={item.entityKey} variants={scaleIn(Boolean(reducedMotion))} className="col-span-12 sm:col-span-6 xl:col-span-4">
              <Card>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-base">{item.definition?.pluralLabel ?? item.entityKey}</CardTitle>
                      <CardDescription>{item.loading ? "Loading metrics..." : `${item.total} records`}</CardDescription>
                    </div>
                    <span className="rounded-lg bg-primary/12 p-2 text-primary">
                      {createElement(icon, { className: "h-4 w-4" })}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-end justify-between gap-2">
                    <p className="text-3xl font-semibold tracking-tight">{item.total}</p>
                    <p className={item.trendValue >= 0 ? "inline-flex items-center gap-1 text-sm text-success" : "inline-flex items-center gap-1 text-sm text-destructive"}>
                      <TrendIcon className="h-4 w-4" />
                      {Math.abs(item.trendValue)}%
                    </p>
                  </div>

                  <svg viewBox="0 0 100 36" className="h-10 w-full" role="img" aria-label="Trend sparkline">
                    <path
                      d={sparklinePath(item.sparkline)}
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>

                  <Button asChild variant="outline" className="w-full justify-between">
                    <Link href={`/app/${workspaceId}/${item.entityKey}`}>
                      Open {item.definition?.pluralLabel ?? item.entityKey}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>

      <motion.section variants={fadeIn(Boolean(reducedMotion))}>
        <WorkspaceInsightsCharts metrics={chartMetrics} trend={chartTrend} />
      </motion.section>

      {livePreviewRows.length > 0 && (
        <motion.section variants={fadeIn(Boolean(reducedMotion))}>
          <Card>
            <CardHeader>
              <CardTitle>Live Chart Preview Data</CardTitle>
              <CardDescription>
                Showing first 5 rows returned from {isRealApiMode ? "staging API" : "mock service"} preview endpoint.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="max-h-[280px] overflow-auto rounded-xl border border-border/60 bg-background/60 p-3 text-xs">
                {JSON.stringify(livePreviewRows.slice(0, 5), null, 2)}
              </pre>
            </CardContent>
          </Card>
        </motion.section>
      )}
    </motion.div>
  );
}
