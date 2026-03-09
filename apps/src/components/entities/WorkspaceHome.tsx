"use client";

import Link from "next/link";
import { createElement } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Plus } from "lucide-react";
import { getWorkspaceDefinition, WORKSPACE_ENTITY_MAP, getEntityDefinition } from "@/lib/store/catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { getEntityIcon, getWorkspaceIcon } from "@/components/layout/workspaces/workspace-icons";
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
  const { canAccessWorkspace, canAccessEntity } = useMockSession();
  const reducedMotion = useReducedMotion();

  const entities = WORKSPACE_ENTITY_MAP[workspaceId] ?? [];
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
      className="space-y-6"
    >
      <PageHeader
        title={workspaceLabel}
        subtitle={workspaceDescription}
        breadcrumbs={[{ label: "App", href: "/app" }, { label: workspaceLabel }]}
      />

      <motion.section variants={fadeIn(Boolean(reducedMotion))}>
        <div className="mb-4 flex items-center gap-2">
          <span className="rounded-lg bg-primary/14 p-2 text-primary">
            {createElement(getWorkspaceIcon(workspaceId), { className: "h-5 w-5" })}
          </span>
          <div>
            <h2 className="text-lg font-semibold">Quick Access</h2>
            <p className="text-sm text-muted-foreground">
              {entities.length} modules available in this workspace
            </p>
          </div>
        </div>
      </motion.section>

      <motion.section
        variants={staggerContainer(Boolean(reducedMotion), 0.04)}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {entities.map((entityKey) => {
          const def = getEntityDefinition(entityKey);
          const EntityIcon = getEntityIcon(entityKey);
          const accessible = canAccessEntity(entityKey, "read");

          return (
            <motion.div key={entityKey} variants={scaleIn(Boolean(reducedMotion))}>
              <Card className={!accessible ? "opacity-50" : undefined}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="rounded-lg bg-primary/10 p-2 text-primary">
                        <EntityIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <CardTitle className="text-base">{def?.pluralLabel ?? entityKey}</CardTitle>
                        <CardDescription className="text-xs">
                          {def?.statuses?.length
                            ? `${def.statuses.length} statuses`
                            : "No status workflow"}
                        </CardDescription>
                      </div>
                    </div>
                    {def?.workflowActions && def.workflowActions.length > 0 && (
                      <Badge variant="secondary" className="text-[10px]">
                        {def.workflowActions.length} action{def.workflowActions.length !== 1 ? "s" : ""}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {def?.statuses && def.statuses.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {def.statuses.map((status) => (
                        <Badge key={status} variant="outline" className="text-[10px]">
                          {status}
                        </Badge>
                      ))}
                    </div>
                  )}
                  <div className="flex gap-2">
                    <Button
                      asChild
                      variant="default"
                      size="sm"
                      className="flex-1 justify-between"
                      disabled={!accessible}
                    >
                      <Link href={`/app/${workspaceId}/${entityKey}`}>
                        Manage
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      size="sm"
                      disabled={!accessible}
                    >
                      <Link href={`/app/${workspaceId}/${entityKey}?action=create`}>
                        <Plus className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.section>
    </motion.div>
  );
}
