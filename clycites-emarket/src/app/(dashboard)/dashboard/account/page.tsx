"use client";

import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  KeyRound,
  Laptop,
  Lock,
  ShieldCheck,
  Smartphone,
  UserCircle2,
} from "lucide-react";
import { KpiCard } from "@/components/dashboard/KpiCard";
import { DataTable, type Column } from "@/components/market/DataTable";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authApi } from "@/lib/api/endpoints/auth.api";
import { useAuth } from "@/lib/auth/auth-context";
import type { ApiToken, AuthAccountPayload, DeviceRecord, TotpSetupResponse } from "@/lib/api/types/shared.types";
import { toast } from "@/components/ui/use-toast";

const profileSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  timezone: z.string().min(2),
  language: z.string().min(2),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(12, "New password must be at least 12 characters"),
});

type ProfileForm = z.infer<typeof profileSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

function toArray<T>(input: unknown): T[] {
  if (Array.isArray(input)) return input as T[];
  if (input && typeof input === "object" && Array.isArray((input as { data?: unknown[] }).data)) {
    return ((input as { data: unknown[] }).data ?? []) as T[];
  }
  return [];
}

export default function AccountDashboardPage() {
  const queryClient = useQueryClient();
  const { role } = useAuth();
  const [totpSetup, setTotpSetup] = useState<TotpSetupResponse | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const accountQuery = useQuery({ queryKey: ["account", "me"], queryFn: () => authApi.me() });
  const devicesQuery = useQuery({ queryKey: ["account", "devices"], queryFn: () => authApi.listDevices() });
  const tokensQuery = useQuery({ queryKey: ["account", "tokens"], queryFn: () => authApi.listTokens() });

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { firstName: "", lastName: "", phone: "", timezone: "UTC", language: "en" },
  });
  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { currentPassword: "", newPassword: "" },
  });

  useEffect(() => {
    const account = accountQuery.data;
    if (!account) return;
    profileForm.reset({
      firstName: account.user.firstName ?? "",
      lastName: account.user.lastName ?? "",
      phone: account.user.phone ?? "",
      timezone: account.user.timezone ?? "UTC",
      language: account.user.language ?? "en",
    });
  }, [accountQuery.data, profileForm]);

  const updateProfileMutation = useMutation({
    mutationFn: (values: ProfileForm) => authApi.updateMyProfile(values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
      toast({ title: "Profile updated", variant: "success" });
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: (values: PasswordForm) => authApi.changePassword(values.currentPassword, values.newPassword),
    onSuccess: () => {
      passwordForm.reset();
      toast({ title: "Password changed", variant: "success" });
    },
  });

  const setupTotpMutation = useMutation({
    mutationFn: () => authApi.setupTotp(),
    onSuccess: (result) => {
      setTotpSetup(result);
      setBackupCodes([]);
      toast({ title: "TOTP setup started", variant: "success" });
    },
  });

  const verifyTotpMutation = useMutation({
    mutationFn: () => authApi.verifyTotp(totpCode),
    onSuccess: (result) => {
      setTotpSetup(null);
      setTotpCode("");
      setBackupCodes(result.backupCodes ?? []);
      queryClient.invalidateQueries({ queryKey: ["account", "me"] });
      toast({ title: "MFA enabled", variant: "success" });
    },
  });

  const enableEmailOtpMutation = useMutation({ mutationFn: () => authApi.enableEmailOtp() });
  const requestEmailOtpMutation = useMutation({ mutationFn: () => authApi.requestEmailOtp() });
  const disableMfaMutation = useMutation({
    mutationFn: () => authApi.disableMfa(),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account", "me"] }),
  });

  const verifyDeviceMutation = useMutation({
    mutationFn: (id: string) => authApi.verifyDevice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account", "devices"] }),
  });
  const blockDeviceMutation = useMutation({
    mutationFn: (id: string) => authApi.blockDevice(id, "Blocked from account dashboard"),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account", "devices"] }),
  });
  const revokeDeviceMutation = useMutation({
    mutationFn: (id: string) => authApi.revokeDevice(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["account", "devices"] }),
  });

  const account = accountQuery.data as AuthAccountPayload | undefined;
  const devices = toArray<DeviceRecord>(devicesQuery.data);
  const tokens = toArray<ApiToken>(tokensQuery.data);
  const activeTokens = tokens.filter((item) => item.status === "active").length;

  const deviceColumns: Column<DeviceRecord>[] = useMemo(() => [
    {
      key: "device",
      header: "Device",
      render: (row) => (
        <div>
          <p className="font-medium">{row.deviceInfo.browser} on {row.deviceInfo.os}</p>
          <p className="text-xs text-muted-foreground">{row.lastLocation?.ip ?? "Unknown IP"}</p>
        </div>
      ),
    },
    {
      key: "trust",
      header: "Trust",
      render: (row) => <Badge variant={row.isTrusted ? "success" : "warning"}>{row.trustLevel}</Badge>,
    },
    {
      key: "actions",
      header: "Actions",
      render: (row) => (
        <div className="flex gap-1">
          {!row.isTrusted && row.status === "active" && (
            <Button size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); verifyDeviceMutation.mutate(row.id); }}>Verify</Button>
          )}
          {row.status === "active" && (
            <Button size="sm" variant="outline" onClick={(event) => { event.stopPropagation(); blockDeviceMutation.mutate(row.id); }}>Block</Button>
          )}
          {row.status !== "revoked" && (
            <Button size="sm" variant="destructive" onClick={(event) => { event.stopPropagation(); revokeDeviceMutation.mutate(row.id); }}>Revoke</Button>
          )}
        </div>
      ),
    },
  ], [blockDeviceMutation, revokeDeviceMutation, verifyDeviceMutation]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-[linear-gradient(135deg,hsl(var(--card)/0.95)_0%,hsl(var(--primary)/0.1)_100%)] p-6">
        <h2 className="font-display text-2xl font-bold sm:text-3xl">Enterprise Account Dashboard</h2>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Built against `auth.routes.ts`, `auth.controller.ts`, `auth.service.ts`, `apiToken.service.ts`,
          `security.routes.ts`, `security.controller.ts`, `device.service.ts`, and `mfa.service.ts`.
        </p>
      </section>

      {(accountQuery.error || devicesQuery.error || tokensQuery.error) && (
        <div className="grid gap-3">
          {accountQuery.error && <ApiErrorPanel error={accountQuery.error} />}
          {devicesQuery.error && <ApiErrorPanel error={devicesQuery.error} compact />}
          {tokensQuery.error && <ApiErrorPanel error={tokensQuery.error} compact />}
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard title="Profile Completion" value={String(account?.onboarding?.profileCompletionScore ?? 0)} trend="%" caption="Onboarding quality" />
        <KpiCard title="MFA Status" value={account?.security.isMfaEnabled ? "Enabled" : "Disabled"} trend={account?.security.isMfaEnabled ? "Secure" : "At risk"} caption="Security hardening" />
        <KpiCard title="Trusted Devices" value={String(devices.filter((item) => item.isTrusted).length)} trend={String(devices.length)} caption="trusted / total" />
        <KpiCard title="Active Tokens" value={String(activeTokens)} trend={String(tokens.length)} caption="active / total" />
      </section>

      <Tabs defaultValue="profile">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="tokens">Tokens</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><UserCircle2 className="h-5 w-5" />Profile</CardTitle>
              <CardDescription>Mapped to `PATCH /auth/me/profile`.</CardDescription>
            </CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={profileForm.handleSubmit((values) => updateProfileMutation.mutate(values))}>
                <div className="space-y-1.5"><Label>First Name</Label><Input {...profileForm.register("firstName")} /></div>
                <div className="space-y-1.5"><Label>Last Name</Label><Input {...profileForm.register("lastName")} /></div>
                <div className="space-y-1.5"><Label>Phone</Label><Input {...profileForm.register("phone")} /></div>
                <div className="space-y-1.5"><Label>Timezone</Label><Input {...profileForm.register("timezone")} /></div>
                <div className="space-y-1.5"><Label>Language</Label><Input {...profileForm.register("language")} /></div>
                <div className="md:col-span-2"><Button type="submit" loading={updateProfileMutation.isPending}>Save Profile</Button></div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><ShieldCheck className="h-5 w-5" />Security State</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2">
              <Badge variant={account?.security.isMfaEnabled ? "success" : "destructive"}>MFA {account?.security.isMfaEnabled ? "Enabled" : "Disabled"}</Badge>
              <Badge variant={account?.security.isLocked ? "destructive" : "success"}>{account?.security.isLocked ? "Locked" : "Active"}</Badge>
              <Badge variant={account?.security.suspiciousActivityDetected ? "warning" : "outline"}>
                Suspicious: {account?.security.suspiciousActivityDetected ? "Yes" : "No"}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Lock className="h-5 w-5" />Change Password</CardTitle></CardHeader>
            <CardContent>
              <form className="grid gap-4 md:grid-cols-2" onSubmit={passwordForm.handleSubmit((values) => changePasswordMutation.mutate(values))}>
                <div className="space-y-1.5"><Label>Current Password</Label><Input type="password" {...passwordForm.register("currentPassword")} /></div>
                <div className="space-y-1.5"><Label>New Password</Label><Input type="password" {...passwordForm.register("newPassword")} /></div>
                <div className="md:col-span-2"><Button type="submit" loading={changePasswordMutation.isPending}>Change Password</Button></div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Smartphone className="h-5 w-5" />MFA Controls</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setupTotpMutation.mutate()} loading={setupTotpMutation.isPending}>Setup TOTP</Button>
                <Button variant="outline" onClick={() => enableEmailOtpMutation.mutate()} loading={enableEmailOtpMutation.isPending}>Enable Email OTP</Button>
                <Button variant="outline" onClick={() => requestEmailOtpMutation.mutate()} loading={requestEmailOtpMutation.isPending}>Request Email OTP</Button>
                <Button variant="destructive" onClick={() => disableMfaMutation.mutate()} loading={disableMfaMutation.isPending}>Disable MFA</Button>
              </div>

              {totpSetup && (
                <div className="grid gap-4 rounded-xl border border-border/70 p-4 md:grid-cols-[220px_1fr]">
                  <div className="overflow-hidden rounded-lg border bg-white p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={totpSetup.qrCode} alt="TOTP QR" className="h-full w-full object-contain" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Verify using a 6-digit authenticator token.</p>
                    <Input value={totpCode} onChange={(event) => setTotpCode(event.target.value)} maxLength={6} />
                    <Button onClick={() => verifyTotpMutation.mutate()} disabled={totpCode.length !== 6} loading={verifyTotpMutation.isPending}>Verify TOTP</Button>
                  </div>
                </div>
              )}

              {backupCodes.length > 0 && (
                <div className="rounded-xl border border-warning/40 bg-warning/10 p-4">
                  <p className="mb-2 text-sm font-medium">Backup Codes</p>
                  <div className="grid gap-1 font-mono text-xs">
                    {backupCodes.map((code) => <span key={code}>{code}</span>)}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Laptop className="h-5 w-5" />Devices</CardTitle>
              <CardDescription>Mapped to `/security/devices` lifecycle endpoints.</CardDescription>
            </CardHeader>
            <CardContent>
              <DataTable data={devices} columns={deviceColumns} isLoading={devicesQuery.isLoading} emptyTitle="No devices" />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tokens">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><KeyRound className="h-5 w-5" />Token Governance</CardTitle>
              <CardDescription>Token lifecycle is managed by `apiToken.service.ts` APIs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Use dedicated token workflows for create/list/view/update/rotate/revoke/usage.
              </p>
              <div className="flex flex-wrap gap-2">
                <Button asChild><Link href="/dashboard/tokens">Open Token Vault</Link></Button>
                {role === "super_admin" && <Button variant="outline" asChild><Link href="/dashboard/super-admin">Open Super Admin Controls</Link></Button>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {(updateProfileMutation.error || changePasswordMutation.error || verifyTotpMutation.error) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-destructive" />Errors</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {updateProfileMutation.error && <ApiErrorPanel error={updateProfileMutation.error} compact />}
            {changePasswordMutation.error && <ApiErrorPanel error={changePasswordMutation.error} compact />}
            {verifyTotpMutation.error && <ApiErrorPanel error={verifyTotpMutation.error} compact />}
          </CardContent>
        </Card>
      )}

      <Card className="border-dashed">
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><CheckCircle2 className="h-5 w-5 text-emerald-600" />OAuth Note</CardTitle>
          <CardDescription>
            `oauth.service.ts` is implemented in backend, but OAuth HTTP routes are not exposed in current `auth.routes.ts`.
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
