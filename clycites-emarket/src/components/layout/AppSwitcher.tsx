"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Cloud,
  DollarSign,
  Bot,
  BarChart3,
  Stethoscope,
  ChevronDown,
  Check,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface AppModule {
  id: string;
  name: string;
  description: string;
  icon: typeof LayoutDashboard;
  href: string;
  color: string;
  requiredPermission?: string;
}

const ALL_MODULES: AppModule[] = [
  {
    id: "accounts-dashboard",
    name: "Accounts Dashboard",
    description: "Role-based control plane and operations overview",
    icon: LayoutDashboard,
    href: "/dashboard/account",
    color: "text-slate-600",
  },
  {
    id: "emarket-dashboard",
    name: "E-Market Dashboard",
    description: "Marketplace listings, offers, orders, and settlements",
    icon: ShoppingCart,
    href: "/market",
    color: "text-emerald-600",
  },
  {
    id: "weather-dashboard",
    name: "Weather",
    description: "Forecasts, alerts, and climate intelligence",
    icon: Cloud,
    href: "/weather",
    color: "text-blue-600",
  },
  {
    id: "price-dashboard",
    name: "Price",
    description: "Commodity price board and market rates",
    icon: DollarSign,
    href: "/prices",
    color: "text-lime-600",
  },
  {
    id: "agric-assistant",
    name: "Agric Assistant",
    description: "Advisory workflows and assistant tools",
    icon: Bot,
    href: "/agric-assistant",
    color: "text-amber-600",
  },
  {
    id: "analytics-dashboard",
    name: "Analytics",
    description: "Dashboards, trends, and intelligence reports",
    icon: BarChart3,
    href: "/analytics",
    color: "text-cyan-600",
  },
  {
    id: "expert-portal",
    name: "Expert Portal",
    description: "Expert consultations, cases, and knowledge resources",
    icon: Stethoscope,
    href: "/dashboard/expert",
    color: "text-violet-600",
  },
];

interface AppSwitcherProps {
  userPermissions?: string[];
  recentModules?: string[];
}

export function AppSwitcher({ userPermissions = [], recentModules = [] }: AppSwitcherProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Filter modules based on permissions
  const availableModules = ALL_MODULES.filter((module) => {
    if (!module.requiredPermission) return true;
    return userPermissions.includes(module.requiredPermission);
  });

  // Get current active module
  const currentModule = availableModules
    .filter((module) => pathname?.startsWith(module.href))
    .sort((a, b) => b.href.length - a.href.length)[0];

  // Get recent modules (filtered)
  const recentModulesData = recentModules
    .map((id) => availableModules.find((m) => m.id === id))
    .filter(Boolean) as AppModule[];

  // Get other modules (not recent, not current)
  const otherModules = availableModules.filter(
    (module) =>
      module.id !== currentModule?.id &&
      !recentModulesData.some((m) => m.id === module.id)
  );

  const CurrentIcon = currentModule?.icon ?? ShoppingCart;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="h-10 rounded-xl border-border/70 bg-card/80 px-3"
        >
          <CurrentIcon className={cn("h-4 w-4", currentModule?.color)} />
          <span className="font-medium text-sm hidden sm:inline">
            {currentModule?.name ?? "Apps"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72 rounded-2xl border-border/70">
        <DropdownMenuLabel className="font-display text-xs font-normal text-muted-foreground">
          SWITCH MODULE
        </DropdownMenuLabel>

        {/* Recently Used */}
        {recentModulesData.length > 0 && (
          <>
            <DropdownMenuLabel className="font-display text-xs font-normal text-muted-foreground mt-2">
              RECENTLY USED
            </DropdownMenuLabel>
            {recentModulesData.map((module) => (
              <ModuleMenuItem
                key={module.id}
                module={module}
                isActive={currentModule?.id === module.id}
                onSelect={() => setOpen(false)}
              />
            ))}
            <DropdownMenuSeparator />
          </>
        )}

        {/* All Modules */}
        <DropdownMenuLabel className="font-display text-xs font-normal text-muted-foreground">
          ALL MODULES
        </DropdownMenuLabel>
        {otherModules.map((module) => (
          <ModuleMenuItem
            key={module.id}
            module={module}
            isActive={currentModule?.id === module.id}
            onSelect={() => setOpen(false)}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface ModuleMenuItemProps {
  module: AppModule;
  isActive: boolean;
  onSelect: () => void;
}

function ModuleMenuItem({ module, isActive, onSelect }: ModuleMenuItemProps) {
  const Icon = module.icon;

  return (
    <DropdownMenuItem asChild className="cursor-pointer rounded-xl focus:bg-muted/70">
      <Link
        href={module.href}
        onClick={onSelect}
        className="flex items-start gap-3 py-2"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-border/70 bg-muted/80",
            isActive && "border-primary/25 bg-primary/12"
          )}
        >
          <Icon className={cn("h-4 w-4", module.color)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-medium text-sm">{module.name}</span>
            {isActive && <Check className="h-4 w-4 text-primary shrink-0" />}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
            {module.description}
          </p>
        </div>
      </Link>
    </DropdownMenuItem>
  );
}
