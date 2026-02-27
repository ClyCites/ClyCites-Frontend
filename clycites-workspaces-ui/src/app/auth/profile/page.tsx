"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { securityService } from "@/lib/api/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function AuthProfilePage() {
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useMockSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  const securityQuery = useQuery({
    queryKey: ["auth-security", session?.user.id],
    queryFn: () => securityService.getSettings(session!.user.id),
    enabled: Boolean(session),
  });

  const onboardingQuery = useQuery({
    queryKey: ["auth-onboarding", session?.user.id],
    queryFn: () => securityService.getOnboarding(session!.user.id),
    enabled: Boolean(session),
  });

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Auth Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-md border bg-muted/50 p-4 text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security Snapshot</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <span>MFA</span>
            <Badge variant={securityQuery.data?.mfaEnabled ? "success" : "warning"}>
              {securityQuery.data?.mfaEnabled ? "Enabled" : "Disabled"}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <span>Onboarding</span>
            <Badge variant={onboardingQuery.data ? "success" : "outline"}>{onboardingQuery.data ? "Completed" : "Pending"}</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
