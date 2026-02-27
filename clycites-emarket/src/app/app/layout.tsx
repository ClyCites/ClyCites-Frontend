"use client";

import { AppGuard } from "@/components/layout/workspaces/AppGuard";
import { WorkspaceShell } from "@/components/layout/workspaces/WorkspaceShell";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppGuard>
      <WorkspaceShell>{children}</WorkspaceShell>
    </AppGuard>
  );
}
