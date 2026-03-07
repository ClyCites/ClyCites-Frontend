"use client";

import Link from "next/link";
import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { listWorkspaceEndpoints } from "@/lib/api/endpoint-catalog";
import { getWorkspaceDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { AccessDenied } from "@/components/common/AccessDenied";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fadeIn, scaleIn, staggerContainer } from "@/lib/motion";

interface WorkspaceHomeProps {
  workspaceId: WorkspaceId;
}

export function WorkspaceHome({ workspaceId }: WorkspaceHomeProps) {
  const workspace = getWorkspaceDefinition(workspaceId);
  const { canAccessWorkspace } = useMockSession();
  const reducedMotion = useReducedMotion();

  const endpoints = useMemo(() => listWorkspaceEndpoints(workspaceId), [workspaceId]);
  const methodSummary = useMemo(() => {
    const summary: Record<string, number> = {
      GET: 0,
      POST: 0,
      PUT: 0,
      PATCH: 0,
      DELETE: 0,
    };

    endpoints.forEach((endpoint) => {
      summary[endpoint.method] = (summary[endpoint.method] ?? 0) + 1;
    });

    return summary;
  }, [endpoints]);

  const wiredCount = endpoints.filter((endpoint) => endpoint.uiImplemented).length;
  const catalogOnlyCount = endpoints.length - wiredCount;
  const workspaceLabel = workspace?.label ?? "Workspace";
  const workspaceDescription = workspace?.description ?? "Workspace overview";

  if (!workspace) {
    return <AccessDenied />;
  }

  if (!canAccessWorkspace(workspaceId)) {
    return <AccessDenied />;
  }

  return (
    <motion.div
      variants={staggerContainer(Boolean(reducedMotion), 0.05)}
      initial="hidden"
      animate="show"
      className="space-y-5"
    >
      <PageHeader
        title={workspaceLabel}
        subtitle={workspaceDescription}
        breadcrumbs={[{ label: "App", href: "/app" }, { label: workspaceLabel }]}
        actions={
          <Button asChild size="sm">
            <Link href={`/app/${workspaceId}/endpoints`}>Open Endpoint Catalog</Link>
          </Button>
        }
      />

      <motion.section variants={fadeIn(Boolean(reducedMotion))} className="grid grid-cols-12 gap-4">
        <Card className="col-span-12">
          <CardHeader className="pb-3">
            <CardTitle>Workspace Endpoint Coverage</CardTitle>
            <CardDescription>
              Workspace navigation and operations are now endpoint-driven.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Total Endpoints</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{endpoints.length}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Wired in UI</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{wiredCount}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Catalog only</p>
                <p className="mt-1 text-3xl font-semibold tracking-tight">{catalogOnlyCount}</p>
              </div>
              <div className="rounded-xl border border-border/60 bg-background/60 p-4">
                <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Methods</p>
                <p className="mt-1 text-sm font-semibold tracking-tight">
                  GET {methodSummary.GET} | POST {methodSummary.POST} | PUT {methodSummary.PUT} | PATCH {methodSummary.PATCH} | DELETE {methodSummary.DELETE}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.section>

      <motion.section variants={staggerContainer(Boolean(reducedMotion), 0.04)} className="grid grid-cols-12 gap-4">
        {endpoints.map((endpoint) => (
          <motion.div key={endpoint.id} variants={scaleIn(Boolean(reducedMotion))} className="col-span-12 lg:col-span-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <CardTitle className="text-base">{endpoint.summary}</CardTitle>
                    <CardDescription className="font-mono text-xs">{endpoint.path}</CardDescription>
                  </div>
                  {endpoint.uiImplemented ? <Badge variant="success">Wired</Badge> : <Badge variant="secondary">Catalog only</Badge>}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Badge variant="outline">{endpoint.method}</Badge>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={`/app/${workspaceId}/endpoints/${endpoint.id}`}>
                    Open Endpoint
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.section>
    </motion.div>
  );
}
