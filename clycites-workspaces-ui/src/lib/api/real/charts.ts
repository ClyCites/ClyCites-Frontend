import type {
  ChartPreviewResult,
  ChartServiceContract,
  SaveChartRequest,
  SavedChart,
} from "@/lib/api/contracts";
import { apiRequest, unwrapApiData } from "@/lib/api/real/http";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
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

function extractChartRows(payload: unknown): unknown[] {
  const unwrapped = unwrapApiData<unknown>(payload);
  const root = asRecord(unwrapped) ?? {};
  const candidates = [root.items, root.data, root.charts, root.rows, root.results];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) {
      return candidate;
    }
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

    return {
      rows: extractPreviewRows(payload),
      raw: unwrapApiData<unknown>(payload),
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

    return extractChartRows(response).map((item) => normalizeSavedChart(item));
  },
};
