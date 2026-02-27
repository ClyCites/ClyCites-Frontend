"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Edit, Eye, Filter, Plus, RefreshCw, Trash2, Workflow } from "lucide-react";
import { entityServices } from "@/lib/api/mock";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";
import type { EntityKey, EntityRecord, FieldDefinition, ListParams, ListResult, WorkspaceId } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { AccessDenied } from "@/components/common/AccessDenied";
import { fadeIn, scaleIn, staggerContainer } from "@/lib/motion";

interface EntityManagerProps {
  workspaceId: WorkspaceId;
  entityKey: EntityKey;
}

type FormValues = Record<string, string | number | boolean>;
type EntityListCache = ListResult<EntityRecord>;

function getPathValue(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function setPathValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const keys = path.split(".");
  let current: Record<string, unknown> = target;

  keys.forEach((key, index) => {
    const isLast = index === keys.length - 1;
    if (isLast) {
      current[key] = value;
    } else {
      if (!current[key] || typeof current[key] !== "object") {
        current[key] = {};
      }
      current = current[key] as Record<string, unknown>;
    }
  });
}

function parseValue(field: FieldDefinition, rawValue: string | number | boolean): unknown {
  if (field.type === "number") {
    const value = Number(rawValue);
    return Number.isNaN(value) ? 0 : value;
  }
  if (field.type === "switch") {
    return Boolean(rawValue);
  }
  if (field.type === "tags") {
    return String(rawValue)
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);
  }
  return rawValue;
}

function toFormValues(record: EntityRecord, fields: FieldDefinition[]): FormValues {
  const values: FormValues = {
    title: record.title,
    subtitle: record.subtitle ?? "",
    tags: record.tags.join(", "),
  };

  fields.forEach((field) => {
    const fieldValue = getPathValue(record as unknown as Record<string, unknown>, field.key);
    if (fieldValue === undefined || fieldValue === null) {
      values[field.key] = "";
      return;
    }

    if (Array.isArray(fieldValue)) {
      values[field.key] = fieldValue.join(", ");
      return;
    }

    values[field.key] = fieldValue as string | number | boolean;
  });

  return values;
}

export function EntityManager({ workspaceId, entityKey }: EntityManagerProps) {
  const { session, canAccessEntity } = useMockSession();
  const queryClient = useQueryClient();
  const reducedMotion = useReducedMotion();
  const definition = ENTITY_DEFINITIONS[entityKey];
  const service = entityServices[entityKey] as {
    listX: (params: ListParams) => Promise<EntityListCache>;
    createX: (payload: {
      actorId: string;
      title: string;
      subtitle?: string;
      status?: string;
      tags?: string[];
      data: Record<string, unknown>;
    }) => Promise<EntityRecord>;
    updateX: (id: string, payload: {
      actorId: string;
      title?: string;
      subtitle?: string;
      tags?: string[];
      data?: Record<string, unknown>;
    }) => Promise<EntityRecord>;
    deleteX: (id: string, actorId: string) => Promise<void>;
    changeStatus: (id: string, actorId: string, status: string, note?: string) => Promise<EntityRecord>;
    runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
  };

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [selected, setSelected] = useState<EntityRecord | null>(null);
  const [formOpen, setFormOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [formValues, setFormValues] = useState<FormValues>({ title: "", subtitle: "", tags: "" });
  const [deleteOpen, setDeleteOpen] = useState(false);

  const canRead = canAccessEntity(entityKey, "read");
  const canWrite = canAccessEntity(entityKey, "write");
  const canDelete = canAccessEntity(entityKey, "delete");
  const canStatus = canAccessEntity(entityKey, "status");

  const listParams = useMemo<ListParams>(
    () => ({
      pagination: { page, pageSize },
      sort: { field: sortField, direction: sortDirection },
      filters: {
        text: searchText || undefined,
        status: statusFilter === "all" ? undefined : [statusFilter],
      },
    }),
    [page, pageSize, searchText, sortDirection, sortField, statusFilter]
  );

  const queryKey = ["entity", workspaceId, entityKey, listParams] as const;

  const query = useQuery<EntityListCache>({
    queryKey,
    queryFn: () => service.listX(listParams),
    enabled: canRead,
  });

  const resetForm = () => {
    setFormValues({ title: "", subtitle: "", tags: "" });
  };

  const openCreate = () => {
    setFormMode("create");
    resetForm();
    setFormOpen(true);
  };

  const openEdit = (record: EntityRecord) => {
    setFormMode("edit");
    setSelected(record);
    setFormValues(toFormValues(record, definition.fields));
    setFormOpen(true);
  };

  const createMutation = useMutation({
    onMutate: async () => {
      if (!session) return undefined;

      await queryClient.cancelQueries({ queryKey: ["entity", workspaceId, entityKey] });
      const previous = queryClient.getQueryData<EntityListCache>(queryKey);
      if (!previous) return { previous };

      const optimistic: EntityRecord = {
        id: `optimistic-${Date.now()}`,
        entity: entityKey,
        workspace: workspaceId,
        title: String(formValues.title || "Untitled"),
        subtitle: String(formValues.subtitle || ""),
        status: definition.defaultStatus,
        data: {} as EntityRecord["data"],
        tags: String(formValues.tags || "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: session.user.id,
        updatedBy: session.user.id,
      };

      queryClient.setQueryData<EntityListCache>(queryKey, {
        ...previous,
        items: [optimistic, ...previous.items],
        pagination: { ...previous.pagination, total: previous.pagination.total + 1 },
      });

      return { previous };
    },
    mutationFn: () => {
      if (!session) throw new Error("No active session");

      const payloadData: Record<string, unknown> = {};
      definition.fields
        .filter((field) => field.key.startsWith("data."))
        .forEach((field) => {
          const raw = formValues[field.key] ?? "";
          setPathValue(payloadData, field.key.replace(/^data\./, ""), parseValue(field, raw));
        });

      return service.createX({
        actorId: session.user.id,
        title: String(formValues.title ?? "Untitled"),
        subtitle: String(formValues.subtitle ?? ""),
        tags: String(formValues.tags ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        data: payloadData as EntityRecord["data"],
      });
    },
    onSuccess: () => {
      setFormOpen(false);
      toast({ title: `${definition.label} created`, variant: "success" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Create failed";
      toast({ title: "Create failed", description: message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entity", workspaceId, entityKey] });
    },
  });

  const updateMutation = useMutation({
    onMutate: async () => {
      if (!selected) return undefined;
      await queryClient.cancelQueries({ queryKey: ["entity", workspaceId, entityKey] });
      const previous = queryClient.getQueryData<EntityListCache>(queryKey);
      if (!previous) return { previous };

      queryClient.setQueryData<EntityListCache>(queryKey, {
        ...previous,
        items: previous.items.map((item) =>
          item.id === selected.id
            ? {
                ...item,
                title: String(formValues.title ?? item.title),
                subtitle: String(formValues.subtitle ?? item.subtitle ?? ""),
                tags: String(formValues.tags ?? item.tags.join(","))
                  .split(",")
                  .map((value) => value.trim())
                  .filter(Boolean),
              }
            : item
        ),
      });

      return { previous };
    },
    mutationFn: () => {
      if (!session || !selected) throw new Error("No active selection");

      const payloadData: Record<string, unknown> = {};
      definition.fields
        .filter((field) => field.key.startsWith("data."))
        .forEach((field) => {
          const raw = formValues[field.key] ?? "";
          setPathValue(payloadData, field.key.replace(/^data\./, ""), parseValue(field, raw));
        });

      return service.updateX(selected.id, {
        actorId: session.user.id,
        title: String(formValues.title ?? selected.title),
        subtitle: String(formValues.subtitle ?? ""),
        tags: String(formValues.tags ?? "")
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
        data: payloadData as Partial<EntityRecord["data"]>,
      });
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(queryKey, (current: EntityListCache | undefined) => {
        if (!current) return current;
        return {
          ...current,
          items: current.items.map((item) => (item.id === updated.id ? updated : item)),
        };
      });
      setFormOpen(false);
      setSelected(updated);
      toast({ title: `${definition.label} updated`, variant: "success" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Update failed";
      toast({ title: "Update failed", description: message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entity", workspaceId, entityKey] });
    },
  });

  const deleteMutation = useMutation({
    onMutate: async () => {
      if (!selected) return undefined;
      await queryClient.cancelQueries({ queryKey: ["entity", workspaceId, entityKey] });
      const previous = queryClient.getQueryData<EntityListCache>(queryKey);
      if (!previous) return { previous };

      queryClient.setQueryData<EntityListCache>(queryKey, {
        ...previous,
        items: previous.items.filter((item) => item.id !== selected.id),
        pagination: { ...previous.pagination, total: Math.max(0, previous.pagination.total - 1) },
      });

      return { previous };
    },
    mutationFn: () => {
      if (!session || !selected) throw new Error("No record selected");
      return service.deleteX(selected.id, session.user.id);
    },
    onSuccess: () => {
      setDeleteOpen(false);
      setSelected(null);
      toast({ title: `${definition.label} deleted`, variant: "success" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Delete failed";
      toast({ title: "Delete failed", description: message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entity", workspaceId, entityKey] });
    },
  });

  const statusMutation = useMutation({
    onMutate: async (nextStatus) => {
      if (!selected) return undefined;
      await queryClient.cancelQueries({ queryKey: ["entity", workspaceId, entityKey] });
      const previous = queryClient.getQueryData<EntityListCache>(queryKey);
      if (!previous) return { previous };

      queryClient.setQueryData<EntityListCache>(queryKey, {
        ...previous,
        items: previous.items.map((item) =>
          item.id === selected.id ? { ...item, status: nextStatus, updatedAt: new Date().toISOString() } : item
        ),
      });

      return { previous };
    },
    mutationFn: (nextStatus: string) => {
      if (!session || !selected) throw new Error("No record selected");
      return service.changeStatus(selected.id, session.user.id, nextStatus);
    },
    onSuccess: (updated) => {
      setSelected(updated);
      toast({ title: `Status set to ${updated.status}`, variant: "success" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Status update failed";
      toast({ title: "Status update failed", description: message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["entity", workspaceId, entityKey] });
    },
  });

  const actionMutation = useMutation({
    mutationFn: (actionId: string) => {
      if (!session) throw new Error("No active session");
      return service.runAction(actionId, session.user.id, selected?.id);
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["entity", workspaceId, entityKey] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      toast({ title: "Action executed", description: result.message, variant: "success" });
    },
    onError: (error) => {
      const message = error instanceof Error ? error.message : "Action failed";
      toast({ title: "Action failed", description: message, variant: "destructive" });
    },
  });

  const submitForm = () => {
    if (formMode === "create") {
      createMutation.mutate();
      return;
    }
    updateMutation.mutate();
  };

  const renderField = (field: FieldDefinition) => {
    const value = formValues[field.key] ?? "";

    if (field.type === "textarea") {
      return (
        <Textarea
          value={String(value)}
          onChange={(event) => setFormValues((current) => ({ ...current, [field.key]: event.target.value }))}
          placeholder={field.placeholder}
        />
      );
    }

    if (field.type === "select") {
      return (
        <Select
          value={String(value || field.options?.[0]?.value || "")}
          onValueChange={(nextValue) => setFormValues((current) => ({ ...current, [field.key]: nextValue }))}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select value" />
          </SelectTrigger>
          <SelectContent>
            {(field.options ?? []).map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    if (field.type === "switch") {
      return (
        <Switch
          checked={Boolean(value)}
          onCheckedChange={(checked) => setFormValues((current) => ({ ...current, [field.key]: checked }))}
        />
      );
    }

    const inputType = field.type === "number" ? "number" : field.type === "date" ? "date" : "text";

    return (
      <Input
        type={inputType}
        value={String(value)}
        onChange={(event) => setFormValues((current) => ({ ...current, [field.key]: event.target.value }))}
        placeholder={field.placeholder}
      />
    );
  };

  if (!canRead) {
    return <AccessDenied />;
  }

  if (query.isLoading) {
    return <LoadingSkeletons />;
  }

  if (query.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load {definition.pluralLabel.toLowerCase()}</CardTitle>
          <CardDescription>{query.error instanceof Error ? query.error.message : "Unknown error"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => query.refetch()}>
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  const data = query.data;
  const items = data?.items ?? [];

  return (
    <motion.div
      variants={staggerContainer(Boolean(reducedMotion), 0.05)}
      initial="hidden"
      animate="show"
      className="space-y-4"
    >
      <PageHeader
        title={definition.pluralLabel}
        subtitle={definition.statuses.join(" | ")}
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: workspaceId, href: `/app/${workspaceId}` },
          { label: definition.pluralLabel },
        ]}
        actions={
          <>
            {definition.toolbarActions?.map((action) => (
              <Button key={action.id} variant="outline" onClick={() => actionMutation.mutate(action.id)}>
                <Workflow className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            ))}
            {canWrite && (
              <Button onClick={openCreate}>
                <Plus className="mr-2 h-4 w-4" />
                New {definition.label}
              </Button>
            )}
          </>
        }
      />

      <motion.div variants={fadeIn(Boolean(reducedMotion))}>
        <Card>
          <CardHeader className="pb-4">
            <div className="grid gap-2 md:grid-cols-[1fr_170px_170px_120px_120px]">
              <Input
                placeholder={`Search ${definition.pluralLabel.toLowerCase()}...`}
                value={searchText}
                onChange={(event) => {
                  setPage(1);
                  setSearchText(event.target.value);
                }}
              />
              <Select
                value={statusFilter}
                onValueChange={(nextValue) => {
                  setPage(1);
                  setStatusFilter(nextValue);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {definition.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortField} onValueChange={setSortField}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="createdAt">Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortDirection} onValueChange={(value) => setSortDirection(value as "asc" | "desc")}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="desc">Desc</SelectItem>
                  <SelectItem value="asc">Asc</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => query.refetch()}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <EmptyState
              title={`No ${definition.pluralLabel.toLowerCase()} yet`}
              description="Create your first record or relax filters to see data."
              actionLabel={canWrite ? `Create ${definition.label}` : undefined}
              onAction={canWrite ? openCreate : undefined}
            />
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead>Updated</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((record) => (
                    <TableRow key={record.id}>
                      <TableCell>
                        <div className="font-medium">{record.title}</div>
                        <div className="text-xs text-muted-foreground">{record.subtitle || record.id}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{record.status}</Badge>
                      </TableCell>
                      <TableCell className="max-w-[240px] truncate text-xs text-muted-foreground">
                        {record.tags.join(", ")}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground">
                        {new Date(record.updatedAt).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="inline-flex items-center gap-1">
                          <Button size="icon" variant="ghost" onClick={() => setSelected(record)}>
                            <Eye className="h-4 w-4" />
                          </Button>
                          {canWrite && (
                            <Button size="icon" variant="ghost" onClick={() => openEdit(record)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {canDelete && (
                            <Button
                              size="icon"
                              variant="ghost"
                              className="text-destructive"
                              onClick={() => {
                                setSelected(record);
                                setDeleteOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Page {data?.pagination.page ?? 1} of {Math.max(1, Math.ceil((data?.pagination.total ?? 0) / pageSize))}
                </div>
                <div className="flex items-center gap-2">
                  <Select value={String(pageSize)} onValueChange={(value) => setPageSize(Number(value))}>
                    <SelectTrigger className="w-[110px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[10, 20, 50].map((size) => (
                        <SelectItem key={size} value={String(size)}>
                          {size} / page
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    disabled={page <= 1}
                    onClick={() => setPage((current) => Math.max(1, current - 1))}
                  >
                    Prev
                  </Button>
                  <Button
                    variant="outline"
                    disabled={(data?.pagination.total ?? 0) <= page * pageSize}
                    onClick={() => setPage((current) => current + 1)}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{formMode === "create" ? `Create ${definition.label}` : `Edit ${definition.label}`}</DialogTitle>
            <DialogDescription>All writes are persisted to localStorage and audited.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 md:grid-cols-2">
            {definition.fields.map((field) => (
              <div key={field.key} className={field.type === "textarea" ? "md:col-span-2 space-y-1.5" : "space-y-1.5"}>
                <Label>{field.label}</Label>
                {renderField(field)}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancel
            </Button>
            <Button onClick={submitForm} disabled={createMutation.isPending || updateMutation.isPending}>
              {formMode === "create" ? "Create" : "Save changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(selected)} onOpenChange={(open) => (!open ? setSelected(null) : null)}>
        <SheetContent className="w-[560px] sm:max-w-[560px]">
          {selected && (
            <div className="space-y-4">
              <SheetHeader>
                <SheetTitle>{selected.title}</SheetTitle>
                <SheetDescription>{selected.subtitle ?? selected.id}</SheetDescription>
              </SheetHeader>

              <div className="rounded-lg border bg-muted/40 p-3 text-sm">
                <div className="mb-2 flex items-center justify-between">
                  <span>Status</span>
                  <Badge>{selected.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">Updated {new Date(selected.updatedAt).toLocaleString()}</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Filter className="h-4 w-4" />
                  Workflow actions
                </div>
                <div className="flex flex-wrap gap-2">
                  {canStatus && definition.workflowActions?.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (action.targetStatus) {
                          statusMutation.mutate(action.targetStatus);
                        } else {
                          actionMutation.mutate(action.id);
                        }
                      }}
                    >
                      {action.label}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-medium">Record payload</h4>
                <pre className="max-h-[360px] overflow-auto rounded-md border bg-background p-3 text-xs">
                  {JSON.stringify(selected, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>

      <ConfirmDeleteDialog
        open={deleteOpen}
        title={`Delete ${definition.label}?`}
        description="This action removes the record from local mock storage and writes an audit event."
        onCancel={() => setDeleteOpen(false)}
        onConfirm={() => deleteMutation.mutate()}
      />
    </motion.div>
  );
}
