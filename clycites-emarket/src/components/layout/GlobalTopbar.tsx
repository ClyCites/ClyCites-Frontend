"use client";

import Link from "next/link";
import { Bell, Search, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { AppSwitcher } from "./AppSwitcher";
import { OrgSwitcher } from "./OrgSwitcher";
import { useAuth } from "@/lib/auth/auth-context";
import { useOrg } from "@/lib/context/org-context";
import { getInitials } from "@/lib/utils";

export function GlobalTopbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { organizations, currentOrgId, switchOrg } = useOrg();

  // Mock permissions - in production these would come from the current org
  const userPermissions = organizations
    .find((org) => org.id === currentOrgId)?.permissions ?? [];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center gap-4 px-4">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-primary shrink-0"
        >
          <svg
            className="h-6 w-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
          <span className="hidden sm:inline">ClyCites</span>
        </Link>

        {/* App Switcher */}
        {isAuthenticated && (
          <AppSwitcher
            userPermissions={userPermissions}
            recentModules={["market", "farmers"]}
          />
        )}

        {/* Org Switcher */}
        {isAuthenticated && organizations.length > 0 && currentOrgId && (
          <OrgSwitcher
            organizations={organizations}
            currentOrgId={currentOrgId}
            onOrgChange={switchOrg}
          />  
        )}

        {/* Spacer */}
        <div className="flex-1" />

        {/* Global Search */}
        {isAuthenticated && (
          <Button
            variant="ghost"
            size="sm"
            className="hidden lg:flex items-center gap-2 text-muted-foreground max-w-xs w-full justify-start border border-border/40"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search...</span>
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        )}

        {/* Notifications */}
        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge
                  variant="destructive"
                  className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                >
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {/* Help */}
        {isAuthenticated && (
          <Button variant="ghost" size="icon" asChild>
            <Link href="/help">
              <HelpCircle className="h-5 w-5" />
            </Link>
          </Button>
        )}

        {/* User Menu */}
        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={(user as { avatar?: string }).avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xs">
                    {getInitials(`${user.firstName} ${user.lastName}`)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {organizations.find((o) => o.id === currentOrgId) && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {organizations.find((o) => o.id === currentOrgId)?.role} •{" "}
                      {organizations.find((o) => o.id === currentOrgId)?.name}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive">
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Log in</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/register">Sign up</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
