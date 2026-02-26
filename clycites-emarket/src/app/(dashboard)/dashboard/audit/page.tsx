"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoleGate } from "@/components/rbac/RoleGate";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/market/DataTable";
import { auditApi } from "@/lib/api/endpoints/platform.api";
import { ORGANIZATION_ADMIN_ROLES } from "@/lib/rbac/roles";

interface AuditRow {
  id: string;
  action: string;
  actor: string;
  createdAt: string;
}

const columns: Column<AuditRow>[] = [
  { key: "id", header: "Audit ID", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
  { key: "action", header: "Action" },
  { key: "actor", header: "Actor" },
  { key: "createdAt", header: "Timestamp" },
];

export default function AuditDashboardPage() {
  return (
    <RoleGate allowedRoles={ORGANIZATION_ADMIN_ROLES}>
      <AuditDashboardContent />
    </RoleGate>
  );
}

function AuditDashboardContent() {
  const query = useQuery({
    queryKey: ["dashboard", "audit-log"],
    queryFn: () => auditApi.list({ limit: 50 }),
  });

  const rows = useMemo<AuditRow[]>(() => {
    const source = query.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined;
    const list = Array.isArray(source) ? source : source?.data ?? [];
    return list.map((item, index) => ({
      id: String(item.id ?? `audit-${index}`),
      action: String(item.action ?? "event"),
      actor: String(item.actor ?? item.userId ?? "system"),
      createdAt: String(item.createdAt ?? new Date().toISOString()),
    }));
  }, [query.data]);

  return (
    <div className="space-y-4">
      {query.error && <ApiErrorPanel error={query.error} />}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Audit Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            isLoading={query.isLoading}
            emptyTitle="No audit events"
            emptyDescription="Audit entries will appear as privileged actions occur."
          />
        </CardContent>
      </Card>
    </div>
  );
}
