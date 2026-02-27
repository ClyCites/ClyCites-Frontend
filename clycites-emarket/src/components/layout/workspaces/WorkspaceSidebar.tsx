"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { WorkspaceId } from "@/lib/store/types";
import { getWorkspaceItems, getWorkspaceLabel } from "@/lib/nav/workspace-nav";

interface WorkspaceSidebarProps {
  workspaceId: WorkspaceId;
}

export function WorkspaceSidebar({ workspaceId }: WorkspaceSidebarProps) {
  const pathname = usePathname();
  const items = getWorkspaceItems(workspaceId);

  return (
    <aside className="hidden w-72 shrink-0 border-r bg-card/60 p-4 lg:block">
      <div className="rounded-lg border bg-background/70 p-3">
        <p className="text-xs uppercase tracking-wide text-muted-foreground">Workspace</p>
        <h2 className="text-lg font-semibold">{getWorkspaceLabel(workspaceId)}</h2>
      </div>

      <nav className="mt-4 space-y-1">
        <Link
          href={`/app/${workspaceId}`}
          className={cn(
            "block rounded-md px-3 py-2 text-sm transition-colors",
            pathname === `/app/${workspaceId}` ? "bg-primary/10 text-primary" : "hover:bg-muted"
          )}
        >
          Overview
        </Link>
        {items.map((item) => {
          const active = pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-primary/10 text-primary" : "hover:bg-muted"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
