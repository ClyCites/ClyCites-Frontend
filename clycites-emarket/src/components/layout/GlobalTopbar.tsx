"use client";

import Link from "next/link";
import { Bell, HelpCircle, Leaf, Search } from "lucide-react";
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
  const currentOrg = organizations.find((org) => org.id === currentOrgId);
  const userPermissions = currentOrg?.permissions ?? [];

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-[1400px] items-center gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-primary/25 bg-primary/10 text-primary shadow-[0_10px_16px_-14px_hsl(var(--primary)/0.9)] transition-transform duration-200 group-hover:-translate-y-0.5">
            <Leaf className="h-4 w-4" />
          </span>
          <div className="hidden min-[380px]:block leading-tight">
            <p className="font-display text-[0.95rem] font-bold text-foreground">ClyCites</p>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
              Agri Workspace
            </p>
          </div>
        </Link>

        {isAuthenticated && (
          <AppSwitcher
            userPermissions={userPermissions}
            recentModules={["accounts-dashboard", "emarket-dashboard", "weather-dashboard"]}
          />
        )}

        {isAuthenticated && organizations.length > 0 && currentOrgId && (
          <OrgSwitcher organizations={organizations} currentOrgId={currentOrgId} onOrgChange={switchOrg} />
        )}

        <div className="flex-1" />

        {isAuthenticated && (
          <Button
            variant="outline"
            size="sm"
            className="hidden xl:flex h-10 min-w-72 items-center justify-start gap-2 rounded-xl border-border/70 bg-card/80 px-3 text-muted-foreground"
          >
            <Search className="h-4 w-4" />
            <span className="text-sm">Search listings, offers, orders...</span>
            <kbd className="ml-auto inline-flex h-5 select-none items-center rounded border border-border/70 bg-background px-1.5 font-mono text-[10px] font-semibold text-muted-foreground">
              Ctrl K
            </kbd>
          </Button>
        )}

        {isAuthenticated && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="relative rounded-xl border-border/70 bg-card/80">
                <Bell className="h-4 w-4" />
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 min-w-5 justify-center px-1 text-[10px]">
                  3
                </Badge>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80 rounded-2xl border-border/70">
              <DropdownMenuLabel className="font-display text-sm">Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="p-4 text-center text-sm text-muted-foreground">
                No new notifications
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        )}

        {isAuthenticated && (
          <Button variant="outline" size="icon" asChild className="rounded-xl border-border/70 bg-card/80">
            <Link href="/help">
              <HelpCircle className="h-4 w-4" />
            </Link>
          </Button>
        )}

        {isAuthenticated && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="rounded-full border border-border/70 bg-card/85 p-0.5 transition-all hover:shadow-[0_12px_18px_-14px_hsl(var(--foreground)/0.9)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={(user as { avatar?: string }).avatar} />
                  <AvatarFallback className="bg-primary/12 text-primary text-xs">
                    {getInitials(`${user.firstName} ${user.lastName}`)}
                  </AvatarFallback>
                </Avatar>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 rounded-2xl border-border/70">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="font-medium">
                    {user.firstName} {user.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                  {currentOrg && (
                    <p className="text-xs text-muted-foreground capitalize">
                      {currentOrg.role} | {currentOrg.name}
                    </p>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/settings">Profile & Settings</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="text-destructive focus:text-destructive">
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
