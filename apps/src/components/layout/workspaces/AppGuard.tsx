"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { useMockSession } from "@/lib/auth/mock-session";

export function AppGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated, hasStaleSession } = useMockSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      const target = hasStaleSession ? "/auth/restore-session" : "/auth/login";
      router.replace(`${target}?next=${encodeURIComponent(pathname)}`);
    }
  }, [hasStaleSession, isAuthenticated, isLoading, pathname, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
