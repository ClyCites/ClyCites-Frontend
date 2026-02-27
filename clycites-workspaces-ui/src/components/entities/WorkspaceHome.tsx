"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { WORKSPACE_ENTITY_MAP, getEntityDefinition, getWorkspaceDefinition } from "@/lib/store/catalog";
import { entityServices } from "@/lib/api/mock";
import type { WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { AccessDenied } from "@/components/common/AccessDenied";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface WorkspaceHomeProps {
  workspaceId: WorkspaceId;
}

export function WorkspaceHome({ workspaceId }: WorkspaceHomeProps) {
  const workspace = getWorkspaceDefinition(workspaceId);
  const entities = WORKSPACE_ENTITY_MAP[workspaceId];
  const { canAccessWorkspace } = useMockSession();

  const cardsQuery = useQueries({
    queries: entities.map((entityKey) => ({
      queryKey: ["workspace-summary", workspaceId, entityKey],
      queryFn: () => entityServices[entityKey].listX({
        pagination: { page: 1, pageSize: 1 },
        sort: { field: "updatedAt", direction: "desc" },
      }),
    })),
  });

  if (!workspace) {
    return <AccessDenied />;
  }

  if (!canAccessWorkspace(workspaceId)) {
    return <AccessDenied />;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>{workspace.label}</CardTitle>
          <CardDescription>{workspace.description}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {entities.map((entityKey, index) => {
          const definition = getEntityDefinition(entityKey);
          const summary = cardsQuery[index].data?.pagination.total ?? 0;
          const pending = cardsQuery[index].isLoading;

          return (
            <Card key={entityKey} className="relative overflow-hidden">
              <CardHeader>
                <CardTitle className="text-base">{definition?.pluralLabel ?? entityKey}</CardTitle>
                <CardDescription>
                  {pending ? "Loading..." : `${summary} total records`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full justify-between">
                  <Link href={`/app/${workspaceId}/${entityKey}`}>
                    Open {definition?.pluralLabel ?? entityKey}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </motion.div>
  );
}
