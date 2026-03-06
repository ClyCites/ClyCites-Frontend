"use client";

import { useEffect, useState, Suspense } from "react";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { useMockSession } from "@/lib/auth/mock-session";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

function RestoreSessionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/app";
  const [isRestoring, setIsRestoring] = useState(false);

  const {
    isLoading,
    isAuthenticated,
    hasStaleSession,
    lastProfile,
    refresh,
    clearStaleSession,
  } = useMockSession();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace(nextPath);
      return;
    }
    if (!hasStaleSession) {
      router.replace(`/auth/login?next=${encodeURIComponent(nextPath)}`);
    }
  }, [hasStaleSession, isAuthenticated, isLoading, nextPath, router]);

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      await refresh();
      toast({
        title: "Session restore requested",
        description: "If refresh succeeded, you will be redirected automatically.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Unable to restore session",
        description: error instanceof Error ? error.message : "Please sign in again.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  const handleSignInAgain = async () => {
    await clearStaleSession();
    router.replace(`/auth/login?next=${encodeURIComponent(nextPath)}`);
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <Card className="w-full panel-surface">
        <CardHeader>
          <div className="mb-2">
            <Image src="/logo.png" alt="ClyCites" width={752} height={927} className="h-16 w-auto" priority />
          </div>
          <CardTitle>Restore Session</CardTitle>
          <CardDescription>Your previous access token appears expired. Try restoring your session or sign in again.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-xl border border-warning/40 bg-warning/10 p-3 text-sm">
            <div className="flex items-start gap-2">
              <AlertTriangle className="mt-0.5 h-4 w-4 text-warning" />
              <div>
                <p className="font-medium">Session refresh required</p>
                <p className="text-muted-foreground">
                  We found a stale session token. Restoring uses your refresh token if still valid.
                </p>
              </div>
            </div>
          </div>

          {lastProfile && (
            <div className="rounded-xl border border-border/60 bg-background/55 p-3 text-sm">
              <p className="font-medium">Last known profile</p>
              <p className="text-muted-foreground">{lastProfile.name}</p>
              <p className="text-muted-foreground">{lastProfile.email}</p>
              <p className="text-muted-foreground">Workspace: {lastProfile.workspace}</p>
              <p className="text-xs text-muted-foreground">
                Captured {new Date(lastProfile.capturedAt).toLocaleString()}
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-2">
            <Button onClick={handleRestore} loading={isRestoring}>
              Restore Session
            </Button>
            <Button variant="outline" onClick={handleSignInAgain}>
              Sign In Again
            </Button>
          </div>

          <div className="text-sm text-muted-foreground">
            Need a different account?{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Open sign-in page
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function RestoreSessionPageWithSuspense() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      <RestoreSessionPage />
    </Suspense>
  );
}
