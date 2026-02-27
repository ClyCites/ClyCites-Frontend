import type { UserRole } from "@/lib/api/types/shared.types";
import {
  COMMERCIAL_ROLES,
  EXPERT_ROLES,
  LOGISTICS_ROLES,
  ORGANIZATION_ADMIN_ROLES,
  SUPER_ADMIN_ROLES,
} from "./roles";

export type NavIconKey =
  | "home"
  | "account"
  | "market"
  | "orders"
  | "tokens"
  | "logistics"
  | "weather"
  | "analytics"
  | "expert"
  | "organization"
  | "superadmin"
  | "audit";

export interface DashboardNavItem {
  id: string;
  label: string;
  href: string;
  icon: NavIconKey;
  roles?: UserRole[];
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: "home" },
  { id: "account", label: "Account", href: "/dashboard/account", icon: "account" },
  { id: "market", label: "Market", href: "/market", icon: "market", roles: COMMERCIAL_ROLES },
  { id: "orders-payments", label: "Orders & Payments", href: "/dashboard/orders-payments", icon: "orders", roles: COMMERCIAL_ROLES },
  { id: "tokens", label: "Token Vault", href: "/dashboard/tokens", icon: "tokens", roles: ORGANIZATION_ADMIN_ROLES },
  { id: "logistics", label: "Logistics", href: "/dashboard/logistics", icon: "logistics", roles: LOGISTICS_ROLES },
  { id: "weather", label: "Weather", href: "/weather", icon: "weather", roles: COMMERCIAL_ROLES },
  { id: "analytics", label: "Analytics", href: "/analytics", icon: "analytics", roles: ORGANIZATION_ADMIN_ROLES },
  { id: "expert", label: "Expert Portal", href: "/dashboard/expert", icon: "expert", roles: EXPERT_ROLES },
  { id: "organization", label: "Organization", href: "/dashboard/organization", icon: "organization", roles: ORGANIZATION_ADMIN_ROLES },
  { id: "super-admin", label: "Super Admin", href: "/dashboard/super-admin", icon: "superadmin", roles: SUPER_ADMIN_ROLES },
  { id: "audit", label: "Audit", href: "/dashboard/audit", icon: "audit", roles: ORGANIZATION_ADMIN_ROLES },
];

export function getDashboardNavForRole(role: UserRole | null): DashboardNavItem[] {
  return DASHBOARD_NAV_ITEMS.filter((item) => {
    if (!item.roles || item.roles.length === 0) return true;
    return role ? item.roles.includes(role) : false;
  });
}
