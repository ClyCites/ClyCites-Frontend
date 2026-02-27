"use client";

import Link from "next/link";
import { createElement, useMemo } from "react";
import { useQueries } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingDown, TrendingUp } from "lucide-react";
import { WORKSPACE_ENTITY_MAP, getEntityDefinition, getWorkspaceDefinition } from "@/lib/store/catalog";
import { entityServices } from "@/lib/api/mock";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceInsightsCharts } from "@/components/charts/WorkspaceInsightsCharts";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  const entities = WORKSPACE_ENTITY_MAP[workspaceId];
  const { canAccessWorkspace } = useMockSession();
  const reducedMotion = useReducedMotion();

  const cardsQuery = useQueries({
    queries: entities.map((entityKey) => ({
      queryKey: ["workspace-summary", workspaceId, entityKey],
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

  if (!workspace) {
    return <AccessDenied />;
  }

  if (!canAccessWorkspace(workspaceId)) {
    return <AccessDenied />;
  }

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

  return (
    <motion.div
      variants={staggerContainer(Boolean(reducedMotion), 0.05)}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <PageHeader
        title={workspace.label}
        subtitle={workspace.description}
        breadcrumbs={[{ label: "App", href: "/app" }, { label: workspace.label }]}
        actions={<Badge variant="success">{totalRecords} Records</Badge>}
      />

      <motion.section variants={fadeIn(Boolean(reducedMotion))} className="grid grid-cols-12 gap-4">
        <Card className="col-span-12">
          <CardHeader className="pb-3">
            <CardTitle>Workspace Intelligence Summary</CardTitle>
            <CardDescription>
              Overview of active entities in {workspace.label}. Counts are powered by local mock persistence.
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
    </motion.div>
  );
}
