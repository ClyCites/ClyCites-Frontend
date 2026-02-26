"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, KeyRound, RefreshCw, ShieldAlert, Trash2 } from "lucide-react";
import { authApi } from "@/lib/api/endpoints/auth.api";
import type { ApiToken } from "@/lib/api/types/shared.types";
import { ApiErrorPanel } from "@/components/shared/ApiErrorPanel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable, type Column } from "@/components/market/DataTable";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";

interface TokenFormState {
  name: string;
  description: string;
  tokenType: "personal" | "organization" | "super_admin";
  scopes: string;
  reason: string;
}

const defaultForm: TokenFormState = {
  name: "",
  description: "",
  tokenType: "personal",
  scopes: "orders:read,orders:write",
  reason: "Routine integration credential rotation",
};

function tokenStatusVariant(status: ApiToken["status"]): "success" | "destructive" | "warning" {
  if (status === "active") return "success";
  if (status === "revoked") return "destructive";
  return "warning";
}

export default function TokenManagementPage() {
  const qc = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "revoked" | "expired">("all");
  const [typeFilter, setTypeFilter] = useState<"all" | "personal" | "organization" | "super_admin">("all");
  const [openCreate, setOpenCreate] = useState(false);
  const [form, setForm] = useState<TokenFormState>(defaultForm);
  const [selectedToken, setSelectedToken] = useState<ApiToken | null>(null);
  const [issuedSecret, setIssuedSecret] = useState<string | null>(null);
  const [rotateReason, setRotateReason] = useState("Security rotation");
  const [revokeReason, setRevokeReason] = useState("Credential retired");

  const tokensQuery = useQuery({
    queryKey: ["auth", "tokens", statusFilter, typeFilter],
    queryFn: () =>
      authApi.listTokens({
        status: statusFilter === "all" ? undefined : statusFilter,
        tokenType: typeFilter === "all" ? undefined : typeFilter,
      }),
  });

  const tokenUsageQuery = useQuery({
    queryKey: ["auth", "token-usage", selectedToken?.id],
    queryFn: () => authApi.getTokenUsage(selectedToken!.id, 7),
    enabled: !!selectedToken,
  });

  const createMutation = useMutation({
    mutationFn: () =>
      authApi.createToken({
        name: form.name,
        description: form.description || undefined,
        tokenType: form.tokenType,
        scopes: form.scopes.split(",").map((scope) => scope.trim()).filter(Boolean),
        reason: form.reason,
      }),
    onSuccess: (result) => {
      setIssuedSecret(result.secret);
      setOpenCreate(false);
      setForm(defaultForm);
      qc.invalidateQueries({ queryKey: ["auth", "tokens"] });
      toast({ title: "Token created", variant: "success" });
    },
    onError: (error) => {
      toast({
        title: "Create failed",
        description: error instanceof Error ? error.message : "Unable to create token",
        variant: "destructive",
      });
    },
  });

  const rotateMutation = useMutation({
    mutationFn: () => authApi.rotateToken(selectedToken!.id, rotateReason),
    onSuccess: (result) => {
      setIssuedSecret(result.secret);
      qc.invalidateQueries({ queryKey: ["auth", "tokens"] });
      toast({ title: "Token rotated", variant: "success" });
    },
  });

  const revokeMutation = useMutation({
    mutationFn: () => authApi.revokeToken(selectedToken!.id, revokeReason),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "tokens"] });
      setSelectedToken(null);
      toast({ title: "Token revoked", variant: "success" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (payload: { name?: string; description?: string; scopes?: string[]; reason: string }) =>
      authApi.updateToken(selectedToken!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["auth", "tokens"] });
      toast({ title: "Token updated", variant: "success" });
    },
  });

  const tokenRows = useMemo<ApiToken[]>(() => {
    const source = tokensQuery.data as ApiToken[] | { data?: ApiToken[] } | undefined;
    return Array.isArray(source) ? source : source?.data ?? [];
  }, [tokensQuery.data]);

  const columns: Column<ApiToken>[] = [
    { key: "name", header: "Name", render: (row) => <span className="font-medium">{row.name}</span> },
    { key: "tokenType", header: "Type", render: (row) => <span className="capitalize">{row.tokenType}</span> },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge variant={tokenStatusVariant(row.status)} className="capitalize">{row.status}</Badge>,
    },
    { key: "lastUsedAt", header: "Last Used", render: (row) => <span className="text-xs text-muted-foreground">{row.lastUsedAt ?? "Never"}</span> },
    { key: "expiresAt", header: "Expires", render: (row) => <span className="text-xs text-muted-foreground">{row.expiresAt ?? "No expiry"}</span> },
  ];

  return (
    <div className="space-y-6">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl font-bold">API Token Management</h2>
          <p className="text-sm text-muted-foreground">
            Create, rotate, revoke, and audit token usage. Token secrets are shown only once.
          </p>
        </div>
        <Dialog open={openCreate} onOpenChange={setOpenCreate}>
          <DialogTrigger asChild>
            <Button>
              <KeyRound className="h-4 w-4" />
              Create Token
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create API Token</DialogTitle>
              <DialogDescription>Configure token scope, type, and creation reason.</DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1.5">
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Description</Label>
                <Input value={form.description} onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Token Type</Label>
                <Select
                  value={form.tokenType}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, tokenType: value as TokenFormState["tokenType"] }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="personal">Personal</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label>Scopes (comma separated)</Label>
                <Input value={form.scopes} onChange={(e) => setForm((prev) => ({ ...prev, scopes: e.target.value }))} />
              </div>
              <div className="space-y-1.5">
                <Label>Reason</Label>
                <Input value={form.reason} onChange={(e) => setForm((prev) => ({ ...prev, reason: e.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpenCreate(false)}>Cancel</Button>
              <Button
                onClick={() => createMutation.mutate()}
                loading={createMutation.isPending}
                disabled={!form.name.trim() || !form.reason.trim()}
              >
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {(tokensQuery.error || createMutation.error || rotateMutation.error || revokeMutation.error) && (
        <div className="grid gap-3">
          {tokensQuery.error && <ApiErrorPanel error={tokensQuery.error} />}
          {createMutation.error && <ApiErrorPanel error={createMutation.error} compact />}
          {rotateMutation.error && <ApiErrorPanel error={rotateMutation.error} compact />}
          {revokeMutation.error && <ApiErrorPanel error={revokeMutation.error} compact />}
        </div>
      )}

      {issuedSecret && (
        <Card className="border-warning/40 bg-warning/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-warning-foreground">
              <ShieldAlert className="h-4 w-4" />
              Token Secret (One-time view)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2 text-xs text-muted-foreground">Copy this now. It will never be shown again.</p>
            <div className="flex items-center gap-2 rounded-xl border border-border/70 bg-card p-3">
              <code className="min-w-0 flex-1 truncate text-xs">{issuedSecret}</code>
              <Button
                variant="outline"
                size="sm"
                onClick={async () => {
                  await navigator.clipboard.writeText(issuedSecret);
                  toast({ title: "Copied token secret", variant: "success" });
                }}
              >
                <Copy className="h-3.5 w-3.5" />
                Copy
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setIssuedSecret(null)}>
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <CardTitle>Token Registry</CardTitle>
          <div className="flex gap-2">
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as typeof statusFilter)}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="revoked">Revoked</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as typeof typeFilter)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Token type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="personal">Personal</SelectItem>
                <SelectItem value="organization">Organization</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={tokenRows}
            columns={columns}
            isLoading={tokensQuery.isLoading}
            emptyTitle="No API tokens"
            emptyDescription="Create a token to authenticate integrations."
            onRowClick={(row) => setSelectedToken(row)}
          />
        </CardContent>
      </Card>

      <Sheet open={!!selectedToken} onOpenChange={(open) => !open && setSelectedToken(null)}>
        <SheetContent side="right" className="w-full sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>{selectedToken?.name}</SheetTitle>
            <SheetDescription>Update metadata, rotate secret, revoke, and inspect usage.</SheetDescription>
          </SheetHeader>
          {selectedToken && (
            <div className="mt-6 space-y-5">
              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <Label>Display Name</Label>
                <Input
                  defaultValue={selectedToken.name}
                  onBlur={(e) => {
                    if (e.target.value.trim() !== selectedToken.name) {
                      updateMutation.mutate({ name: e.target.value.trim(), reason: "Metadata update" });
                    }
                  }}
                />
                <Label>Description</Label>
                <Input
                  defaultValue={selectedToken.description ?? ""}
                  onBlur={(e) => {
                    updateMutation.mutate({ description: e.target.value.trim(), reason: "Metadata update" });
                  }}
                />
              </div>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <Label>Rotate Secret Reason</Label>
                <Input value={rotateReason} onChange={(e) => setRotateReason(e.target.value)} />
                <Button onClick={() => rotateMutation.mutate()} loading={rotateMutation.isPending} className="w-full">
                  <RefreshCw className="h-4 w-4" />
                  Rotate Secret
                </Button>
              </div>

              <div className="space-y-2 rounded-xl border border-destructive/35 bg-destructive/5 p-3">
                <Label>Revoke Reason</Label>
                <Input value={revokeReason} onChange={(e) => setRevokeReason(e.target.value)} />
                <Button
                  variant="destructive"
                  onClick={() => revokeMutation.mutate()}
                  loading={revokeMutation.isPending}
                  className="w-full"
                >
                  <Trash2 className="h-4 w-4" />
                  Revoke Token
                </Button>
              </div>

              <div className="space-y-2 rounded-xl border border-border/70 p-3">
                <p className="text-sm font-medium">7-day Usage</p>
                {tokenUsageQuery.isLoading && <p className="text-xs text-muted-foreground">Loading usage...</p>}
                {tokenUsageQuery.data && (
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>Total requests: {tokenUsageQuery.data.summary?.totalRequests ?? 0}</p>
                    <p>Client errors: {tokenUsageQuery.data.summary?.clientErrors ?? 0}</p>
                    <p>Server errors: {tokenUsageQuery.data.summary?.serverErrors ?? 0}</p>
                    <p>Last used at: {tokenUsageQuery.data.lastUsedAt ?? "Never"}</p>
                  </div>
                )}
                {tokenUsageQuery.error && <ApiErrorPanel error={tokenUsageQuery.error} compact />}
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
