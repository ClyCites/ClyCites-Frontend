"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { RoleGate } from "@/components/rbac/RoleGate";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/market/DataTable";
import { organizationsApi } from "@/lib/api/endpoints/platform.api";
import { ORGANIZATION_ADMIN_ROLES } from "@/lib/rbac/roles";

interface OrganizationRow {
  id: string;
  name: string;
  type: string;
  role: string;
}

const columns: Column<OrganizationRow>[] = [
  { key: "id", header: "ID", render: (row) => <span className="font-mono text-xs">{row.id}</span> },
  { key: "name", header: "Name" },
  { key: "type", header: "Type" },
  { key: "role", header: "My Role" },
];

export default function OrganizationDashboardPage() {
  return (
    <RoleGate allowedRoles={ORGANIZATION_ADMIN_ROLES}>
      <OrganizationDashboardContent />
    </RoleGate>
  );
}

function OrganizationDashboardContent() {
  const query = useQuery({
    queryKey: ["dashboard", "organizations", "mine"],
    queryFn: () => organizationsApi.listMine({ limit: 30 }),
  });

  const rows = useMemo<OrganizationRow[]>(() => {
    const source = query.data as { data?: Array<Record<string, unknown>> } | Array<Record<string, unknown>> | undefined;
    const list = Array.isArray(source) ? source : source?.data ?? [];
    return list.map((item, index) => ({
      id: String(item.id ?? item._id ?? `org-${index}`),
      name: String(item.name ?? "Organization"),
      type: String(item.type ?? "company"),
      role: String(item.role ?? "member"),
    }));
  }, [query.data]);

  return (
    <div className="space-y-4">
      {query.error && <ApiErrorPanel error={query.error} />}
      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Organization Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={rows}
            columns={columns}
            isLoading={query.isLoading}
            emptyTitle="No organizations found"
            emptyDescription="You are not assigned to any organization yet."
          />
        </CardContent>
      </Card>
    </div>
  );
}
