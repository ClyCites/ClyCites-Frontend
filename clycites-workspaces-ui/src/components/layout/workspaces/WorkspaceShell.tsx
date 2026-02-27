"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";
import { WorkspaceSidebar } from "@/components/layout/workspaces/WorkspaceSidebar";
import { WorkspaceTopbar } from "@/components/layout/workspaces/WorkspaceTopbar";
import { useMockSession } from "@/lib/auth/mock-session";
import type { WorkspaceId } from "@/lib/store/types";

function resolveWorkspaceFromPath(pathname: string): WorkspaceId | null {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 2 || segments[0] !== "app") return null;

  const workspace = segments[1] as WorkspaceId;
  const allowed: WorkspaceId[] = [
    "farmer",
    "production",
    "aggregation",
    "marketplace",
    "logistics",
    "finance",
    "weather",
    "prices",
    "expert",
    "analytics",
    "admin",
  ];

  return allowed.includes(workspace) ? workspace : null;
}

export function WorkspaceShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { activeWorkspace } = useMockSession();

  const workspace = useMemo(() => {
    return resolveWorkspaceFromPath(pathname) ?? activeWorkspace ?? "farmer";
  }, [activeWorkspace, pathname]);

  const showSidebar = pathname.startsWith("/app/") && workspace !== null;

  return (
    <div className="min-h-screen bg-background">
      <WorkspaceTopbar />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {showSidebar && <WorkspaceSidebar workspaceId={workspace} />}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
