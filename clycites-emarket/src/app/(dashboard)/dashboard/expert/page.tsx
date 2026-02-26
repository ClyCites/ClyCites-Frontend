"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoleGate } from "@/components/rbac/RoleGate";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/market/DataTable";
import { expertPortalApi } from "@/lib/api/endpoints/platform.api";
import { EXPERT_ROLES } from "@/lib/rbac/roles";

interface ExpertCaseRow {
  id: string;
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

const columns: Column<ExpertCaseRow>[] = [
  { key: "id", header: "Case ID", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
  { key: "category", header: "Category" },
  { key: "priority", header: "Priority" },
  { key: "status", header: "Status" },
  { key: "createdAt", header: "Created" },
];

export default function ExpertDashboardPage() {
  return (
    <RoleGate allowedRoles={EXPERT_ROLES}>
      <ExpertDashboardContent />
    </RoleGate>
  );
}

function ExpertDashboardContent() {
  const query = useQuery({
    queryKey: ["dashboard", "expert-portal"],
    queryFn: () => expertPortalApi.overview({ limit: 30 }),
  });

  const rows = useMemo<ExpertCaseRow[]>(() => {
    const source = query.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined;
    const list = Array.isArray(source) ? source : source?.data ?? [];
    return list.map((item, index) => ({
      id: String(item.id ?? `case-${index}`),
      category: String(item.category ?? "general"),
      priority: String(item.priority ?? "medium"),
      status: String(item.status ?? "open"),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
    }));
  }, [query.data]);

  return (
    <div className="space-y-4">
      {query.error && <ApiErrorPanel error={query.error} />}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Expert Portal Cases</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            isLoading={query.isLoading}
            emptyTitle="No expert cases"
            emptyDescription="No open consultation cases right now."
          />
        </CardContent>
      </Card>
    </div>
  );
}
