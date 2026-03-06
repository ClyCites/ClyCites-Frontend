import { entityServices } from "@/lib/api/mock/entities";
import type {
  ChartExportResult,
  ChartDefinition,
  ChartPreviewResult,
  ChartServiceContract,
  DashboardSharingUpdateRequest,
  DashboardChartItem,
  GenerateReportRequest,
  SaveChartRequest,
  SaveDashboardRequest,
  SavedChart,
  SavedDashboard,
} from "@/lib/api/contracts";

const DEFAULT_ACTOR_ID = "usr-ops";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeChart(record: Awaited<ReturnType<typeof entityServices.charts.createX>>): SavedChart {
  const data = record.data as Record<string, unknown>;
  return {
    id: record.id,
    name: record.title,
    description: record.subtitle,
    definition: (data.definition as ChartDefinition) ?? {
      datasetId: "platform_health",
      metrics: [{ type: "count" }],
      chartType: "line",
    },
    tags: record.tags,
    shareScope: String(data.shareScope ?? "owner_only"),
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function normalizeDashboardChartItem(payload: unknown, index: number): DashboardChartItem {
  const record = asRecord(payload) ?? {};
  const position = asRecord(record.position);
  const size = asRecord(record.size);

  return {
    chartId: String(record.chartId ?? record.id ?? `chart-${index + 1}`),
    chartName: typeof record.chartName === "string" ? record.chartName : undefined,
    position: {
      col: Number(position?.col ?? 0),
      row: Number(position?.row ?? index * 4),
    },
    size: {
      w: Number(size?.w ?? 6),
      h: Number(size?.h ?? 4),
    },
  };
}

function normalizeDashboard(record: Awaited<ReturnType<typeof entityServices.dashboards.createX>>): SavedDashboard {
  const data = record.data as Record<string, unknown>;
  const chartItems = Array.isArray(data.chartItems)
    ? data.chartItems.map((item, index) => normalizeDashboardChartItem(item, index))
    : [];

  return {
    id: record.id,
    name: record.title,
    description: record.subtitle,
    tags: record.tags,
    shareScope: String(data.shareScope ?? "org_members"),
    charts: chartItems,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

async function getDashboardOrThrow(dashboardId: string) {
  const record = await entityServices.dashboards.getX(dashboardId);
  return normalizeDashboard(record as Awaited<ReturnType<typeof entityServices.dashboards.createX>>);
}

async function updateDashboardCharts(dashboardId: string, charts: DashboardChartItem[]): Promise<SavedDashboard> {
  const current = await entityServices.dashboards.getX(dashboardId);
  const updated = await entityServices.dashboards.updateX(dashboardId, {
    actorId: DEFAULT_ACTOR_ID,
    title: current.title,
    subtitle: current.subtitle,
    tags: current.tags,
    data: {
      ...current.data,
      chartItems: charts,
    },
  });

  return normalizeDashboard(updated as Awaited<ReturnType<typeof entityServices.dashboards.createX>>);
}

function createBlobFromContent(content: string, format: ChartExportResult["format"], filename: string): ChartExportResult {
  const mimeByFormat: Record<ChartExportResult["format"], string> = {
    csv: "text/csv;charset=utf-8",
    json: "application/json;charset=utf-8",
    pdf: "application/pdf",
  };

  const blob = new Blob([content], { type: mimeByFormat[format] });
  return {
    downloadUrl: URL.createObjectURL(blob),
    filename,
    format,
  };
}

export const chartService: ChartServiceContract = {
  async previewChart(definition: ChartDefinition): Promise<ChartPreviewResult> {
    const dimensions = definition.dimensions?.[0]?.type ?? "period";
    const metricAlias = definition.metrics?.[0]?.alias ?? definition.metrics?.[0]?.field ?? "value";

    const rows = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((period, index) => ({
      [dimensions]: period,
      [metricAlias]: Math.max(4, 12 + index * 5 + (index % 2 === 0 ? 3 : -2)),
      datasetId: definition.datasetId,
    }));

    return {
      rows,
      raw: {
        mode: "mock",
        definition,
      },
    };
  },

  async saveChart(payload: SaveChartRequest): Promise<SavedChart> {
    const created = await entityServices.charts.createX({
      actorId: DEFAULT_ACTOR_ID,
      title: payload.name,
      subtitle: payload.description,
      tags: payload.tags ?? ["chart", "saved"],
      data: {
        definition: payload.definition,
        shareScope: payload.shareScope ?? "owner_only",
      },
    });

    return normalizeChart(created);
  },

  async exportPreview(definition, options): Promise<ChartExportResult> {
    const format = options?.format ?? "csv";
    const filename = options?.filename?.trim() || `preview-${definition.datasetId}.${format}`;
    const dimensions = definition.dimensions?.[0]?.type ?? "period";
    const metricAlias = definition.metrics?.[0]?.alias ?? definition.metrics?.[0]?.field ?? "value";
    const rows = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((period, index) => ({
      [dimensions]: period,
      [metricAlias]: Math.max(4, 12 + index * 5 + (index % 2 === 0 ? 3 : -2)),
      datasetId: definition.datasetId,
    }));
    const content =
      format === "csv"
        ? [
            Object.keys(rows[0] ?? {}).join(","),
            ...rows.map((row) =>
              Object.values(row)
                .map((value) => JSON.stringify(value ?? ""))
                .join(",")
            ),
          ].join("\n")
        : JSON.stringify({ definition, rows }, null, 2);
    return createBlobFromContent(content, format, filename);
  },

  async updateChart(chartId, payload): Promise<SavedChart> {
    const current = await entityServices.charts.getX(chartId);
    const updated = await entityServices.charts.updateX(chartId, {
      actorId: DEFAULT_ACTOR_ID,
      title: payload.name ?? current.title,
      subtitle: payload.description ?? current.subtitle,
      tags: payload.tags ?? current.tags,
      data: {
        ...current.data,
        definition: payload.definition ?? current.data.definition,
        shareScope: payload.shareScope ?? current.data.shareScope ?? "owner_only",
      },
    });
    return normalizeChart(updated as Awaited<ReturnType<typeof entityServices.charts.createX>>);
  },

  async deleteChart(chartId): Promise<void> {
    await entityServices.charts.deleteX(chartId, DEFAULT_ACTOR_ID);
  },

  async listCharts(params?: { page?: number; limit?: number; dataset?: string; tags?: string }): Promise<SavedChart[]> {
    const response = await entityServices.charts.listX({
      pagination: {
        page: params?.page ?? 1,
        pageSize: params?.limit ?? 25,
      },
      filters: {
        text: params?.dataset,
        tags: params?.tags ? params.tags.split(",").map((item) => item.trim()).filter(Boolean) : undefined,
      },
      sort: {
        field: "updatedAt",
        direction: "desc",
      },
    });

    return response.items.map((item) => normalizeChart(item as Awaited<ReturnType<typeof entityServices.charts.createX>>));
  },

  async exportChart(chartId, options): Promise<ChartExportResult> {
    const format = options?.format ?? "csv";
    const filename = options?.filename?.trim() || `chart-${chartId}.${format}`;

    const content =
      format === "csv"
        ? "dimension,value\nJan,120\nFeb,132\nMar,141\nApr,150\n"
        : JSON.stringify(
            {
              chartId,
              rows: [
                { dimension: "Jan", value: 120 },
                { dimension: "Feb", value: 132 },
                { dimension: "Mar", value: 141 },
                { dimension: "Apr", value: 150 },
              ],
            },
            null,
            2
          );

    return createBlobFromContent(content, format, filename);
  },

  async listDashboards(params): Promise<SavedDashboard[]> {
    const response = await entityServices.dashboards.listX({
      pagination: {
        page: params?.page ?? 1,
        pageSize: params?.limit ?? 25,
      },
      sort: {
        field: "updatedAt",
        direction: "desc",
      },
    });

    return response.items.map((item) => normalizeDashboard(item as Awaited<ReturnType<typeof entityServices.dashboards.createX>>));
  },

  async createDashboard(payload: SaveDashboardRequest): Promise<SavedDashboard> {
    const created = await entityServices.dashboards.createX({
      actorId: DEFAULT_ACTOR_ID,
      title: payload.name,
      subtitle: payload.description,
      tags: payload.tags ?? ["dashboard"],
      data: {
        shareScope: payload.shareScope ?? "org_members",
        chartItems: [],
      },
    });

    return normalizeDashboard(created);
  },

  async updateDashboardSharing(dashboardId: string, payload: DashboardSharingUpdateRequest): Promise<SavedDashboard> {
    const current = await entityServices.dashboards.getX(dashboardId);
    const updated = await entityServices.dashboards.updateX(dashboardId, {
      actorId: DEFAULT_ACTOR_ID,
      title: current.title,
      subtitle: current.subtitle,
      tags: current.tags,
      data: {
        ...current.data,
        shareScope: payload.scope,
        shareRoles: payload.roles ?? [],
        shareUserIds: payload.userIds ?? [],
      },
    });
    return normalizeDashboard(updated as Awaited<ReturnType<typeof entityServices.dashboards.createX>>);
  },

  async deleteDashboard(dashboardId): Promise<void> {
    await entityServices.dashboards.deleteX(dashboardId, DEFAULT_ACTOR_ID);
  },

  async attachChartToDashboard(dashboardId, payload): Promise<SavedDashboard> {
    const current = await getDashboardOrThrow(dashboardId);
    const existing = current.charts.find((item) => item.chartId === payload.chartId);
    if (existing) {
      return current;
    }

    return updateDashboardCharts(dashboardId, [
      ...current.charts,
      {
        chartId: payload.chartId,
        position: payload.position ?? { col: 0, row: current.charts.length * 4 },
        size: payload.size ?? { w: 6, h: 4 },
      },
    ]);
  },

  async removeChartFromDashboard(dashboardId, chartId): Promise<SavedDashboard> {
    const current = await getDashboardOrThrow(dashboardId);
    return updateDashboardCharts(
      dashboardId,
      current.charts.filter((item) => item.chartId !== chartId)
    );
  },

  async reorderDashboardCharts(dashboardId, orderedChartIds): Promise<SavedDashboard> {
    const current = await getDashboardOrThrow(dashboardId);
    const byId = new Map(current.charts.map((item) => [item.chartId, item]));
    const reordered = orderedChartIds
      .map((chartId, index) => {
        const existing = byId.get(chartId);
        if (!existing) return null;
        return {
          ...existing,
          position: {
            col: existing.position.col,
            row: index * Math.max(1, existing.size.h),
          },
        };
      })
      .filter((item): item is DashboardChartItem => Boolean(item));

    return updateDashboardCharts(dashboardId, reordered);
  },

  async generateReport(payload: GenerateReportRequest): Promise<ChartExportResult> {
    const format = payload.format ?? "csv";
    const filename = payload.filename?.trim() || `analytics-report-${Date.now()}.${format}`;
    const dashboardId = payload.dashboardId ?? "all";
    const reportBody =
      format === "csv"
        ? `dashboard,metric,value\n${dashboardId},records,324\n${dashboardId},alerts,12\n`
        : JSON.stringify(
            {
              dashboardId,
              generatedAt: new Date().toISOString(),
              summary: {
                records: 324,
                alerts: 12,
              },
              filters: payload.filters ?? {},
            },
            null,
            2
          );

    if (format === "pdf") {
      return createBlobFromContent(
        `Mock PDF report for dashboard ${dashboardId}\nGenerated at ${new Date().toISOString()}`,
        format,
        filename
      );
    }

    return createBlobFromContent(reportBody, format, filename);
  },
};
