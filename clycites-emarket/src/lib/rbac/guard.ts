import type { UserRole } from "@/lib/api/types/shared.types";

export function canAccessRoute(
  role: UserRole | null | undefined,
  allowedRoles?: UserRole[]
): boolean {
  if (!allowedRoles || allowedRoles.length === 0) return true;
  if (!role) return false;
  return allowedRoles.includes(role);
}
