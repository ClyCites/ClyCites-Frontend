import { WORKSPACES, WORKSPACE_ENTITY_MAP, getEntityDefinition } from "@/lib/store/catalog";
import type { EntityKey, WorkspaceId } from "@/lib/store/types";

export interface WorkspaceNavItem {
  id: string;
  label: string;
  href: string;
  entityKey: EntityKey;
}

export function getWorkspaceItems(workspaceId: WorkspaceId): WorkspaceNavItem[] {
  const entities = WORKSPACE_ENTITY_MAP[workspaceId] ?? [];
  return entities.map((entityKey) => {
    const def = getEntityDefinition(entityKey);
    return {
      id: entityKey,
      label: def?.pluralLabel ?? entityKey,
      href: `/app/${workspaceId}/${entityKey}`,
      entityKey,
    };
  });
}

export function getWorkspaceLabel(workspaceId: WorkspaceId): string {
  return WORKSPACES.find((workspace) => workspace.id === workspaceId)?.label ?? workspaceId;
}

export function workspaceRoute(workspaceId: WorkspaceId): string {
  return `/app/${workspaceId}`;
}
