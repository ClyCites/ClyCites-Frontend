"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { Menu, Moon, Search, Sun, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { WorkspaceSwitcher } from "@/components/layout/workspaces/WorkspaceSwitcher";
import { NotificationsCenter } from "@/components/layout/workspaces/NotificationsCenter";
import { useMockSession } from "@/lib/auth/mock-session";
import { layoutTransition, slideUp } from "@/lib/motion";
import { useThemePreference } from "@/lib/theme/theme";
import type { WorkspaceId } from "@/lib/store/types";

interface WorkspaceTopbarProps {
  workspaceId: WorkspaceId;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
}

export function WorkspaceTopbar({
  workspaceId,
  sidebarCollapsed,
  onToggleSidebar,
  onToggleMobileSidebar,
}: WorkspaceTopbarProps) {
  const router = useRouter();
  const reducedMotion = useReducedMotion();
  const { session, logout } = useMockSession();
  const { preference, resolvedTheme, updatePreference } = useThemePreference();

  return (
    <motion.header
      variants={slideUp(Boolean(reducedMotion), 8)}
      initial="hidden"
      animate="show"
      transition={layoutTransition(Boolean(reducedMotion))}
      className="sticky top-2 z-40 mx-auto w-[calc(100%-1rem)] max-w-[1880px]"
    >
      <div className="frosted rounded-[var(--radius-xl)] px-3 py-2 shadow-md sm:px-4 lg:px-5">
        <div className="flex min-h-14 flex-wrap items-center gap-2.5 lg:flex-nowrap lg:gap-3">
          <Button size="icon" variant="ghost" className="lg:hidden" onClick={onToggleMobileSidebar}>
            <Menu className="h-4 w-4" />
            <span className="sr-only">Open workspace navigation</span>
          </Button>

          <Button
            size="icon"
            variant="ghost"
            className="hidden lg:inline-flex"
            onClick={onToggleSidebar}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <Menu className="h-4 w-4" />
          </Button>

          <Link href="/app" className="flex items-center">
            <Image
              src="/logo.png"
              alt="ClyCites"
              width={752}
              height={927}
              className="h-9 w-auto"
              priority
            />
          </Link>

          <WorkspaceSwitcher workspaceId={workspaceId} />

          <button
            className="group ml-auto hidden h-10 min-w-[280px] flex-1 items-center gap-2 rounded-full border border-border/65 bg-background/70 px-3 text-left text-sm text-muted-foreground transition-colors hover:bg-card lg:flex xl:max-w-[460px]"
            onClick={() => router.push("/app/search")}
            type="button"
          >
            <Search className="h-4 w-4" />
            <span className="truncate">Search products, advisories, alerts, orders, shipments...</span>
            <span className="ml-auto rounded-md border border-border/70 bg-card px-1.5 py-0.5 text-[10px] uppercase tracking-wide">
              /
            </span>
          </button>

          <Button
            variant="outline"
            className="lg:hidden"
            onClick={() => router.push("/app/search")}
          >
            <Search className="mr-1.5 h-4 w-4" />
            Search
          </Button>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <NotificationsCenter />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Theme">
                  {resolvedTheme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44">
                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => updatePreference("light")}>Light</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updatePreference("dark")}>Dark</DropdownMenuItem>
                <DropdownMenuItem onClick={() => updatePreference("system")}>System</DropdownMenuItem>
                <DropdownMenuSeparator />
                <div className="px-2 pb-1 text-[11px] text-muted-foreground">Current: {preference}</div>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="h-10 gap-2 rounded-full px-2.5 sm:px-3">
                  <UserCircle2 className="h-4 w-4" />
                  <span className="hidden max-w-[160px] truncate sm:inline">{session?.user.name ?? "Profile"}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60">
                <DropdownMenuLabel>
                  <div className="text-sm font-medium">{session?.user.name}</div>
                  <div className="text-xs text-muted-foreground">{session?.user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/app/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/app/notifications">Notifications</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/auth/profile">Auth Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={async () => {
                    await logout();
                    router.replace("/auth/login");
                  }}
                  className="text-destructive focus:text-destructive"
                >
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
