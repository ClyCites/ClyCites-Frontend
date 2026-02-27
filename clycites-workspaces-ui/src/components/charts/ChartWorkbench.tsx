"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
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
import { chartService, isRealApiMode } from "@/lib/api";
import type { ChartDefinition } from "@/lib/api/contracts";
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
import { chartSeriesPalette } from "@/styles/design-system";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/components/ui/use-toast";

interface ChartWorkbenchProps {
  workspaceLabel: string;
  canSave?: boolean;
  canExport?: boolean;
}

function numberValue(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function stringValue(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

function resolveChartKeys(
  rows: Array<Record<string, unknown>>,
  preferredDimension: string,
  preferredMetric: string
): { dimensionKey: string; metricKey: string; normalizedRows: Array<Record<string, unknown>> } {
  if (rows.length === 0) {
    return {
      dimensionKey: "dimension",
      metricKey: "value",
      normalizedRows: [],
    };
  }

  const firstRow = rows[0];
  const keys = Object.keys(firstRow);
  const numericKeys = keys.filter((key) => typeof firstRow[key] === "number");
  const nonNumericKeys = keys.filter((key) => !numericKeys.includes(key));

  const metricKey =
    (preferredMetric && keys.includes(preferredMetric) ? preferredMetric : "") ||
    (numericKeys.length > 0 ? numericKeys[0] : keys[0] ?? "value");
  const dimensionKey =
    (preferredDimension && keys.includes(preferredDimension) ? preferredDimension : "") ||
    (nonNumericKeys.length > 0 ? nonNumericKeys[0] : keys.find((key) => key !== metricKey) ?? "dimension");

  const normalizedRows = rows.map((row, index) => ({
    ...row,
    [dimensionKey]: stringValue(row[dimensionKey] ?? `Row ${index + 1}`),
    [metricKey]: numberValue(row[metricKey]),
  }));

  return {
    dimensionKey,
    metricKey,
    normalizedRows,
  };
}

export function ChartWorkbench({ workspaceLabel, canSave = true, canExport = true }: ChartWorkbenchProps) {
  const queryClient = useQueryClient();
  const palette = chartSeriesPalette;

  const [datasetId, setDatasetId] = useState<ChartDatasetId>("platform_health");
  const [metricType, setMetricType] = useState<ChartMetricType>("count");
  const [metricField, setMetricField] = useState("records");
  const [metricAlias, setMetricAlias] = useState("value");
  const [dimensionType, setDimensionType] = useState<ChartDimensionType>("date_month");
  const [dimensionAlias, setDimensionAlias] = useState("period");
  const [chartType, setChartType] = useState<SupportedChartType>("line");
  const [previewRows, setPreviewRows] = useState<Array<Record<string, unknown>>>([]);

  const definition = useMemo<ChartDefinition>(
    () => ({
      datasetId,
      chartType,
      metrics: [
        {
          type: metricType,
          field: metricField || undefined,
          alias: metricAlias || undefined,
        },
      ],
      dimensions: [
        {
          type: dimensionType,
          alias: dimensionAlias || undefined,
        },
      ],
      vizOptions: {
        showLegend: true,
        title: `${workspaceLabel} Dataflow`,
        colorScheme: "green",
      },
    }),
    [chartType, datasetId, dimensionAlias, dimensionType, metricAlias, metricField, metricType, workspaceLabel]
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
      toast({
        title: "Preview failed",
        description: error instanceof Error ? error.message : "Unable to preview chart query.",
        variant: "destructive",
      });
    },
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      chartService.saveChart({
        name: `${toOptionLabel(datasetId)} ${toOptionLabel(chartType)} Chart`,
        description: `${metricType} of ${metricField || metricAlias}`,
        definition,
        tags: [datasetId, chartType, metricType],
        shareScope: "org_members",
      }),
    onSuccess: (saved) => {
      queryClient.invalidateQueries({ queryKey: ["analytics", "saved-charts"] });
      toast({
        title: "Chart saved",
        description: `Saved chart "${saved.name}".`,
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

  const exportMutation = useMutation({
    mutationFn: async ({ chartId, format }: { chartId: string; format: "csv" | "json" }) => {
      const exported = await chartService.exportChart(chartId, { format });
      const anchor = document.createElement("a");
      anchor.href = exported.downloadUrl;
      anchor.download = exported.filename;
      anchor.click();
      window.setTimeout(() => URL.revokeObjectURL(exported.downloadUrl), 2_000);
      return exported;
    },
    onSuccess: (result) => {
      toast({
        title: "Export ready",
        description: `Downloaded ${result.filename}`,
        variant: "success",
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Unable to export chart.",
        variant: "destructive",
      });
    },
  });

  const savedChartsQuery = useQuery({
    queryKey: ["analytics", "saved-charts", datasetId],
    queryFn: () => chartService.listCharts({ page: 1, limit: 8, dataset: datasetId }),
  });

  const resolved = useMemo(
    () => resolveChartKeys(previewRows, dimensionAlias || dimensionType, metricAlias || metricField),
    [dimensionAlias, dimensionType, metricAlias, metricField, previewRows]
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Workbench</CardTitle>
        <CardDescription>
          Build a query-backed chart, preview live rows, and save reusable charts.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div className="space-y-1.5">
            <Label>Dataset</Label>
            <Select value={datasetId} onValueChange={(value) => setDatasetId(value as ChartDatasetId)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_DATASETS.map((item) => (
                  <SelectItem key={item} value={item}>
                    {toOptionLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Metric Type</Label>
            <Select value={metricType} onValueChange={(value) => setMetricType(value as ChartMetricType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_METRIC_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {toOptionLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Metric Field</Label>
            <Input value={metricField} onChange={(event) => setMetricField(event.target.value)} placeholder="totalAmount" />
          </div>

          <div className="space-y-1.5">
            <Label>Metric Alias</Label>
            <Input value={metricAlias} onChange={(event) => setMetricAlias(event.target.value)} placeholder="value" />
          </div>

          <div className="space-y-1.5">
            <Label>Dimension</Label>
            <Select value={dimensionType} onValueChange={(value) => setDimensionType(value as ChartDimensionType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_DIMENSION_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {toOptionLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label>Dimension Alias</Label>
            <Input value={dimensionAlias} onChange={(event) => setDimensionAlias(event.target.value)} placeholder="period" />
          </div>

          <div className="space-y-1.5">
            <Label>Chart Type</Label>
            <Select value={chartType} onValueChange={(value) => setChartType(value as SupportedChartType)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHART_TYPES.map((item) => (
                  <SelectItem key={item} value={item}>
                    {toOptionLabel(item)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end gap-2">
            <Button className="flex-1" onClick={() => previewMutation.mutate()} loading={previewMutation.isPending}>
              Preview
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => saveMutation.mutate()}
              loading={saveMutation.isPending}
              disabled={!canSave}
            >
              Save
            </Button>
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-[2fr_1fr]">
          <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="text-sm font-medium">Chart Preview</div>
              <Badge variant={isRealApiMode ? "success" : "outline"}>
                {isRealApiMode ? "Real API" : "Mock Service"}
              </Badge>
            </div>
            <div className="h-[320px]">
              {resolved.normalizedRows.length === 0 ? (
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Run preview to render chart data.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  {chartType === "bar" || chartType === "stacked_bar" ? (
                    <BarChart data={resolved.normalizedRows} margin={{ top: 10, right: 10, left: -8, bottom: 10 }}>
                      <CartesianGrid stroke="hsl(var(--border) / 0.4)" vertical={false} />
                      <XAxis dataKey={resolved.dimensionKey} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Bar dataKey={resolved.metricKey} fill={palette[0]} radius={[8, 8, 0, 0]} />
                    </BarChart>
                  ) : chartType === "area" ? (
                    <AreaChart data={resolved.normalizedRows} margin={{ top: 10, right: 10, left: -8, bottom: 10 }}>
                      <CartesianGrid stroke="hsl(var(--border) / 0.4)" />
                      <XAxis dataKey={resolved.dimensionKey} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey={resolved.metricKey}
                        stroke={palette[0]}
                        fill={palette[0]}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : chartType === "pie" || chartType === "donut" ? (
                    <PieChart>
                      <Pie
                        data={resolved.normalizedRows}
                        dataKey={resolved.metricKey}
                        nameKey={resolved.dimensionKey}
                        innerRadius={chartType === "donut" ? 56 : 0}
                        outerRadius={100}
                      >
                        {resolved.normalizedRows.map((row, index) => (
                          <Cell key={`${row[resolved.dimensionKey]}-${index}`} fill={palette[index % palette.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  ) : (
                    <LineChart data={resolved.normalizedRows} margin={{ top: 10, right: 10, left: -8, bottom: 10 }}>
                      <CartesianGrid stroke="hsl(var(--border) / 0.4)" />
                      <XAxis dataKey={resolved.dimensionKey} tickLine={false} axisLine={false} />
                      <YAxis tickLine={false} axisLine={false} />
                      <Tooltip />
                      <Line type="monotone" dataKey={resolved.metricKey} stroke={palette[0]} strokeWidth={2.5} dot={false} />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
            <div className="mb-2 text-sm font-medium">Saved Charts</div>
            <div className="space-y-2">
              {(savedChartsQuery.data ?? []).slice(0, 6).map((chart) => (
                <div key={chart.id} className="rounded-xl border border-border/60 bg-card/60 p-2">
                  <div className="line-clamp-1 text-sm font-medium">{chart.name}</div>
                  <div className="line-clamp-1 text-xs text-muted-foreground">
                    {chart.definition.datasetId} • {chart.shareScope}
                  </div>
                  {canExport && (
                    <div className="mt-2 flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={exportMutation.isPending}
                        onClick={() => exportMutation.mutate({ chartId: chart.id, format: "csv" })}
                      >
                        Export CSV
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={exportMutation.isPending}
                        onClick={() => exportMutation.mutate({ chartId: chart.id, format: "json" })}
                      >
                        Export JSON
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {!savedChartsQuery.isLoading && (savedChartsQuery.data ?? []).length === 0 && (
                <div className="text-xs text-muted-foreground">No saved charts yet.</div>
              )}
            </div>
          </div>
        </div>

        {resolved.normalizedRows.length > 0 && (
          <div className="rounded-2xl border border-border/60 bg-background/50 p-3">
            <div className="mb-2 text-sm font-medium">Preview Rows</div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{resolved.dimensionKey}</TableHead>
                  <TableHead className="text-right">{resolved.metricKey}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {resolved.normalizedRows.slice(0, 6).map((row, index) => (
                  <TableRow key={`${row[resolved.dimensionKey]}-${index}`}>
                    <TableCell>{stringValue(row[resolved.dimensionKey])}</TableCell>
                    <TableCell className="text-right">{numberValue(row[resolved.metricKey]).toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
