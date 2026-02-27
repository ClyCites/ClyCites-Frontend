import { notificationsService as mockNotificationsService } from "@/lib/api/mock";
import { apiRequest, ApiRequestError, unwrapApiData } from "@/lib/api/real/http";
import type { AppNotification, ListResult, NotificationFilterParams } from "@/lib/store/types";

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function shouldFallback(error: unknown): boolean {
  if (!(error instanceof ApiRequestError)) return true;
  return error.status !== 401 && error.status !== 403;
}

async function withFallback<T>(remote: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await remote();
  } catch (error) {
    if (!shouldFallback(error)) throw error;
    return fallback();
  }
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
    return withFallback(
      async () => {
        const query = new URLSearchParams();
        query.set("page", String(params.page));
        query.set("limit", String(params.pageSize));
        if (params.unreadOnly) query.set("read", "false");
        const payload = await apiRequest<unknown>(`/api/v1/notifications?${query.toString()}`, { method: "GET" }, { auth: true });
        const rows = extractRows(payload).map((row, index) => normalizeNotification(row, index));
        return applyPaging(rows, params);
      },
      () => mockNotificationsService.list(params)
    );
  },
  async markRead(notificationId: string, actorId: string) {
    return withFallback(
      () =>
        apiRequest<unknown>(
          `/api/v1/notifications/${encodeURIComponent(notificationId)}/read`,
          { method: "PATCH" },
          { auth: true }
        ).then(() => undefined),
      () => mockNotificationsService.markRead(notificationId, actorId)
    );
  },
  async markUnread(notificationId: string, actorId: string) {
    return mockNotificationsService.markUnread(notificationId, actorId);
  },
  async markAllRead(actorId: string) {
    return withFallback(
      () => apiRequest<unknown>("/api/v1/notifications/mark-all-read", { method: "PATCH" }, { auth: true }).then(() => undefined),
      () => mockNotificationsService.markAllRead(actorId)
    );
  },
};
