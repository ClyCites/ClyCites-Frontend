"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { authApi } from "@/lib/api/endpoints/auth.api";
import { Reveal } from "@/lib/motion";
import { Lock, Shield, Smartphone } from "lucide-react";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

function ChangePasswordSection() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setLoading(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast({
        title: "Password updated",
        description: "Your password has been changed successfully.",
        variant: "success",
      });
      reset();
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to change password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lock className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Change Password</CardTitle>
        </div>
        <CardDescription>Update your account password</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
          <div className="space-y-1.5">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              {...register("currentPassword")}
              disabled={loading}
            />
            {errors.currentPassword && (
              <p className="text-sm text-destructive">{errors.currentPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register("newPassword")}
              disabled={loading}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword")}
              disabled={loading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" disabled={loading} loading={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

function MFASection() {
  const { toast } = useToast();
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [backupCodes, setBackupCodes] = useState<string[] | null>(null);
  const [verifyToken, setVerifyToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);

  const handleSetupTOTP = async () => {
    setLoading(true);
    try {
      const result = await authApi.setupTotp();
      setQrCode(result.qrCodeUri);
      setBackupCodes(result.backupCodes);
      toast({
        title: "MFA Setup Initiated",
        description: "Scan the QR code with your authenticator app.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to setup MFA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyTOTP = async () => {
    if (!verifyToken) return;
    setLoading(true);
    try {
      await authApi.verifyTotp(verifyToken);
      toast({
        title: "MFA Enabled",
        description: "Two-factor authentication has been enabled for your account.",
        variant: "success",
      });
      setSetupComplete(true);
      setQrCode(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDisableMFA = async () => {
    setLoading(true);
    try {
      await authApi.disableMfa();
      toast({
        title: "MFA Disabled",
        description: "Two-factor authentication has been disabled.",
        variant: "success",
      });
      setSetupComplete(false);
      setQrCode(null);
      setBackupCodes(null);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to disable MFA",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-muted-foreground" />
          <CardTitle>Two-Factor Authentication (MFA)</CardTitle>
        </div>
        <CardDescription>
          Add an extra layer of security with TOTP-based authentication
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {setupComplete ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-green-100 border border-green-200 p-4">
              <p className="text-sm text-green-900 font-medium">
                ✓ Two-factor authentication is enabled
              </p>
            </div>
            <Button
              variant="destructive"
              onClick={handleDisableMFA}
              disabled={loading}
              loading={loading}
            >
              Disable MFA
            </Button>
          </div>
        ) : qrCode ? (
          <div className="space-y-4 max-w-md">
            <div className="space-y-2">
              <p className="text-sm font-medium">Step 1: Scan QR Code</p>
              <div className="rounded-lg border p-4 bg-white">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrCode} alt="TOTP QR Code" className="mx-auto" />
              </div>
            </div>

            {backupCodes && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Backup Codes (Save these!)</p>
                <div className="rounded-lg bg-muted p-3 font-mono text-xs space-y-1">
                  {backupCodes.map((code, i) => (
                    <div key={i}>{code}</div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <p className="text-sm font-medium">Step 2: Verify Code</p>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter 6-digit code"
                  value={verifyToken}
                  onChange={(e) => setVerifyToken(e.target.value)}
                  maxLength={6}
                  disabled={loading}
                />
                <Button
                  onClick={handleVerifyTOTP}
                  disabled={loading || verifyToken.length !== 6}
                  loading={loading}
                >
                  Verify
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <Button onClick={handleSetupTOTP} disabled={loading} loading={loading}>
            <Smartphone className="h-4 w-4 mr-2" />
            Enable MFA
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

export default function SettingsPage() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-4xl">
      <Reveal>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
          <p className="text-muted-foreground mt-1">Manage your account security and preferences</p>
        </div>
      </Reveal>

      <div className="space-y-6">
        <Reveal>
          <ChangePasswordSection />
        </Reveal>

        <Reveal>
          <MFASection />
        </Reveal>
      </div>
    </div>
  );
}
