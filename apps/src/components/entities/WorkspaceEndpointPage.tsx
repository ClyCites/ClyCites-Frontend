"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { apiRequest } from "@/lib/api/real/http";
import { getWorkspaceEndpoint } from "@/lib/api/endpoint-catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { getWorkspaceLabel } from "@/lib/nav/workspace-nav";
import { useMockSession } from "@/lib/auth/mock-session";
import { AccessDenied } from "@/components/common/AccessDenied";
import { PageHeader } from "@/components/common/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface WorkspaceEndpointPageProps {
  workspaceId: WorkspaceId;
  endpointId: string;
}

function extractPathParams(path: string): string[] {
  const matches = path.match(/\{([a-zA-Z0-9_]+)\}/g);
  if (!matches) return [];
  return matches.map((item) => item.slice(1, -1));
}

function buildResolvedPath(template: string, values: Record<string, string>): string {
  return template.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => {
    const value = values[key]?.trim();
    if (!value) {
      throw new Error(`Missing value for "${key}".`);
    }
    return encodeURIComponent(value);
  });
}

export function WorkspaceEndpointPage({ workspaceId, endpointId }: WorkspaceEndpointPageProps) {
  const { canAccessWorkspace } = useMockSession();
  const endpoint = getWorkspaceEndpoint(workspaceId, endpointId);
  const workspaceLabel = getWorkspaceLabel(workspaceId);

  const params = useMemo(() => extractPathParams(endpoint?.path ?? ""), [endpoint?.path]);
  const [paramValues, setParamValues] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState("");
  const [responseBody, setResponseBody] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!canAccessWorkspace(workspaceId)) {
    return <AccessDenied />;
  }

  if (!endpoint) {
    return <AccessDenied />;
  }

  const runEndpoint = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setResponseBody("");

    try {
      const path = buildResolvedPath(endpoint.path, paramValues);
      const method = endpoint.method;
      const acceptsBody = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
      const body =
        acceptsBody && requestBody.trim().length > 0
          ? JSON.stringify(JSON.parse(requestBody))
          : undefined;

      const response = await apiRequest<unknown>(
        path,
        {
          method,
          body,
        },
        { auth: true }
      );

      setResponseBody(JSON.stringify(response, null, 2));
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Request failed.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <PageHeader
        title={endpoint.summary}
        subtitle={endpoint.path}
        breadcrumbs={[
          { label: "App", href: "/app" },
          { label: workspaceLabel, href: `/app/${workspaceId}` },
          { label: "Endpoints", href: `/app/${workspaceId}/endpoints` },
          { label: endpoint.id },
        ]}
      />

      <Card>
        <CardHeader>
          <CardTitle>Endpoint Configuration</CardTitle>
          <CardDescription>Run this endpoint directly from the workspace endpoint catalog.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{endpoint.method}</Badge>
            {endpoint.uiImplemented ? <Badge variant="success">Wired</Badge> : <Badge variant="secondary">Catalog only</Badge>}
          </div>

          {params.length > 0 && (
            <div className="grid gap-2 md:grid-cols-2">
              {params.map((param) => (
                <Input
                  key={param}
                  placeholder={param}
                  value={paramValues[param] ?? ""}
                  onChange={(event) =>
                    setParamValues((current) => ({
                      ...current,
                      [param]: event.target.value,
                    }))
                  }
                />
              ))}
            </div>
          )}

          {(endpoint.method === "POST" || endpoint.method === "PUT" || endpoint.method === "PATCH" || endpoint.method === "DELETE") && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Request body (JSON)</p>
              <Textarea
                value={requestBody}
                onChange={(event) => setRequestBody(event.target.value)}
                className="min-h-[180px] font-mono text-xs"
                placeholder='{"key":"value"}'
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Button onClick={runEndpoint} loading={isLoading}>
              Execute Endpoint
            </Button>
            <Button asChild variant="outline">
              <Link href={`/app/${workspaceId}/endpoints`}>Back to Catalog</Link>
            </Button>
          </div>

          {errorMessage && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-3 text-sm text-destructive">
              {errorMessage}
            </div>
          )}

          {responseBody && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Response</p>
              <pre className="max-h-[420px] overflow-auto rounded-lg border border-border/60 bg-background/60 p-3 text-xs">
                {responseBody}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
