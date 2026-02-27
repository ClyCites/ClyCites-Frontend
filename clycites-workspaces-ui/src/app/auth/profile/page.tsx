"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useMockSession } from "@/lib/auth/mock-session";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthProfilePage() {
  const router = useRouter();
  const { session, isLoading, isAuthenticated } = useMockSession();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  if (!session) {
    return null;
  }

  return (
    <div className="mx-auto max-w-3xl py-10">
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
    </div>
  );
}
