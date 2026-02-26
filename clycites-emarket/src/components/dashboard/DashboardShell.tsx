"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import {
  Activity,
  Building2,
  Database,
  Globe,
  Home,
  Leaf,
  Package,
  Route,
  Shield,
  ShoppingCart,
  Stethoscope,
  CloudSun,
  UserCog,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { LoadingState } from "@/components/shared/LoadingState";
import { useAuth } from "@/lib/auth/auth-context";
import { useOrg } from "@/lib/context/org-context";
import { useDataSaver } from "@/lib/context/data-saver-context";
import { cn } from "@/lib/utils";
import { getDashboardNavForRole, type NavIconKey } from "@/lib/rbac/navigation";

const navIconMap: Record<NavIconKey, React.ComponentType<{ className?: string }>> = {
  home: Home,
  market: ShoppingCart,
  orders: Package,
  tokens: Database,
  logistics: Route,
  weather: CloudSun,
  analytics: Activity,
  expert: Stethoscope,
  organization: Building2,
  superadmin: Shield,
  audit: UserCog,
};

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { role, isAuthenticated, isLoading, logout } = useAuth();
  const { currentOrg } = useOrg();
  const { enabled, setEnabled } = useDataSaver();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const navItems = useMemo(() => getDashboardNavForRole(role), [role]);

  if (isLoading || !isAuthenticated) {
    return <LoadingState text="Preparing dashboard..." className="min-h-screen" size="lg" />;
  }

  return (
    <div className="min-h-screen bg-background lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-border/70 bg-card/65 p-4 lg:block">
        <Link href="/dashboard" className="mb-6 flex items-center gap-2 rounded-2xl border border-border/70 bg-card px-3 py-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Leaf className="h-4 w-4" />
          </span>
          <div>
            <p className="font-display text-sm font-semibold">ClyCites</p>
            <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Control Plane</p>
          </div>
        </Link>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = navIconMap[item.icon];
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
                  active
                    ? "bg-primary/12 text-primary"
                    : "text-muted-foreground hover:bg-muted/70 hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-8 rounded-2xl border border-border/70 bg-card p-3">
          <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Tenant</p>
          <p className="mt-1 truncate text-sm font-medium">{currentOrg?.name ?? "No organization"}</p>
          {role && (
            <Badge className="mt-2 capitalize" variant="outline">
              {role.replace("_", " ")}
            </Badge>
          )}
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/92 backdrop-blur-md">
          <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
            <div>
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">Workspace</p>
              <h1 className="text-base font-semibold sm:text-lg">
                {currentOrg?.name ?? "ClyCites"}
              </h1>
            </div>
            <div className="flex items-center gap-3">
              <label className="hidden items-center gap-2 rounded-xl border border-border/70 bg-card px-3 py-2 sm:flex">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Data Saver</span>
                <Switch checked={enabled} onCheckedChange={setEnabled} aria-label="Toggle low bandwidth mode" />
              </label>
              <Button variant="outline" size="sm" onClick={logout}>
                Log out
              </Button>
            </div>
          </div>
          <div className="flex gap-1 overflow-x-auto border-t border-border/60 px-2 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = navIconMap[item.icon];
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={cn(
                    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs",
                    active ? "bg-primary/12 text-primary" : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </header>
        <main className="mx-auto max-w-[1400px] px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
