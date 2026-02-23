"use client";

import { useState } from "react";
import { Building2, Check, ChevronDown, Crown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface Organization {
  id: string;
  name: string;
  type: "personal" | "cooperative" | "enterprise" | "ngo";
  tier: "free" | "premium" | "enterprise";
  role: string; // User's role in this org
}

interface OrgSwitcherProps {
  organizations: Organization[];
  currentOrgId: string;
  onOrgChange: (orgId: string) => void;
}

const TIER_COLORS = {
  free: "bg-gray-100 text-gray-700 border-gray-300",
  premium: "bg-blue-100 text-blue-700 border-blue-300",
  enterprise: "bg-purple-100 text-purple-700 border-purple-300",
};

const TIER_LABELS = {
  free: "Free",
  premium: "Premium",
  enterprise: "Enterprise",
};

export function OrgSwitcher({
  organizations,
  currentOrgId,
  onOrgChange,
}: OrgSwitcherProps) {
  const [open, setOpen] = useState(false);

  const currentOrg = organizations.find((org) => org.id === currentOrgId);

  if (!currentOrg) {
    return null;
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex items-center gap-2 px-3 h-9 max-w-[240px]"
        >
          <Building2 className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="flex-1 min-w-0 text-left hidden sm:block">
            <div className="font-medium text-sm truncate">{currentOrg.name}</div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-80">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
          YOUR ORGANIZATIONS
        </DropdownMenuLabel>

        {organizations.map((org) => {
          const isActive = org.id === currentOrgId;

          return (
            <DropdownMenuItem
              key={org.id}
              className="cursor-pointer"
              onClick={() => {
                onOrgChange(org.id);
                setOpen(false);
              }}
            >
              <div className="flex items-start gap-3 py-1.5 w-full">
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2",
                    isActive
                      ? "border-primary bg-primary/10"
                      : "border-muted bg-muted"
                  )}
                >
                  {org.tier === "enterprise" ? (
                    <Crown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium text-sm truncate">
                      {org.name}
                    </span>
                    {isActive && (
                      <Check className="h-4 w-4 text-primary shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={cn(
                        "text-xs font-normal px-1.5 py-0",
                        TIER_COLORS[org.tier]
                      )}
                    >
                      {TIER_LABELS[org.tier]}
                    </Badge>
                    <span className="text-xs text-muted-foreground capitalize">
                      {org.role}
                    </span>
                  </div>
                </div>
              </div>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />

        <DropdownMenuItem className="text-sm cursor-pointer">
          <Building2 className="h-4 w-4 mr-2" />
          Create Organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
