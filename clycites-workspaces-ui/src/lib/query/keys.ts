import type { EntityKey, ListParams, WorkspaceId } from "@/lib/store/types";

export const queryKeys = {
  entity: {
    root: () => ["entity"] as const,
    scope: (workspaceId: WorkspaceId, entityKey: EntityKey) => ["entity", workspaceId, entityKey] as const,
    list: (workspaceId: WorkspaceId, entityKey: EntityKey, params: ListParams) =>
      ["entity", workspaceId, entityKey, params] as const,
  },
  workspaceSummary: {
    root: () => ["workspace-summary"] as const,
    byEntity: (workspaceId: WorkspaceId, entityKey: EntityKey) => ["workspace-summary", workspaceId, entityKey] as const,
    byWorkspace: (workspaceId: WorkspaceId) => ["workspace-summary", workspaceId] as const,
  },
  notifications: {
    root: () => ["notifications"] as const,
    byWorkspace: (workspaceId?: WorkspaceId) => ["notifications", workspaceId ?? "all"] as const,
    byPage: (page: number, workspaceId?: WorkspaceId) => ["notifications", workspaceId ?? "all", page] as const,
  },
  audit: {
    root: () => ["audit"] as const,
    list: <T extends Record<string, unknown>>(params: T) => ["audit", params] as const,
  },
  search: {
    root: () => ["global-search"] as const,
    query: (text: string) => ["global-search", text] as const,
  },
  analytics: {
    root: () => ["analytics"] as const,
    savedCharts: (datasetId?: string) =>
      datasetId ? (["analytics", "saved-charts", datasetId] as const) : (["analytics", "saved-charts"] as const),
    dashboards: () => ["analytics", "dashboards"] as const,
    dashboard: (dashboardId: string) => ["analytics", "dashboards", dashboardId] as const,
  },
};

