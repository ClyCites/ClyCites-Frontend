"use client";

import { AlertTriangle } from "lucide-react";
import { HttpError } from "@/lib/api/http";

const STATUS_HINTS: Record<number, string> = {
  400: "Request payload is invalid. Review inputs and try again.",
  401: "Session expired or invalid token. Please log in again.",
  403: "You do not have permission for this action.",
  404: "Requested resource was not found.",
  409: "Conflict detected. Refresh and retry the action.",
  422: "Validation failed on one or more fields.",
  429: "Rate limit reached. Wait a moment before retrying.",
  500: "Server encountered an error. Please retry shortly.",
};

interface ApiErrorPanelProps {
  error: unknown;
  compact?: boolean;
}

export function ApiErrorPanel({ error, compact = false }: ApiErrorPanelProps) {
  const fallbackMessage = "An unexpected error occurred.";
  const httpError = error instanceof HttpError ? error : null;

  const status = httpError?.status;
  const code = httpError?.code ?? "UNKNOWN";
  const message = httpError?.message ?? fallbackMessage;
  const hint = status ? STATUS_HINTS[status] : fallbackMessage;
  const requestId = httpError?.requestId ?? httpError?.apiError?.meta?.requestId;

  return (
    <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-4 w-4 text-destructive" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-destructive">{code}</p>
          <p className="text-sm text-foreground">{message}</p>
          {!compact && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
          {requestId && (
            <p className="mt-2 text-xs text-muted-foreground">
              requestId: <span className="font-mono">{requestId}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
