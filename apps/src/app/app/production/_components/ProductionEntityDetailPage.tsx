"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Edit, Filter, Trash2, Workflow } from "lucide-react";
import { entityServices } from "@/lib/api";
import type { EntityRecord, FieldDefinition } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { invalidateEntityMutation } from "@/lib/query/invalidation";
import { PageHeader } from "@/components/common/PageHeader";
import { AccessDenied } from "@/components/common/AccessDenied";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import {
  PRODUCTION_WORKSPACE_ID,
  type ProductionEntityKey,
  getProductionEntityDefinition,
  getProductionEntityFeatures,
  getFilteredActions,
} from "@/app/app/production/_lib/entity-config";
import { getPathValue } from "@/app/app/production/_lib/form-utils";

interface ProductionEntityService {
  getX: (id: string) => Promise<EntityRecord>;
  deleteX: (id: string, actorId: string) => Promise<void>;
  changeStatus: (id: string, actorId: string, status: string, note?: string) => Promise<EntityRecord>;
  runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
}

function serviceFor(entityKey: ProductionEntityKey): ProductionEntityService {
  return entityServices[entityKey] as ProductionEntityService;
}

function entityPath(entityKey: ProductionEntityKey): string {
  return `/app/${PRODUCTION_WORKSPACE_ID}/${entityKey}`;
}

function formatFieldValue(value: unknown, field: FieldDefinition): string {
  if (value === undefined || value === null || value === "") return "-";
  if (field.type === "switch") return Boolean(value) ? "Yes" : "No";
  if (field.type === "date") {
    const parsed = new Date(String(value));
    if (!Number.isNaN(parsed.getTime())) return parsed.toLocaleDateString();
  }
  if (Array.isArray(value)) return value.map((item) => String(item)).join(", ");
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

export function ProductionEntityDetailPage({ entityKey, recordId }: { entityKey: ProductionEntityKey; recordId: string }) {
  const router = useRouter();
  const { session, canAccessEntity } = useMockSession();
  const queryClient = useQueryClient();
  const definition = getProductionEntityDefinition(entityKey);
  const features = getProductionEntityFeatures(entityKey);
  const service = serviceFor(entityKey);

  const canRead = canAccessEntity(entityKey, "read");
  const canWrite = canAccessEntity(entityKey, "write");
  const canDeletePermission = canAccessEntity(entityKey, "delete");
  const canStatusPermission = canAccessEntity(entityKey, "status");
  const canEdit = canWrite && features.allowEdit;
  const canDelete = canDeletePermission && features.allowDelete;
  const canStatus = canStatusPermission && features.allowStatus;
  const workflowActions = getFilteredActions(definition.workflowActions, features.enabledWorkflowActionIds);

  const [deleteOpen, setDeleteOpen] = useState(false);

  const query = useQuery<EntityRecord>({
    queryKey: ["entity", PRODUCTION_WORKSPACE_ID, entityKey, "record", recordId],
    queryFn: () => service.getX(recordId),
    enabled: canRead,
  });

  const statusMutation = useMutation({
    mutationFn: (nextStatus: string) => {
      if (!session) throw new Error("No active session");
      return service.changeStatus(recordId, session.user.id, nextStatus);
    },
    onSuccess: () => {
      void invalidateEntityMutation(queryClient, { workspaceId: PRODUCTION_WORKSPACE_ID, entityKey });
      toast({ title: "Status updated", variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Status update failed", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    },
  });

  const actionMutation = useMutation({
    mutationFn: (actionId: string) => {
      if (!session) throw new Error("No active session");
      return service.runAction(actionId, session.user.id, recordId);
    },
    onSuccess: (result) => {
      void invalidateEntityMutation(queryClient, { workspaceId: PRODUCTION_WORKSPACE_ID, entityKey });
      toast({ title: "Action executed", description: result.message, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Action failed", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => {
      if (!session) throw new Error("No active session");
      return service.deleteX(recordId, session.user.id);
    },
    onSuccess: () => {
      void invalidateEntityMutation(queryClient, { workspaceId: PRODUCTION_WORKSPACE_ID, entityKey });
      toast({ title: `${definition.label} deleted`, variant: "success" });
      router.push(entityPath(entityKey));
    },
    onError: (error) => {
      toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    },
  });

  if (!canRead) return <AccessDenied />;
  if (query.isLoading) return <LoadingSkeletons />;
  if (query.error || !query.data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load {definition.label.toLowerCase()}</CardTitle>
          <CardDescription>{query.error instanceof Error ? query.error.message : "Record not found."}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const record = query.data;

  return (
    <div className="space-y-4">
      <PageHeader
        title={record.title}
        subtitle={record.subtitle ?? record.id}
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: PRODUCTION_WORKSPACE_ID, href: `/app/${PRODUCTION_WORKSPACE_ID}` },
          { label: definition.pluralLabel, href: entityPath(entityKey) },
          { label: record.title },
        ]}
        actions={
          <>
            <Button variant="outline" asChild>
              <Link href={entityPath(entityKey)}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to list
              </Link>
            </Button>
            {canEdit && (
              <Button variant="outline" asChild>
                <Link href={`${entityPath(entityKey)}/${record.id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            )}
            {canDelete && (
              <Button variant="destructive" onClick={() => setDeleteOpen(true)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            )}
          </>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Status</p>
            <Badge className="mt-1" variant="outline">{record.status}</Badge>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Created</p>
            <p>{new Date(record.createdAt).toLocaleString()}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Updated</p>
            <p>{new Date(record.updatedAt).toLocaleString()}</p>
          </div>
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="text-xs uppercase text-muted-foreground">Tags</p>
            <p>{record.tags.length > 0 ? record.tags.join(", ") : "-"}</p>
          </div>
        </CardContent>
      </Card>

      {workflowActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Filter className="h-4 w-4" />
              Workflow Actions
            </CardTitle>
            <CardDescription>Run status transitions and workflow operations for this record.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            {workflowActions.map((action) => {
              const disabled = action.targetStatus ? !canStatus : !canWrite;
              return (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  disabled={disabled}
                  loading={statusMutation.isPending || actionMutation.isPending}
                  onClick={() => (action.targetStatus ? statusMutation.mutate(action.targetStatus) : actionMutation.mutate(action.id))}
                >
                  <Workflow className="h-4 w-4" />
                  {action.label}
                </Button>
              );
            })}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Field Data</CardTitle>
          <CardDescription>Mapped view of configured entity fields.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {definition.fields.map((field) => {
              const value = getPathValue(record as unknown as Record<string, unknown>, field.key);
              return (
                <div key={field.key} className={field.type === "textarea" ? "md:col-span-2" : undefined}>
                  <p className="text-xs uppercase text-muted-foreground">{field.label}</p>
                  <p className="break-words">{formatFieldValue(value, field)}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Raw Payload</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="max-h-[360px] overflow-auto rounded-md border bg-background p-3 text-xs">{JSON.stringify(record, null, 2)}</pre>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={deleteOpen}
        title={`Delete ${definition.label}?`}
        description="This action removes the record permanently."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </div>
  );
}

