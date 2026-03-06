"use client";

import Link from "next/link";
import { FormEvent, useState, Suspense } from "react";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { useSearchParams } from "next/navigation";
import { authService } from "@/lib/api";
import type { OtpPurpose } from "@/lib/auth/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";

const PURPOSE_OPTIONS: Array<{ value: OtpPurpose; label: string }> = [
  { value: "verification", label: "Account verification" },
  { value: "login", label: "Login challenge" },
  { value: "password_reset", label: "Password reset" },
];

function VerifyOtpPage() {
  const searchParams = useSearchParams();
  const seededEmail = searchParams.get("email") ?? "";

  const [email, setEmail] = useState(seededEmail);
  const [code, setCode] = useState("");
  const [purpose, setPurpose] = useState<OtpPurpose>("verification");
  const [isResending, setIsResending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleResend = async () => {
    if (!email.trim()) {
      toast({ title: "Email required", description: "Enter your account email first.", variant: "destructive" });
      return;
    }

    setIsResending(true);
    try {
      await authService.resendOtp(email.trim(), purpose);
      toast({
        title: "OTP sent",
        description: "A new code has been sent for this flow.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to send OTP",
        description: error instanceof Error ? error.message : "Could not send OTP.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleVerify = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!email.trim() || !code.trim()) {
      toast({
        title: "Missing details",
        description: "Email and OTP code are required.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      await authService.verifyOtp(email.trim(), code.trim(), purpose);
      toast({
        title: "OTP verified",
        description: "Verification completed successfully.",
        variant: "success",
      });
      setCode("");
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Unable to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <Card className="panel-surface w-full">
        <CardHeader>
          <CardTitle>OTP Verification</CardTitle>
          <CardDescription>Use this page for login, account verification, and password-reset OTP checks.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleVerify}>
            <div className="space-y-1.5">
              <Label htmlFor="otp-email">Email</Label>
              <Input
                id="otp-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@clycites.com"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otp-purpose">Purpose</Label>
              <Select value={purpose} onValueChange={(value) => setPurpose(value as OtpPurpose)}>
                <SelectTrigger id="otp-purpose">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PURPOSE_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="otp-code">Code</Label>
              <Input
                id="otp-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                inputMode="numeric"
                placeholder="Enter OTP code"
                required
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <Button type="button" variant="outline" onClick={handleResend} loading={isResending}>
                Resend OTP
              </Button>
              <Button type="submit" loading={isVerifying}>
                Verify OTP
              </Button>
            </div>
          </form>

          <div className="mt-4 text-sm text-muted-foreground">
            Return to{" "}
            <Link href="/auth/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyOtpPageWithSuspense() {
  return (
    <Suspense fallback={<LoadingSkeletons />}>
      <VerifyOtpPage />
    </Suspense>
  );
}
