"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { authService } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";

type ResetStep = "request" | "reset";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("request");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isResendingCode, setIsResendingCode] = useState(false);

  const handleRequestReset = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await authService.requestPasswordReset(email);
      toast({
        title: "Reset instructions sent",
        description: "If your email exists, you will receive a reset code.",
        variant: "success",
      });
      setStep("reset");
    } catch (error) {
      toast({
        title: "Unable to request reset",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation must match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 12) {
      toast({
        title: "Weak password",
        description: "Use at least 12 characters for the new password.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await authService.resetPassword(email, code, newPassword);
      toast({
        title: "Password reset complete",
        description: "Sign in with your new password.",
        variant: "success",
      });
      router.replace(`/auth/login?email=${encodeURIComponent(email)}`);
    } catch (error) {
      toast({
        title: "Reset failed",
        description: error instanceof Error ? error.message : "Could not reset password.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Enter your account email first.",
        variant: "destructive",
      });
      return;
    }

    setIsResendingCode(true);
    try {
      await authService.requestPasswordReset(email);
      toast({
        title: "Reset code sent",
        description: "A new reset code has been sent to your email.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Resend failed",
        description: error instanceof Error ? error.message : "Unable to resend reset code.",
        variant: "destructive",
      });
    } finally {
      setIsResendingCode(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl items-center px-4 py-10">
      <Card className="panel-surface w-full">
        <CardHeader>
          <div className="mb-2">
            <Image src="/logo.png" alt="ClyCites" width={752} height={927} className="h-16 w-auto" priority />
          </div>
          <CardTitle>Recover account access</CardTitle>
          <CardDescription>
            {step === "request"
              ? "Enter your account email to receive password reset instructions."
              : "Enter the reset code and create a new password."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "request" ? (
            <form className="space-y-4" onSubmit={handleRequestReset}>
              <div className="space-y-1.5">
                <Label htmlFor="email">Account email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <Button type="submit" className="w-full" loading={isSubmitting}>
                Send reset code
              </Button>
            </form>
          ) : (
            <form className="space-y-4" onSubmit={handleResetPassword}>
              <div className="space-y-1.5">
                <Label htmlFor="reset-email">Account email</Label>
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="reset-code">Reset code</Label>
                <Input
                  id="reset-code"
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  inputMode="numeric"
                  placeholder="6-digit code"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="new-password">New password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  required
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2">
                <Button type="button" variant="outline" onClick={() => setStep("request")}>
                  Back
                </Button>
                <div className="flex flex-wrap gap-2">
                  <Button type="button" variant="outline" onClick={handleResendCode} loading={isResendingCode}>
                    Resend code
                  </Button>
                  <Button type="submit" loading={isSubmitting}>
                    Reset password
                  </Button>
                </div>
              </div>
            </form>
          )}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-muted-foreground">
            <span>
              Back to{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Sign in
              </Link>
            </span>
            <Link href={`/auth/verify-otp?email=${encodeURIComponent(email)}`} className="text-primary hover:underline">
              Open OTP tools
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
