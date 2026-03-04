"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, useReducedMotion } from "framer-motion";
import { Edit, Eye, Plus, RefreshCw, Trash2, Workflow } from "lucide-react";
import { entityServices } from "@/lib/api";
import type { EntityRecord, ListParams, ListResult } from "@/lib/store/types";
import { useMockSession } from "@/lib/auth/mock-session";
import { queryKeys } from "@/lib/query/keys";
import { invalidateEntityMutation } from "@/lib/query/invalidation";
import { PageHeader } from "@/components/common/PageHeader";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ConfirmDeleteDialog } from "@/components/common/ConfirmDeleteDialog";
import { EmptyState } from "@/components/common/EmptyState";
import { LoadingSkeletons } from "@/components/common/LoadingSkeletons";
import { AccessDenied } from "@/components/common/AccessDenied";
import { fadeIn, scaleIn, staggerContainer } from "@/lib/motion";
import {
  LOGISTICS_WORKSPACE_ID,
  type LogisticsEntityKey,
  getLogisticsEntityDefinition,
  getLogisticsEntityFeatures,
  getFilteredActions,
} from "@/app/app/logistics/_lib/entity-config";

type EntityListCache = ListResult<EntityRecord>;

interface LogisticsEntityService {
  listX: (params: ListParams) => Promise<EntityListCache>;
  deleteX: (id: string, actorId: string) => Promise<void>;
  runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
}

const MotionTableRow = motion(TableRow);

function serviceFor(entityKey: LogisticsEntityKey): LogisticsEntityService {
  return entityServices[entityKey] as LogisticsEntityService;
}

function entityPath(entityKey: LogisticsEntityKey): string {
  return `/app/${LOGISTICS_WORKSPACE_ID}/${entityKey}`;
}

export function LogisticsEntityListPage({ entityKey }: { entityKey: LogisticsEntityKey }) {
  const router = useRouter();
  const { session, canAccessEntity } = useMockSession();
  const queryClient = useQueryClient();
  const reducedMotion = useReducedMotion();
  const definition = getLogisticsEntityDefinition(entityKey);
  const features = getLogisticsEntityFeatures(entityKey);
  const service = serviceFor(entityKey);

  const canRead = canAccessEntity(entityKey, "read");
  const canWrite = canAccessEntity(entityKey, "write");
  const canDeletePermission = canAccessEntity(entityKey, "delete");
  const canCreate = canWrite && features.allowCreate;
  const canEdit = canWrite && features.allowEdit;
  const canDelete = canDeletePermission && features.allowDelete;
  const toolbarActions = getFilteredActions(definition.toolbarActions, features.enabledToolbarActionIds);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<string>("updatedAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [deleteTarget, setDeleteTarget] = useState<EntityRecord | null>(null);

  const listParams = useMemo<ListParams>(
    () => ({
      pagination: { page, pageSize },
      sort: { field: sortField, direction: sortDirection },
      filters: { text: searchText || undefined, status: statusFilter === "all" ? undefined : [statusFilter] },
    }),
    [page, pageSize, searchText, sortDirection, sortField, statusFilter]
  );

  const query = useQuery<EntityListCache>({
    queryKey: queryKeys.entity.list(LOGISTICS_WORKSPACE_ID, entityKey, listParams),
    queryFn: () => service.listX(listParams),
    enabled: canRead,
  });

  const toolbarActionMutation = useMutation({
    mutationFn: (actionId: string) => {
      if (!session) throw new Error("No active session");
      return service.runAction(actionId, session.user.id);
    },
    onSuccess: (result) => {
      void invalidateEntityMutation(queryClient, { workspaceId: LOGISTICS_WORKSPACE_ID, entityKey });
      toast({ title: "Action executed", description: result.message, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Action failed", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (recordId: string) => {
      if (!session) throw new Error("No active session");
      return service.deleteX(recordId, session.user.id);
    },
    onSuccess: () => {
      void invalidateEntityMutation(queryClient, { workspaceId: LOGISTICS_WORKSPACE_ID, entityKey });
      setDeleteTarget(null);
      toast({ title: `${definition.label} deleted`, variant: "success" });
    },
    onError: (error) => {
      toast({ title: "Delete failed", description: error instanceof Error ? error.message : "Failed", variant: "destructive" });
    },
  });

  if (!canRead) return <AccessDenied />;
  if (query.isLoading) return <LoadingSkeletons />;
  if (query.error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Unable to load {definition.pluralLabel.toLowerCase()}</CardTitle>
          <CardDescription>{query.error instanceof Error ? query.error.message : "Unknown error"}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => query.refetch()}>Retry</Button>
        </CardContent>
      </Card>
    );
  }

  const data = query.data;
  const items = data?.items ?? [];

  return (
    <motion.div variants={staggerContainer(Boolean(reducedMotion), 0.05)} initial="hidden" animate="show" className="space-y-4">
      <PageHeader
        title={definition.pluralLabel}
        subtitle={definition.statuses.join(" | ")}
        breadcrumbs={[{ label: "App", href: "/app" }, { label: LOGISTICS_WORKSPACE_ID, href: `/app/${LOGISTICS_WORKSPACE_ID}` }, { label: definition.pluralLabel }]}
        actions={
          <>
            {toolbarActions.map((action) => (
              <Button key={action.id} variant="outline" onClick={() => toolbarActionMutation.mutate(action.id)} loading={toolbarActionMutation.isPending}>
                <Workflow className="mr-2 h-4 w-4" />
                {action.label}
              </Button>
            ))}
            {canCreate && (
              <Button asChild>
                <Link href={`${entityPath(entityKey)}/new`}>
                  <Plus className="mr-2 h-4 w-4" />
                  New {definition.label}
                </Link>
              </Button>
            )}
          </>
        }
      />

      <motion.div variants={fadeIn(Boolean(reducedMotion))}>
        <Card>
          <CardHeader className="pb-4">
            <div className="grid gap-2 md:grid-cols-[1fr_170px_170px_120px_120px]">
              <Input placeholder={`Search ${definition.pluralLabel.toLowerCase()}...`} value={searchText} onChange={(event) => { setPage(1); setSearchText(event.target.value); }} />
              <Select value={statusFilter} onValueChange={(next) => { setPage(1); setStatusFilter(next); }}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  {definition.statuses.map((status) => <SelectItem key={status} value={status}>{status}</SelectItem>)}
                </SelectContent>
              </Select>
              <Select value={sortField} onValueChange={(value) => { setPage(1); setSortField(value); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="updatedAt">Updated</SelectItem>
                  <SelectItem value="createdAt">Created</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="status">Status</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortDirection} onValueChange={(value) => { setPage(1); setSortDirection(value as "asc" | "desc"); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
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
                actionLabel={canCreate ? `Create ${definition.label}` : undefined}
                onAction={canCreate ? () => router.push(`${entityPath(entityKey)}/new`) : undefined}
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
                      <MotionTableRow key={record.id} layout variants={scaleIn(Boolean(reducedMotion))} initial="hidden" animate="show">
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
                            <Button size="icon" variant="ghost" asChild>
                              <Link href={`${entityPath(entityKey)}/${record.id}`}>
                                <Eye className="h-4 w-4" />
                              </Link>
                            </Button>
                            {canEdit && (
                              <Button size="icon" variant="ghost" asChild>
                                <Link href={`${entityPath(entityKey)}/${record.id}/edit`}>
                                  <Edit className="h-4 w-4" />
                                </Link>
                              </Button>
                            )}
                            {canDelete && (
                              <Button size="icon" variant="ghost" className="text-destructive" onClick={() => setDeleteTarget(record)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </MotionTableRow>
                    ))}
                  </TableBody>
                </Table>

                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    Page {data?.pagination.page ?? 1} of {Math.max(1, Math.ceil((data?.pagination.total ?? 0) / pageSize))}
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={String(pageSize)} onValueChange={(value) => { setPage(1); setPageSize(Number(value)); }}>
                      <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {[10, 20, 50].map((size) => (
                          <SelectItem key={size} value={String(size)}>
                            {size} / page
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                      Prev
                    </Button>
                    <Button variant="outline" disabled={(data?.pagination.total ?? 0) <= page * pageSize} onClick={() => setPage((current) => current + 1)}>
                      Next
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </motion.div>

      <ConfirmDeleteDialog
        open={Boolean(deleteTarget)}
        title={`Delete ${definition.label}?`}
        description="This action removes the record permanently."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (!deleteTarget) return;
          deleteMutation.mutate(deleteTarget.id);
        }}
      />
    </motion.div>
  );
}



