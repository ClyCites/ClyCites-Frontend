"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockSession } from "@/lib/auth/mock-session";

export default function AppHomePage() {
  const router = useRouter();
  const { isLoading, isAuthenticated, activeWorkspace, availableWorkspaces } = useMockSession();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/auth/login");
      return;
    }

    const workspace = activeWorkspace ?? availableWorkspaces[0] ?? "farmer";
    router.replace(`/app/${workspace}`);
  }, [activeWorkspace, availableWorkspaces, isAuthenticated, isLoading, router]);

  return null;
}
