import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceHome } from "@/components/entities/WorkspaceHome";
import { getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";

interface WorkspacePageProps {
  params: Promise<{
    workspace: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  const { workspace: workspaceParam } = await params;
  const workspaceId = workspaceParam as WorkspaceId;
  const workspace = getWorkspaceDefinition(workspaceId);

  if (!workspace) {
    return <AccessDenied />;
  }

  return <WorkspaceHome workspaceId={workspaceId} />;
}
