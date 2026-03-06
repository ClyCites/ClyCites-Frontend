"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { WorkspaceSidebar } from "@/components/layout/workspaces/WorkspaceSidebar";
import { WorkspaceTopbar } from "@/components/layout/workspaces/WorkspaceTopbar";
import { useMockSession } from "@/lib/auth/mock-session";
import { layoutTransition, slideUp } from "@/lib/motion";
import type { WorkspaceId } from "@/lib/store/types";

const SIDEBAR_STORAGE_KEY = "clycites.sidebar.collapsed";

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
  const reducedMotion = useReducedMotion();

  const [collapsed, setCollapsed] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.localStorage.getItem(SIDEBAR_STORAGE_KEY) === "true";
  });
  const [mobileOpen, setMobileOpen] = useState(false);

  const workspace = useMemo(() => {
    return resolveWorkspaceFromPath(pathname) ?? activeWorkspace ?? "farmer";
  }, [activeWorkspace, pathname]);

  const showSidebar = pathname.startsWith("/app") && workspace !== null;

  const toggleCollapsed = () => {
    setCollapsed((current) => {
      const next = !current;
      if (typeof window !== "undefined") {
        window.localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next));
      }
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <WorkspaceTopbar
        workspaceId={workspace}
        sidebarCollapsed={collapsed}
        onToggleSidebar={toggleCollapsed}
        onToggleMobileSidebar={() => setMobileOpen((current) => !current)}
      />

      <div className="mx-auto flex w-full max-w-[1880px] gap-3 px-2 pb-4 pt-3 sm:px-4 lg:px-5">
        {showSidebar && (
          <WorkspaceSidebar
            workspaceId={workspace}
            collapsed={collapsed}
            mobileOpen={mobileOpen}
            onMobileOpenChange={setMobileOpen}
          />
        )}

        <AnimatePresence mode="wait" initial={false}>
          <motion.main
            key={pathname}
            className="min-h-[calc(100vh-6.5rem)] flex-1"
            variants={slideUp(Boolean(reducedMotion), 12)}
            initial="hidden"
            animate="show"
            exit="exit"
            transition={layoutTransition(Boolean(reducedMotion))}
          >
            <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-5">{children}</div>
          </motion.main>
        </AnimatePresence>
      </div>
    </div>
  );
}
