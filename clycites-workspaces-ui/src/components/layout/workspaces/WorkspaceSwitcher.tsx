"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { WORKSPACES, getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";

export function WorkspaceSwitcher() {
  const pathname = usePathname();
  const router = useRouter();
  const { activeWorkspace, availableWorkspaces, switchWorkspace } = useMockSession();

  const currentWorkspace = useMemo(() => {
    if (!activeWorkspace) return null;
    return getWorkspaceDefinition(activeWorkspace);
  }, [activeWorkspace]);

  const switchToWorkspace = async (workspaceId: WorkspaceId) => {
    await switchWorkspace(workspaceId);

    const segments = pathname.split("/").filter(Boolean);
    const nextPath = segments.length >= 2 ? `/app/${workspaceId}` : `/app/${workspaceId}`;
    router.push(nextPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[220px] justify-between">
          <span>{currentWorkspace?.label ?? "Switch Workspace"}</span>
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[320px]">
        <DropdownMenuLabel>Switch Workspace</DropdownMenuLabel>
        {WORKSPACES.filter((workspace) => availableWorkspaces.includes(workspace.id)).map((workspace) => (
          <DropdownMenuItem key={workspace.id} onClick={() => switchToWorkspace(workspace.id)}>
            {workspace.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
