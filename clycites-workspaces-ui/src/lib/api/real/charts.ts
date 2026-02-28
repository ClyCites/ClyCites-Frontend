import { chartService as mockChartService } from "@/lib/api/mock/charts";
import type {
  ChartExportResult,
  ChartPreviewResult,
  ChartServiceContract,
  DashboardChartItem,
  GenerateReportRequest,
  SaveChartRequest,
  SaveDashboardRequest,
  SavedChart,
  SavedDashboard,
} from "@/lib/api/contracts";
import { apiRequest, ApiRequestError, unwrapApiData } from "@/lib/api/real/http";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
}

function shouldFallback(error: unknown): boolean {
  if (!(error instanceof ApiRequestError)) return true;
  return error.status !== 401 && error.status !== 403;
}

async function withFallback<T>(remote: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await remote();
  } catch (error) {
    if (!shouldFallback(error)) throw error;
    return fallback();
  }
}

function extractPreviewRows(payload: unknown): Array<Record<string, unknown>> {
  const unwrapped = unwrapApiData<unknown>(payload);
  const root = asRecord(unwrapped) ?? {};
  const queryResult = asRecord(root.rows) ? root : asRecord(root.result) ?? root;

  const candidates = [
    Array.isArray(queryResult.rows) ? queryResult.rows : null,
    Array.isArray(root.items) ? root.items : null,
    Array.isArray(root.data) ? root.data : null,
    Array.isArray(root.results) ? root.results : null,
  ].filter((rows): rows is unknown[] => Array.isArray(rows));

  const first = candidates[0] ?? [];
  return first.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object");
}

function extractRows(payload: unknown): unknown[] {
  const unwrapped = unwrapApiData<unknown>(payload);
  const root = asRecord(unwrapped) ?? {};
  const candidates = [root.items, root.data, root.rows, root.results, root.charts, root.dashboards];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function normalizeSavedChart(payload: unknown): SavedChart {
  const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
  const definitionRaw = data.definition;

  return {
    id: String(data.id ?? data.chartId ?? `chart-${Date.now()}`),
    name: String(data.name ?? "Untitled Chart"),
    description: typeof data.description === "string" ? data.description : undefined,
    definition:
      definitionRaw && typeof definitionRaw === "object"
        ? (definitionRaw as SavedChart["definition"])
        : {
            datasetId: "platform_health",
            metrics: [{ type: "count" }],
            chartType: "line",
          },
    tags: asStringArray(data.tags),
    shareScope: String(data.shareScope ?? "owner_only"),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

function normalizeDashboardChartItem(payload: unknown, index: number): DashboardChartItem {
  const record = asRecord(payload) ?? {};
  const nestedChart = asRecord(record.chart);
  const position = asRecord(record.position);
  const size = asRecord(record.size);

  const width = Number(size?.w ?? size?.width ?? 6);
  const height = Number(size?.h ?? size?.height ?? 4);
  const col = Number(position?.col ?? position?.x ?? 0);
  const row = Number(position?.row ?? position?.y ?? index * 4);

  return {
    chartId: String(record.chartId ?? nestedChart?.id ?? record.id ?? `chart-${index + 1}`),
    chartName: typeof record.chartName === "string" ? record.chartName : typeof nestedChart?.name === "string" ? nestedChart.name : undefined,
    position: {
      col: Number.isFinite(col) ? Math.max(0, Math.min(11, Math.trunc(col))) : 0,
      row: Number.isFinite(row) ? Math.max(0, Math.trunc(row)) : index * 4,
    },
    size: {
      w: Number.isFinite(width) ? Math.max(1, Math.min(12, Math.trunc(width))) : 6,
      h: Number.isFinite(height) ? Math.max(1, Math.trunc(height)) : 4,
    },
  };
}

function normalizeDashboard(payload: unknown): SavedDashboard {
  const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
  const chartsRaw = Array.isArray(data.charts)
    ? data.charts
    : Array.isArray(data.items)
      ? data.items
      : [];

  return {
    id: String(data.id ?? data.dashboardId ?? `dashboard-${Date.now()}`),
    name: String(data.name ?? "Untitled Dashboard"),
    description: typeof data.description === "string" ? data.description : undefined,
    tags: asStringArray(data.tags),
    shareScope: String(data.shareScope ?? "org_members"),
    charts: chartsRaw.map((item, index) => normalizeDashboardChartItem(item, index)),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

async function fetchDashboard(dashboardId: string): Promise<SavedDashboard> {
  const payload = await apiRequest<unknown>(
    `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}`,
    { method: "GET" },
    { auth: true }
  );
  return normalizeDashboard(payload);
}

function createBlobFromPayload(payload: unknown, format: ChartExportResult["format"], filename: string): ChartExportResult {
  const mimeByFormat: Record<ChartExportResult["format"], string> = {
    csv: "text/csv;charset=utf-8",
    json: "application/json;charset=utf-8",
    pdf: "application/pdf",
  };

  const blob =
    typeof payload === "string"
      ? new Blob([payload], { type: mimeByFormat[format] })
      : new Blob([JSON.stringify(unwrapApiData<unknown>(payload), null, 2)], {
          type: "application/json;charset=utf-8",
        });

  return {
    downloadUrl: URL.createObjectURL(blob),
    filename,
    format,
  };
}

function queryFromObject(input: Record<string, unknown>): string {
  const query = new URLSearchParams();
  for (const [key, value] of Object.entries(input)) {
    if (value === null || value === undefined || value === "") continue;
    query.set(key, String(value));
  }
  return query.toString();
}

async function replaceDashboardCharts(dashboardId: string, items: DashboardChartItem[]): Promise<SavedDashboard> {
  const current = await fetchDashboard(dashboardId);
  for (const item of current.charts) {
    await apiRequest<unknown>(
      `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}/charts/${encodeURIComponent(item.chartId)}`,
      { method: "DELETE" },
      { auth: true }
    );
  }

  for (const item of items) {
    await apiRequest<unknown>(
      `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}/charts`,
      {
        method: "POST",
        body: JSON.stringify({
          chartId: item.chartId,
          position: item.position,
          size: item.size,
        }),
      },
      { auth: true }
    );
  }

  return fetchDashboard(dashboardId);
}

export const chartService: ChartServiceContract = {
  async previewChart(definition) {
    return withFallback(
      async () => {
        const payload = await apiRequest<unknown>(
          "/api/v1/analytics/charts/preview",
          {
            method: "POST",
            body: JSON.stringify(definition),
          },
          { auth: true }
        );

        return {
          rows: extractPreviewRows(payload),
          raw: unwrapApiData<unknown>(payload),
        } as ChartPreviewResult;
      },
      () => mockChartService.previewChart(definition)
    );
  },

  async saveChart(payload: SaveChartRequest) {
    return withFallback(
      async () => {
        const response = await apiRequest<unknown>(
          "/api/v1/analytics/charts",
          {
            method: "POST",
            body: JSON.stringify(payload),
          },
          { auth: true }
        );

        return normalizeSavedChart(response);
      },
      () => mockChartService.saveChart(payload)
    );
  },

  async updateChart(chartId, payload) {
    return withFallback(
      async () => {
        const response = await apiRequest<unknown>(
          `/api/v1/analytics/charts/${encodeURIComponent(chartId)}`,
          {
            method: "PUT",
            body: JSON.stringify(payload),
          },
          { auth: true }
        );
        return normalizeSavedChart({
          ...asRecord(unwrapApiData<unknown>(response)),
          id: chartId,
        });
      },
      () => mockChartService.updateChart(chartId, payload)
    );
  },

  async deleteChart(chartId) {
    return withFallback(
      async () => {
        await apiRequest<unknown>(
          `/api/v1/analytics/charts/${encodeURIComponent(chartId)}`,
          { method: "DELETE" },
          { auth: true }
        );
      },
      () => mockChartService.deleteChart(chartId)
    );
  },

  async listCharts(params) {
    return withFallback(
      async () => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        if (params?.dataset) query.set("dataset", params.dataset);
        if (params?.tags) query.set("tags", params.tags);

        const response = await apiRequest<unknown>(
          `/api/v1/analytics/charts${query.size > 0 ? `?${query.toString()}` : ""}`,
          { method: "GET" },
          { auth: true }
        );

        return extractRows(response).map((item) => normalizeSavedChart(item));
      },
      () => mockChartService.listCharts(params)
    );
  },

  async exportChart(chartId, options) {
    return withFallback(
      async () => {
        const format = options?.format ?? "csv";
        const filename = options?.filename?.trim() || `chart-${chartId}.${format}`;
        const payload = await apiRequest<unknown>(
          `/api/v1/analytics/charts/${encodeURIComponent(chartId)}/export`,
          {
            method: "POST",
            body: JSON.stringify({
              format,
              filename,
            }),
          },
          { auth: true }
        );

        return createBlobFromPayload(payload, format, filename);
      },
      () => mockChartService.exportChart(chartId, options)
    );
  },

  async listDashboards(params) {
    return withFallback(
      async () => {
        const query = new URLSearchParams();
        if (params?.page) query.set("page", String(params.page));
        if (params?.limit) query.set("limit", String(params.limit));
        const response = await apiRequest<unknown>(
          `/api/v1/analytics/dashboards${query.size > 0 ? `?${query.toString()}` : ""}`,
          { method: "GET" },
          { auth: true }
        );
        return extractRows(response).map((item) => normalizeDashboard(item));
      },
      () => mockChartService.listDashboards(params)
    );
  },

  async createDashboard(payload: SaveDashboardRequest) {
    return withFallback(
      async () => {
        const response = await apiRequest<unknown>(
          "/api/v1/analytics/dashboards",
          {
            method: "POST",
            body: JSON.stringify({
              ...payload,
              isDefault: false,
            }),
          },
          { auth: true }
        );
        return normalizeDashboard(response);
      },
      () => mockChartService.createDashboard(payload)
    );
  },

  async deleteDashboard(dashboardId) {
    return withFallback(
      async () => {
        await apiRequest<unknown>(
          `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}`,
          { method: "DELETE" },
          { auth: true }
        );
      },
      () => mockChartService.deleteDashboard(dashboardId)
    );
  },

  async attachChartToDashboard(dashboardId, payload) {
    return withFallback(
      async () => {
        await apiRequest<unknown>(
          `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}/charts`,
          {
            method: "POST",
            body: JSON.stringify({
              chartId: payload.chartId,
              position: payload.position ?? { col: 0, row: 0 },
              size: payload.size ?? { w: 6, h: 4 },
            }),
          },
          { auth: true }
        );
        return fetchDashboard(dashboardId);
      },
      () => mockChartService.attachChartToDashboard(dashboardId, payload)
    );
  },

  async removeChartFromDashboard(dashboardId, chartId) {
    return withFallback(
      async () => {
        await apiRequest<unknown>(
          `/api/v1/analytics/dashboards/${encodeURIComponent(dashboardId)}/charts/${encodeURIComponent(chartId)}`,
          { method: "DELETE" },
          { auth: true }
        );
        return fetchDashboard(dashboardId);
      },
      () => mockChartService.removeChartFromDashboard(dashboardId, chartId)
    );
  },

  async reorderDashboardCharts(dashboardId, orderedChartIds) {
    return withFallback(
      async () => {
        const current = await fetchDashboard(dashboardId);
        const byChartId = new Map(current.charts.map((item) => [item.chartId, item]));
        const ordered = orderedChartIds
          .map((chartId, index) => {
            const existing = byChartId.get(chartId);
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

        return replaceDashboardCharts(dashboardId, ordered);
      },
      () => mockChartService.reorderDashboardCharts(dashboardId, orderedChartIds)
    );
  },

  async generateReport(payload: GenerateReportRequest) {
    return withFallback(
      async () => {
        const format = payload.format ?? "csv";
        const filename = payload.filename?.trim() || `analytics-report-${Date.now()}.${format}`;
        const query = queryFromObject({
          format,
          page: 1,
          limit: 200,
          dashboardId: payload.dashboardId,
          ...payload.filters,
        });

        const response = await apiRequest<unknown>(
          `/api/v1/prices/report${query ? `?${query}` : ""}`,
          { method: "GET" },
          { auth: true }
        );
        return createBlobFromPayload(response, format, filename);
      },
      () => mockChartService.generateReport(payload)
    );
  },
};
