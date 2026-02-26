"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bell, ChevronRight, ClipboardList, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { DataTable, type Column } from "@/components/market/DataTable";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { LoadingState } from "@/components/shared/LoadingState";
import { useAuth } from "@/lib/auth/auth-context";
import { useDataSaver } from "@/lib/context/data-saver-context";
import { analyticsApi, notificationsApi, weatherApi } from "@/lib/api/endpoints/platform.api";
import { formatRelativeTime } from "@/lib/utils";

const HeavyInsightChart = dynamic(() => import("@/components/dashboard/HeavyInsightChart"), {
  ssr: false,
  loading: () => <LoadingState text="Loading chart..." />,
});

interface FeedRow {
  id: string;
  module: string;
  title: string;
  status: string;
  updatedAt: string;
  details?: string;
}

const columns: Column<FeedRow>[] = [
  {
    key: "module",
    header: "Module",
    render: (row) => <Badge variant="outline">{row.module}</Badge>,
  },
  { key: "title", header: "Title" },
  {
    key: "status",
    header: "Status",
    render: (row) => <span className="capitalize">{row.status}</span>,
  },
  {
    key: "updatedAt",
    header: "Updated",
    render: (row) => <span className="text-xs text-muted-foreground">{formatRelativeTime(row.updatedAt)}</span>,
  },
];

function roleCopy(role: string | null): { heading: string; subHeading: string } {
  switch (role) {
    case "farmer":
      return {
        heading: "Farmer Operations Dashboard",
        subHeading: "Monitor listings, deliveries, weather alerts, and pending buyer commitments.",
      };
    case "buyer":
      return {
        heading: "Buyer Intelligence Dashboard",
        subHeading: "Track sourcing opportunities, order fulfillment risk, and payment status.",
      };
    case "trader":
    case "supplier":
      return {
        heading: "Trader & Supplier Command",
        subHeading: "Coordinate procurement, logistics, and margin-sensitive market movements.",
      };
    case "expert":
      return {
        heading: "Expert Advisory Workspace",
        subHeading: "Prioritize support cases, weather interventions, and active consultations.",
      };
    case "org_admin":
      return {
        heading: "Organization Control Dashboard",
        subHeading: "Oversee tenant activity, compliance, users, and operational throughput.",
      };
    case "super_admin":
      return {
        heading: "Super Admin Global Overview",
        subHeading: "Track platform health, feature controls, and high-risk activity.",
      };
    default:
      return {
        heading: "Multi-Dashboard Overview",
        subHeading: "A unified view of ClyCites marketplace and operations modules.",
      };
  }
}

export default function DashboardPage() {
  const { role } = useAuth();
  const { enabled: dataSaverEnabled } = useDataSaver();
  const [selectedRow, setSelectedRow] = useState<FeedRow | null>(null);

  const analyticsQuery = useQuery({
    queryKey: ["dashboard", "analytics", role],
    queryFn: () => analyticsApi.dashboard({ role }),
  });

  const weatherQuery = useQuery({
    queryKey: ["dashboard", "weather"],
    queryFn: () => weatherApi.list({ limit: dataSaverEnabled ? 5 : 10 }),
    staleTime: dataSaverEnabled ? 1000 * 60 * 10 : 1000 * 60 * 5,
  });

  const notificationsQuery = useQuery({
    queryKey: ["dashboard", "notifications"],
    queryFn: () => notificationsApi.list({ limit: dataSaverEnabled ? 8 : 20 }),
    refetchInterval: dataSaverEnabled ? 120_000 : 30_000,
  });

  const copy = roleCopy(role);

  const feedRows = useMemo<FeedRow[]>(() => {
    const source = (
      notificationsQuery.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined
    );

    const rows = Array.isArray(source)
      ? source
      : Array.isArray(source?.data)
        ? source.data
        : [];

    return rows.slice(0, dataSaverEnabled ? 8 : 15).map((item, index) => ({
      id: String(item.id ?? index),
      module: String(item.type ?? "system"),
      title: String(item.title ?? item.body ?? "Platform update"),
      status: String(item.status ?? "active"),
      updatedAt: String(item.createdAt ?? new Date().toISOString()),
      details: String(item.body ?? "No details provided."),
    }));
  }, [notificationsQuery.data, dataSaverEnabled]);

  const weatherAlerts = useMemo(() => {
    const source = weatherQuery.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined;
    const rows = Array.isArray(source) ? source : Array.isArray(source?.data) ? source.data : [];
    return rows.slice(0, 3);
  }, [weatherQuery.data]);

  const analyticsPayload = analyticsQuery.data as Record<string, unknown> | undefined;
  const kpis = [
    {
      title: "Active Orders",
      value: String(analyticsPayload?.activeOrders ?? 0),
      trend: "+8.4%",
      caption: "vs previous cycle",
    },
    {
      title: "Settlement Volume",
      value: String(analyticsPayload?.settlementVolume ?? "$0"),
      trend: "+2.1%",
      caption: "payments + escrow",
    },
    {
      title: "Open Alerts",
      value: String(weatherAlerts.length),
      trend: weatherAlerts.length > 0 ? "Watch" : "Clear",
      caption: "weather + operations",
    },
    {
      title: "Unread Notices",
      value: String(feedRows.length),
      trend: "Live",
      caption: "notifications + messaging",
    },
  ];

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-[linear-gradient(135deg,hsl(var(--card)/0.95)_0%,hsl(var(--primary)/0.08)_48%,hsl(var(--secondary)/0.08)_100%)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold sm:text-3xl">{copy.heading}</h2>
            <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{copy.subHeading}</p>
          </div>
          <Badge variant={dataSaverEnabled ? "warning" : "success"} className="h-fit">
            {dataSaverEnabled ? "Low-bandwidth mode enabled" : "Standard mode"}
          </Badge>
        </div>
      </section>

      {(analyticsQuery.error || notificationsQuery.error || weatherQuery.error) && (
        <div className="grid gap-3">
          {analyticsQuery.error && <ApiErrorPanel error={analyticsQuery.error} />}
          {notificationsQuery.error && <ApiErrorPanel error={notificationsQuery.error} compact />}
          {weatherQuery.error && <ApiErrorPanel error={weatherQuery.error} compact />}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.title} {...kpi} />
        ))}
      </section>

      {!dataSaverEnabled && (
        <HeavyInsightChart title="Cross-module activity trend (lazy loaded)" />
      )}

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-4 w-4" />
              Activity Feed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={feedRows}
              columns={columns}
              isLoading={notificationsQuery.isLoading}
              emptyTitle="No activity yet"
              emptyDescription="Notifications and workflow events will appear here."
              onRowClick={setSelectedRow}
            />
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Priority Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {weatherQuery.isLoading && <LoadingState text="Loading weather intelligence..." />}
            {!weatherQuery.isLoading && weatherAlerts.length === 0 && (
              <p className="text-sm text-muted-foreground">No active weather alerts.</p>
            )}
            {weatherAlerts.map((alert, index) => (
              <div key={String(alert.id ?? index)} className="rounded-xl border border-border/70 p-3">
                <p className="text-sm font-medium">{String(alert.alertType ?? "Weather advisory")}</p>
                <p className="mt-1 text-xs text-muted-foreground">{String(alert.message ?? "No detail")}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full justify-between" asChild>
              <a href="/weather">
                Open weather board
                <ChevronRight className="h-4 w-4" />
              </a>
            </Button>
            <Button variant="ghost" className="w-full justify-between" asChild>
              <a href="/dashboard/orders-payments">
                Open operations workflow
                <Bell className="h-4 w-4" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </section>

      <Sheet open={!!selectedRow} onOpenChange={(open) => !open && setSelectedRow(null)}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{selectedRow?.title}</SheetTitle>
            <SheetDescription>Module: {selectedRow?.module}</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="font-medium">Status:</span> {selectedRow?.status}
            </p>
            <p>
              <span className="font-medium">Updated:</span> {selectedRow?.updatedAt}
            </p>
            <p className="rounded-xl border border-border/70 bg-card/70 p-3">
              {selectedRow?.details}
            </p>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
