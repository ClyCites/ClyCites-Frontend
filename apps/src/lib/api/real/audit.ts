import { apiRequest, unwrapApiData } from "@/lib/api/real/http";
import type { AuditAction, AuditFilterParams, AuditRecord, ListResult } from "@/lib/store/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function normalizeAction(value: unknown): AuditAction {
  const text = typeof value === "string" ? value.toLowerCase() : "";
  if (text.includes("create")) return "create";
  if (text.includes("update") || text.includes("edit") || text.includes("patch")) return "update";
  if (text.includes("delete") || text.includes("remove")) return "delete";
  if (text.includes("status")) return "status_change";
  if (text.includes("login")) return "login";
  if (text.includes("logout")) return "logout";
  return "simulate";
}

function extractRows(payload: unknown): unknown[] {
  const data = unwrapApiData<unknown>(payload);
  if (Array.isArray(data)) return data;
  const record = asRecord(data);
  if (!record) return [];
  const candidates = [record.items, record.rows, record.results, record.data];
  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }
  return [];
}

function normalizeAuditRecord(row: unknown, index: number): AuditRecord {
  const record = asRecord(row) ?? {};
  const action = normalizeAction(record.action);
  const now = new Date().toISOString();
  return {
    id: String(record.id ?? record._id ?? `audit-remote-${index + 1}`),
    actorId: String(record.actorId ?? record.userId ?? "remote"),
    action,
    entityType: String(record.entityType ?? record.resource ?? "resource"),
    entityId: String(record.entityId ?? record.resourceId ?? `resource-${index + 1}`),
    workspace: undefined,
    summary: String(record.summary ?? record.action ?? "Audit event"),
    fromStatus: typeof record.fromStatus === "string" ? record.fromStatus : undefined,
    toStatus: typeof record.toStatus === "string" ? record.toStatus : undefined,
    metadata: asRecord(record.changes) ?? asRecord(record.metadata) ?? undefined,
    tags: [String(record.resource ?? "resource"), action],
    createdAt: typeof record.createdAt === "string" ? record.createdAt : now,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : now,
    createdBy: String(record.createdBy ?? record.userId ?? "remote"),
    updatedBy: String(record.updatedBy ?? record.userId ?? "remote"),
  };
}

function toPositiveInteger(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const normalized = Math.trunc(parsed);
  return normalized > 0 ? normalized : null;
}

function extractRemotePagination(payload: unknown, page: number, pageSize: number, itemCount: number): {
  page: number;
  pageSize: number;
  total: number;
} | null {
  const root = asRecord(payload) ?? {};
  const unwrapped = asRecord(unwrapApiData<unknown>(payload)) ?? {};
  const candidates = [
    asRecord(unwrapped.pagination),
    asRecord(root.pagination),
    asRecord(asRecord(unwrapped.meta)?.pagination),
    asRecord(asRecord(root.meta)?.pagination),
    asRecord(unwrapped.meta),
    asRecord(root.meta),
    unwrapped,
    root,
  ].filter((value): value is Record<string, unknown> => Boolean(value));

  for (const candidate of candidates) {
    const total =
      toPositiveInteger(candidate.total) ??
      toPositiveInteger(candidate.totalItems) ??
      toPositiveInteger(candidate.totalCount) ??
      toPositiveInteger(candidate.recordsTotal);
    if (total === null) continue;

    return {
      page:
        toPositiveInteger(candidate.page) ??
        toPositiveInteger(candidate.currentPage) ??
        page,
      pageSize:
        toPositiveInteger(candidate.pageSize) ??
        toPositiveInteger(candidate.limit) ??
        toPositiveInteger(candidate.perPage) ??
        pageSize,
      total: Math.max(total, itemCount),
    };
  }
  return null;
}

function applyClientFilters(items: AuditRecord[], params: AuditFilterParams): ListResult<AuditRecord> {
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const filtered = items.filter((item) => {
    if (params.action && item.action !== params.action) return false;
    if (params.text && !item.summary.toLowerCase().includes(params.text.toLowerCase())) return false;
    if (params.entityType && item.entityType !== params.entityType) return false;
    return true;
  });
  const start = (page - 1) * pageSize;
  return {
    items: filtered.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total: filtered.length,
    },
  };
}

export const auditService = {
  async list(params: AuditFilterParams) {
    const query = new URLSearchParams();
    query.set("page", String(params.page));
    query.set("limit", String(params.pageSize));
    if (params.action) query.set("action", params.action);
    if (params.dateRange?.from) query.set("startDate", params.dateRange.from);
    if (params.dateRange?.to) query.set("endDate", params.dateRange.to);

    const payload = await apiRequest<unknown>(`/api/v1/audit/me?${query.toString()}`, { method: "GET" }, { auth: true });
    const rows = extractRows(payload).map((row, index) => normalizeAuditRecord(row, index));

    const hasClientOnlyFilters = Boolean(params.text || params.entityType);
    if (hasClientOnlyFilters) {
      return applyClientFilters(rows, params);
    }

    const remotePagination = extractRemotePagination(payload, params.page, params.pageSize, rows.length);
    if (remotePagination) {
      return {
        items: rows,
        pagination: remotePagination,
      };
    }

    return applyClientFilters(rows, params);
  },
};
