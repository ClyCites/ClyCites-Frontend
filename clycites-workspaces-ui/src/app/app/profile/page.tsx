"use client";

import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { runtimeService } from "@/lib/api/mock";
import { useMockSession } from "@/lib/auth/mock-session";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function AppProfilePage() {
  const { session, can } = useMockSession();
  const runtimeQuery = useQuery({
    queryKey: ["runtime-config"],
    queryFn: () => Promise.resolve(runtimeService.getConfig()),
  });

  const [latencyMs, setLatencyMs] = useState(420);
  const [jitterMs, setJitterMs] = useState(220);
  const [errorRate, setErrorRate] = useState(0.08);
  const [enabled, setEnabled] = useState(false);

  const updateMutation = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No session");
      return runtimeService.updateConfig(session.user.id, {
        latencyMs,
        jitterMs,
        errorRate,
        enableRandomErrors: enabled,
      });
    },
    onSuccess: () => toast({ title: "Runtime config updated", variant: "success" }),
    onError: (error) =>
      toast({
        title: "Failed to update runtime config",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      }),
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title="Profile"
        subtitle="User context, active roles, and environment tuning for mock backend behavior."
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

      {can("admin.config.write") && (
        <Card>
          <CardHeader>
            <CardTitle>Mock Backend Runtime</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label>Latency (ms)</Label>
                <Input type="number" value={latencyMs} onChange={(event) => setLatencyMs(Number(event.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Jitter (ms)</Label>
                <Input type="number" value={jitterMs} onChange={(event) => setJitterMs(Number(event.target.value))} />
              </div>
              <div className="space-y-1.5">
                <Label>Error Rate (0-1)</Label>
                <Input type="number" step="0.01" value={errorRate} onChange={(event) => setErrorRate(Number(event.target.value))} />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={enabled} onCheckedChange={setEnabled} />
              <span className="text-sm">Enable random failures</span>
            </div>
            <Button onClick={() => updateMutation.mutate()}>Save Runtime Config</Button>
            <pre className="overflow-auto rounded-xl border border-border/60 bg-muted/40 p-3 text-xs">
              {JSON.stringify(runtimeQuery.data, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
