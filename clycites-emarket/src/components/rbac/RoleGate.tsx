"use client";

import { useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth/auth-context";
import type { UserRole } from "@/lib/api/types/shared.types";
import { LoadingState } from "@/components/shared/LoadingState";
import { Button } from "@/components/ui/button";
import { canAccessRoute } from "@/lib/rbac/guard";

interface RoleGateProps {
  allowedRoles?: UserRole[];
  redirectTo?: string;
  children: React.ReactNode;
}

export function RoleGate({ allowedRoles, redirectTo = "/dashboard", children }: RoleGateProps) {
  const router = useRouter();
  const { isLoading, isAuthenticated, role } = useAuth();

  const hasAccess = useMemo(() => {
    return canAccessRoute(role, allowedRoles);
  }, [allowedRoles, role]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return <LoadingState text="Checking access..." className="min-h-[40vh]" />;

  if (!isAuthenticated) {
    return <LoadingState text="Redirecting to login..." className="min-h-[40vh]" />;
  }

  if (!hasAccess) {
    return (
      <div className="mx-auto max-w-xl rounded-2xl border border-destructive/30 bg-card/90 p-6 text-center">
        <h2 className="text-lg font-semibold">Insufficient permissions</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your current role cannot access this area.
        </p>
        <Button className="mt-4" variant="outline" onClick={() => router.push(redirectTo)}>
          Back to dashboard
        </Button>
      </div>
    );
  }

  return <>{children}</>;
}
