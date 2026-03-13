import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceEndpointCatalog } from "@/components/entities/WorkspaceEndpointCatalog";
import { getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";

interface WorkspaceEndpointsPageProps {
  params: Promise<{
    workspace: string;
  }>;
}

export default async function WorkspaceEndpointsPage({ params }: WorkspaceEndpointsPageProps) {
  const { workspace: workspaceParam } = await params;
  const workspaceId = workspaceParam as WorkspaceId;
  const workspace = getWorkspaceDefinition(workspaceId);

  if (!workspace) {
    return <AccessDenied />;
  }

  return <WorkspaceEndpointCatalog workspaceId={workspaceId} />;
}
