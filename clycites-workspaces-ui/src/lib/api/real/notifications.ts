import { apiRequest, unwrapApiData } from "@/lib/api/real/http";
import type { AppNotification, ListResult, NotificationFilterParams } from "@/lib/store/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
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

function normalizeNotification(row: unknown, index: number): AppNotification {
  const record = asRecord(row) ?? {};
  const now = new Date().toISOString();
  return {
    id: String(record.id ?? record._id ?? `notif-remote-${index + 1}`),
    title: String(record.title ?? record.subject ?? "Notification"),
    message: String(record.message ?? record.body ?? ""),
    read: Boolean(record.read ?? record.isRead ?? false),
    severity:
      (typeof record.severity === "string" &&
      ["info", "success", "warning", "error"].includes(record.severity)
        ? (record.severity as AppNotification["severity"])
        : "info"),
    link: typeof record.link === "string" ? record.link : undefined,
    workspace: undefined,
    entityType: typeof record.entityType === "string" ? record.entityType : undefined,
    entityId: typeof record.entityId === "string" ? record.entityId : undefined,
    tags: Array.isArray(record.tags) ? (record.tags as string[]) : [],
    createdAt: typeof record.createdAt === "string" ? record.createdAt : now,
    updatedAt: typeof record.updatedAt === "string" ? record.updatedAt : now,
    createdBy: String(record.createdBy ?? "remote"),
    updatedBy: String(record.updatedBy ?? "remote"),
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

function applyPaging(items: AppNotification[], params: NotificationFilterParams): ListResult<AppNotification> {
  const page = Math.max(1, params.page);
  const pageSize = Math.max(1, params.pageSize);
  const filtered = items.filter((item) => !params.unreadOnly || !item.read);
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

export const notificationsService = {
  async list(params: NotificationFilterParams) {
    const query = new URLSearchParams();
    query.set("page", String(params.page));
    query.set("limit", String(params.pageSize));
    if (params.unreadOnly) query.set("read", "false");
    const payload = await apiRequest<unknown>(`/api/v1/notifications?${query.toString()}`, { method: "GET" }, { auth: true });
    const rows = extractRows(payload).map((row, index) => normalizeNotification(row, index));
    const filtered = params.unreadOnly ? rows.filter((row) => !row.read) : rows;
    const remotePagination = extractRemotePagination(payload, params.page, params.pageSize, filtered.length);
    if (remotePagination) {
      return {
        items: filtered,
        pagination: remotePagination,
      };
    }
    return applyPaging(filtered, params);
  },
  async markRead(notificationId: string, _actorId: string) {
    void _actorId;
    await apiRequest<unknown>(
      `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
      { method: "PATCH" },
      { auth: true }
    );
  },
  async markUnread(notificationId: string, _actorId: string) {
    void _actorId;
    await apiRequest<unknown>(
      `/api/v1/notifications/${encodeURIComponent(notificationId)}/unread`,
      { method: "PATCH" },
      { auth: true }
    );
  },
  async markAllRead(_actorId: string) {
    void _actorId;
    await apiRequest<unknown>("/api/v1/notifications/mark-all-read", { method: "PATCH" }, { auth: true });
  },
  async getUnreadCount() {
    const payload = await apiRequest<unknown>("/api/v1/notifications/unread-count", { method: "GET" }, { auth: true });
    const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
    const direct = Number(data.count ?? data.unreadCount ?? data.total ?? 0);
    return Number.isFinite(direct) ? Math.max(0, Math.trunc(direct)) : 0;
  },
  async listTemplates() {
    const payload = await apiRequest<unknown>("/api/v1/notifications/templates", { method: "GET" }, { auth: true });
    const rows = extractRows(payload);
    return rows.map((row, index) => {
      const record = asRecord(row) ?? {};
      return {
        id: String(record.id ?? `template-${index + 1}`),
        key: String(record.key ?? record.name ?? `template_${index + 1}`),
        channels: Array.isArray(record.channels)
          ? record.channels.filter((item): item is string => typeof item === "string")
          : [],
      };
    });
  },
  async retryFailed() {
    const payload = await apiRequest<unknown>("/api/v1/notifications/admin/retry-failed", { method: "POST" }, { auth: true });
    const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
    return {
      queued: Number(data.queued ?? 0),
      retried: Number(data.retried ?? data.count ?? 0),
    };
  },
  async expireOld() {
    const payload = await apiRequest<unknown>("/api/v1/notifications/admin/expire-old", { method: "POST" }, { auth: true });
    const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
    return {
      expired: Number(data.expired ?? data.count ?? 0),
    };
  },
};
