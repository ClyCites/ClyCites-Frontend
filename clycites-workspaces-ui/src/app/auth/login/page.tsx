"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Lock, ShieldCheck } from "lucide-react";
import { authService, securityService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";

function isMfaChallenge(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;

  const candidate = error as { code?: unknown; name?: unknown; message?: unknown };
  const code = typeof candidate.code === "string" ? candidate.code.toLowerCase() : "";
  const name = typeof candidate.name === "string" ? candidate.name.toLowerCase() : "";
  const message = typeof candidate.message === "string" ? candidate.message.toLowerCase() : "";

  return (
    code.includes("mfa_required") ||
    code.includes("otp") ||
    name.includes("authmfarequirederror") ||
    message.includes("mfa") ||
    message.includes("otp")
  );
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = searchParams.get("next") || "/app";

  const { login, isLoading, isAuthenticated } = useMockSession();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [trustedDevice, setTrustedDevice] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [otpPassword, setOtpPassword] = useState("");
  const [isOtpSubmitting, setIsOtpSubmitting] = useState(false);
  const [isOtpResending, setIsOtpResending] = useState(false);

  useEffect(() => {
    const seededEmail = searchParams.get("email");
    if (seededEmail && !email) {
      setEmail(seededEmail);
    }
  }, [email, searchParams]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextPath);
    }
  }, [isAuthenticated, isLoading, nextPath, router]);

  const continueAfterLogin = async (passwordValue: string): Promise<boolean> => {
    try {
      const session = await login(email, passwordValue);
      securityService.initializeForUser(session.user.id, {
        trustedDevicesOnly: !trustedDevice,
      });

      toast({ title: "Signed in", variant: "success" });
      router.replace(nextPath);
      return true;
    } catch (error) {
      if (isMfaChallenge(error)) {
        setOtpPassword(passwordValue);
        setOtpCode("");
        setOtpOpen(true);

        try {
          await authService.requestLoginOtp(email);
        } catch {
          // Login challenge may already trigger OTP delivery on backend.
        }

        toast({
          title: "Verification required",
          description: "Enter the OTP sent for this account to continue.",
          variant: "default",
        });
        return false;
      }

      throw error;
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await continueAfterLogin(password);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to sign in.";
      toast({ title: "Login failed", description: message, variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!otpCode.trim()) {
      toast({ title: "OTP required", description: "Enter the verification code.", variant: "destructive" });
      return;
    }

    setIsOtpSubmitting(true);
    try {
      await authService.verifyMfaCode(email, otpCode.trim());
      const signedIn = await continueAfterLogin(otpPassword || password);
      if (signedIn) {
        setOtpOpen(false);
        setOtpCode("");
        setOtpPassword("");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to verify OTP.";
      toast({ title: "Verification failed", description: message, variant: "destructive" });
    } finally {
      setIsOtpSubmitting(false);
    }
  };

  const handleOtpResend = async () => {
    setIsOtpResending(true);
    try {
      await authService.requestLoginOtp(email);
      toast({ title: "OTP sent", description: "A new verification code has been sent.", variant: "success" });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unable to resend OTP.";
      toast({ title: "Resend failed", description: message, variant: "destructive" });
    } finally {
      setIsOtpResending(false);
    }
  };

  return (
    <>
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10">
        <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden flex-col justify-center rounded-3xl border border-border/70 bg-card/70 p-10 lg:flex">
            <Image src="/logo.png" alt="ClyCites" width={752} height={927} className="h-20 w-auto" priority />
            <h1 className="mt-6 text-4xl font-semibold leading-tight">ClyCites Secure Workspace Access</h1>
            <p className="mt-3 text-muted-foreground">
              Sign in to access your workspaces, role-based tools, and operational dashboards.
            </p>

            <div className="mt-6 grid gap-3">
              <div className="rounded-xl border border-border/60 bg-background/55 p-3 text-sm text-muted-foreground">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <ShieldCheck className="h-4 w-4 text-success" />
                  Server-enforced security flow
                </div>
                MFA is requested only when your account requires it.
              </div>
              <div className="rounded-xl border border-border/60 bg-background/55 p-3 text-sm text-muted-foreground">
                <div className="mb-1 flex items-center gap-2 text-foreground">
                  <Lock className="h-4 w-4 text-primary" />
                  Protected workspace access
                </div>
                Access is scoped by organization, role permissions, and module-level controls.
              </div>
            </div>
          </div>

          <Card className="panel-surface">
            <CardHeader>
              <Image
                src="/logo.png"
                alt="ClyCites"
                width={752}
                height={927}
                className="mb-2 h-14 w-auto lg:hidden"
                priority
              />
              <div className="flex items-center justify-between gap-3">
                <div>
                  <CardTitle>Sign in</CardTitle>
                  <CardDescription>Access your workspace and continue where you left off.</CardDescription>
                </div>
                <Badge variant="outline">Secure Login</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                </div>

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

                <Button className="w-full" type="submit" loading={isSubmitting || isLoading}>
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

      <Dialog open={otpOpen} onOpenChange={(open) => (!isOtpSubmitting ? setOtpOpen(open) : undefined)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verify One-Time Passcode</DialogTitle>
            <DialogDescription>
              Enter the OTP sent to <span className="font-medium text-foreground">{email}</span> to complete sign-in.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-3" onSubmit={handleOtpVerify}>
            <div className="space-y-1.5">
              <Label htmlFor="otp-code">OTP code</Label>
              <Input
                id="otp-code"
                value={otpCode}
                onChange={(event) => setOtpCode(event.target.value)}
                inputMode="numeric"
                placeholder="Enter 6-digit code"
                required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleOtpResend} loading={isOtpResending}>
                Resend OTP
              </Button>
              <Button type="submit" loading={isOtpSubmitting}>
                Verify and Continue
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
