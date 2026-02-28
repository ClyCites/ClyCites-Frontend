"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDown, ArrowUp, Pencil, Plus, Trash2 } from "lucide-react";
import { chartService, isRealApiMode } from "@/lib/api";
import type { ChartDefinition, SavedChart } from "@/lib/api/contracts";
import {
  CHART_DATASETS,
  CHART_DIMENSION_TYPES,
  CHART_METRIC_TYPES,
  CHART_TYPES,
  toOptionLabel,
  type ChartDatasetId,
  type ChartDimensionType,
  type ChartMetricType,
  type SupportedChartType,
} from "@/lib/charts/catalog";
import { queryKeys } from "@/lib/query/keys";
import { invalidateAnalyticsMutation } from "@/lib/query/invalidation";
import { chartSeriesPalette } from "@/styles/design-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/common/EmptyState";
import { toast } from "@/components/ui/use-toast";

interface ChartWorkbenchProps {
  workspaceLabel: string;
  canSave?: boolean;
  canExport?: boolean;
}

function displayError(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback;
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toStringValue(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

function resolveRows(
  rows: Array<Record<string, unknown>>,
  preferredDimension: string,
  preferredMetric: string
): { rows: Array<Record<string, unknown>>; dimensionKey: string; metricKey: string } {
  if (rows.length === 0) {
    return { rows: [], dimensionKey: "dimension", metricKey: "value" };
  }

  const keys = Object.keys(rows[0]);
  const numeric = keys.filter((key) => typeof rows[0][key] === "number");
  const metricKey = keys.includes(preferredMetric) ? preferredMetric : numeric[0] ?? keys[0] ?? "value";
  const dimensionKey =
    keys.includes(preferredDimension) ? preferredDimension : keys.find((key) => key !== metricKey) ?? "dimension";

  return {
    dimensionKey,
    metricKey,
    rows: rows.map((item, index) => ({
      ...item,
      [dimensionKey]: toStringValue(item[dimensionKey] ?? `Row ${index + 1}`),
      [metricKey]: toNumber(item[metricKey]),
    })),
  };
}

function download(downloadUrl: string, filename: string): void {
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 2_000);
}

export function ChartWorkbench({ workspaceLabel, canSave = true, canExport = true }: ChartWorkbenchProps) {
  const queryClient = useQueryClient();

  const [datasetId, setDatasetId] = useState<ChartDatasetId>("platform_health");
  const [metricType, setMetricType] = useState<ChartMetricType>("count");
  const [metricField, setMetricField] = useState("records");
  const [metricAlias, setMetricAlias] = useState("value");
  const [dimensionType, setDimensionType] = useState<ChartDimensionType>("date_month");
  const [dimensionAlias, setDimensionAlias] = useState("period");
  const [chartType, setChartType] = useState<SupportedChartType>("line");
  const [previewRows, setPreviewRows] = useState<Array<Record<string, unknown>>>([]);
  const [editingChartId, setEditingChartId] = useState<string | null>(null);

  const [dashboardName, setDashboardName] = useState("");
  const [dashboardDescription, setDashboardDescription] = useState("");
  const [selectedDashboardId, setSelectedDashboardId] = useState("");
  const [reportFormat, setReportFormat] = useState<"csv" | "json" | "pdf">("csv");

  const definition = useMemo<ChartDefinition>(
    () => ({
      datasetId,
      chartType,
      metrics: [{ type: metricType, field: metricField || undefined, alias: metricAlias || undefined }],
      dimensions: [{ type: dimensionType, alias: dimensionAlias || undefined }],
      vizOptions: {
        title: `${workspaceLabel} Dataflow`,
        showLegend: true,
      },
    }),
    [chartType, datasetId, dimensionAlias, dimensionType, metricAlias, metricField, metricType, workspaceLabel]
  );

  const chartsQuery = useQuery({
    queryKey: queryKeys.analytics.savedCharts(datasetId),
    queryFn: () => chartService.listCharts({ page: 1, limit: 20, dataset: datasetId }),
  });

  const dashboardsQuery = useQuery({
    queryKey: queryKeys.analytics.dashboards(),
    queryFn: () => chartService.listDashboards({ page: 1, limit: 20 }),
  });

  const activeDashboardId = selectedDashboardId || dashboardsQuery.data?.[0]?.id || "";

  const selectedDashboard = useMemo(
    () => (dashboardsQuery.data ?? []).find((item) => item.id === activeDashboardId) ?? null,
    [activeDashboardId, dashboardsQuery.data]
  );

  const previewMutation = useMutation({
    mutationFn: () => chartService.previewChart(definition),
    onSuccess: (result) => {
      setPreviewRows(result.rows);
      toast({
        title: "Preview generated",
        description: `${result.rows.length} rows loaded from ${isRealApiMode ? "real API" : "mock service"}.`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({ title: "Preview failed", description: displayError(error, "Unable to preview chart."), variant: "destructive" });
    },
  });

  const upsertChartMutation = useMutation({
    mutationFn: () => {
      const payload = {
        name: `${toOptionLabel(datasetId)} ${toOptionLabel(chartType)} Chart`,
        description: `${metricType} of ${metricField || metricAlias}`,
        definition,
        tags: [datasetId, chartType, metricType],
        shareScope: "org_members" as const,
      };
      return editingChartId ? chartService.updateChart(editingChartId, payload) : chartService.saveChart(payload);
    },
    onSuccess: (saved) => {
      setEditingChartId(null);
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: editingChartId ? "Chart updated" : "Chart saved", description: saved.name, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Save failed", description: displayError(error, "Unable to save chart."), variant: "destructive" });
    },
  });

  const deleteChartMutation = useMutation({
    mutationFn: (chartId: string) => chartService.deleteChart(chartId),
    onSuccess: () => {
      setEditingChartId(null);
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: "Chart deleted", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Delete failed", description: displayError(error, "Unable to delete chart."), variant: "destructive" });
    },
  });

  const exportMutation = useMutation({
    mutationFn: async (payload: { chartId: string; format: "csv" | "json" }) => {
      const result = await chartService.exportChart(payload.chartId, { format: payload.format });
      download(result.downloadUrl, result.filename);
      return result;
    },
    onSuccess: (result) => {
      toast({ title: "Export ready", description: result.filename, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Export failed", description: displayError(error, "Unable to export chart."), variant: "destructive" });
    },
  });

  const createDashboardMutation = useMutation({
    mutationFn: () =>
      chartService.createDashboard({
        name: dashboardName || `${workspaceLabel} Dashboard`,
        description: dashboardDescription || undefined,
        tags: [workspaceLabel.toLowerCase(), "dashboard"],
        shareScope: "org_members",
      }),
    onSuccess: (dashboard) => {
      setDashboardName("");
      setDashboardDescription("");
      setSelectedDashboardId(dashboard.id);
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: "Dashboard created", description: dashboard.name, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Dashboard failed", description: displayError(error, "Unable to create dashboard."), variant: "destructive" });
    },
  });

  const deleteDashboardMutation = useMutation({
    mutationFn: (dashboardId: string) => chartService.deleteDashboard(dashboardId),
    onSuccess: () => {
      setSelectedDashboardId("");
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: "Dashboard deleted", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Delete failed", description: displayError(error, "Unable to delete dashboard."), variant: "destructive" });
    },
  });

  const attachMutation = useMutation({
    mutationFn: ({ dashboardId, chartId }: { dashboardId: string; chartId: string }) =>
      chartService.attachChartToDashboard(dashboardId, {
        chartId,
        position: { col: 0, row: (selectedDashboard?.charts.length ?? 0) * 4 },
        size: { w: 6, h: 4 },
      }),
    onSuccess: () => {
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: "Chart attached", variant: "success" });
    },
  });

  const removeMutation = useMutation({
    mutationFn: ({ dashboardId, chartId }: { dashboardId: string; chartId: string }) =>
      chartService.removeChartFromDashboard(dashboardId, chartId),
    onSuccess: () => {
      void invalidateAnalyticsMutation(queryClient);
      toast({ title: "Chart removed", variant: "success" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: ({ dashboardId, orderedChartIds }: { dashboardId: string; orderedChartIds: string[] }) =>
      chartService.reorderDashboardCharts(dashboardId, orderedChartIds),
    onSuccess: () => {
      void invalidateAnalyticsMutation(queryClient);
    },
  });

  const reportMutation = useMutation({
    mutationFn: () =>
      chartService.generateReport({
        dashboardId: activeDashboardId || undefined,
        format: reportFormat,
        filename: `analytics-report.${reportFormat}`,
      }),
    onSuccess: (report) => {
      download(report.downloadUrl, report.filename);
      toast({ title: "Report exported", description: report.filename, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Report failed", description: displayError(error, "Unable to export report."), variant: "destructive" });
    },
  });

  const preview = useMemo(
    () => resolveRows(previewRows, dimensionAlias || dimensionType, metricAlias || metricField),
    [dimensionAlias, dimensionType, metricAlias, metricField, previewRows]
  );

  const editChart = (chart: SavedChart) => {
    const metric = chart.definition.metrics?.[0];
    const dimension = chart.definition.dimensions?.[0];
    setEditingChartId(chart.id);
    setDatasetId((chart.definition.datasetId as ChartDatasetId) ?? "platform_health");
    setMetricType((metric?.type as ChartMetricType) ?? "count");
    setMetricField(metric?.field ?? "records");
    setMetricAlias(metric?.alias ?? "value");
    setDimensionType((dimension?.type as ChartDimensionType) ?? "date_month");
    setDimensionAlias(dimension?.alias ?? "period");
    setChartType((chart.definition.chartType as SupportedChartType) ?? "line");
  };

  const moveChart = (chartId: string, direction: -1 | 1) => {
    if (!selectedDashboard) return;
    const ids = selectedDashboard.charts.map((item) => item.chartId);
    const index = ids.findIndex((id) => id === chartId);
    const next = index + direction;
    if (index < 0 || next < 0 || next >= ids.length) return;
    const [picked] = ids.splice(index, 1);
    ids.splice(next, 0, picked);
    reorderMutation.mutate({ dashboardId: selectedDashboard.id, orderedChartIds: ids });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Studio Workbench</CardTitle>
        <CardDescription>
          Chart edit/delete, dashboard attach/reorder, and report export are wired to typed adapters.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="builder" className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="builder">Builder</TabsTrigger>
            <TabsTrigger value="dashboards">Dashboards</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-4">
            <div className="grid gap-2 md:grid-cols-4">
              <Select value={datasetId} onValueChange={(value) => setDatasetId(value as ChartDatasetId)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHART_DATASETS.map((item) => <SelectItem key={item} value={item}>{toOptionLabel(item)}</SelectItem>)}</SelectContent>
              </Select>
              <Select value={metricType} onValueChange={(value) => setMetricType(value as ChartMetricType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHART_METRIC_TYPES.map((item) => <SelectItem key={item} value={item}>{toOptionLabel(item)}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={metricField} onChange={(event) => setMetricField(event.target.value)} placeholder="Metric field" />
              <Input value={metricAlias} onChange={(event) => setMetricAlias(event.target.value)} placeholder="Metric alias" />
              <Select value={dimensionType} onValueChange={(value) => setDimensionType(value as ChartDimensionType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHART_DIMENSION_TYPES.map((item) => <SelectItem key={item} value={item}>{toOptionLabel(item)}</SelectItem>)}</SelectContent>
              </Select>
              <Input value={dimensionAlias} onChange={(event) => setDimensionAlias(event.target.value)} placeholder="Dimension alias" />
              <Select value={chartType} onValueChange={(value) => setChartType(value as SupportedChartType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{CHART_TYPES.map((item) => <SelectItem key={item} value={item}>{toOptionLabel(item)}</SelectItem>)}</SelectContent>
              </Select>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => previewMutation.mutate()} loading={previewMutation.isPending}>Preview</Button>
                <Button className="flex-1" variant="outline" onClick={() => upsertChartMutation.mutate()} loading={upsertChartMutation.isPending} disabled={!canSave}>
                  {editingChartId ? "Update" : "Save"}
                </Button>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span>Preview</span>
                  <Badge variant={isRealApiMode ? "success" : "outline"}>{isRealApiMode ? "Real API" : "Mock"}</Badge>
                </div>
                <div className="h-[300px]">
                  {preview.rows.length === 0 ? (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">Run preview first.</div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      {chartType === "pie" || chartType === "donut" ? (
                        <PieChart>
                          <Pie data={preview.rows} dataKey={preview.metricKey} nameKey={preview.dimensionKey} innerRadius={chartType === "donut" ? 56 : 0} outerRadius={100}>
                            {preview.rows.map((row, index) => <Cell key={`${row[preview.dimensionKey]}-${index}`} fill={chartSeriesPalette[index % chartSeriesPalette.length]} />)}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      ) : chartType === "bar" || chartType === "stacked_bar" ? (
                        <BarChart data={preview.rows}>
                          <CartesianGrid stroke="hsl(var(--border) / 0.4)" />
                          <XAxis dataKey={preview.dimensionKey} />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey={preview.metricKey} fill={chartSeriesPalette[0]} radius={[8, 8, 0, 0]} />
                        </BarChart>
                      ) : (
                        <LineChart data={preview.rows}>
                          <CartesianGrid stroke="hsl(var(--border) / 0.4)" />
                          <XAxis dataKey={preview.dimensionKey} />
                          <YAxis />
                          <Tooltip />
                          <Line dataKey={preview.metricKey} stroke={chartSeriesPalette[0]} dot={false} />
                        </LineChart>
                      )}
                    </ResponsiveContainer>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 text-sm font-medium">Saved Charts</div>
                {chartsQuery.isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : chartsQuery.error ? (
                  <div className="space-y-2">
                    <div className="text-sm text-destructive">{displayError(chartsQuery.error, "Unable to load charts.")}</div>
                    <Button size="sm" variant="outline" onClick={() => chartsQuery.refetch()}>Retry</Button>
                  </div>
                ) : (chartsQuery.data ?? []).length === 0 ? (
                  <EmptyState compact title="No charts" description="Save a chart to begin." />
                ) : (
                  <div className="space-y-2">
                    {(chartsQuery.data ?? []).map((chart) => (
                      <div key={chart.id} className="rounded-xl border border-border/60 bg-card/60 p-2">
                        <div className="text-sm font-medium">{chart.name}</div>
                        <div className="mb-2 text-xs text-muted-foreground">{chart.definition.datasetId}</div>
                        <div className="flex flex-wrap gap-1">
                          <Button size="sm" variant="outline" onClick={() => editChart(chart)}><Pencil className="mr-1 h-3.5 w-3.5" />Edit</Button>
                          <Button size="sm" variant="outline" className="text-destructive" onClick={() => deleteChartMutation.mutate(chart.id)}><Trash2 className="mr-1 h-3.5 w-3.5" />Delete</Button>
                          {canExport && <Button size="sm" variant="outline" onClick={() => exportMutation.mutate({ chartId: chart.id, format: "csv" })}>CSV</Button>}
                          {canExport && <Button size="sm" variant="outline" onClick={() => exportMutation.mutate({ chartId: chart.id, format: "json" })}>JSON</Button>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="dashboards" className="space-y-4">
            <div className="grid gap-4 xl:grid-cols-2">
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 text-sm font-medium">Create Dashboard</div>
                <div className="space-y-2">
                  <Input value={dashboardName} onChange={(event) => setDashboardName(event.target.value)} placeholder="Dashboard name" />
                  <Input value={dashboardDescription} onChange={(event) => setDashboardDescription(event.target.value)} placeholder="Description" />
                  <Button onClick={() => createDashboardMutation.mutate()} loading={createDashboardMutation.isPending} disabled={!canSave}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 text-sm font-medium">Select Dashboard</div>
                {(dashboardsQuery.data ?? []).length === 0 ? (
                  <EmptyState compact title="No dashboards" description="Create one first." />
                ) : (
                  <div className="space-y-2">
                    <Select value={activeDashboardId} onValueChange={setSelectedDashboardId}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>{(dashboardsQuery.data ?? []).map((dashboard) => <SelectItem key={dashboard.id} value={dashboard.id}>{dashboard.name}</SelectItem>)}</SelectContent>
                    </Select>
                    {selectedDashboard && (
                      <Button variant="outline" className="text-destructive" onClick={() => deleteDashboardMutation.mutate(selectedDashboard.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr]">
              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 text-sm font-medium">Attach Charts</div>
                {!selectedDashboard ? (
                  <EmptyState compact title="No dashboard selected" description="Select one to attach charts." />
                ) : (chartsQuery.data ?? []).length === 0 ? (
                  <EmptyState compact title="No charts available" description="Save charts from builder tab." />
                ) : (
                  <div className="space-y-2">
                    {(chartsQuery.data ?? []).map((chart) => {
                      const attached = selectedDashboard.charts.some((item) => item.chartId === chart.id);
                      return (
                        <div key={chart.id} className="flex items-center justify-between rounded-xl border border-border/60 p-2">
                          <div>
                            <p className="text-sm font-medium">{chart.name}</p>
                            <p className="text-xs text-muted-foreground">{chart.definition.datasetId}</p>
                          </div>
                          <Button size="sm" variant="outline" disabled={attached} onClick={() => attachMutation.mutate({ dashboardId: selectedDashboard.id, chartId: chart.id })}>
                            {attached ? "Attached" : "Attach"}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
                <div className="mb-2 text-sm font-medium">Attached & Ordered</div>
                {!selectedDashboard || selectedDashboard.charts.length === 0 ? (
                  <EmptyState compact title="No attached charts" description="Attach charts to manage order." />
                ) : (
                  <div className="space-y-2">
                    {selectedDashboard.charts.map((item, index) => (
                      <div key={`${item.chartId}-${index}`} className="flex items-center justify-between rounded-xl border border-border/60 p-2">
                        <div className="text-sm">{item.chartName ?? item.chartId}</div>
                        <div className="flex items-center gap-1">
                          <Button size="icon" variant="outline" onClick={() => moveChart(item.chartId, -1)} disabled={index === 0}><ArrowUp className="h-4 w-4" /></Button>
                          <Button size="icon" variant="outline" onClick={() => moveChart(item.chartId, 1)} disabled={index === selectedDashboard.charts.length - 1}><ArrowDown className="h-4 w-4" /></Button>
                          <Button size="icon" variant="outline" className="text-destructive" onClick={() => removeMutation.mutate({ dashboardId: selectedDashboard.id, chartId: item.chartId })}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="reports">
            <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
              <div className="grid gap-3 md:grid-cols-3">
                <div className="space-y-1.5">
                  <Label>Dashboard</Label>
                  <Select value={activeDashboardId} onValueChange={setSelectedDashboardId}>
                    <SelectTrigger><SelectValue placeholder="Optional scope" /></SelectTrigger>
                    <SelectContent>{(dashboardsQuery.data ?? []).map((dashboard) => <SelectItem key={dashboard.id} value={dashboard.id}>{dashboard.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label>Format</Label>
                  <Select value={reportFormat} onValueChange={(value) => setReportFormat(value as "csv" | "json" | "pdf")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV</SelectItem>
                      <SelectItem value="json">JSON</SelectItem>
                      <SelectItem value="pdf">PDF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={() => reportMutation.mutate()} loading={reportMutation.isPending} disabled={!canExport}>Generate & Export</Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
