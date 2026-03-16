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
  FARMER_WORKSPACE_ID,
  type FarmerEntityKey,
  getFarmerEntityDefinition,
  getFarmerEntityFeatures,
} from "@/app/app/farmer/_lib/entity-config";
import {
  createFarmerEntityFormValues,
  getFarmerEntityFormDefinition,
  getFarmerEntityMutationPayload,
  type FarmerFormValues,
} from "@/app/app/farmer/_lib/entity-form-config";
import { renderFarmerFieldControl } from "@/app/app/farmer/_components/farmer-form-controls";

interface FarmerEntityService {
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

function serviceFor(entityKey: FarmerEntityKey): FarmerEntityService {
  return entityServices[entityKey] as FarmerEntityService;
}

function entityPath(entityKey: FarmerEntityKey): string {
  return `/app/${FARMER_WORKSPACE_ID}/${entityKey}`;
}

export function FarmerEntityFormPage({
  entityKey,
  mode,
  recordId,
}: {
  entityKey: FarmerEntityKey;
  mode: "create" | "edit";
  recordId?: string;
}) {
  const router = useRouter();
  const { session, canAccessEntity } = useMockSession();
  const queryClient = useQueryClient();
  const definition = getFarmerEntityDefinition(entityKey);
  const features = getFarmerEntityFeatures(entityKey);
  const formDefinition = getFarmerEntityFormDefinition(entityKey);
  const service = serviceFor(entityKey);

  const canRead = canAccessEntity(entityKey, "read");
  const canWrite = canAccessEntity(entityKey, "write");
  const canCreate = canWrite && features.allowCreate;
  const canEdit = canWrite && features.allowEdit;

  const recordQuery = useQuery<EntityRecord>({
    queryKey: ["entity", FARMER_WORKSPACE_ID, entityKey, "record", recordId],
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
      ? createFarmerEntityFormValues(entityKey, recordQuery.data)
      : createFarmerEntityFormValues(entityKey);

  const formKey = mode === "edit" ? recordQuery.data?.id ?? recordId ?? "edit" : "create";

  return (
    <FarmerEntityFormContent
      key={`${entityKey}-${mode}-${formKey}`}
      entityKey={entityKey}
      mode={mode}
      recordId={recordId}
      definition={definition}
      formDefinition={formDefinition}
      service={service}
      session={session}
      queryClient={queryClient}
      router={router}
      initialValues={initialValues}
    />
  );
}

function FarmerEntityFormContent({
  entityKey,
  mode,
  recordId,
  definition,
  formDefinition,
  service,
  session,
  queryClient,
  router,
  initialValues,
}: {
  entityKey: FarmerEntityKey;
  mode: "create" | "edit";
  recordId?: string;
  definition: ReturnType<typeof getFarmerEntityDefinition>;
  formDefinition: ReturnType<typeof getFarmerEntityFormDefinition>;
  service: FarmerEntityService;
  session: ReturnType<typeof useMockSession>["session"];
  queryClient: ReturnType<typeof useQueryClient>;
  router: ReturnType<typeof useRouter>;
  initialValues: FarmerFormValues;
}) {
  const [formValues, setFormValues] = useState<FarmerFormValues>(initialValues);

  const submitMutation = useMutation({
    mutationFn: async () => {
      if (!session) throw new Error("No active session");

      const payload = getFarmerEntityMutationPayload(entityKey, formValues);

      if (mode === "create") {
        return service.createX({
          actorId: session.user.id,
          ...payload,
        });
      }

      if (!recordId) throw new Error("Missing record id");
      return service.updateX(recordId, {
        actorId: session.user.id,
        ...payload,
      });
    },
    onSuccess: (record) => {
      void invalidateEntityMutation(queryClient, { workspaceId: FARMER_WORKSPACE_ID, entityKey });
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
          { label: FARMER_WORKSPACE_ID, href: `/app/${FARMER_WORKSPACE_ID}` },
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
          <CardDescription>Fill in the API-specific fields below and save.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {formDefinition.sections
            .map((section) => ({
              ...section,
              fields: section.fields.filter((field) => !field.modes || field.modes.includes(mode)),
            }))
            .filter((section) => section.fields.length > 0)
            .map((section, sectionIndex) => (
              <div key={section.title} className={sectionIndex > 0 ? "space-y-4 border-t pt-4" : "space-y-4"}>
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold">{section.title}</h3>
                  {section.description ? <p className="text-sm text-muted-foreground">{section.description}</p> : null}
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  {section.fields.map((field) => {
                    const value = formValues[field.key] ?? (field.type === "switch" ? false : "");
                    return (
                      <div
                        key={field.key}
                        className={field.span === 2 || field.type === "textarea" ? "space-y-1.5 md:col-span-2" : "space-y-1.5"}
                      >
                        <Label>{field.label}</Label>
                        {renderFarmerFieldControl(field, value, (next) =>
                          setFormValues((current) => ({ ...current, [field.key]: next }))
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

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
