import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceEndpointPage } from "@/components/entities/WorkspaceEndpointPage";
import { getWorkspaceEndpoint } from "@/lib/api/endpoint-catalog";
import { getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";

interface WorkspaceEndpointDetailPageProps {
  params: Promise<{
    workspace: string;
    endpointId: string;
  }>;
}

export default async function WorkspaceEndpointDetailPage({ params }: WorkspaceEndpointDetailPageProps) {
  const { workspace: workspaceParam, endpointId } = await params;
  const workspaceId = workspaceParam as WorkspaceId;
  const workspace = getWorkspaceDefinition(workspaceId);

  if (!workspace) {
    return <AccessDenied />;
  }

  const endpoint = getWorkspaceEndpoint(workspaceId, endpointId);
  if (!endpoint) {
    return <AccessDenied />;
  }

  return <WorkspaceEndpointPage workspaceId={workspaceId} endpointId={endpointId} />;
}
