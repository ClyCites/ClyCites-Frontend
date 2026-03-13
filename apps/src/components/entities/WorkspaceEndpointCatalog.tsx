"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { listWorkspaceEndpoints } from "@/lib/api/workspaces";
import type { WorkspaceId } from "@/lib/store/types";
import { getWorkspaceLabel } from "@/lib/nav/workspace-nav";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

interface WorkspaceEndpointCatalogProps {
  workspaceId: WorkspaceId;
}

export function WorkspaceEndpointCatalog({ workspaceId }: WorkspaceEndpointCatalogProps) {
  const [searchText, setSearchText] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const workspaceLabel = getWorkspaceLabel(workspaceId);
  const endpoints = useMemo(() => listWorkspaceEndpoints(workspaceId), [workspaceId]);
  const filtered = useMemo(() => {
    const query = searchText.trim().toLowerCase();
    return endpoints.filter((endpoint) => {
      if (methodFilter !== "all" && endpoint.method !== methodFilter) return false;
      if (statusFilter === "wired" && !endpoint.uiImplemented) return false;
      if (statusFilter === "catalog-only" && endpoint.uiImplemented) return false;
      if (!query) return true;

      return (
        endpoint.path.toLowerCase().includes(query) ||
        endpoint.summary.toLowerCase().includes(query) ||
        endpoint.method.toLowerCase().includes(query)
      );
    });
  }, [endpoints, methodFilter, searchText, statusFilter]);

  const wiredCount = endpoints.filter((endpoint) => endpoint.uiImplemented).length;
  const catalogOnlyCount = endpoints.length - wiredCount;

  return (
    <div className="space-y-4">
      <PageHeader
        title={`${workspaceLabel} Endpoint Catalog`}
        subtitle="Endpoint-list-driven index for workspace visibility and rollout tracking."
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: workspaceLabel, href: `/app/${workspaceId}` },
          { label: "Endpoints" },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Coverage Summary</CardTitle>
          <CardDescription>Track what is already wired in UI versus cataloged for rollout.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Total Endpoints</p>
            <p className="mt-1 text-2xl font-semibold">{endpoints.length}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Wired In UI</p>
            <p className="mt-1 text-2xl font-semibold">{wiredCount}</p>
          </div>
          <div className="rounded-lg border border-border/60 bg-background/60 p-3">
            <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground">Catalog Only</p>
            <p className="mt-1 text-2xl font-semibold">{catalogOnlyCount}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <div className="grid gap-2 md:grid-cols-[1fr_140px_170px]">
            <Input placeholder="Search endpoint path or summary..." value={searchText} onChange={(event) => setSearchText(event.target.value)} />
            <Select value={methodFilter} onValueChange={setMethodFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All methods</SelectItem>
                <SelectItem value="GET">GET</SelectItem>
                <SelectItem value="POST">POST</SelectItem>
                <SelectItem value="PUT">PUT</SelectItem>
                <SelectItem value="PATCH">PATCH</SelectItem>
                <SelectItem value="DELETE">DELETE</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All status</SelectItem>
                <SelectItem value="wired">Wired in UI</SelectItem>
                <SelectItem value="catalog-only">Catalog only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Method</TableHead>
                <TableHead>Path</TableHead>
                <TableHead>Summary</TableHead>
                <TableHead>UI Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((endpoint) => (
                <TableRow key={endpoint.id}>
                  <TableCell>
                    <Badge variant="outline">{endpoint.method}</Badge>
                  </TableCell>
                  <TableCell className="font-mono text-xs">{endpoint.path}</TableCell>
                  <TableCell>{endpoint.summary}</TableCell>
                  <TableCell>
                    {endpoint.uiImplemented ? (
                      <Badge variant="success">Wired</Badge>
                    ) : (
                      <Badge variant="secondary">Catalog only</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/app/${workspaceId}/endpoints/${endpoint.id}`}>Open</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {endpoints.length} endpoints in {workspaceLabel}.{" "}
            <Link href={`/app/${workspaceId}`} className="underline underline-offset-4">
              Back to workspace
            </Link>
            .
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
