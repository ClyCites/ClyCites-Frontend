import { AccessDenied } from "@/components/common/AccessDenied";
import { WorkspaceHome } from "@/components/entities/WorkspaceHome";
import { getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";

interface WorkspacePageProps {
  params: {
    workspace: string;
  };
}

export default function WorkspacePage({ params }: WorkspacePageProps) {
  const workspaceId = params.workspace as WorkspaceId;
  const workspace = getWorkspaceDefinition(workspaceId);

  if (!workspace) {
    return <AccessDenied />;
  }

  return <WorkspaceHome workspaceId={workspaceId} />;
}
