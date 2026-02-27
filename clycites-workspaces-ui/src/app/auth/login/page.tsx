"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, ShieldCheck, Sprout } from "lucide-react";
import { authService, securityService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export default function MockLoginPage() {
  const router = useRouter();
  const { login, logout, isLoading } = useMockSession();
  const [email, setEmail] = useState(() => {
    if (typeof window === "undefined") return "ops@clycites.io";
    return new URLSearchParams(window.location.search).get("email") ?? "ops@clycites.io";
  });
  const [password, setPassword] = useState("ops12345");
  const [mfaCode, setMfaCode] = useState("");
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [forceMfaPrompt, setForceMfaPrompt] = useState(false);

  const mfaPolicy = useMemo(() => authService.getMfaPolicy(email), [email]);
  const requiresMfa = forceMfaPrompt || mfaPolicy.requiresMfa;

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      const session = await login(email, password);
      securityService.initializeForUser(session.user.id, {
        trustedDevicesOnly: !trustedDevice,
      });

      const resolvedMfaPolicy = authService.getMfaPolicy(email);
      if (resolvedMfaPolicy.requiresMfa) {
        if (!mfaCode.trim()) {
          setForceMfaPrompt(true);
          await logout();
          toast({
            title: "MFA required",
            description: "This account has MFA enabled. Enter your one-time code to continue.",
            variant: "default",
          });
          return;
        }

        try {
          await authService.verifyMfaCode(email, mfaCode);
        } catch (error) {
          await logout();
          throw error;
        }
        setForceMfaPrompt(false);
      } else {
        toast({
          title: "Security reminder",
          description: "MFA is not enabled yet. Activate it from Profile > Security.",
          variant: "default",
        });
      }

      const onboardingComplete = await securityService.isOnboardingComplete(session.user.id);
      const nextPath = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("next") : null;

      toast({ title: "Signed in", variant: "success" });
      router.replace(onboardingComplete ? nextPath || "/app" : "/auth/onboarding");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Invalid credentials";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="hidden flex-col justify-center rounded-3xl border border-border/70 bg-card/70 p-10 lg:flex">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
            <Sprout className="h-6 w-6" />
          </div>
          <h1 className="mt-6 text-4xl font-semibold leading-tight">ClyCites Secure Workspace Access</h1>
          <p className="mt-3 text-muted-foreground">
            Access value-chain and intelligence workspaces with role-based controls, onboarding, and built-in security posture checks.
          </p>

          <div className="mt-6 grid gap-3">
            <div className="rounded-xl border border-border/60 bg-background/55 p-3 text-sm text-muted-foreground">
              <div className="mb-1 flex items-center gap-2 text-foreground">
                <ShieldCheck className="h-4 w-4 text-success" />
                Multi-factor challenge for accounts with MFA enabled
              </div>
              Demo MFA code: <span className="font-medium text-foreground">123456</span>
            </div>
            <div className="rounded-xl border border-border/60 bg-background/55 p-3 text-sm text-muted-foreground">
              <div className="mb-1 flex items-center gap-2 text-foreground">
                <Lock className="h-4 w-4 text-primary" />
                Seed credentials for evaluation
              </div>
              <ul className="space-y-1 text-xs">
                {authService.getCredentials().map((credential) => (
                  <li key={credential.email}>
                    <span className="font-medium text-foreground">{credential.email}</span> / {credential.password}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Card className="panel-surface">
          <CardHeader>
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Access your workspace and continue where you left off.</CardDescription>
              </div>
              <Badge variant={requiresMfa ? "warning" : "outline"}>
                {requiresMfa ? "MFA Required" : "Standard Login"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submit}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    setForceMfaPrompt(false);
                  }}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>

              {requiresMfa && (
                <div className="space-y-1.5 rounded-xl border border-warning/40 bg-warning/10 p-3">
                  <Label htmlFor="mfa">Authenticator code</Label>
                  <Input
                    id="mfa"
                    inputMode="numeric"
                    value={mfaCode}
                    onChange={(event) => setMfaCode(event.target.value)}
                    placeholder="Enter 6-digit code"
                    required
                  />
                  <p className="text-xs text-muted-foreground">{mfaPolicy.challengeHint}</p>
                </div>
              )}

              {!requiresMfa && (
                <div className="rounded-xl border border-primary/30 bg-primary/5 p-3 text-xs text-muted-foreground">
                  MFA is not activated for this account. Activate it after sign-in from{" "}
                  <span className="font-medium text-foreground">Profile &gt; Security</span>.
                </div>
              )}

              <div className="flex items-center gap-2 text-sm">
                <Checkbox
                  id="trusted-device"
                  checked={trustedDevice}
                  onCheckedChange={(checked) => setTrustedDevice(Boolean(checked))}
                />
                <Label htmlFor="trusted-device" className="text-sm font-normal text-muted-foreground">
                  Mark this device as trusted
                </Label>
              </div>

              <Button className="w-full" type="submit" loading={isLoading}>
                Continue
              </Button>
            </form>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
              <Link href="/auth/register" className="text-primary hover:underline">
                Create an account
              </Link>
              <div className="flex items-center gap-3">
                <Link href="/auth/forgot-password" className="text-primary hover:underline">
                  Forgot password?
                </Link>
                <Link href="/auth/profile" className="text-muted-foreground hover:text-foreground">
                  View auth profile
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
