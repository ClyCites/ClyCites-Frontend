"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { entityServices } from "@/lib/api";
import type { EntityRecord } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { invalidateEntityMutation } from "@/lib/query/invalidation";
import { PageHeader } from "@/components/common/PageHeader";
import { AccessDenied } from "@/components/common/AccessDenied";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import {
  PRICES_WORKSPACE_ID,
  type PricesEntityKey,
  getPricesEntityDefinition,
  getPricesEntityFeatures,
} from "@/app/app/prices/_lib/entity-config";
import {
  buildDataPayload,
  createEmptyFormValues,
  type FormValues,
  toFormValues,
} from "@/app/app/prices/_lib/form-utils";
import { renderPricesFieldControl } from "@/app/app/prices/_components/prices-form-controls";

interface PricesEntityService {
  getX: (id: string) => Promise<EntityRecord>;
  createX: (payload: {
    actorId: string;
    title: string;
    subtitle?: string;
    status?: string;
    tags?: string[];
    data: Record<string, unknown>;
  }) => Promise<EntityRecord>;
  updateX: (
    id: string,
    payload: {
      actorId: string;
      title?: string;
      subtitle?: string;
      tags?: string[];
      data?: Record<string, unknown>;
    }
  ) => Promise<EntityRecord>;
}

function serviceFor(entityKey: PricesEntityKey): PricesEntityService {
  return entityServices[entityKey] as PricesEntityService;
}

function entityPath(entityKey: PricesEntityKey): string {
  return `/app/${PRICES_WORKSPACE_ID}/${entityKey}`;
}

function splitTags(rawTags: string | number | boolean | undefined): string[] {
  return String(rawTags ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function PricesEntityFormPage({
  entityKey,
  mode,
  recordId,
}: {
  entityKey: PricesEntityKey;
  mode: "create" | "edit";
  recordId?: string;
}) {
  const router = useRouter();
  const { session, canAccessEntity } = useMockSession();
  const queryClient = useQueryClient();
  const definition = getPricesEntityDefinition(entityKey);
  const features = getPricesEntityFeatures(entityKey);
  const service = serviceFor(entityKey);

  const canRead = canAccessEntity(entityKey, "read");
  const canWrite = canAccessEntity(entityKey, "write");
  const canCreate = canWrite && features.allowCreate;
  const canEdit = canWrite && features.allowEdit;

  const recordQuery = useQuery<EntityRecord>({
    queryKey: ["entity", PRICES_WORKSPACE_ID, entityKey, "record", recordId],
    queryFn: () => service.getX(recordId ?? ""),
    enabled: mode === "edit" && Boolean(recordId) && canRead,
  });

  const canSubmit = mode === "create" ? canCreate : canEdit;

  if (mode === "create" && !canSubmit) return <AccessDenied />;
  if (mode === "edit" && (!canSubmit || !canRead)) return <AccessDenied />;
  if (mode === "edit" && recordQuery.isLoading) return <LoadingSkeletons />;
  if (mode === "edit" && recordQuery.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load {definition.label.toLowerCase()}</CardTitle>
          <CardDescription>{recordQuery.error instanceof Error ? recordQuery.error.message : "Unknown error"}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const initialValues =
    mode === "edit" && recordQuery.data
      ? toFormValues(recordQuery.data, definition.fields)
      : createEmptyFormValues(definition.fields);

  const formKey = mode === "edit" ? recordQuery.data?.id ?? recordId ?? "edit" : "create";

  return (
    <PricesEntityFormContent
      key={`${entityKey}-${mode}-${formKey}`}
      entityKey={entityKey}
      mode={mode}
      recordId={recordId}
      definition={definition}
      service={service}
      session={session}
      queryClient={queryClient}
      router={router}
      initialValues={initialValues}
    />
  );
}

function PricesEntityFormContent({
  entityKey,
  mode,
  recordId,
  definition,
  service,
  session,
  queryClient,
  router,
  initialValues,
}: {
  entityKey: PricesEntityKey;
  mode: "create" | "edit";
  recordId?: string;
  definition: ReturnType<typeof getPricesEntityDefinition>;
  service: PricesEntityService;
  session: ReturnType<typeof useMockSession>["session"];
  queryClient: ReturnType<typeof useQueryClient>;
  router: ReturnType<typeof useRouter>;
  initialValues: FormValues;
}) {
  const [formValues, setFormValues] = useState<FormValues>(initialValues);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No active session");

      const payload = {
        actorId: session.user.id,
        title: String(formValues.title ?? "Untitled"),
        subtitle: String(formValues.subtitle ?? ""),
        tags: splitTags(formValues.tags),
        data: buildDataPayload(definition.fields, formValues),
      };

      if (mode === "create") {
        return service.createX(payload);
      }

      if (!recordId) throw new Error("Missing record id");
      return service.updateX(recordId, payload);
    },
    onSuccess: (record) => {
      void invalidateEntityMutation(queryClient, { workspaceId: PRICES_WORKSPACE_ID, entityKey });
      toast({ title: mode === "create" ? `${definition.label} created` : `${definition.label} updated`, variant: "success" });
      router.push(`${entityPath(entityKey)}/${record.id}`);
    },
    onError: (error) => {
      toast({
        title: mode === "create" ? "Create failed" : "Update failed",
        description: error instanceof Error ? error.message : "Failed",
        variant: "destructive",
      });
    },
  });

  return (
    <div className="space-y-4">
      <PageHeader
        title={mode === "create" ? `Create ${definition.label}` : `Edit ${definition.label}`}
        subtitle={definition.pluralLabel}
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: PRICES_WORKSPACE_ID, href: `/app/${PRICES_WORKSPACE_ID}` },
          { label: definition.pluralLabel, href: entityPath(entityKey) },
          { label: mode === "create" ? "Create" : "Edit" },
        ]}
        actions={
          <Button variant="outline" asChild>
            <Link href={mode === "edit" && recordId ? `${entityPath(entityKey)}/${recordId}` : entityPath(entityKey)}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{mode === "create" ? `New ${definition.label}` : `Update ${definition.label}`}</CardTitle>
          <CardDescription>Fill in the fields below and save.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {definition.fields.map((field) => {
              const value = formValues[field.key] ?? "";
              return (
                <div key={field.key} className={field.type === "textarea" ? "space-y-1.5 md:col-span-2" : "space-y-1.5"}>
                  <Label>{field.label}</Label>
                  {renderPricesFieldControl(field, value, (next) => setFormValues((current) => ({ ...current, [field.key]: next })))}
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <Button onClick={() => submitMutation.mutate()} loading={submitMutation.isPending}>
              {mode === "create" ? "Create" : "Save changes"}
            </Button>
            <Button variant="outline" asChild>
              <Link href={mode === "edit" && recordId ? `${entityPath(entityKey)}/${recordId}` : entityPath(entityKey)}>Cancel</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}



