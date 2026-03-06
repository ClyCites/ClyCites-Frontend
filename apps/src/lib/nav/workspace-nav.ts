import { WORKSPACE_ENTITY_MAP, WORKSPACES, getEntityDefinition } from "@/lib/store/catalog";
import type { EntityKey, WorkspaceId } from "@/lib/store/types";

export interface WorkspaceNavItem {
  label: string;
  href: string;
  entityKey: EntityKey;
}

export function getWorkspaceItems(workspaceId: WorkspaceId): WorkspaceNavItem[] {
  return WORKSPACE_ENTITY_MAP[workspaceId].map((entityKey) => {
    const definition = getEntityDefinition(entityKey);
    return {
      label: definition?.pluralLabel ?? entityKey,
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
