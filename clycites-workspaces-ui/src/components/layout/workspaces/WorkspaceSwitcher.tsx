"use client";

import { useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Check, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { WORKSPACES, getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { getWorkspaceIcon } from "@/components/layout/workspaces/workspace-icons";

interface WorkspaceSwitcherProps {
  workspaceId: WorkspaceId;
}

export function WorkspaceSwitcher({ workspaceId }: WorkspaceSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { activeWorkspace, availableWorkspaces, switchWorkspace } = useMockSession();

  const currentWorkspace = useMemo(() => {
    return getWorkspaceDefinition(activeWorkspace ?? workspaceId);
  }, [activeWorkspace, workspaceId]);

  const CurrentIcon = getWorkspaceIcon(currentWorkspace?.id ?? workspaceId);

  const switchToWorkspace = async (nextWorkspaceId: WorkspaceId) => {
    await switchWorkspace(nextWorkspaceId);

    const nextPath = pathname.startsWith("/app/") ? `/app/${nextWorkspaceId}` : `/app/${nextWorkspaceId}`;
    router.push(nextPath);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 min-w-[220px] justify-between rounded-full border-border/70 bg-background/78 px-3 shadow-sm sm:min-w-[250px]"
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <CurrentIcon className="h-4 w-4 text-primary" />
            <span className="truncate">{currentWorkspace?.label ?? "Switch Workspace"}</span>
          </span>
          <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-[340px] rounded-2xl p-1.5">
        <DropdownMenuLabel className="px-2 pb-1">Switch Workspace</DropdownMenuLabel>

        {WORKSPACES.filter((workspace) => availableWorkspaces.includes(workspace.id)).map((workspace) => {
          const Icon = getWorkspaceIcon(workspace.id);
          const selected = workspace.id === currentWorkspace?.id;

          return (
            <DropdownMenuItem
              key={workspace.id}
              onClick={() => switchToWorkspace(workspace.id)}
              className="rounded-xl px-2.5 py-2"
            >
              <span className="inline-flex min-w-0 flex-1 items-start gap-2.5">
                <span className="mt-0.5 rounded-md bg-primary/12 p-1.5 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-sm font-medium">{workspace.label}</span>
                  <span className="line-clamp-1 text-xs text-muted-foreground">{workspace.description}</span>
                </span>
              </span>
              {selected && <Check className="h-4 w-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
