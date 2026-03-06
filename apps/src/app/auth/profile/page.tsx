"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMockSession } from "@/lib/auth/mock-session";
import { authService } from "@/lib/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

function splitName(name: string): { firstName: string; lastName: string } {
  const trimmed = name.trim();
  if (!trimmed) return { firstName: "", lastName: "" };

  const parts = trimmed.split(/\s+/);
  return {
    firstName: parts[0] ?? "",
    lastName: parts.slice(1).join(" "),
  };
}

export default function AuthProfilePage() {
  const router = useRouter();
  const { session, isLoading, isAuthenticated, refresh, logout } = useMockSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [timezone, setTimezone] = useState("");
  const [language, setLanguage] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isResendingOtp, setIsResendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/auth/login");
    }
  }, [isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (!session) return;
    const names = splitName(session.user.name);
    setFirstName(session.user.firstName ?? names.firstName);
    setLastName(session.user.lastName ?? names.lastName);
    setPhone(session.user.phone ?? "");
    setTimezone(session.user.timezone ?? "UTC");
    setLanguage(session.user.language ?? "en");
  }, [session]);

  const isEmailVerified = session?.user.isEmailVerified ?? true;

  const fullNamePreview = useMemo(() => {
    const combined = `${firstName} ${lastName}`.trim();
    return combined || session?.user.name || "";
  }, [firstName, lastName, session?.user.name]);

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSavingProfile(true);

    try {
      await authService.updateMyProfile({
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        timezone: timezone.trim() || undefined,
        language: language.trim() || undefined,
        profile: {
          displayName: fullNamePreview,
        },
      });
      await refresh();
      toast({
        title: "Profile updated",
        description: "Your account profile was updated successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Profile update failed",
        description: error instanceof Error ? error.message : "Unable to update profile.",
        variant: "destructive",
      });
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newPassword !== confirmPassword) {
      toast({
        title: "Password mismatch",
        description: "New password and confirmation do not match.",
        variant: "destructive",
      });
      return;
    }
    if (newPassword.length < 12) {
      toast({
        title: "Weak password",
        description: "Use at least 12 characters for your new password.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingPassword(true);
    try {
      await authService.changePassword(currentPassword, newPassword);
      await logout();
      toast({
        title: "Password changed",
        description: "Sign in again with your new password.",
        variant: "success",
      });
      router.replace("/auth/login");
    } catch (error) {
      toast({
        title: "Password update failed",
        description: error instanceof Error ? error.message : "Unable to update password.",
        variant: "destructive",
      });
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleResendVerificationOtp = async () => {
    if (!session?.user.email) return;

    setIsResendingOtp(true);
    try {
      await authService.resendOtp(session.user.email, "verification");
      toast({
        title: "Verification code sent",
        description: "A new OTP has been sent to your email.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to resend code",
        description: error instanceof Error ? error.message : "Could not resend verification code.",
        variant: "destructive",
      });
    } finally {
      setIsResendingOtp(false);
    }
  };

  const handleVerifyOtp = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!session?.user.email) return;
    if (!otpCode.trim()) {
      toast({
        title: "OTP required",
        description: "Enter the verification code to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsVerifyingOtp(true);
    try {
      await authService.verifyOtp(session.user.email, otpCode.trim(), "verification");
      setOtpCode("");
      await refresh();
      toast({
        title: "Email verified",
        description: "Your account email has been verified.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Verification failed",
        description: error instanceof Error ? error.message : "Unable to verify OTP.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  if (!session) return null;

  return (
    <div className="mx-auto max-w-5xl space-y-4 py-10">
      <Card className="panel-surface">
        <CardHeader>
          <CardTitle>Account Profile</CardTitle>
          <CardDescription>Manage your identity details, verification state, and password security.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Name</p>
            <p className="font-medium">{session.user.name}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Email</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Role</p>
            <p className="font-medium">{session.user.role ?? session.user.roles.join(", ")}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Email Verification</p>
            <Badge variant={isEmailVerified ? "success" : "warning"}>
              {isEmailVerified ? "Verified" : "Pending"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {!isEmailVerified && (
        <Card className="panel-surface">
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardDescription>Verify your account email using OTP.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <form className="grid gap-3 md:grid-cols-[1fr_auto]" onSubmit={handleVerifyOtp}>
              <div className="space-y-1.5">
                <Label htmlFor="verification-otp">Verification code</Label>
                <Input
                  id="verification-otp"
                  value={otpCode}
                  onChange={(event) => setOtpCode(event.target.value)}
                  inputMode="numeric"
                  placeholder="Enter OTP code"
                  required
                />
              </div>
              <div className="flex items-end gap-2">
                <Button type="button" variant="outline" onClick={handleResendVerificationOtp} loading={isResendingOtp}>
                  Resend code
                </Button>
                <Button type="submit" loading={isVerifyingOtp}>
                  Verify
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="panel-surface">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Updates are sent to `PATCH /api/v1/auth/me/profile`.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleProfileSubmit}>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="first-name">First name</Label>
                <Input id="first-name" value={firstName} onChange={(event) => setFirstName(event.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="last-name">Last name</Label>
                <Input id="last-name" value={lastName} onChange={(event) => setLastName(event.target.value)} required />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(event) => setPhone(event.target.value)} placeholder="+2567..." />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="timezone">Timezone</Label>
                <Input id="timezone" value={timezone} onChange={(event) => setTimezone(event.target.value)} placeholder="UTC" />
              </div>
              <div className="space-y-1.5 md:col-span-2">
                <Label htmlFor="language">Language</Label>
                <Input id="language" value={language} onChange={(event) => setLanguage(event.target.value)} placeholder="en" />
              </div>
            </div>
            <Button type="submit" loading={isSavingProfile}>
              Save profile changes
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="panel-surface">
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
          <CardDescription>For security, this signs you out after a successful change.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handlePasswordSubmit}>
            <div className="space-y-1.5">
              <Label htmlFor="current-password">Current password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(event) => setCurrentPassword(event.target.value)}
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
              <Label htmlFor="confirm-new-password">Confirm new password</Label>
              <Input
                id="confirm-new-password"
                type="password"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required
              />
            </div>
            <Button type="submit" loading={isSavingPassword}>
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator />
      <div className="text-sm text-muted-foreground">
        Need OTP verification for another flow?{" "}
        <Link href="/auth/verify-otp" className="text-primary hover:underline">
          Open OTP tools
        </Link>
      </div>
    </div>
  );
}
