import { entityServices } from "@/lib/api/mock/entities";
import type {
  ChartDefinition,
  ChartPreviewResult,
  ChartServiceContract,
  SaveChartRequest,
  SavedChart,
} from "@/lib/api/contracts";

const DEFAULT_ACTOR_ID = "usr-ops";

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

    return response.items.map((item) => normalizeChart(item));
  },
};
