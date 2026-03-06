"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockSession } from "@/lib/auth/mock-session";

export default function AppHomePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, hasStaleSession, activeWorkspace, availableWorkspaces } = useMockSession();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(hasStaleSession ? "/auth/restore-session" : "/auth/login");
      return;
    }

    const workspace = activeWorkspace ?? availableWorkspaces[0] ?? "farmer";
    router.replace(`/app/${workspace}`);
  }, [activeWorkspace, availableWorkspaces, hasStaleSession, isAuthenticated, isLoading, router]);

  return null;
}
