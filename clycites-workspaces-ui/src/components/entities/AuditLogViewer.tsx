"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auditService } from "@/lib/api";
import { useMockSession } from "@/lib/auth/mock-session";
import { AccessDenied } from "@/components/common/AccessDenied";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function AuditLogViewer() {
  const { session, can } = useMockSession();
  const [page, setPage] = useState(1);
  const [text, setText] = useState("");
  const [action, setAction] = useState<string>("all");

  const params = useMemo(
    () => ({
      page,
      pageSize: 20,
      text: text || undefined,
      action: action === "all" ? undefined : (action as "create"),
    }),
    [action, page, text]
  );

  const query = useQuery({
    queryKey: ["audit", params],
    queryFn: () => auditService.list(params),
    enabled: Boolean(session),
  });

  if (!session || !can("admin.audit.read")) {
    return <AccessDenied />;
  }

  const rows = query.data?.items ?? [];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Audit Log Viewer"
        subtitle="Centralized immutable trail for create, update, delete, status, auth, and simulation actions."
        breadcrumbs={[{ label: "App", href: "/app" }, { label: "Admin", href: "/app/admin" }, { label: "Audit" }]}
      />

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="grid gap-3 md:grid-cols-3">
            <Input placeholder="Search summary, actor, entity" value={text} onChange={(event) => setText(event.target.value)} />
            <Select value={action} onValueChange={setAction}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All actions</SelectItem>
                <SelectItem value="create">Create</SelectItem>
                <SelectItem value="update">Update</SelectItem>
                <SelectItem value="delete">Delete</SelectItem>
                <SelectItem value="status_change">Status Change</SelectItem>
                <SelectItem value="login">Login</SelectItem>
                <SelectItem value="logout">Logout</SelectItem>
                <SelectItem value="simulate">Simulate</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => query.refetch()}>
              Refresh
            </Button>
          </div>

          {rows.length === 0 ? (
            <EmptyState title="No audit records" description="Adjust filters or trigger a new action to populate logs." />
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>When</TableHead>
                  <TableHead>Actor</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead>Summary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="text-xs">{new Date(record.createdAt).toLocaleString()}</TableCell>
                    <TableCell>{record.actorId}</TableCell>
                    <TableCell>{record.action}</TableCell>
                    <TableCell>{record.entityType}</TableCell>
                    <TableCell>{record.summary}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{query.data?.pagination.total ?? 0} records</p>
            <div className="flex items-center gap-2">
              <Button variant="outline" disabled={page <= 1} onClick={() => setPage((current) => current - 1)}>
                Prev
              </Button>
              <Button
                variant="outline"
                disabled={(query.data?.pagination.total ?? 0) <= page * 20}
                onClick={() => setPage((current) => current + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
