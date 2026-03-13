"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Home, Search, Waypoints } from "lucide-react";
import { usePathname } from "next/navigation";
import { createElement, type ComponentType } from "react";
import { cn } from "@/lib/utils";
import type { WorkspaceId } from "@/lib/store/types";
import { getWorkspaceItems, getWorkspaceLabel } from "@/lib/nav/workspace-nav";
import { getWorkspaceIcon, getEntityIcon } from "@/components/layout/workspaces/workspace-icons";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface WorkspaceSidebarProps {
  workspaceId: WorkspaceId;
  collapsed: boolean;
  mobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
}

interface SidebarLinkProps {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  active: boolean;
  collapsed: boolean;
  onNavigate?: () => void;
}

function SidebarLink({ href, label, icon: Icon, active, collapsed, onNavigate }: SidebarLinkProps) {
  const content = (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "group relative flex h-10 items-center gap-2.5 rounded-xl text-sm transition-colors duration-200",
        collapsed ? "justify-center px-0" : "px-3",
        active
          ? "bg-primary/12 text-primary"
          : "text-muted-foreground hover:bg-hoverbg/70 hover:text-foreground"
      )}
    >
      {active && (
        <motion.span
          layoutId="workspace-active-indicator"
          className="absolute left-1.5 top-1.5 h-7 w-1 rounded-full bg-primary"
        />
      )}
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) {
    return content;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{content}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}

function SidebarBody({
  workspaceId,
  pathname,
  collapsed,
  onNavigate,
}: {
  workspaceId: WorkspaceId;
  pathname: string;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const items = getWorkspaceItems(workspaceId);
  const workspaceIcon = getWorkspaceIcon(workspaceId);

  return (
    <TooltipProvider delayDuration={120}>
      <div className="flex h-full flex-col gap-4">
        <div className={cn("rounded-2xl border border-border/65 bg-card/76 py-3", collapsed ? "px-2" : "px-3")}>
          <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
            <span className="rounded-lg bg-primary/14 p-2 text-primary">
              {createElement(workspaceIcon, { className: "h-4 w-4" })}
            </span>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
                <h2 className="truncate text-sm font-semibold">{getWorkspaceLabel(workspaceId)}</h2>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          {!collapsed && <p className="px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Overview</p>}
          <SidebarLink
            href={`/app/${workspaceId}`}
            label="Dashboard"
            icon={Home}
            active={pathname === `/app/${workspaceId}`}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>

        <div className="space-y-2">
          {!collapsed && <p className="px-2 text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Manage</p>}
          <nav className="space-y-1">
            {items.map((item) => (
              <SidebarLink
                key={item.id}
                href={item.href}
                label={item.label}
                icon={getEntityIcon(item.entityKey)}
                active={pathname.startsWith(item.href)}
                collapsed={collapsed}
                onNavigate={onNavigate}
              />
            ))}
          </nav>
        </div>

        <div className="mt-auto space-y-1 border-t border-border/55 pt-3">
          <SidebarLink
            href={`/app/${workspaceId}/endpoints`}
            label="API Explorer"
            icon={Waypoints}
            active={pathname === `/app/${workspaceId}/endpoints`}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
          <SidebarLink
            href="/app/search"
            label="Global Search"
            icon={Search}
            active={pathname === "/app/search"}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        </div>
      </div>
    </TooltipProvider>
  );
}

export function WorkspaceSidebar({ workspaceId, collapsed, mobileOpen, onMobileOpenChange }: WorkspaceSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <motion.aside
        layout
        transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          "hidden min-h-[calc(100vh-7.5rem)] shrink-0 rounded-[var(--radius-xl)] border border-border/60 bg-card/72 p-3 shadow-sm backdrop-blur-sm lg:block",
          collapsed ? "w-[88px]" : "w-[284px]"
        )}
      >
        <SidebarBody workspaceId={workspaceId} pathname={pathname} collapsed={collapsed} />
      </motion.aside>

      <Sheet open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side="left" className="w-[320px] border-border/70 bg-card/94 p-3 sm:max-w-[320px]">
          <SheetTitle className="sr-only">Workspace navigation</SheetTitle>
          <SidebarBody
            workspaceId={workspaceId}
            pathname={pathname}
            collapsed={false}
            onNavigate={() => onMobileOpenChange(false)}
          />
          <Button variant="ghost" className="mt-3 w-full" onClick={() => onMobileOpenChange(false)}>
            Close
          </Button>
        </SheetContent>
      </Sheet>
    </>
  );
}
