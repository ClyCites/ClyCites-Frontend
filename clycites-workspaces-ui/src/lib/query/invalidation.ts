import type { QueryClient } from "@tanstack/react-query";
import { WORKSPACE_ENTITY_MAP } from "@/lib/store/catalog";
import type { EntityKey, WorkspaceId } from "@/lib/store/types";
import { queryKeys } from "@/lib/query/keys";

const ENTITY_WORKSPACE_MAP = Object.entries(WORKSPACE_ENTITY_MAP).reduce(
  (acc, [workspaceId, entityKeys]) => {
    for (const entityKey of entityKeys) {
      if (!acc[entityKey]) {
        acc[entityKey] = [];
      }
      acc[entityKey].push(workspaceId as WorkspaceId);
    }
    return acc;
  },
  {} as Record<EntityKey, WorkspaceId[]>
);

function resolveWorkspaceScopes(entityKey: EntityKey, workspaceId?: WorkspaceId): WorkspaceId[] {
  if (workspaceId) {
    return [workspaceId];
  }
  return ENTITY_WORKSPACE_MAP[entityKey] ?? [];
}

export async function invalidateEntityMutation(
  queryClient: QueryClient,
  params: {
    entityKey: EntityKey;
    workspaceId?: WorkspaceId;
    includeNotifications?: boolean;
    includeAudit?: boolean;
    includeSearch?: boolean;
  }
): Promise<void> {
  const workspaces = resolveWorkspaceScopes(params.entityKey, params.workspaceId);
  const invalidations: Array<Promise<void>> = [];

  invalidations.push(queryClient.invalidateQueries({ queryKey: queryKeys.entity.root() }));

  for (const workspaceId of workspaces) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: queryKeys.workspaceSummary.byWorkspace(workspaceId),
      })
    );
  }

  if (params.includeNotifications !== false) {
    invalidations.push(queryClient.invalidateQueries({ queryKey: queryKeys.notifications.root() }));
  }
  if (params.includeAudit !== false) {
    invalidations.push(queryClient.invalidateQueries({ queryKey: queryKeys.audit.root() }));
  }
  if (params.includeSearch !== false) {
    invalidations.push(queryClient.invalidateQueries({ queryKey: queryKeys.search.root() }));
  }

  await Promise.all(invalidations);
}

export async function invalidateAnalyticsMutation(queryClient: QueryClient): Promise<void> {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: queryKeys.analytics.root() }),
    queryClient.invalidateQueries({ queryKey: queryKeys.entity.scope("analytics", "charts") }),
    queryClient.invalidateQueries({ queryKey: queryKeys.entity.scope("analytics", "dashboards") }),
    queryClient.invalidateQueries({ queryKey: queryKeys.entity.scope("analytics", "reports") }),
    queryClient.invalidateQueries({ queryKey: queryKeys.workspaceSummary.byWorkspace("analytics") }),
    queryClient.invalidateQueries({ queryKey: queryKeys.audit.root() }),
  ]);
}
