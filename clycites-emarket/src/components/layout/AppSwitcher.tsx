"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  Sprout,
  Cloud,
  BarChart3,
  FlaskConical,
  Settings,
  HelpCircle,
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
  icon: typeof ShoppingCart;
  href: string;
  color: string;
  requiredPermission?: string;
}

const ALL_MODULES: AppModule[] = [
  {
    id: "market",
    name: "E-Market",
    description: "Browse and trade agricultural products",
    icon: ShoppingCart,
    href: "/market",
    color: "text-green-600",
  },
  {
    id: "farmers",
    name: "Farmers Hub",
    description: "Manage farms, crops, and records",
    icon: Sprout,
    href: "/farms",
    color: "text-emerald-600",
    requiredPermission: "farmers.farm.read",
  },
  {
    id: "weather",
    name: "Weather & Alerts",
    description: "Forecasts and climate intelligence",
    icon: Cloud,
    href: "/weather",
    color: "text-blue-600",
  },
  {
    id: "analytics",
    name: "Analytics",
    description: "Dashboards and insights",
    icon: BarChart3,
    href: "/analytics",
    color: "text-purple-600",
    requiredPermission: "analytics.dashboard.read",
  },
  {
    id: "research",
    name: "Research Portal",
    description: "Datasets and expert knowledge",
    icon: FlaskConical,
    href: "/research",
    color: "text-indigo-600",
    requiredPermission: "research.dataset.read",
  },
  {
    id: "admin",
    name: "Admin",
    description: "System management and settings",
    icon: Settings,
    href: "/admin",
    color: "text-gray-600",
    requiredPermission: "admin.user.read",
  },
  {
    id: "support",
    name: "Help & Support",
    description: "FAQs, tickets, and assistance",
    icon: HelpCircle,
    href: "/help",
    color: "text-orange-600",
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
  const currentModule = availableModules.find((module) =>
    pathname?.startsWith(module.href)
  );

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
          variant="ghost"
          className="flex items-center gap-2 px-3 h-9 border border-border/40 hover:bg-accent/50"
        >
          <CurrentIcon className={cn("h-4 w-4", currentModule?.color)} />
          <span className="font-medium text-sm hidden sm:inline">
            {currentModule?.name ?? "Apps"}
          </span>
          <ChevronDown className="h-3.5 w-3.5 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-72">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          SWITCH MODULE
        </DropdownMenuLabel>

        {/* Recently Used */}
        {recentModulesData.length > 0 && (
          <>
            <DropdownMenuLabel className="text-xs font-normal text-muted-foreground mt-2">
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
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
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
    <DropdownMenuItem asChild className="cursor-pointer">
      <Link
        href={module.href}
        onClick={onSelect}
        className="flex items-start gap-3 py-2.5"
      >
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted",
            isActive && "bg-primary/10"
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
