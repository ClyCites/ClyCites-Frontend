import type { UserRole } from "@/lib/api/types/shared.types";

export const ALL_ROLES: UserRole[] = [
  "farmer",
  "buyer",
  "trader",
  "supplier",
  "expert",
  "org_admin",
  "admin",
  "platform_admin",
  "super_admin",
];

export const SUPER_ADMIN_ROLES: UserRole[] = ["super_admin"];
export const ORGANIZATION_ADMIN_ROLES: UserRole[] = ["org_admin", "super_admin", "platform_admin", "admin"];
export const COMMERCIAL_ROLES: UserRole[] = ["farmer", "buyer", "trader", "supplier", "org_admin", "super_admin"];
export const EXPERT_ROLES: UserRole[] = ["expert", "org_admin", "super_admin"];
export const LOGISTICS_ROLES: UserRole[] = ["trader", "supplier", "org_admin", "super_admin", "platform_admin", "admin"];

export function hasRole(userRole: UserRole | null | undefined, role: UserRole): boolean {
  return userRole === role;
}

export function hasAnyRole(userRole: UserRole | null | undefined, allowedRoles: UserRole[]): boolean {
  if (!userRole) return false;
  return allowedRoles.includes(userRole);
}
