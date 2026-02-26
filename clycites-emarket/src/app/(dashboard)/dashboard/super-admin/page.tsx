"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Shield, ShieldCheck, UserRoundCog } from "lucide-react";
import { RoleGate } from "@/components/rbac/RoleGate";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { superAdminApi, analyticsApi, auditApi } from "@/lib/api/endpoints/platform.api";
import { SUPER_ADMIN_ROLES } from "@/lib/rbac/roles";
import { toast } from "@/components/ui/use-toast";

export default function SuperAdminPage() {
  return (
    <RoleGate allowedRoles={SUPER_ADMIN_ROLES}>
      <SuperAdminContent />
    </RoleGate>
  );
}

function SuperAdminContent() {
  const qc = useQueryClient();
  const [maintenanceReason, setMaintenanceReason] = useState("Operational maintenance window");
  const [maintenanceMessage, setMaintenanceMessage] = useState("Scheduled platform maintenance");
  const [flagsReason, setFlagsReason] = useState("Controlled rollout");
  const [impersonationReason, setImpersonationReason] = useState("Support incident investigation");
  const [targetUserId, setTargetUserId] = useState("");

  const maintenanceQuery = useQuery({
    queryKey: ["super-admin", "maintenance"],
    queryFn: () => superAdminApi.getMaintenanceMode(),
  });

  const flagsQuery = useQuery({
    queryKey: ["super-admin", "flags"],
    queryFn: () => superAdminApi.getFeatureFlags(),
  });

  const impersonationQuery = useQuery({
    queryKey: ["super-admin", "impersonation"],
    queryFn: () => superAdminApi.listImpersonationSessions(),
  });

  const analyticsQuery = useQuery({
    queryKey: ["super-admin", "global-analytics"],
    queryFn: () => analyticsApi.global({ period: "30d" }),
  });

  const auditQuery = useQuery({
    queryKey: ["super-admin", "audit"],
    queryFn: () => auditApi.list({ limit: 20 }),
  });

  const maintenanceMutation = useMutation({
    mutationFn: (enabled: boolean) =>
      superAdminApi.updateMaintenanceMode({
        enabled,
        message: maintenanceMessage,
        reason: maintenanceReason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "maintenance"] });
      toast({ title: "Maintenance mode updated", variant: "success" });
    },
  });

  const flagsMutation = useMutation({
    mutationFn: (flags: Record<string, boolean>) =>
      superAdminApi.updateFeatureFlags({
        flags,
        reason: flagsReason,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "flags"] });
      toast({ title: "Feature flags updated", variant: "success" });
    },
  });

  const startImpersonationMutation = useMutation({
    mutationFn: () =>
      superAdminApi.startImpersonation({
        targetUserId,
        reason: impersonationReason,
        ttlMinutes: 15,
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "impersonation"] });
      toast({ title: "Impersonation session started", variant: "success" });
    },
  });

  const revokeImpersonationMutation = useMutation({
    mutationFn: (sessionId: string) =>
      superAdminApi.revokeImpersonationSession(sessionId, "Session revoked from control center"),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["super-admin", "impersonation"] });
      toast({ title: "Impersonation session revoked", variant: "success" });
    },
  });

  const flags = useMemo(() => {
    const data = flagsQuery.data as { flags?: Record<string, boolean> } | undefined;
    const defaultFlags = {
      orderEscrowV2: true,
      aiPriceAdvisory: false,
      lowBandwidthDefaults: true,
    };
    return data?.flags ?? defaultFlags;
  }, [flagsQuery.data]);

  const [localFlags, setLocalFlags] = useState<Record<string, boolean>>({});
  const mergedFlags = Object.keys(localFlags).length > 0 ? localFlags : flags;

  const auditRows = useMemo(() => {
    const source = auditQuery.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [auditQuery.data]);

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border/70 bg-[linear-gradient(130deg,hsl(var(--card)/0.96),hsl(var(--primary)/0.08),hsl(var(--secondary)/0.08))] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl font-bold">Super Admin Control Center</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Privileged operations require explicit `X-Super-Admin-Mode` and reason headers.
            </p>
          </div>
          <Badge variant="warning">
            <Shield className="mr-1 h-3.5 w-3.5" />
            Elevated Mode
          </Badge>
        </div>
      </section>

      {(maintenanceQuery.error || flagsQuery.error || impersonationQuery.error) && (
        <div className="grid gap-3">
          {maintenanceQuery.error && <ApiErrorPanel error={maintenanceQuery.error} />}
          {flagsQuery.error && <ApiErrorPanel error={flagsQuery.error} compact />}
          {impersonationQuery.error && <ApiErrorPanel error={impersonationQuery.error} compact />}
        </div>
      )}

      <Tabs defaultValue="controls">
        <TabsList>
          <TabsTrigger value="controls">Controls</TabsTrigger>
          <TabsTrigger value="impersonation">Impersonation</TabsTrigger>
          <TabsTrigger value="global">Global Views</TabsTrigger>
        </TabsList>

        <TabsContent value="controls" className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" />
                Maintenance Mode
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                <div>
                  <p className="text-sm font-medium">Current state</p>
                  <p className="text-xs text-muted-foreground">
                    {maintenanceQuery.data?.enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>
                <Switch
                  checked={!!maintenanceQuery.data?.enabled}
                  onCheckedChange={(next) => maintenanceMutation.mutate(next)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>User-facing message</Label>
                <Input value={maintenanceMessage} onChange={(e) => setMaintenanceMessage(e.target.value)} />
              </div>
              <div className="space-y-1.5">
                <Label>Reason (mandatory)</Label>
                <Input value={maintenanceReason} onChange={(e) => setMaintenanceReason(e.target.value)} />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Feature Flags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {Object.entries(mergedFlags).map(([flag, value]) => (
                <div key={flag} className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                  <span className="text-sm">{flag}</span>
                  <Switch
                    checked={value}
                    onCheckedChange={(next) => setLocalFlags((prev) => ({ ...prev, [flag]: next }))}
                  />
                </div>
              ))}
              <div className="space-y-1.5">
                <Label>Reason (mandatory)</Label>
                <Input value={flagsReason} onChange={(e) => setFlagsReason(e.target.value)} />
              </div>
              <Button onClick={() => flagsMutation.mutate(mergedFlags)} loading={flagsMutation.isPending}>
                Update Flags
              </Button>
              {flagsMutation.error && <ApiErrorPanel error={flagsMutation.error} compact />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="impersonation" className="space-y-4">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserRoundCog className="h-4 w-4" />
                Start Impersonation Session
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1.5">
                <Label>Target user ID</Label>
                <Input value={targetUserId} onChange={(e) => setTargetUserId(e.target.value)} placeholder="24-char user id" />
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Input value={impersonationReason} onChange={(e) => setImpersonationReason(e.target.value)} />
              </div>
              <Button
                onClick={() => startImpersonationMutation.mutate()}
                loading={startImpersonationMutation.isPending}
                disabled={!targetUserId.trim() || !impersonationReason.trim()}
              >
                Start Session
              </Button>
              {startImpersonationMutation.error && <ApiErrorPanel error={startImpersonationMutation.error} compact />}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Active Sessions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {(Array.isArray(impersonationQuery.data) ? impersonationQuery.data : []).map((session, index) => {
                const sessionId = String((session as { sessionId?: string; id?: string }).sessionId ?? (session as { id?: string }).id ?? index);
                return (
                  <div key={sessionId} className="flex items-center justify-between rounded-xl border border-border/70 p-3">
                    <div>
                      <p className="font-mono text-xs">{sessionId}</p>
                      <p className="text-xs text-muted-foreground">{String((session as { reason?: string }).reason ?? "No reason")}</p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => revokeImpersonationMutation.mutate(sessionId)}
                    >
                      Revoke
                    </Button>
                  </div>
                );
              })}
              {revokeImpersonationMutation.error && <ApiErrorPanel error={revokeImpersonationMutation.error} compact />}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="global" className="grid gap-4 xl:grid-cols-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Global Analytics Snapshot</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <pre className="overflow-auto rounded-xl border border-border/70 bg-card/70 p-3 text-xs">
                {JSON.stringify(analyticsQuery.data ?? { message: "No analytics payload" }, null, 2)}
              </pre>
              {analyticsQuery.error && <ApiErrorPanel error={analyticsQuery.error} compact />}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Audit Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {auditRows.slice(0, 10).map((entry, index) => (
                <div key={String(entry.id ?? index)} className="rounded-xl border border-border/70 p-3 text-xs">
                  <p className="font-medium">{String(entry.action ?? "action")}</p>
                  <p className="text-muted-foreground">{String(entry.createdAt ?? "timestamp unavailable")}</p>
                </div>
              ))}
              {auditQuery.error && <ApiErrorPanel error={auditQuery.error} compact />}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
