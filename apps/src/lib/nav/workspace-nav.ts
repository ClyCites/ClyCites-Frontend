import { listWorkspaceEndpoints } from "@/lib/api/workspaces";
import type { ApiMethod } from "@/lib/api/workspaces";
import { WORKSPACES } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";

export interface WorkspaceNavItem {
  id: string;
  label: string;
  href: string;
  method: ApiMethod;
}

export function getWorkspaceItems(workspaceId: WorkspaceId): WorkspaceNavItem[] {
  return listWorkspaceEndpoints(workspaceId).map((endpoint) => {
    return {
      id: endpoint.id,
      label: endpoint.summary,
      href: `/app/${workspaceId}/endpoints/${endpoint.id}`,
      method: endpoint.method,
    };
  });
}

export function getWorkspaceLabel(workspaceId: WorkspaceId): string {
  return WORKSPACES.find((workspace) => workspace.id === workspaceId)?.label ?? workspaceId;
}

export function workspaceRoute(workspaceId: WorkspaceId): string {
  return `/app/${workspaceId}`;
}
