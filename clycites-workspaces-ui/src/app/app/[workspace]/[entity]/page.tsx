import { AccessDenied } from "@/components/common/AccessDenied";
import { EntityManager } from "@/components/entities/EntityManager";
import { belongsToWorkspace, getEntityDefinition, getWorkspaceDefinition } from "@/lib/store/catalog";
import type { EntityKey, WorkspaceId } from "@/lib/store/types";

interface EntityPageProps {
  params: {
    workspace: string;
    entity: string;
  };
}

export default function WorkspaceEntityPage({ params }: EntityPageProps) {
  const workspaceId = params.workspace as WorkspaceId;
  const entityKey = params.entity as EntityKey;

  const workspace = getWorkspaceDefinition(workspaceId);
  const entity = getEntityDefinition(entityKey);

  if (!workspace || !entity || !belongsToWorkspace(workspaceId, entityKey)) {
    return <AccessDenied />;
  }

  return <EntityManager workspaceId={workspaceId} entityKey={entityKey} />;
}
