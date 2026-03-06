"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { securityService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import type { MfaMethod } from "@/lib/auth/types";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";

export default function AppProfilePage() {
  const { session } = useMockSession();
  const queryClient = useQueryClient();

  const securityQuery = useQuery({
    queryKey: ["security-settings", session?.user.id],
    queryFn: () => securityService.getSettings(session!.user.id),
    enabled: Boolean(session),
  });

  const sessionsQuery = useQuery({
    queryKey: ["security-sessions", session?.user.id],
    queryFn: () => securityService.listSessions(session!.user.id),
    enabled: Boolean(session),
  });

  const [securityDraft, setSecurityDraft] = useState<{
    mfaEnabled: boolean;
    mfaMethod: MfaMethod;
    passkeyEnabled: boolean;
    loginAlerts: boolean;
    trustedDevicesOnly: boolean;
  } | null>(null);

  const securityValues = useMemo(() => {
    return (
      securityDraft ?? {
        mfaEnabled: securityQuery.data?.mfaEnabled ?? true,
        mfaMethod: securityQuery.data?.mfaMethod ?? "authenticator",
        passkeyEnabled: securityQuery.data?.passkeyEnabled ?? false,
        loginAlerts: securityQuery.data?.loginAlerts ?? true,
        trustedDevicesOnly: securityQuery.data?.trustedDevicesOnly ?? false,
      }
    );
  }, [securityDraft, securityQuery.data]);

  const updateSecurityMutation = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No session");
      return securityService.updateSettings(session.user.id, securityValues);
    },
    onSuccess: () => {
      setSecurityDraft(null);
      queryClient.invalidateQueries({ queryKey: ["security-settings", session?.user.id] });
      toast({ title: "Security settings saved", variant: "success" });
    },
    onError: (error) =>
      toast({
        title: "Failed to save security settings",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      }),
  });

  const rotateCodesMutation = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No session");
      return securityService.rotateBackupCodes(session.user.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security-settings", session?.user.id] });
      toast({ title: "Backup codes rotated", variant: "success" });
    },
    onError: (error) =>
      toast({
        title: "Could not rotate backup codes",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      }),
  });

  const terminateSessionMutation = useMutation({
    mutationFn: (sessionId: string) => {
      if (!session) throw new Error("No session");
      return securityService.terminateSession(session.user.id, sessionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["security-sessions", session?.user.id] });
      toast({ title: "Session terminated", variant: "success" });
    },
  });

  const backupCodes = securityQuery.data?.backupCodes ?? [];
  const sessions = sessionsQuery.data ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Profile & Security"
        subtitle="Manage authentication posture and active sessions."
        breadcrumbs={[{ label: "App", href: "/app" }, { label: "Profile" }]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Session payload</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="overflow-auto rounded-xl border border-border/60 bg-muted/40 p-4 text-sm">
            {JSON.stringify(session, null, 2)}
          </pre>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Security Controls</CardTitle>
            <Badge variant={securityValues.mfaEnabled ? "success" : "warning"}>
              {securityValues.mfaEnabled ? "MFA Enabled" : "MFA Disabled"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-2">
            <div className="space-y-1.5">
              <Label>MFA method</Label>
              <Select
                value={securityValues.mfaMethod}
                onValueChange={(value) =>
                  setSecurityDraft((current) => ({
                    ...(current ?? securityValues),
                    mfaMethod: value as MfaMethod,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="authenticator">Authenticator App</SelectItem>
                  <SelectItem value="sms">SMS OTP</SelectItem>
                  <SelectItem value="email">Email OTP</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 rounded-xl border border-border/60 bg-background/55 p-3">
              <div className="flex items-center justify-between text-sm">
                <span>Require MFA at sign in</span>
                <Switch
                  checked={securityValues.mfaEnabled}
                  onCheckedChange={(value) =>
                    setSecurityDraft((current) => ({
                      ...(current ?? securityValues),
                      mfaEnabled: value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Enable passkeys</span>
                <Switch
                  checked={securityValues.passkeyEnabled}
                  onCheckedChange={(value) =>
                    setSecurityDraft((current) => ({
                      ...(current ?? securityValues),
                      passkeyEnabled: value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Login alerts</span>
                <Switch
                  checked={securityValues.loginAlerts}
                  onCheckedChange={(value) =>
                    setSecurityDraft((current) => ({
                      ...(current ?? securityValues),
                      loginAlerts: value,
                    }))
                  }
                />
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Trusted devices only</span>
                <Switch
                  checked={securityValues.trustedDevicesOnly}
                  onCheckedChange={(value) =>
                    setSecurityDraft((current) => ({
                      ...(current ?? securityValues),
                      trustedDevicesOnly: value,
                    }))
                  }
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button onClick={() => updateSecurityMutation.mutate()} loading={updateSecurityMutation.isPending}>
              Save Security Settings
            </Button>
            <Button variant="outline" onClick={() => rotateCodesMutation.mutate()} loading={rotateCodesMutation.isPending}>
              Rotate Backup Codes
            </Button>
          </div>

          <div className="rounded-xl border border-border/60 bg-background/55 p-3">
            <p className="mb-2 text-sm font-medium">Recovery codes</p>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {backupCodes.map((code) => (
                <code key={code} className="rounded-md border border-border/60 bg-muted/40 px-2 py-1 text-xs">
                  {code}
                </code>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active Sessions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {sessions.map((deviceSession) => (
            <div key={deviceSession.id} className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/55 p-3">
              <div className="text-sm">
                <div className="font-medium">{deviceSession.device}</div>
                <div className="text-xs text-muted-foreground">
                  {deviceSession.location} • {deviceSession.ipAddress} • Last seen {new Date(deviceSession.lastSeenAt).toLocaleString()}
                </div>
              </div>
              {deviceSession.current ? (
                <Badge variant="outline">Current</Badge>
              ) : (
                <Button size="sm" variant="outline" onClick={() => terminateSessionMutation.mutate(deviceSession.id)}>
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>

    </div>
  );
}
