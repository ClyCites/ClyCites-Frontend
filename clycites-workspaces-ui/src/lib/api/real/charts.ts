import type {
  ChartPreviewResult,
  ChartServiceContract,
  SaveChartRequest,
  SavedChart,
} from "@/lib/api/contracts";
import { apiRequest, unwrapApiData } from "@/lib/api/real/http";

function normalizeSavedChart(payload: unknown): SavedChart {
  const data = unwrapApiData<Record<string, unknown>>(payload);
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
    tags: Array.isArray(data.tags) ? data.tags.filter((item): item is string => typeof item === "string") : [],
    shareScope: String(data.shareScope ?? "owner_only"),
    createdAt: typeof data.createdAt === "string" ? data.createdAt : undefined,
    updatedAt: typeof data.updatedAt === "string" ? data.updatedAt : undefined,
  };
}

export const chartService: ChartServiceContract = {
  async previewChart(definition) {
    const payload = await apiRequest<unknown>(
      "/api/v1/analytics/charts/preview",
      {
        method: "POST",
        body: JSON.stringify(definition),
      },
      { auth: true }
    );

    const data = unwrapApiData<Record<string, unknown>>(payload);

    const rows =
      Array.isArray(data.rows)
        ? data.rows
        : Array.isArray(data.items)
          ? data.items
          : Array.isArray(data.data)
            ? data.data
            : [];

    return {
      rows: rows.filter((item): item is Record<string, unknown> => Boolean(item) && typeof item === "object"),
      raw: data,
    } as ChartPreviewResult;
  },

  async saveChart(payload: SaveChartRequest) {
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

  async listCharts(params) {
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

    const data = unwrapApiData<Record<string, unknown>>(response);
    const rows = Array.isArray(data.items)
      ? data.items
      : Array.isArray(data.data)
        ? data.data
        : Array.isArray(data.charts)
          ? data.charts
          : [];

    return rows.map((item) => normalizeSavedChart(item));
  },
};
