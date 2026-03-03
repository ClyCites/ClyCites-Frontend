import { ENTITY_DEFINITIONS, WORKSPACE_ENTITY_MAP, WORKSPACES } from "@/lib/store/catalog";
import type { EntityKey, EntityRecord, ListParams, ListResult, WorkspaceId } from "@/lib/store/types";
import { entityServices as mockEntityServices, type EntityService } from "@/lib/api/mock/entities";
import { apiRequest, ApiRequestError, unwrapApiData } from "@/lib/api/real/http";

type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type CreatePayload = {
  actorId: string;
  title: string;
  subtitle?: string;
  status?: string;
  tags?: string[];
  data: Record<string, unknown>;
};

type UpdatePayload = {
  actorId: string;
  title?: string;
  subtitle?: string;
  tags?: string[];
  data?: Record<string, unknown>;
};

interface StatusRequestConfig {
  path: string;
  method: RequestMethod;
  body?: unknown;
}

interface ActionRequestConfig {
  path: string;
  method: RequestMethod;
  body?: unknown;
  message?: string;
  messageFromResponse?: (payload: unknown) => string | undefined;
}

interface EntityApiConfig {
  listPath?: string;
  listMode?: "collection" | "single";
  mapListRows?: (payload: unknown, params: ListParams) => unknown[];
  mapGetRow?: (payload: unknown, id: string) => Record<string, unknown>;
  getPath?: (id: string) => string;
  createPath?: string;
  createMethod?: RequestMethod;
  updatePath?: (id: string) => string;
  updateMethod?: RequestMethod;
  deletePath?: (id: string) => string;
  deleteMethod?: RequestMethod;
  deleteBody?: (id: string) => unknown;
  listQuery?: (params: ListParams) => Record<string, unknown>;
  mapCreateBody?: (payload: CreatePayload) => unknown;
  mapUpdateBody?: (id: string, payload: UpdatePayload) => unknown;
  statusRequest?: (id: string, status: string, note?: string) => StatusRequestConfig | null;
  actionRequest?: (actionId: string, actorId: string, targetId?: string) => ActionRequestConfig | null;
}

const WORKSPACE_BY_ENTITY = Object.entries(WORKSPACE_ENTITY_MAP).reduce(
  (acc, [workspace, entities]) => {
    entities.forEach((entity) => {
      acc[entity] = workspace as WorkspaceId;
    });
    return acc;
  },
  {} as Record<EntityKey, WorkspaceId>
);

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function toStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === "string" && item.trim().length > 0);
  }
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }
  return [];
}

function readPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((current, key) => {
    if (!current || typeof current !== "object") return undefined;
    return (current as Record<string, unknown>)[key];
  }, source);
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function safeIsoDate(value: unknown): string {
  if (typeof value === "string") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) {
      return parsed.toISOString();
    }
  }
  return new Date().toISOString();
}

function hashToHex(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  const normalized = Math.abs(hash).toString(16);
  return `${normalized}${"0".repeat(24)}`.slice(0, 24);
}

function toMongoLikeId(value: unknown, fallbackSeed: string): string {
  if (typeof value === "string" && value.trim().length > 0) {
    const normalized = value.toLowerCase().replace(/[^a-f0-9]/g, "");
    if (normalized.length >= 24) return normalized.slice(0, 24);
    if (normalized.length > 0) return `${normalized}${hashToHex(value)}`.slice(0, 24);
  }
  return hashToHex(fallbackSeed);
}

function joinLocationParts(location: unknown): string | undefined {
  const record = asRecord(location);
  if (!record) return undefined;
  const parts = [record.region, record.district, record.village]
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
  return parts.length > 0 ? parts.join(", ") : undefined;
}

function normalizeTitle(entityKey: EntityKey, row: Record<string, unknown>, fallbackId: string): string {
  const candidates = [
    row.title,
    row.name,
    row.businessName,
    row.displayName,
    row.productName,
    row.commodity,
    row.code,
    row.policyNumber,
  ];

  const found = candidates.find((item) => typeof item === "string" && item.trim().length > 0);
  if (typeof found === "string") return found;

  return `${ENTITY_DEFINITIONS[entityKey].label} ${fallbackId}`;
}

function normalizeSubtitle(row: Record<string, unknown>): string | undefined {
  const location = joinLocationParts(row.location);
  const candidates = [row.subtitle, row.description, row.summary, row.email, location];
  const found = candidates.find((item) => typeof item === "string" && item.trim().length > 0);
  return typeof found === "string" ? found : undefined;
}

function extractCollection(payload: unknown): unknown[] {
  const unwrapped = unwrapApiData<unknown>(payload);

  if (Array.isArray(unwrapped)) return unwrapped;

  const queue: unknown[] = [unwrapped];
  const visited = new Set<unknown>();

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;
    visited.add(current);

    if (Array.isArray(current)) return current;

    const record = asRecord(current);
    if (!record) continue;

    const preferredKeys = ["items", "results", "rows", "docs", "records", "list", "data"];
    for (const key of preferredKeys) {
      const candidate = record[key];
      if (Array.isArray(candidate)) return candidate;
    }

    const nestedKeys = ["data", "result", "payload", "response"];
    nestedKeys.forEach((key) => {
      const candidate = record[key];
      if (candidate && (Array.isArray(candidate) || typeof candidate === "object")) {
        queue.push(candidate);
      }
    });
  }

  return [];
}

function extractSingle(payload: unknown): Record<string, unknown> {
  const unwrapped = unwrapApiData<unknown>(payload);
  if (Array.isArray(unwrapped)) {
    const first = unwrapped.find((item) => Boolean(item));
    return asRecord(first) ?? {};
  }

  const record = asRecord(unwrapped);
  if (!record) return {};

  const nested = asRecord(record.data);
  if (nested) return nested;
  return record;
}

function extractNumericCount(payload: unknown): number | null {
  const unwrapped = unwrapApiData<unknown>(payload);
  const record = asRecord(unwrapped) ?? asRecord(payload);
  if (!record) return null;

  const candidates = [
    record.count,
    record.total,
    record.totalCount,
    record.unreadCount,
    asRecord(record.meta)?.count,
    asRecord(record.pagination)?.total,
  ];
  for (const candidate of candidates) {
    const parsed = Number(candidate);
    if (Number.isFinite(parsed)) {
      return Math.max(0, Math.trunc(parsed));
    }
  }

  const rows = extractCollection(payload);
  return Array.isArray(rows) ? rows.length : null;
}

function mapRemoteRecord(entityKey: EntityKey, row: unknown, index = 0): EntityRecord {
  const record = asRecord(row) ?? {};
  const fallbackId = `${entityKey}-remote-${index + 1}`;
  const id = String(
    record.id ??
      record._id ??
      record.uuid ??
      record.userId ??
      record.memberId ??
      record.offerId ??
      record.conversationId ??
      record.ratingId ??
      fallbackId
  );
  const title = normalizeTitle(entityKey, record, id);
  const subtitle = normalizeSubtitle(record);
  const rawStatus =
    (typeof record.status === "string" ? record.status : undefined) ||
    (typeof record.state === "string" ? record.state : undefined) ||
    (typeof record.workflowStatus === "string" ? record.workflowStatus : undefined) ||
    (typeof record.lifecycleStatus === "string" ? record.lifecycleStatus : undefined) ||
    (typeof record.productionStatus === "string" ? record.productionStatus : undefined) ||
    (typeof record.caseStatus === "string" ? record.caseStatus : undefined) ||
    (typeof record.stationStatus === "string" ? record.stationStatus : undefined) ||
    (typeof record.alertStatus === "string" ? record.alertStatus : undefined) ||
    (typeof record.reviewStatus === "string" ? record.reviewStatus : undefined) ||
    (typeof record.offerStatus === "string" ? record.offerStatus : undefined) ||
    (typeof record.deliveryStatus === "string" ? record.deliveryStatus : undefined);

  let status = rawStatus ?? ENTITY_DEFINITIONS[entityKey].defaultStatus;
  if (entityKey === "users") {
    const isActive = typeof record.isActive === "boolean" ? record.isActive : true;
    status = isActive ? "active" : "disabled";
  }
  if (entityKey === "orgs") {
    const isActive = typeof record.isActive === "boolean" ? record.isActive : true;
    status = isActive ? "active" : "disabled";
  }
  if (entityKey === "moduleToggles") {
    const isEnabled =
      typeof record.enabled === "boolean"
        ? record.enabled
        : typeof record.isEnabled === "boolean"
          ? record.isEnabled
          : status !== "disabled";
    status = isEnabled ? "enabled" : "disabled";
  }
  if (entityKey === "farmers") {
    const verificationStatus =
      typeof record.verificationStatus === "string" ? record.verificationStatus.toLowerCase() : "";
    const statusSource = (rawStatus ?? verificationStatus).toLowerCase();

    if (statusSource.includes("reject")) {
      status = "rejected";
    } else if (statusSource.includes("verif")) {
      status = "verified";
    } else if (
      statusSource.includes("submit") ||
      statusSource.includes("review") ||
      record.submittedForVerification === true ||
      Boolean(record.verificationSubmittedAt)
    ) {
      status = "submitted";
    } else if (typeof record.verified === "boolean") {
      status = record.verified ? "verified" : "draft";
    } else if (!statusSource) {
      status = "draft";
    }
  }
  if (entityKey === "pestIncidents") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending") {
      status = "created";
    } else if (normalized === "analyzed" || normalized === "ai_analyzed" || normalized === "expert_reviewed" || normalized === "verified") {
      status = "assigned";
    } else if (normalized === "resolved") {
      status = "resolved";
    } else if (normalized === "closed") {
      status = "closed";
    }
  }
  if (entityKey === "cropCycles") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "planned") {
      status = "planned";
    } else if (normalized === "in_progress") {
      status = "active";
    } else if (normalized === "harvested" || normalized === "sold" || normalized === "stored" || normalized === "failed") {
      status = "completed";
    }
  }
  if (entityKey === "growthStages") {
    const normalized = (rawStatus ?? "").toLowerCase();
    const stage =
      normalized === "seed" || normalized === "vegetative" || normalized === "flowering" || normalized === "maturity" || normalized === "harvested"
        ? normalized
        : normalized === "planned"
          ? "seed"
          : normalized === "in_progress"
            ? "vegetative"
            : normalized === "sold" || normalized === "stored" || normalized === "failed"
              ? "maturity"
              : undefined;
    if (stage) {
      status = stage;
    }
  }
  if (entityKey === "crops") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "planned") {
      status = "planned";
    } else if (normalized === "in_progress") {
      status = "growing";
    } else if (normalized === "harvested" || normalized === "sold" || normalized === "stored") {
      status = "harvested";
    } else if (normalized === "failed") {
      status = "archived";
    }
  }
  if (entityKey === "shipments") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "created" || normalized === "assigned" || normalized === "picked_up" || normalized === "planned") {
      status = "planned";
    } else if (normalized === "in_transit") {
      status = "in_transit";
    } else if (normalized === "delivered") {
      status = "delivered";
    } else if (normalized === "cancelled" || normalized === "returned") {
      status = "cancelled";
    }
  }
  if (entityKey === "wallets") {
    const frozen =
      typeof record.frozen === "boolean"
        ? record.frozen
        : typeof record.isFrozen === "boolean"
          ? record.isFrozen
          : false;
    status = frozen ? "frozen" : "active";
  }
  if (entityKey === "transactions") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending") {
      status = "pending";
    } else if (normalized === "completed") {
      status = "completed";
    } else if (normalized === "failed") {
      status = "failed";
    } else if (normalized === "cancelled") {
      status = "reversed";
    }
  }
  if (entityKey === "payouts") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending") {
      status = "processing";
    } else if (normalized === "completed") {
      status = "paid";
    } else if (normalized === "failed" || normalized === "cancelled") {
      status = "failed";
    } else if (!normalized) {
      status = "requested";
    }
  }
  if (entityKey === "escrowAccounts") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "active") {
      status = "funded";
    } else if (normalized === "released") {
      status = "released";
    } else if (normalized === "refunded") {
      status = "refunded";
    } else if (normalized === "disputed" || normalized === "closed") {
      status = "closed";
    } else if (!normalized) {
      status = "created";
    }
  }
  if (entityKey === "alertRules") {
    const isEnabled =
      typeof record.enabled === "boolean"
        ? record.enabled
        : typeof record.active === "boolean"
          ? record.active
        : typeof record.isActive === "boolean"
          ? record.isActive
          : status === "active";
    status = isEnabled ? "active" : "disabled";
  }
  if ((entityKey === "priceSignals" || entityKey === "marketSignals") && !rawStatus) {
    const isActive = typeof record.active === "boolean" ? record.active : true;
    const investigated = typeof record.investigated === "boolean" ? record.investigated : false;
    if (!isActive) {
      status = entityKey === "priceSignals" ? "closed" : "dismissed";
    } else if (investigated) {
      status = entityKey === "priceSignals" ? "investigating" : "investigated";
    } else {
      status = "new";
    }
  }
  if (entityKey === "weatherAlerts" && !rawStatus) {
    if (record.dismissedAt || record.resolvedAt) {
      status = "resolved";
    } else if (record.acknowledgedAt) {
      status = "acknowledged";
    } else {
      status = "new";
    }
  }
  if (entityKey === "advisories") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "submitted" || normalized === "in_review" || normalized === "under_review" || normalized === "review") {
      status = "in_review";
    } else if (normalized === "approved") {
      status = "approved";
    } else if (normalized === "rejected" || normalized === "declined") {
      status = "rejected";
    } else if (normalized === "published" || normalized === "sent" || normalized === "dispatched" || normalized === "active") {
      status = "published";
    } else if (normalized === "acknowledged" || normalized === "read") {
      status = "acknowledged";
    } else if (normalized === "draft" || normalized === "new" || !normalized) {
      status = "draft";
    }
  }
  if (entityKey === "knowledgeBaseArticles") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "submitted" || normalized === "in_review" || normalized === "under_review") {
      status = "in_review";
    } else if (normalized === "approved") {
      status = "approved";
    } else if (normalized === "rejected") {
      status = "rejected";
    } else if (normalized === "published" || record.published === true) {
      status = "published";
    } else if (normalized === "unpublished") {
      status = "unpublished";
    } else if (normalized === "archived") {
      status = "archived";
    } else if (normalized === "draft" || !normalized) {
      status = "draft";
    }
  }
  if (entityKey === "fieldCases") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending" || normalized === "open" || normalized === "new" || normalized === "created" || !normalized) {
      status = "created";
    } else if (normalized === "assigned") {
      status = "assigned";
    } else if (normalized === "in_progress" || normalized === "started" || normalized === "active") {
      status = "in_visit";
    } else if (normalized === "resolved" || normalized === "submitted" || normalized === "completed") {
      status = "resolved";
    } else if (normalized === "closed") {
      status = "closed";
    }
  }
  if (entityKey === "assignments") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending" || normalized === "open" || normalized === "new" || normalized === "created" || !normalized) {
      status = "created";
    } else if (normalized === "assigned" || normalized === "in_progress" || normalized === "started") {
      status = "assigned";
    } else if (normalized === "resolved" || normalized === "completed" || normalized === "closed") {
      status = "completed";
    } else if (normalized === "cancelled" || normalized === "rejected") {
      status = "cancelled";
    }
  }
  if (entityKey === "reviewQueue") {
    const normalized = (rawStatus ?? "").toLowerCase();
    if (normalized === "pending" || normalized === "new" || normalized === "queued" || normalized === "unassigned" || !normalized) {
      status = "queued";
    } else if (normalized === "in_review" || normalized === "assigned" || normalized === "in_progress") {
      status = "in_review";
    } else if (normalized === "approved" || normalized === "resolved" || normalized === "completed") {
      status = "approved";
    } else if (normalized === "rejected" || normalized === "declined" || normalized === "closed") {
      status = "rejected";
    }
  }
  if (entityKey === "stations" && typeof record.stationStatus === "string") {
    status = record.stationStatus;
  }
  if (entityKey === "negotiations" && !rawStatus) {
    if (record.archived === true) {
      status = "closed";
    } else if (record.agreed === true) {
      status = "agreed";
    } else {
      status = "open";
    }
  }
  if (entityKey === "rfqs" && !rawStatus) {
    if (record.withdrawnAt || record.closedAt) {
      status = "closed";
    } else if (record.acceptedAt) {
      status = "shortlisted";
    } else {
      status = "open";
    }
  }

  const tags = toStringArray(record.tags);
  const derivedTags = [
    ...tags,
    ...toStringArray(record.scopes),
    ...toStringArray(record.cropTypes),
    ...toStringArray(record.categories),
    ...(typeof record.role === "string" ? [record.role] : []),
  ];

  return {
    id,
    entity: entityKey,
    workspace: WORKSPACE_BY_ENTITY[entityKey],
    title,
    subtitle,
    status,
    data: record,
    tags: [...new Set(derivedTags)].slice(0, 8),
    createdAt: safeIsoDate(record.createdAt ?? record.created_at ?? record.timestamp),
    updatedAt: safeIsoDate(record.updatedAt ?? record.updated_at ?? record.createdAt ?? record.timestamp),
    createdBy: String(record.createdBy ?? record.ownerId ?? "remote"),
    updatedBy: String(record.updatedBy ?? record.ownerId ?? "remote"),
  };
}

function applyListParams(records: EntityRecord[], params: ListParams): ListResult<EntityRecord> {
  const filtered = records.filter((record) => {
    const filters = params.filters;
    if (!filters) return true;

    if (filters.text) {
      const needle = filters.text.toLowerCase();
      const haystack = [record.title, record.subtitle ?? "", record.status, record.tags.join(" "), JSON.stringify(record.data)]
        .join(" ")
        .toLowerCase();
      if (!haystack.includes(needle)) return false;
    }

    if (filters.status && filters.status.length > 0 && !filters.status.includes(record.status)) {
      return false;
    }

    if (filters.tags && filters.tags.length > 0) {
      const tagSet = new Set(record.tags);
      const hasAll = filters.tags.every((tag) => tagSet.has(tag));
      if (!hasAll) return false;
    }

    if (filters.dateRange?.from || filters.dateRange?.to) {
      const updatedAt = new Date(record.updatedAt).getTime();
      const from = filters.dateRange.from ? new Date(filters.dateRange.from).getTime() : Number.NEGATIVE_INFINITY;
      const to = filters.dateRange.to ? new Date(filters.dateRange.to).getTime() : Number.POSITIVE_INFINITY;
      if (updatedAt < from || updatedAt > to) return false;
    }

    return true;
  });

  const sorted = [...filtered].sort((left, right) => {
    const field = params.sort?.field ?? "updatedAt";
    const direction = params.sort?.direction ?? "desc";
    const compared = compareValues(
      readPath(left as unknown as Record<string, unknown>, field),
      readPath(right as unknown as Record<string, unknown>, field)
    );
    return direction === "asc" ? compared : -compared;
  });

  const page = Math.max(1, params.pagination.page);
  const pageSize = Math.max(1, params.pagination.pageSize);
  const start = (page - 1) * pageSize;

  return {
    items: sorted.slice(start, start + pageSize),
    pagination: {
      page,
      pageSize,
      total: filtered.length,
    },
  };
}

function toPositiveInteger(value: unknown): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const normalized = Math.trunc(parsed);
  return normalized > 0 ? normalized : null;
}

function normalizeRateLimit(value: unknown): { requestsPerMinute: number; burst: number } {
  const record = asRecord(value);
  const requestsPerMinuteCandidate = Number(record?.requestsPerMinute ?? value ?? 1000);
  const burstCandidate = Number(record?.burst ?? requestsPerMinuteCandidate * 2);

  const requestsPerMinute = Number.isFinite(requestsPerMinuteCandidate)
    ? Math.max(1, Math.trunc(requestsPerMinuteCandidate))
    : 1000;
  const burst = Number.isFinite(burstCandidate) ? Math.max(requestsPerMinute, Math.trunc(burstCandidate)) : requestsPerMinute * 2;

  return {
    requestsPerMinute,
    burst,
  };
}

function extractRemotePagination(payload: unknown, fallbackPage: number, fallbackPageSize: number, itemCount: number): {
  page: number;
  pageSize: number;
  total: number;
} | null {
  const rawPayload = asRecord(payload) ?? {};
  const unwrapped = asRecord(unwrapApiData<unknown>(payload)) ?? {};
  const unwrappedMeta = asRecord(unwrapped.meta);
  const rawMeta = asRecord(rawPayload.meta);

  const candidates = [
    asRecord(unwrapped.pagination),
    asRecord(rawPayload.pagination),
    asRecord(unwrappedMeta?.pagination),
    asRecord(rawMeta?.pagination),
    unwrappedMeta,
    rawMeta,
    unwrapped,
    rawPayload,
  ].filter((value): value is Record<string, unknown> => Boolean(value));

  for (const candidate of candidates) {
    const page =
      toPositiveInteger(candidate.page) ??
      toPositiveInteger(candidate.currentPage) ??
      toPositiveInteger(candidate.pageIndex) ??
      toPositiveInteger(candidate.page_number) ??
      fallbackPage;
    const pageSize =
      toPositiveInteger(candidate.pageSize) ??
      toPositiveInteger(candidate.limit) ??
      toPositiveInteger(candidate.perPage) ??
      toPositiveInteger(candidate.page_size) ??
      fallbackPageSize;
    const total =
      toPositiveInteger(candidate.total) ??
      toPositiveInteger(candidate.totalItems) ??
      toPositiveInteger(candidate.totalCount) ??
      toPositiveInteger(candidate.recordsTotal) ??
      (() => {
        const totalPages =
          toPositiveInteger(candidate.totalPages) ??
          toPositiveInteger(candidate.pages) ??
          toPositiveInteger(candidate.pageCount);
        return totalPages ? totalPages * pageSize : null;
      })();

    if (total !== null) {
      return {
        page,
        pageSize,
        total: Math.max(total, itemCount),
      };
    }
  }

  return null;
}

function toQueryString(values: Record<string, unknown>): string {
  const params = new URLSearchParams();
  Object.entries(values).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (Array.isArray(value)) {
      if (value.length === 0) return;
      params.set(key, value.join(","));
      return;
    }
    params.set(key, String(value));
  });
  return params.toString();
}

function shouldFallback(error: unknown): boolean {
  if (!(error instanceof ApiRequestError)) return true;
  return error.status !== 401 && error.status !== 403;
}

async function withFallback<T>(remote: () => Promise<T>, fallback: () => Promise<T>): Promise<T> {
  try {
    return await remote();
  } catch (error) {
    if (!shouldFallback(error)) {
      throw error;
    }
    return fallback();
  }
}

function defaultCreateBody(payload: CreatePayload): unknown {
  return {
    title: payload.title,
    description: payload.subtitle,
    status: payload.status,
    tags: payload.tags ?? [],
    ...payload.data,
  };
}

function defaultUpdateBody(payload: UpdatePayload): unknown {
  return {
    title: payload.title,
    description: payload.subtitle,
    tags: payload.tags,
    ...payload.data,
  };
}

function advisoryCreateUrgency(value?: unknown): "info" | "warning" | "critical" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("critical") || normalized.includes("emergency") || normalized.includes("reject")) return "critical";
  if (normalized.includes("high") || normalized.includes("warning") || normalized.includes("publish") || normalized.includes("approve")) {
    return "warning";
  }
  return "info";
}

function advisoryUpdateUrgency(value?: unknown): "low" | "medium" | "high" | "critical" | "emergency" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("emergency")) return "emergency";
  if (normalized.includes("critical")) return "critical";
  if (normalized.includes("high") || normalized.includes("warning")) return "high";
  if (normalized.includes("medium") || normalized.includes("review")) return "medium";
  return "low";
}

function normalizeAdvisoryCategory(value?: unknown): "weather" | "pest_outbreak" | "market" | "best_practice" | "regulatory" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("weather") || normalized.includes("climate")) return "weather";
  if (normalized.includes("pest") || normalized.includes("disease") || normalized.includes("outbreak")) return "pest_outbreak";
  if (normalized.includes("market") || normalized.includes("price")) return "market";
  if (normalized.includes("regulat") || normalized.includes("policy") || normalized.includes("compliance")) return "regulatory";
  return "best_practice";
}

function mapOrderStatus(nextStatus: string): string {
  const normalized = nextStatus.toLowerCase();
  const map: Record<string, string> = {
    created: "confirmed",
    accepted: "confirmed",
    rejected: "cancelled",
    fulfilled: "completed",
    cancelled: "cancelled",
    confirmed: "confirmed",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    completed: "completed",
  };
  return map[normalized] ?? "processing";
}

function mapShipmentStatus(nextStatus: string): string {
  const normalized = nextStatus.toLowerCase();
  const map: Record<string, string> = {
    planned: "created",
    in_transit: "in_transit",
    delivered: "delivered",
    cancelled: "cancelled",
    created: "created",
    assigned: "assigned",
    picked_up: "picked_up",
    returned: "returned",
  };
  return map[normalized] ?? "in_transit";
}

function toOrgMembershipRole(value: unknown): "admin" | "member" | "viewer" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized.includes("admin")) return "admin";
  if (normalized.includes("viewer")) return "viewer";
  return "member";
}

function normalizeShareScope(value: unknown): "owner_only" | "org_members" | "specific_roles" | "specific_users" | "public" {
  const normalized = String(value ?? "").toLowerCase();
  if (normalized === "owner_only" || normalized === "private") return "owner_only";
  if (normalized === "org_members" || normalized === "org" || normalized === "organization") return "org_members";
  if (normalized === "specific_roles" || normalized === "roles") return "specific_roles";
  if (normalized === "specific_users" || normalized === "users") return "specific_users";
  if (normalized === "public") return "public";
  return "owner_only";
}

function workspaceLabel(workspaceId: string): string {
  const found = WORKSPACES.find((workspace) => workspace.id === workspaceId);
  if (found) return found.label;

  return workspaceId
    .replaceAll("-", " ")
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function resolveWorkspaceId(value: unknown): string {
  if (typeof value !== "string") return "farmer";
  const normalized = value.trim().toLowerCase();

  const exact = WORKSPACES.find((workspace) => workspace.id === normalized);
  if (exact) return exact.id;

  const byLabel = WORKSPACES.find((workspace) => workspace.label.toLowerCase() === normalized);
  if (byLabel) return byLabel.id;

  const compact = normalized.replaceAll("-", "").replaceAll("_", "").replaceAll(" ", "");
  const byCompact = WORKSPACES.find(
    (workspace) =>
      workspace.id.replaceAll("-", "").replaceAll("_", "").replaceAll(" ", "") === compact ||
      workspace.label.toLowerCase().replaceAll("-", "").replaceAll("_", "").replaceAll(" ", "") === compact
  );
  if (byCompact) return byCompact.id;

  return normalized;
}

function extractFeatureFlags(payload: unknown): Record<string, boolean> {
  const unwrapped = unwrapApiData<unknown>(payload);
  const root = asRecord(unwrapped) ?? {};
  const nestedFlags = asRecord(root.flags);
  const candidate = nestedFlags ?? root;

  return Object.fromEntries(
    Object.entries(candidate).flatMap(([key, value]) => {
      if (typeof value === "boolean") {
        return [[key, value]];
      }
      const nested = asRecord(value);
      if (nested && typeof nested.enabled === "boolean") {
        return [[key, nested.enabled]];
      }
      return [];
    })
  );
}

let primaryOrgCache:
  | {
      id: string;
      expiresAt: number;
    }
  | null = null;

let weatherProfileCache:
  | {
      id: string;
      expiresAt: number;
    }
  | null = null;

let farmerProfileCache:
  | {
      id: string;
      expiresAt: number;
    }
  | null = null;

let userIdCache:
  | {
      id: string;
      expiresAt: number;
    }
  | null = null;

async function getCurrentUserId(): Promise<string> {
  if (userIdCache && Date.now() < userIdCache.expiresAt) {
    return userIdCache.id;
  }

  const mePayload = await apiRequest<unknown>("/api/v1/auth/me", { method: "GET" }, { auth: true });
  const me = unwrapApiData<unknown>(mePayload);
  const meRecord = asRecord(me) ?? {};
  const nestedUser = asRecord(meRecord.user);

  const userId =
    (typeof nestedUser?.id === "string" && nestedUser.id) ||
    (typeof meRecord.id === "string" && meRecord.id) ||
    (typeof meRecord.userId === "string" && meRecord.userId) ||
    "";

  if (!userId) {
    throw new Error("Unable to resolve user context for this session.");
  }

  userIdCache = {
    id: userId,
    expiresAt: Date.now() + 60_000,
  };
  return userId;
}

async function getPrimaryOrganizationId(): Promise<string> {
  if (primaryOrgCache && Date.now() < primaryOrgCache.expiresAt) {
    return primaryOrgCache.id;
  }

  try {
    const orgPayload = await apiRequest<unknown>("/api/v1/organizations/me?page=1&limit=1", { method: "GET" }, { auth: true });
    const rows = extractCollection(orgPayload);
    const first = asRecord(rows[0]);
    const orgId = first?.id ?? first?._id;
    if (typeof orgId === "string" && orgId.length > 0) {
      primaryOrgCache = {
        id: orgId,
        expiresAt: Date.now() + 60_000,
      };
      return orgId;
    }
  } catch {
    // ignore and fallback to auth/me parsing below
  }

  const mePayload = await apiRequest<unknown>("/api/v1/auth/me", { method: "GET" }, { auth: true });
  const me = unwrapApiData<unknown>(mePayload);
  const meRecord = asRecord(me) ?? {};
  const nestedOrg = asRecord(meRecord.organization);
  const nestedUser = asRecord(meRecord.user);

  const orgId =
    (typeof nestedOrg?.id === "string" && nestedOrg.id) ||
    (typeof meRecord.orgId === "string" && meRecord.orgId) ||
    (typeof meRecord.organizationId === "string" && meRecord.organizationId) ||
    (typeof nestedUser?.orgId === "string" && nestedUser.orgId) ||
    (typeof nestedUser?.organizationId === "string" && nestedUser.organizationId) ||
    "";

  if (!orgId) {
    throw new Error("Unable to resolve organization context for this session.");
  }

  primaryOrgCache = {
    id: orgId,
    expiresAt: Date.now() + 60_000,
  };
  return orgId;
}

async function getPrimaryWeatherProfileId(): Promise<string> {
  if (weatherProfileCache && Date.now() < weatherProfileCache.expiresAt) {
    return weatherProfileCache.id;
  }

  try {
    const mePayload = await apiRequest<unknown>("/api/v1/weather/profiles/me", { method: "GET" }, { auth: true });
    const profile = extractSingle(mePayload);
    const profileId = profile.id ?? profile._id;
    if (typeof profileId === "string" && profileId.length > 0) {
      weatherProfileCache = {
        id: profileId,
        expiresAt: Date.now() + 60_000,
      };
      return profileId;
    }
  } catch {
    // ignore and fallback to first profile
  }

  const listPayload = await apiRequest<unknown>("/api/v1/weather/profiles?page=1&limit=1", { method: "GET" }, { auth: true });
  const rows = extractCollection(listPayload);
  const first = asRecord(rows[0]);
  const profileId = first?.id ?? first?._id;
  if (typeof profileId === "string" && profileId.length > 0) {
    weatherProfileCache = {
      id: profileId,
      expiresAt: Date.now() + 60_000,
    };
    return profileId;
  }

  throw new Error("Unable to resolve weather profile context for this session.");
}

async function getPrimaryFarmerId(): Promise<string> {
  if (farmerProfileCache && Date.now() < farmerProfileCache.expiresAt) {
    return farmerProfileCache.id;
  }

  try {
    const mePayload = await apiRequest<unknown>("/api/v1/farmers/profiles/me", { method: "GET" }, { auth: true });
    const profile = extractSingle(mePayload);
    const farmerId = profile.id ?? profile._id ?? profile.farmerId;
    if (typeof farmerId === "string" && farmerId.length > 0) {
      farmerProfileCache = {
        id: farmerId,
        expiresAt: Date.now() + 60_000,
      };
      return farmerId;
    }
  } catch {
    // ignore and fallback to first profile
  }

  const listPayload = await apiRequest<unknown>("/api/v1/farmers/profiles?page=1&limit=1", { method: "GET" }, { auth: true });
  const rows = extractCollection(listPayload);
  const first = asRecord(rows[0]);
  const farmerId = first?.id ?? first?._id ?? first?.farmerId;
  if (typeof farmerId === "string" && farmerId.length > 0) {
    farmerProfileCache = {
      id: farmerId,
      expiresAt: Date.now() + 60_000,
    };
    return farmerId;
  }

  const fallbackUserId = await getCurrentUserId();
  farmerProfileCache = {
    id: fallbackUserId,
    expiresAt: Date.now() + 60_000,
  };
  return fallbackUserId;
}

async function resolvePath(path: string): Promise<string> {
  let resolved = path;

  if (resolved.includes("{orgId}")) {
    const orgId = await getPrimaryOrganizationId();
    resolved = resolved.replaceAll("{orgId}", encodeURIComponent(orgId));
  }

  if (resolved.includes("{weatherProfileId}")) {
    const profileId = await getPrimaryWeatherProfileId();
    resolved = resolved.replaceAll("{weatherProfileId}", encodeURIComponent(profileId));
  }

  if (resolved.includes("{farmerId}")) {
    const farmerId = await getPrimaryFarmerId();
    resolved = resolved.replaceAll("{farmerId}", encodeURIComponent(farmerId));
  }

  if (resolved.includes("{userId}")) {
    const userId = await getCurrentUserId();
    resolved = resolved.replaceAll("{userId}", encodeURIComponent(userId));
  }

  return resolved;
}

const CROP_PRODUCTION_CATEGORIES = new Set([
  "cereals",
  "legumes",
  "vegetables",
  "fruits",
  "cash_crops",
  "roots_tubers",
  "fodder",
  "other",
]);

const CROP_PRODUCTION_SEASONS = new Set(["season_a", "season_b", "dry_season", "wet_season", "year_round"]);
const CROP_PRODUCTION_AREA_UNITS = new Set(["acres", "hectares", "square_meters"]);
const CROP_PRODUCTION_YIELD_UNITS = new Set(["kg", "tons", "bags", "bunches", "pieces"]);

function parseYear(value: unknown): number | undefined {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return undefined;
  const year = Math.trunc(parsed);
  return year >= 2000 && year <= 2100 ? year : undefined;
}

function parseYearFromDate(value: unknown): number | undefined {
  if (typeof value !== "string" || value.trim().length === 0) return undefined;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return undefined;
  return parseYear(parsed.getUTCFullYear());
}

function toPositiveNumber(value: unknown, fallback: number): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  if (parsed <= 0) return fallback;
  return parsed;
}

function normalizeCropCategory(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");

  if (CROP_PRODUCTION_CATEGORIES.has(normalized)) return normalized;
  if (normalized.includes("grain") || normalized.includes("maize") || normalized.includes("rice")) return "cereals";
  if (normalized.includes("bean") || normalized.includes("legume")) return "legumes";
  if (normalized.includes("banana") || normalized.includes("fruit")) return "fruits";
  if (normalized.includes("cassava") || normalized.includes("tuber")) return "roots_tubers";
  return "other";
}

function normalizeCropSeason(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (CROP_PRODUCTION_SEASONS.has(normalized)) return normalized;
  if (normalized === "a") return "season_a";
  if (normalized === "b") return "season_b";
  return "season_a";
}

function normalizeAreaUnit(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (CROP_PRODUCTION_AREA_UNITS.has(normalized)) return normalized;
  if (normalized === "sqm") return "square_meters";
  return "acres";
}

function normalizeYieldUnit(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[\s-]+/g, "_");
  if (CROP_PRODUCTION_YIELD_UNITS.has(normalized)) return normalized;
  if (normalized === "ton" || normalized === "tonnes" || normalized === "tonne") return "tons";
  return "kg";
}

function toCropProductionStatus(value: unknown): string | undefined {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!normalized) return undefined;

  if (normalized === "planned") return "planned";
  if (normalized === "active" || normalized === "growing" || normalized === "in_progress") return "in_progress";
  if (normalized === "completed" || normalized === "harvested") return "harvested";
  if (normalized === "archived" || normalized === "failed") return "failed";
  if (normalized === "sold") return "sold";
  if (normalized === "stored") return "stored";
  return undefined;
}

function mapCropProductionListQuery(params: ListParams): Record<string, unknown> {
  const text = typeof params.filters?.text === "string" ? params.filters.text.trim() : "";
  const yearFromText = parseYear(text);
  const year = yearFromText ?? parseYearFromDate(params.filters?.dateRange?.from);
  const seasonCandidate =
    typeof params.filters?.tags?.[0] === "string" && params.filters.tags[0].trim().length > 0
      ? normalizeCropSeason(params.filters.tags[0])
      : undefined;

  return {
    year,
    season: seasonCandidate,
    cropName: text.length > 0 && !yearFromText ? text : undefined,
  };
}

function mapCropProductionCreateBody(payload: CreatePayload): Record<string, unknown> {
  const data = payload.data;
  const farmSeed =
    (typeof data.farmId === "string" && data.farmId.length > 0 ? data.farmId : undefined) ??
    (typeof data.plotId === "string" && data.plotId.length > 0 ? data.plotId : undefined) ??
    payload.title;
  const cropName =
    (typeof data.cropName === "string" && data.cropName.trim().length > 0 ? data.cropName.trim() : undefined) ??
    (typeof data.cropType === "string" && data.cropType.trim().length > 0 ? data.cropType.trim() : undefined) ??
    payload.title;

  return {
    farmId: toMongoLikeId(farmSeed, String(farmSeed)),
    cropName,
    cropCategory: normalizeCropCategory(data.cropCategory ?? data.category ?? cropName),
    season: normalizeCropSeason(data.season ?? data.stage),
    year: parseYear(data.year) ?? parseYearFromDate(data.plantingDate ?? data.plantingTarget) ?? new Date().getUTCFullYear(),
    areaPlanted: toPositiveNumber(data.areaPlanted ?? data.areaAcres ?? data.sizeInHectares, 1),
    areaUnit: normalizeAreaUnit(data.areaUnit),
    estimatedYield: toPositiveNumber(data.estimatedYield ?? data.expectedYield ?? data.quantityHarvested, 1),
    yieldUnit: normalizeYieldUnit(data.yieldUnit ?? data.unit),
  };
}

function mapCropProductionUpdateBody(payload: UpdatePayload): Record<string, unknown> {
  const data = payload.data ?? {};
  const farmSeed =
    (typeof data.farmId === "string" && data.farmId.length > 0 ? data.farmId : undefined) ??
    (typeof data.plotId === "string" && data.plotId.length > 0 ? data.plotId : undefined);
  const cropName =
    (typeof payload.title === "string" && payload.title.trim().length > 0 ? payload.title.trim() : undefined) ??
    (typeof data.cropName === "string" && data.cropName.trim().length > 0 ? data.cropName.trim() : undefined) ??
    (typeof data.cropType === "string" && data.cropType.trim().length > 0 ? data.cropType.trim() : undefined);
  const actualYield = Number(data.actualYield ?? data.quantityHarvested ?? data.predictedYield);
  const productionStatus = toCropProductionStatus(data.productionStatus ?? data.status ?? data.stage);
  const notes =
    (typeof payload.subtitle === "string" && payload.subtitle.trim().length > 0 ? payload.subtitle.trim() : undefined) ??
    (typeof data.notes === "string" && data.notes.trim().length > 0 ? data.notes.trim() : undefined);

  return {
    farmId: farmSeed ? toMongoLikeId(farmSeed, farmSeed) : undefined,
    cropName,
    productionStatus,
    actualYield: Number.isFinite(actualYield) ? actualYield : undefined,
    notes,
  };
}

function mapPestIncidentStatusFilter(status: string | undefined): string | undefined {
  if (!status) return undefined;
  const normalized = status.toLowerCase();
  if (normalized === "created") return "pending";
  if (normalized === "assigned") return "expert_reviewed";
  if (normalized === "resolved" || normalized === "closed") return "resolved";
  return undefined;
}

function toGrowthStageStatus(value: unknown): string {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();

  if (normalized === "seed" || normalized === "vegetative" || normalized === "flowering" || normalized === "maturity" || normalized === "harvested") {
    return normalized;
  }
  if (normalized === "planned") return "seed";
  if (normalized === "in_progress" || normalized === "active") return "vegetative";
  if (normalized === "sold" || normalized === "stored" || normalized === "failed") return "maturity";
  if (normalized === "completed") return "harvested";
  return "vegetative";
}

function normalizeWeatherRuleCondition(value: unknown): Record<string, unknown> {
  const asObject = asRecord(value);
  if (asObject) return asObject;

  const expression = typeof value === "string" ? value.trim() : "";
  return {
    expression: expression.length > 0 ? expression : "rainfall > 0",
  };
}

const ENTITY_API_CONFIG: Partial<Record<EntityKey, EntityApiConfig>> = {
  farmers: {
    listPath: "/api/v1/farmers/profiles",
    getPath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    createPath: "/api/v1/farmers/profiles",
    updatePath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
      region: undefined,
      status: undefined,
      sortBy: undefined,
      sortDirection: undefined,
      verified:
        params.filters?.status?.[0] === "verified"
          ? true
          : params.filters?.status?.[0] === "draft" ||
              params.filters?.status?.[0] === "submitted" ||
              params.filters?.status?.[0] === "rejected"
            ? false
            : undefined,
    }),
    mapCreateBody: (payload) => {
      const location = asRecord(payload.data.location);
      const coordinates = asRecord(location?.coordinates);
      const lat = Number(coordinates?.lat ?? payload.data.lat ?? payload.data.latitude);
      const lng = Number(coordinates?.lng ?? payload.data.lng ?? payload.data.longitude);
      const region = String(location?.region ?? payload.data.region ?? "Central");
      const district = String(location?.district ?? payload.data.district ?? region);

      return {
        businessName: payload.title,
        description: payload.subtitle,
        location: {
          region,
          district,
          village: String(location?.village ?? payload.data.village ?? ""),
          coordinates:
            Number.isFinite(lat) && Number.isFinite(lng)
              ? {
                  lat,
                  lng,
                }
              : undefined,
        },
        farmSize: Number(payload.data.farmSize ?? payload.data.farmSizeAcres ?? 1),
        cropTypes: toStringArray(payload.data.cropTypes),
      };
    },
    mapUpdateBody: (_id, payload) => {
      const data = payload.data ?? {};
      const location = asRecord(data.location);
      const coordinates = asRecord(location?.coordinates);
      const lat = Number(coordinates?.lat ?? data.lat ?? data.latitude);
      const lng = Number(coordinates?.lng ?? data.lng ?? data.longitude);
      const region = String(location?.region ?? data.region ?? "Central");
      const district = String(location?.district ?? data.district ?? region);

      return {
        businessName: payload.title,
        description: payload.subtitle,
        location: {
          region,
          district,
          village: String(location?.village ?? data.village ?? ""),
          coordinates:
            Number.isFinite(lat) && Number.isFinite(lng)
              ? {
                  lat,
                  lng,
                }
              : undefined,
        },
        farmSize: Number(data.farmSize ?? data.farmSizeAcres ?? 1),
        cropTypes: toStringArray(data.cropTypes),
      };
    },
    statusRequest: (id, status, note) => {
      if (status === "verified" || status === "rejected") {
        return {
          path: `/api/v1/farmers/profiles/${encodeURIComponent(id)}/verify`,
          method: "POST",
          body: {
            status,
            reason: note,
          },
        };
      }
      return null;
    },
    actionRequest: (actionId, _actorId, targetId) => {
      if (actionId === "submit-verification" && targetId) {
        return {
          path: `/api/v1/farmers/profiles/${encodeURIComponent(targetId)}/verify/submit`,
          method: "POST",
          body: {},
          message: "Profile submitted for verification.",
        };
      }
      return null;
    },
  },
  farms: {
    listPath: "/api/v1/farmers/{farmerId}/farms",
    createPath: "/api/v1/farmers/{farmerId}/farms",
    updatePath: (id) => `/api/v1/farmers/farms/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
    }),
    mapCreateBody: (payload) => ({
      name: payload.title,
      location: {
        region: String(payload.data.region ?? payload.data.location ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
        village: String(payload.data.village ?? ""),
      },
      sizeInHectares: Number(payload.data.sizeInHectares ?? payload.data.areaAcres ?? 1),
      farmType: String(payload.data.farmType ?? "mixed"),
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      sizeInHectares: Number(payload.data?.sizeInHectares ?? payload.data?.areaAcres ?? 1),
      farmType: typeof payload.data?.farmType === "string" ? payload.data.farmType : undefined,
    }),
  },
  plots: {
    listPath: "/api/v1/farmers/{farmerId}/farms",
    createPath: "/api/v1/farmers/{farmerId}/farms",
    updatePath: (id) => `/api/v1/farmers/farms/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
    }),
    mapCreateBody: (payload) => ({
      name: payload.title,
      location: {
        region: String(payload.data.region ?? payload.data.location ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
        village: String(payload.data.village ?? ""),
      },
      sizeInHectares: Number(payload.data.areaAcres ?? payload.data.sizeInHectares ?? 0.5),
      farmType: "plot",
      notes: payload.subtitle,
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      sizeInHectares: Number(payload.data?.areaAcres ?? payload.data?.sizeInHectares ?? 0.5),
      notes: payload.subtitle,
    }),
  },
  crops: {
    listPath: "/api/v1/farmers/{farmerId}/production/crops",
    getPath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    createPath: "/api/v1/farmers/{farmerId}/production/crops",
    updatePath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    listQuery: (params) => mapCropProductionListQuery(params),
    mapCreateBody: (payload) => mapCropProductionCreateBody(payload),
    mapUpdateBody: (_id, payload) => mapCropProductionUpdateBody(payload),
  },
  inputs: {
    listPath: "/api/v1/farmers/{farmerId}/production",
    listQuery: (params) => ({
      type: "crop",
      page: params.pagination.page,
      limit: params.pagination.pageSize,
    }),
  },
  tasks: {
    listPath: "/api/v1/expert-portal/inquiries/my",
    createPath: "/api/v1/expert-portal/inquiries",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      title: payload.title,
      description: String(payload.subtitle ?? payload.data.notes ?? payload.title),
      category: String(payload.data.category ?? "general"),
      urgency: String(payload.data.urgency ?? "normal"),
      cropType: typeof payload.data.cropType === "string" ? payload.data.cropType : undefined,
      farmId: typeof payload.data.farmId === "string" ? payload.data.farmId : undefined,
    }),
    statusRequest: (id, status, note) => {
      if (status === "doing") {
        return {
          path: `/api/v1/expert-portal/inquiries/${encodeURIComponent(id)}/followup`,
          method: "POST",
          body: {
            message: note ?? "Task marked as in progress from workspace UI.",
          },
        };
      }
      if (status === "done") {
        const response = note ?? "Issue handled and closed from task workflow in ClyCites UI.";
        return {
          path: `/api/v1/expert-portal/inquiries/${encodeURIComponent(id)}/respond`,
          method: "POST",
          body: {
            response,
          },
        };
      }
      return null;
    },
  },
  cropCycles: {
    listPath: "/api/v1/farmers/{farmerId}/production/crops",
    getPath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    createPath: "/api/v1/farmers/{farmerId}/production/crops",
    updatePath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/farmers/production/crops/${encodeURIComponent(id)}`,
    listQuery: (params) => mapCropProductionListQuery(params),
    mapCreateBody: (payload) => mapCropProductionCreateBody(payload),
    mapUpdateBody: (_id, payload) => mapCropProductionUpdateBody(payload),
  },
  growthStages: {
    listPath: "/api/v1/farmers/{farmerId}/production/crops",
    listQuery: (params) => mapCropProductionListQuery(params),
    mapListRows: (payload) =>
      extractCollection(payload).map((item, index) => {
        const row = asRecord(item) ?? {};
        const stage = toGrowthStageStatus(row.stage ?? row.growthStage ?? row.currentStage ?? row.productionStatus ?? row.status);
        const id = String(row.id ?? row._id ?? `growth-stage-${index + 1}`);
        const cropName =
          (typeof row.cropName === "string" && row.cropName.trim().length > 0 ? row.cropName.trim() : undefined) ??
          (typeof row.name === "string" && row.name.trim().length > 0 ? row.name.trim() : undefined) ??
          `Growth stage ${index + 1}`;
        const season =
          typeof row.season === "string" && row.season.trim().length > 0 ? String(row.season).trim() : undefined;
        const year = parseYear(row.year);
        const subtitle =
          season && year
            ? `${season} ${year}`
            : season
              ? season
              : year
                ? String(year)
                : undefined;

        return {
          ...row,
          id,
          status: stage,
          stage,
          cycleId: String(row.cycleId ?? row.cropId ?? row.id ?? row._id ?? id),
          observedAt: row.updatedAt ?? row.createdAt ?? new Date().toISOString(),
          title: `${cropName} - ${stage}`,
          subtitle,
        };
      }),
  },
  sensorReadings: {
    listPath: "/api/v1/weather/profiles/{weatherProfileId}/conditions/history",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      from: params.filters?.dateRange?.from,
      to: params.filters?.dateRange?.to,
    }),
  },
  pestIncidents: {
    listPath: "/api/v1/pest-disease/farmers/{farmerId}/reports",
    getPath: (id) => `/api/v1/pest-disease/reports/${encodeURIComponent(id)}`,
    createPath: "/api/v1/pest-disease/detect",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      status: mapPestIncidentStatusFilter(params.filters?.status?.[0]),
      cropType: params.filters?.tags?.[0],
    }),
    mapCreateBody: (payload) => ({
      cropType: String(payload.data.cropType ?? payload.data.cropId ?? payload.title),
      imageUrl: typeof payload.data.photoUrl === "string" ? payload.data.photoUrl : undefined,
      notes: payload.subtitle ?? String(payload.data.notes ?? payload.title),
      severity: String(payload.data.severity ?? "medium"),
      location: String(payload.data.location ?? "field"),
    }),
    statusRequest: (id, status, note) => {
      if (status === "resolved" || status === "closed") {
        return {
          path: `/api/v1/pest-disease/reports/${encodeURIComponent(id)}/review`,
          method: "POST",
          body: {
            diagnosis: note ?? "Resolved from workspace workflow",
            confidence: 0.8,
            recommendations: [note ?? "Apply recommended treatment"],
            notes: note,
          },
        };
      }
      return null;
    },
  },
  yieldPredictions: {
    listPath: "/api/v1/farmers/{farmerId}/production/crops",
    listQuery: (params) => mapCropProductionListQuery(params),
    mapListRows: (payload) =>
      extractCollection(payload).map((item, index) => {
        const row = asRecord(item) ?? {};
        const id = String(row.id ?? row._id ?? `yield-prediction-${index + 1}`);
        const cropName =
          (typeof row.cropName === "string" && row.cropName.trim().length > 0 ? row.cropName.trim() : undefined) ??
          (typeof row.name === "string" && row.name.trim().length > 0 ? row.name.trim() : undefined) ??
          `Prediction ${index + 1}`;
        const predictedYield = Number(row.predictedYield ?? row.estimatedYield ?? row.actualYield ?? row.quantityHarvested ?? 0);
        const confidence = Number(row.confidence ?? row.modelConfidence ?? 0.7);
        const horizonDays = Number(row.horizonDays ?? 30);

        return {
          ...row,
          id,
          status: "generated",
          title: `${cropName} yield outlook`,
          cropId: String(row.cropId ?? row.id ?? row._id ?? id),
          predictedYield: Number.isFinite(predictedYield) ? predictedYield : 0,
          confidence: Number.isFinite(confidence) ? confidence : 0.7,
          horizonDays: Number.isFinite(horizonDays) ? horizonDays : 30,
        };
      }),
    createPath: "/api/v1/prices/predict",
    mapCreateBody: (payload) => ({
      productId: toMongoLikeId(payload.data.cropId ?? payload.data.productId ?? payload.title, payload.title),
      marketId:
        typeof payload.data.marketId === "string" && payload.data.marketId.length > 0
          ? toMongoLikeId(payload.data.marketId, payload.data.marketId)
          : undefined,
      daysAhead: Number(payload.data.horizonDays ?? 30),
    }),
    actionRequest: (actionId, _actorId, targetId) => {
      if (actionId !== "refresh-prediction") return null;
      const seed = targetId ?? "default-product";
      return {
        path: "/api/v1/prices/predict",
        method: "POST",
        body: {
          productId: toMongoLikeId(seed, seed),
          daysAhead: 30,
        },
        message: "Prediction refresh requested.",
      };
    },
  },
  listings: {
    listPath: "/api/v1/listings",
    getPath: (id) => `/api/v1/listings/${encodeURIComponent(id)}`,
    createPath: "/api/v1/listings",
    updatePath: (id) => `/api/v1/listings/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/listings/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      product: params.filters?.text,
      status: params.filters?.status?.[0],
      sortBy: params.sort?.field,
    }),
    mapCreateBody: (payload) => ({
      product: toMongoLikeId(payload.data.commodity ?? payload.title, payload.title),
      quantity: Number(payload.data.quantity ?? 1),
      price: Number(payload.data.price ?? 0),
      currency: String(payload.data.currency ?? "UGX"),
      location: {
        region: String(payload.data.region ?? payload.data.market ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
      },
    }),
    mapUpdateBody: (_id, payload) => ({
      product: toMongoLikeId(payload.data?.commodity ?? payload.title ?? "listing", payload.title ?? "listing"),
      quantity: Number(payload.data?.quantity ?? 1),
      price: Number(payload.data?.price ?? 0),
      currency: String(payload.data?.currency ?? "UGX"),
      location: {
        region: String(payload.data?.region ?? payload.data?.market ?? "Central"),
        district: String(payload.data?.district ?? "Unknown"),
      },
      status: payload.data?.status,
    }),
    actionRequest: (actionId, _actorId, targetId) => {
      if (actionId !== "fetch-linked-media" || !targetId) return null;
      return {
        path: `/api/v1/media/linked/Listing/${encodeURIComponent(targetId)}`,
        method: "GET",
        messageFromResponse: (payload) => {
          const count = extractNumericCount(payload);
          return typeof count === "number"
            ? `Loaded ${count} linked media items.`
            : "Loaded linked media metadata.";
        },
      };
    },
  },
  rfqs: {
    listPath: "/api/v1/offers",
    getPath: (id) => `/api/v1/offers/${encodeURIComponent(id)}`,
    createPath: "/api/v1/offers",
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
      listingId: params.filters?.text,
      direction: "received",
    }),
    mapCreateBody: (payload) => ({
      listingId: String(payload.data.listingId ?? toMongoLikeId(payload.title, payload.title)),
      offerPrice: Number(payload.data.targetPrice ?? payload.data.price ?? 0),
      quantity: Number(payload.data.quantity ?? 1),
      message: payload.subtitle,
      expiresInHours: Number(payload.data.expiresInHours ?? 48),
      deliveryOption: typeof payload.data.deliveryOption === "string" ? payload.data.deliveryOption : undefined,
      deliveryAddress: typeof payload.data.deliveryAddress === "string" ? payload.data.deliveryAddress : undefined,
    }),
    statusRequest: (id, status, note) => {
      if (status === "shortlisted") {
        return {
          path: `/api/v1/offers/${encodeURIComponent(id)}/accept`,
          method: "POST",
          body: {
            message: note,
          },
        };
      }
      if (status === "closed") {
        return {
          path: `/api/v1/offers/${encodeURIComponent(id)}/withdraw`,
          method: "POST",
          body: {
            reason: note ?? "Closed from workspace workflow",
          },
        };
      }
      return null;
    },
  },
  negotiations: {
    listPath: "/api/v1/messaging/conversations",
    getPath: (id) => `/api/v1/messaging/conversations/${encodeURIComponent(id)}`,
    createPath: "/api/v1/messaging/conversations",
    listQuery: (params) => ({
      archived: params.filters?.status?.includes("closed") ? true : undefined,
      type: params.filters?.tags?.[0],
    }),
    mapCreateBody: (payload) => {
      const participants = [...new Set([
        payload.actorId,
        ...toStringArray(payload.data.participants),
        ...(typeof payload.data.counterpartyId === "string" ? [payload.data.counterpartyId] : []),
        ...(typeof payload.data.buyerId === "string" ? [payload.data.buyerId] : []),
        ...(typeof payload.data.sellerId === "string" ? [payload.data.sellerId] : []),
      ])].filter((value) => typeof value === "string" && value.trim().length > 0);

      return {
        participants,
        type: String(payload.data.type ?? "offer"),
        title: payload.title,
        orderId: typeof payload.data.orderId === "string" ? payload.data.orderId : undefined,
      };
    },
    statusRequest: (id, status) => {
      if (status === "closed") {
        return {
          path: `/api/v1/messaging/conversations/${encodeURIComponent(id)}/archive`,
          method: "PATCH",
        };
      }
      return null;
    },
    actionRequest: (actionId, _actorId, targetId) => {
      if (actionId !== "send-message" || !targetId) return null;
      return {
        path: `/api/v1/messaging/conversations/${encodeURIComponent(targetId)}/messages`,
        method: "POST",
        body: {
          content: "Message sent from ClyCites negotiation action.",
          contentType: "text",
        },
        message: "Negotiation message sent.",
      };
    },
  },
  reviews: {
    listPath: "/api/v1/reputation/users/{userId}/ratings",
    createPath: "/api/v1/reputation/ratings",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
    }),
    mapCreateBody: (payload) => ({
      orderId: String(payload.data.orderId ?? toMongoLikeId(payload.title, payload.title)),
      ratedUserId: String(payload.data.ratedUserId ?? payload.data.sellerId ?? payload.data.buyerId ?? payload.actorId),
      score: Math.max(1, Math.min(5, Number(payload.data.rating ?? 5))),
      category: String(payload.data.category ?? "transaction"),
      comment: String(payload.data.reviewText ?? payload.subtitle ?? ""),
      aspects: asRecord(payload.data.aspects) ?? undefined,
    }),
  },
  orders: {
    listPath: "/api/v1/orders/my-orders",
    getPath: (id) => `/api/v1/orders/${encodeURIComponent(id)}`,
    createPath: "/api/v1/orders",
    mapCreateBody: (payload) => ({
      listingId: toMongoLikeId(payload.data.listingId ?? payload.title, payload.title),
      quantity: Number(payload.data.quantity ?? 1),
      deliveryAddress: {
        region: String(payload.data.region ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
        address: String(payload.data.address ?? payload.subtitle ?? "Delivery address"),
      },
      notes: String(payload.data.notes ?? payload.subtitle ?? ""),
    }),
    statusRequest: (id, status, note) => ({
      path: `/api/v1/orders/${encodeURIComponent(id)}/status`,
      method: "PATCH",
      body: {
        status: mapOrderStatus(status),
        reason: note,
      },
    }),
  },
  contracts: {
    listPath: "/api/v1/disputes",
    getPath: (id) => `/api/v1/disputes/${encodeURIComponent(id)}`,
    createPath: "/api/v1/disputes",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      orderId: String(payload.data.orderId ?? toMongoLikeId(payload.title, payload.title)),
      type: String(payload.data.type ?? payload.data.category ?? "other"),
      description: String(payload.data.description ?? payload.subtitle ?? payload.title),
      evidence: toStringArray(payload.data.evidence),
    }),
    actionRequest: (actionId, _actorId, targetId) => {
      if (!targetId) return null;
      if (actionId === "open-dispute") {
        return {
          path: "/api/v1/disputes",
          method: "POST",
          body: {
            orderId: targetId,
            type: "other",
            description: "Dispute opened from ClyCites contract workflow.",
          },
          message: "Dispute case created successfully.",
        };
      }
      if (actionId === "resolve-dispute") {
        return {
          path: `/api/v1/disputes/${encodeURIComponent(targetId)}/resolve`,
          method: "POST",
          body: {
            resolution: "Resolved from contract workflow.",
            outcome: "no_action",
          },
          message: "Dispute resolved.",
        };
      }
      if (actionId === "close-dispute") {
        return {
          path: `/api/v1/disputes/${encodeURIComponent(targetId)}/close`,
          method: "POST",
          body: {
            note: "Closed from contract workflow.",
          },
          message: "Dispute closed.",
        };
      }
      return null;
    },
  },
  shipments: {
    listPath: "/api/v1/logistics/shipments",
    getPath: (id) => `/api/v1/logistics/shipments/${encodeURIComponent(id)}`,
    createPath: "/api/v1/logistics/shipments",
    mapCreateBody: (payload) => ({
      organizationId: payload.data.organizationId,
      orderId: payload.data.orderId,
      from: String(payload.data.from ?? payload.data.origin ?? "Warehouse"),
      to: String(payload.data.to ?? payload.data.destination ?? "Destination"),
    }),
    statusRequest: (id, status, note) => ({
      path: `/api/v1/logistics/shipments/${encodeURIComponent(id)}/status`,
      method: "PATCH",
      body: {
        status: mapShipmentStatus(status),
        note,
      },
    }),
  },
  warehouses: {
    listPath: "/api/v1/logistics/collection-points",
    getPath: (id) => `/api/v1/logistics/collection-points/${encodeURIComponent(id)}`,
    createPath: "/api/v1/logistics/collection-points",
    updatePath: (id) => `/api/v1/logistics/collection-points/${encodeURIComponent(id)}`,
    updateMethod: "PATCH",
    deletePath: (id) => `/api/v1/logistics/collection-points/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
    }),
    mapCreateBody: (payload) => ({
      name: payload.title,
      type: String(payload.data.type ?? "warehouse"),
      organizationId: payload.data.organizationId,
      address: {
        region: String(payload.data.region ?? payload.data.location ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
        village: String(payload.data.village ?? ""),
      },
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      type: typeof payload.data?.type === "string" ? payload.data.type : undefined,
      address: {
        region: String(payload.data?.region ?? payload.data?.location ?? "Central"),
        district: String(payload.data?.district ?? "Unknown"),
        village: String(payload.data?.village ?? ""),
      },
    }),
  },
  stockMovements: {
    listPath: "/api/v1/logistics/shipments",
    createPath: "/api/v1/logistics/shipments",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      organizationId: payload.data.organizationId,
      orderId: payload.data.orderId,
      from: {
        location: String(payload.data.sourceId ?? payload.data.source ?? "warehouse"),
      },
      to: {
        location: String(payload.data.destinationId ?? payload.data.destination ?? "dispatch"),
      },
    }),
    statusRequest: (id, status, note) => ({
      path: `/api/v1/logistics/shipments/${encodeURIComponent(id)}/status`,
      method: "PATCH",
      body: {
        status: mapShipmentStatus(status),
        note,
      },
    }),
  },
  spoilageReports: {
    listPath: "/api/v1/pest-disease/outbreaks",
    listMode: "collection",
    listQuery: () => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
    }),
  },
  wallets: {
    listPath: "/api/v1/payments/wallet",
    listMode: "single",
    getPath: () => "/api/v1/payments/wallet",
  },
  transactions: {
    listPath: "/api/v1/payments/transactions",
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
      type: params.filters?.tags?.[0],
      startDate: params.filters?.dateRange?.from,
      endDate: params.filters?.dateRange?.to,
    }),
  },
  payouts: {
    listPath: "/api/v1/payments/transactions",
    createPath: "/api/v1/payments/wallet/withdraw",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      type: "debit",
      status: params.filters?.status?.[0],
      startDate: params.filters?.dateRange?.from,
      endDate: params.filters?.dateRange?.to,
    }),
    mapCreateBody: (payload) => ({
      amount: Number(payload.data.amount ?? 0),
      withdrawalMethod: String(payload.data.method ?? "bank_transfer"),
      accountDetails:
        asRecord(payload.data.accountDetails) ??
        ({
          accountNumber: String(payload.data.accountNumber ?? ""),
          phoneNumber: String(payload.data.phoneNumber ?? ""),
          accountName: String(payload.data.accountName ?? payload.title),
        } as const),
    }),
  },
  escrowAccounts: {
    listPath: "/api/v1/payments/escrow",
    getPath: (id) => `/api/v1/payments/escrow/${encodeURIComponent(id)}`,
    createPath: "/api/v1/payments/escrow/initiate",
    mapCreateBody: (payload) => ({
      orderId: toMongoLikeId(payload.data.orderId ?? payload.title, payload.title),
      amount: Number(payload.data.amount ?? 0),
    }),
    statusRequest: (id, status, note) => {
      if (status === "released") {
        return {
          path: `/api/v1/payments/escrow/${encodeURIComponent(id)}/release`,
          method: "POST",
          body: {
            releaseReason: note ?? "Released from workspace workflow",
          },
        };
      }
      if (status === "refunded") {
        return {
          path: `/api/v1/payments/escrow/${encodeURIComponent(id)}/refund`,
          method: "POST",
          body: {
            refundReason: note ?? "Refunded from workspace workflow",
          },
        };
      }
      return null;
    },
  },
  stations: {
    listPath: "/api/v1/weather/profiles/me",
    getPath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    createPath: "/api/v1/weather/profiles",
    updatePath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: undefined,
    }),
    mapCreateBody: (payload) => ({
      farmId: toMongoLikeId(payload.data.farmId ?? payload.title, payload.title),
      name: payload.title,
      location: {
        region: String(payload.data.region ?? payload.data.location ?? "Central"),
        district: String(payload.data.district ?? "Unknown"),
        village: String(payload.data.village ?? ""),
        lat: typeof payload.data.lat === "number" ? payload.data.lat : undefined,
        lng: typeof payload.data.lng === "number" ? payload.data.lng : undefined,
      },
      timezone: String(payload.data.timezone ?? "Africa/Kampala"),
      cropTypes: toStringArray(payload.data.cropTypes),
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      cropTypes: toStringArray(payload.data?.cropTypes),
      timezone: typeof payload.data?.timezone === "string" ? payload.data.timezone : undefined,
    }),
    actionRequest: (actionId, _actorId, targetId) => {
      if (actionId === "refresh-weather-admin") {
        return {
          path: "/api/v1/weather/admin/refresh",
          method: "POST",
          message: "Triggered weather refresh for all profiles.",
        };
      }
      if (actionId === "check-weather-providers") {
        return {
          path: "/api/v1/weather/admin/providers",
          method: "GET",
          messageFromResponse: (payload) => {
            const count = extractNumericCount(payload);
            return typeof count === "number"
              ? `Provider health loaded (${count} providers).`
              : "Provider health loaded.";
          },
        };
      }
      if (actionId === "retry-weather-deliveries") {
        return {
          path: "/api/v1/weather/admin/retry-deliveries",
          method: "POST",
          message: "Triggered retry for failed weather deliveries.",
        };
      }
      if (actionId === "expire-weather-alerts") {
        return {
          path: "/api/v1/weather/admin/expire-alerts",
          method: "POST",
          message: "Triggered weather alert expiration task.",
        };
      }
      if (actionId === "prune-weather-snapshots") {
        return {
          path: "/api/v1/weather/admin/prune-snapshots",
          method: "POST",
          message: "Triggered weather snapshot pruning.",
        };
      }
      if (actionId === "refresh-profile-weather" && targetId) {
        return {
          path: `/api/v1/weather/admin/profiles/${encodeURIComponent(targetId)}/refresh`,
          method: "POST",
          message: "Triggered weather refresh for selected profile.",
        };
      }
      return null;
    },
  },
  forecasts: {
    listPath: "/api/v1/weather/profiles/{weatherProfileId}/forecast",
    listMode: "single",
    getPath: () => "/api/v1/weather/profiles/{weatherProfileId}/forecast",
    listQuery: (params) => {
      const parsedHorizon = Number(params.filters?.text);
      return {
        page: undefined,
        limit: undefined,
        search: undefined,
        status: undefined,
        horizon: Number.isFinite(parsedHorizon) && parsedHorizon > 0 ? parsedHorizon : 7,
      };
    },
    actionRequest: (actionId) => {
      if (actionId !== "refresh-forecast") return null;
      return {
        path: "/api/v1/weather/admin/refresh",
        method: "POST",
        message: "Forecast refresh triggered.",
      };
    },
  },
  weatherAlerts: {
    listPath: "/api/v1/weather/org/{orgId}/alerts",
    getPath: (id) => `/api/v1/weather/alerts/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
      severity: params.filters?.tags?.[0],
    }),
    statusRequest: (id, status) => {
      if (status === "acknowledged") {
        return {
          path: `/api/v1/weather/alerts/${encodeURIComponent(id)}/acknowledge`,
          method: "POST",
        };
      }
      if (status === "escalated") {
        return {
          path: `/api/v1/weather/alerts/${encodeURIComponent(id)}/escalate`,
          method: "POST",
          body: {
            reason: "Escalated from workspace workflow",
            severity: "high",
          },
        };
      }
      if (status === "resolved" || status === "closed") {
        return {
          path: `/api/v1/weather/alerts/${encodeURIComponent(id)}/dismiss`,
          method: "POST",
        };
      }
      return null;
    },
  },
  alertRules: {
    listPath: "/api/v1/weather/rules",
    getPath: (id) => `/api/v1/weather/rules/${encodeURIComponent(id)}`,
    createPath: "/api/v1/weather/rules",
    updatePath: (id) => `/api/v1/weather/rules/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/weather/rules/${encodeURIComponent(id)}`,
    mapCreateBody: (payload) => ({
      name: payload.title,
      condition: normalizeWeatherRuleCondition(payload.data.condition ?? payload.title),
      severity: String(payload.data.severity ?? "medium"),
      message: payload.subtitle ?? String(payload.data.action ?? "Rule triggered"),
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      condition: normalizeWeatherRuleCondition(payload.data?.condition ?? payload.title ?? "condition"),
      severity: String(payload.data?.severity ?? "medium"),
      message: payload.subtitle ?? String(payload.data?.action ?? "Rule updated"),
      active: payload.data?.enabled,
    }),
    statusRequest: (id, status) => ({
      path: `/api/v1/weather/rules/${encodeURIComponent(id)}`,
      method: "PATCH",
      body: {
        active: status === "active",
      },
    }),
  },
  advisories: {
    listPath: "/api/v1/expert-portal/advisories",
    getPath: (id) => `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}`,
    createPath: "/api/v1/expert-portal/advisories",
    updatePath: (id) => `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      category: params.filters?.text,
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      title: payload.title,
      content: String(payload.data.notes ?? payload.subtitle ?? payload.title),
      category: normalizeAdvisoryCategory(payload.data.targetGroup ?? payload.data.category),
      targetRegions: toStringArray(payload.data.region).length > 0 ? toStringArray(payload.data.region) : ["all"],
      targetCrops: toStringArray(payload.data.cropTypes),
      urgency: advisoryCreateUrgency(payload.data.urgency ?? payload.status),
    }),
    mapUpdateBody: (_id, payload) => {
      const body: Record<string, unknown> = {
        title: payload.title,
        message: String(payload.data?.notes ?? payload.subtitle ?? payload.title ?? "Updated advisory"),
        targetRegions: toStringArray(payload.data?.region).length > 0 ? toStringArray(payload.data?.region) : undefined,
        targetCrops: toStringArray(payload.data?.cropTypes),
      };
      if (payload.data?.urgency !== undefined) {
        body.urgency = advisoryUpdateUrgency(payload.data.urgency);
      }
      if (typeof payload.data?.scheduledAt === "string") {
        body.scheduledAt = payload.data.scheduledAt;
      }
      if (typeof payload.data?.expiresAt === "string") {
        body.expiresAt = payload.data.expiresAt;
      }
      return body;
    },
    statusRequest: (id, status, note) => {
      if (status === "acknowledged") {
        return {
          path: `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}/acknowledge`,
          method: "POST",
        };
      }
      if (status === "in_review") {
        return {
          path: `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}/submit`,
          method: "POST",
        };
      }
      if (status === "approved" || status === "rejected") {
        return {
          path: `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}/review`,
          method: "POST",
          body: {
            decision: status,
            reason: note,
          },
        };
      }
      if (status === "published") {
        return {
          path: `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}/send`,
          method: "POST",
        };
      }
      return null;
    },
  },
  knowledgeBaseArticles: {
    listPath: "/api/v1/expert-portal/knowledge",
    getPath: (id) => `/api/v1/expert-portal/knowledge/${encodeURIComponent(id)}`,
    createPath: "/api/v1/expert-portal/knowledge",
    updatePath: (id) => `/api/v1/expert-portal/knowledge/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      search: params.filters?.text,
      status: params.filters?.status?.[0],
      category: params.filters?.tags?.[0],
    }),
    mapCreateBody: (payload) => ({
      title: payload.title,
      content: String(payload.data.body ?? payload.subtitle ?? payload.title),
      summary: payload.subtitle,
      category: String(payload.data.category ?? "general"),
      tags: toStringArray(payload.data.tags).length > 0 ? toStringArray(payload.data.tags) : payload.tags ?? [],
      cropTypes: toStringArray(payload.data.cropTypes),
    }),
    mapUpdateBody: (_id, payload) => ({
      title: payload.title,
      content: String(payload.data?.body ?? payload.subtitle ?? payload.title ?? "Updated article"),
      ...(typeof payload.data?.status === "string" ? { status: payload.data.status } : {}),
    }),
    statusRequest: (id, status, note) => {
      if (status === "published") {
        return {
          path: `/api/v1/expert-portal/knowledge/${encodeURIComponent(id)}/publish`,
          method: "POST",
        };
      }
      if (status === "in_review") {
        return {
          path: `/api/v1/expert-portal/knowledge/${encodeURIComponent(id)}/submit`,
          method: "POST",
        };
      }
      if (status === "approved" || status === "rejected") {
        return {
          path: `/api/v1/expert-portal/knowledge/${encodeURIComponent(id)}/review`,
          method: "POST",
          body: {
            decision: status,
            feedback: note,
          },
        };
      }
      return null;
    },
  },
  fieldCases: {
    listPath: "/api/v1/expert-portal/cases",
    createPath: "/api/v1/expert-portal/inquiries",
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      title: payload.title,
      description: String(payload.data.notes ?? payload.subtitle ?? payload.title),
      category: String(payload.data.category ?? "general"),
      urgency: String(payload.data.urgency ?? "medium"),
      cropType: typeof payload.data.cropType === "string" ? payload.data.cropType : undefined,
      farmId:
        typeof payload.data.farmerId === "string" && payload.data.farmerId.length > 0
          ? payload.data.farmerId
          : undefined,
    }),
    statusRequest: (id, status, note) => {
      if (status === "assigned") {
        return {
          path: `/api/v1/expert-portal/cases/${encodeURIComponent(id)}/assign`,
          method: "POST",
          body: {
            expertId: typeof note === "string" && note.trim().length > 0 ? note.trim() : "auto_expert",
          },
        };
      }
      if (status === "in_visit") {
        return {
          path: `/api/v1/expert-portal/cases/${encodeURIComponent(id)}/start`,
          method: "POST",
        };
      }
      if (status === "resolved" || status === "closed") {
        const summary = typeof note === "string" && note.trim().length > 0 ? note.trim() : "Case resolved";
        return {
          path: `/api/v1/expert-portal/cases/${encodeURIComponent(id)}/submit`,
          method: "POST",
          body: {
            diagnosis: summary,
            recommendations: [summary],
            notes: summary,
            confidence: 0.75,
          },
        };
      }
      return null;
    },
  },
  assignments: {
    listPath: "/api/v1/expert-portal/cases/my",
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
    }),
  },
  reviewQueue: {
    listPath: "/api/v1/expert-portal/cases",
    listQuery: (params) => ({
      status: params.filters?.status?.[0] ?? "pending",
    }),
  },
  commodities: {
    listPath: "/api/v1/products",
    getPath: (id) => `/api/v1/products/${encodeURIComponent(id)}`,
    createPath: "/api/v1/products",
    updatePath: (id) => `/api/v1/products/${encodeURIComponent(id)}`,
    updateMethod: "PUT",
    deletePath: (id) => `/api/v1/products/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      q: params.filters?.text,
      category: params.filters?.tags?.[0],
    }),
    mapCreateBody: (payload) => ({
      name: payload.title,
      category: String(payload.data.category ?? payload.tags?.[0] ?? "general"),
      unit: String(payload.data.unit ?? "kg"),
      description: payload.subtitle,
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title ?? "Updated product",
      category: String(payload.data?.category ?? payload.tags?.[0] ?? "general"),
      unit: String(payload.data?.unit ?? "kg"),
      description: payload.subtitle,
    }),
    actionRequest: (actionId, _actorId, targetId) => {
      if (!targetId) return null;
      if (actionId === "fetch-market-insights") {
        return {
          path: `/api/v1/market-intelligence/insights?productId=${encodeURIComponent(targetId)}&period=30d`,
          method: "GET",
          messageFromResponse: (payload) => {
            const count = extractNumericCount(payload);
            return typeof count === "number"
              ? `Market insights loaded (${count} records).`
              : "Market insights loaded.";
          },
        };
      }
      if (actionId === "fetch-market-trends") {
        return {
          path: `/api/v1/market-intelligence/trends?productId=${encodeURIComponent(targetId)}&period=90d`,
          method: "GET",
          messageFromResponse: (payload) => {
            const count = extractNumericCount(payload);
            return typeof count === "number"
              ? `Market trends loaded (${count} points).`
              : "Market trends loaded.";
          },
        };
      }
      if (actionId === "compare-market-regions") {
        return {
          path: `/api/v1/market-intelligence/compare?productId=${encodeURIComponent(targetId)}&regions=${encodeURIComponent("Central,Western")}`,
          method: "GET",
          message: "Market region comparison loaded.",
        };
      }
      return null;
    },
  },
  priceSignals: {
    listPath: "/api/v1/market-intelligence/alerts",
    createPath: "/api/v1/market-intelligence/alerts",
    updatePath: (id) => `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
    updateMethod: "PATCH",
    deletePath: (id) => `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      active:
        params.filters?.status && params.filters.status.some((status) => status === "closed")
          ? false
          : undefined,
    }),
    mapCreateBody: (payload) => ({
      product: String(payload.data.commodityId ?? payload.data.commodity ?? payload.title),
      region: String(payload.data.region ?? payload.data.market ?? "all"),
      district: typeof payload.data.district === "string" ? payload.data.district : undefined,
      conditions:
        asRecord(payload.data.conditions) ??
        ({
          signal: String(payload.data.signal ?? "price_change"),
          threshold: Number(payload.data.confidence ?? payload.data.threshold ?? 0),
        } as const),
      notificationChannels:
        toStringArray(payload.data.notificationChannels).length > 0
          ? toStringArray(payload.data.notificationChannels)
          : ["in_app"],
    }),
    mapUpdateBody: (_id, payload) => ({
      conditions: asRecord(payload.data?.conditions) ?? undefined,
      notificationChannels:
        toStringArray(payload.data?.notificationChannels).length > 0
          ? toStringArray(payload.data?.notificationChannels)
          : undefined,
      active: typeof payload.data?.active === "boolean" ? payload.data.active : undefined,
    }),
    statusRequest: (id, status) => {
      if (status === "closed") {
        return {
          path: `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
          method: "DELETE",
        };
      }
      if (status === "acknowledged" || status === "investigating") {
        return {
          path: `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
          method: "PATCH",
          body: {
            active: true,
          },
        };
      }
      return null;
    },
  },
  marketPrices: {
    listPath: "/api/v1/prices",
    getPath: (id) => `/api/v1/prices/${encodeURIComponent(id)}`,
    createPath: "/api/v1/prices",
    updatePath: (id) => `/api/v1/prices/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/prices/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      productId: params.filters?.text ? toMongoLikeId(params.filters.text, params.filters.text) : undefined,
    }),
    mapCreateBody: (payload) => ({
      marketId: toMongoLikeId(payload.data.market ?? payload.title, String(payload.data.market ?? payload.title)),
      productId: toMongoLikeId(payload.data.commodityId ?? payload.data.commodity ?? payload.title, payload.title),
      price: Number(payload.data.price ?? 0),
      unit: String(payload.data.unit ?? "kg"),
      currency: String(payload.data.currency ?? "UGX"),
      quantity: Number(payload.data.quantity ?? 1),
      priceType: String(payload.data.priceType ?? "spot"),
      grade: String(payload.data.grade ?? "standard"),
      source: String(payload.data.source ?? "manual"),
      notes: payload.subtitle,
    }),
    mapUpdateBody: (_id, payload) => ({
      marketId: toMongoLikeId(payload.data?.market ?? payload.title ?? "market", String(payload.data?.market ?? "market")),
      productId: toMongoLikeId(payload.data?.commodityId ?? payload.data?.commodity ?? payload.title ?? "product", payload.title ?? "product"),
      price: Number(payload.data?.price ?? 0),
      unit: String(payload.data?.unit ?? "kg"),
      currency: String(payload.data?.currency ?? "UGX"),
      quantity: Number(payload.data?.quantity ?? 1),
      priceType: String(payload.data?.priceType ?? "spot"),
      grade: String(payload.data?.grade ?? "standard"),
      source: String(payload.data?.source ?? "manual"),
      notes: payload.subtitle,
    }),
  },
  marketSignals: {
    listPath: "/api/v1/market-intelligence/alerts",
    createPath: "/api/v1/market-intelligence/alerts",
    updatePath: (id) => `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
    updateMethod: "PATCH",
    deletePath: (id) => `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      active:
        params.filters?.status && params.filters.status.some((status) => status === "dismissed")
          ? false
          : undefined,
    }),
    mapCreateBody: (payload) => ({
      product: String(payload.data.commodityId ?? payload.title),
      region: String(payload.data.region ?? "all"),
      district: typeof payload.data.district === "string" ? payload.data.district : undefined,
      conditions:
        asRecord(payload.data.conditions) ??
        ({
          anomalyScore: Number(payload.data.anomalyScore ?? 0),
        } as const),
      notificationChannels:
        toStringArray(payload.data.notificationChannels).length > 0
          ? toStringArray(payload.data.notificationChannels)
          : ["in_app"],
    }),
    mapUpdateBody: (_id, payload) => ({
      conditions: asRecord(payload.data?.conditions) ?? undefined,
      notificationChannels:
        toStringArray(payload.data?.notificationChannels).length > 0
          ? toStringArray(payload.data?.notificationChannels)
          : undefined,
      active: typeof payload.data?.active === "boolean" ? payload.data.active : undefined,
    }),
    statusRequest: (id, status) => {
      if (status === "dismissed") {
        return {
          path: `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
          method: "DELETE",
        };
      }
      if (status === "investigating" || status === "investigated") {
        return {
          path: `/api/v1/market-intelligence/alerts/${encodeURIComponent(id)}`,
          method: "PATCH",
          body: {
            active: true,
          },
        };
      }
      return null;
    },
  },
  priceEstimations: {
    createPath: "/api/v1/pricing/predict",
    mapCreateBody: (payload) => ({
      productId: String(payload.data.commodityId ?? payload.data.productId ?? payload.title),
      marketId: String(payload.data.marketId ?? toMongoLikeId(payload.data.market ?? payload.title, payload.title)),
      daysAhead: Number(payload.data.horizonDays ?? 7),
      features: asRecord(payload.data.features) ?? {
        assumptions: payload.data.assumptions,
      },
    }),
  },
  pricePredictions: {
    createPath: "/api/v1/prices/predict",
    mapCreateBody: (payload) => ({
      productId: String(payload.data.commodityId ?? payload.data.productId ?? payload.title),
      marketId: typeof payload.data.marketId === "string" ? payload.data.marketId : undefined,
      daysAhead: Number(payload.data.horizonDays ?? 7),
    }),
  },
  recommendations: {
    listPath: "/api/v1/market-intelligence/price-recommendation",
    listMode: "single",
    listQuery: (params) => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
      productId: params.filters?.text,
      region: params.filters?.tags?.[0],
      quality: params.filters?.tags?.[1],
      quantity: undefined,
    }),
  },
  dataSources: {
    listPath: "/api/v1/weather/admin/providers",
    listMode: "collection",
    listQuery: () => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
    }),
  },
  apiTokens: {
    listPath: "/api/v1/auth/tokens",
    getPath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}`,
    createPath: "/api/v1/auth/tokens",
    updatePath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}/revoke`,
    deleteMethod: "POST",
    deleteBody: (id) => ({
      reason: `Revoked from workspace UI (${id})`,
    }),
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
      tokenType: "personal",
    }),
    mapCreateBody: (payload) => ({
      tokenType: "personal",
      name: payload.title,
      description: payload.subtitle,
      scopes: toStringArray(payload.data.scopes).length > 0 ? toStringArray(payload.data.scopes) : ["orders:read"],
      rateLimit: normalizeRateLimit(payload.data.rateLimit),
      expiresAt: payload.data.expiresAt,
      reason: "Created from workspace UI",
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      description: payload.subtitle,
      scopes: toStringArray(payload.data?.scopes),
      rateLimit: normalizeRateLimit(payload.data?.rateLimit),
      expiresAt: payload.data?.expiresAt,
    }),
    statusRequest: (id, status, note) => {
      if (status === "revoked") {
        return {
          path: `/api/v1/auth/tokens/${encodeURIComponent(id)}/revoke`,
          method: "POST",
          body: {
            reason: note ?? "Revoked from workspace workflow",
          },
        };
      }
      return null;
    },
    actionRequest: (actionId, _actorId, targetId) => {
      if (!targetId) return null;
      if (actionId === "rotate-token-secret") {
        return {
          path: `/api/v1/auth/tokens/${encodeURIComponent(targetId)}/rotate`,
          method: "POST",
          body: {
            reason: "Rotated from workspace UI",
          },
          message: "Token secret rotated successfully.",
        };
      }
      if (actionId === "view-token-usage") {
        return {
          path: `/api/v1/auth/tokens/${encodeURIComponent(targetId)}/usage?sinceDays=7`,
          method: "GET",
          messageFromResponse: (payload) => {
            const data = asRecord(unwrapApiData<unknown>(payload)) ?? {};
            const summary = asRecord(data.summary);
            const total = Number(summary?.totalRequests ?? data.totalRequests ?? NaN);
            if (Number.isFinite(total)) {
              return `Token usage loaded (${Math.max(0, Math.trunc(total))} requests in 7 days).`;
            }
            return "Token usage loaded.";
          },
        };
      }
      return null;
    },
  },
  orgs: {
    listPath: "/api/v1/organizations/me",
    getPath: (id) => `/api/v1/organizations/${encodeURIComponent(id)}`,
    createPath: "/api/v1/organizations",
    updatePath: (id) => `/api/v1/organizations/${encodeURIComponent(id)}`,
    mapCreateBody: (payload) => ({
      name: payload.title,
      type: String(payload.data.type ?? "cooperative"),
      description: payload.subtitle,
      country: String(payload.data.country ?? "Uganda"),
      region: String(payload.data.region ?? "Central"),
      contactEmail: String(payload.data.contactEmail ?? payload.data.email ?? ""),
      contactPhone: String(payload.data.contactPhone ?? payload.data.phone ?? ""),
      website: typeof payload.data.website === "string" ? payload.data.website : undefined,
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      description: payload.subtitle,
      contactEmail: typeof payload.data?.contactEmail === "string" ? payload.data.contactEmail : undefined,
      contactPhone: typeof payload.data?.contactPhone === "string" ? payload.data.contactPhone : undefined,
      website: typeof payload.data?.website === "string" ? payload.data.website : undefined,
      logo: typeof payload.data?.logo === "string" ? payload.data.logo : undefined,
    }),
  },
  users: {
    listPath: "/api/v1/organizations/{orgId}/members",
    createPath: "/api/v1/organizations/{orgId}/members/invite",
    updatePath: (id) => `/api/v1/organizations/{orgId}/members/${encodeURIComponent(id)}/role`,
    deletePath: (id) => `/api/v1/organizations/{orgId}/members/${encodeURIComponent(id)}`,
    updateMethod: "PATCH",
    listQuery: () => ({}),
    mapCreateBody: (payload) => ({
      email: String(payload.data.email ?? payload.subtitle ?? ""),
      role: toOrgMembershipRole(Array.isArray(payload.data.roles) ? payload.data.roles[0] : payload.data.roles),
      message: "Invited from ClyCites workspace admin panel",
    }),
    mapUpdateBody: (_id, payload) => ({
      role: toOrgMembershipRole(Array.isArray(payload.data?.roles) ? payload.data?.roles[0] : payload.data?.roles),
    }),
  },
  moduleToggles: {
    listPath: "/api/v1/admin/system/feature-flags",
    getPath: () => "/api/v1/admin/system/feature-flags",
    createPath: "/api/v1/admin/system/feature-flags",
    createMethod: "PATCH",
    updatePath: () => "/api/v1/admin/system/feature-flags",
    updateMethod: "PATCH",
    listQuery: () => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
    }),
    mapListRows: (payload) =>
      Object.entries(extractFeatureFlags(payload)).map(([workspace, enabled]) => {
        const workspaceId = resolveWorkspaceId(workspace);
        return {
          id: workspaceId,
          name: workspaceLabel(workspaceId),
          workspace: workspaceId,
          enabled,
          status: enabled ? "enabled" : "disabled",
        };
      }),
    mapGetRow: (payload, id) => {
      const workspaceId = resolveWorkspaceId(id);
      const flags = extractFeatureFlags(payload);
      const enabled = typeof flags[workspaceId] === "boolean" ? flags[workspaceId] : typeof flags[id] === "boolean" ? flags[id] : false;
      return {
        id: workspaceId,
        name: workspaceLabel(workspaceId),
        workspace: workspaceId,
        enabled,
        status: enabled ? "enabled" : "disabled",
      };
    },
    mapCreateBody: (payload) => {
      const workspaceId = resolveWorkspaceId(payload.data.workspace ?? payload.title);
      const enabled =
        typeof payload.data.enabled === "boolean" ? payload.data.enabled : payload.status === "disabled" ? false : true;
      return {
        flags: {
          [workspaceId]: enabled,
        },
        reason: "Module toggle updated from admin workspace",
      };
    },
    mapUpdateBody: (id, payload) => {
      const workspaceId = resolveWorkspaceId(payload.data?.workspace ?? id);
      const enabled = typeof payload.data?.enabled === "boolean" ? payload.data.enabled : true;
      return {
        flags: {
          [workspaceId]: enabled,
        },
        reason: "Module toggle updated from admin workspace",
      };
    },
    statusRequest: (id, status, note) => ({
      path: "/api/v1/admin/system/feature-flags",
      method: "PATCH",
      body: {
        flags: {
          [resolveWorkspaceId(id)]: status === "enabled",
        },
        reason: note ?? "Module toggle status change",
      },
    }),
  },
  charts: {
    listPath: "/api/v1/analytics/charts",
    getPath: (id) => `/api/v1/analytics/charts/${encodeURIComponent(id)}`,
    createPath: "/api/v1/analytics/charts",
    updatePath: (id) => `/api/v1/analytics/charts/${encodeURIComponent(id)}`,
    updateMethod: "PUT",
    deletePath: (id) => `/api/v1/analytics/charts/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      dataset: params.filters?.text,
      tags: params.filters?.tags?.join(","),
    }),
    mapCreateBody: (payload) => ({
      name: payload.title,
      description: payload.subtitle,
      definition:
        asRecord(payload.data.definition) ??
        ({
          datasetId: String(payload.data.datasetId ?? "platform_health"),
          chartType: "line",
          metrics: [{ type: "count", field: String(payload.data.metric ?? "records"), alias: "value" }],
          dimensions: [{ type: String(payload.data.dimension ?? "date_month"), alias: "period" }],
          filters: [],
          vizOptions: {
            title: payload.title,
          },
        } as const),
      tags: payload.tags ?? [],
      shareScope: normalizeShareScope(payload.data.shareScope ?? "owner_only"),
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      description: payload.subtitle,
      definition:
        asRecord(payload.data?.definition) ??
        ({
          datasetId: String(payload.data?.datasetId ?? "platform_health"),
          chartType: "line",
          metrics: [{ type: "count", field: String(payload.data?.metric ?? "records"), alias: "value" }],
          dimensions: [{ type: String(payload.data?.dimension ?? "date_month"), alias: "period" }],
          filters: [],
          vizOptions: {
            title: payload.title,
          },
        } as const),
      tags: payload.tags,
      shareScope: normalizeShareScope(payload.data?.shareScope ?? "owner_only"),
    }),
  },
  dashboards: {
    listPath: "/api/v1/analytics/dashboards",
    getPath: (id) => `/api/v1/analytics/dashboards/${encodeURIComponent(id)}`,
    createPath: "/api/v1/analytics/dashboards",
    deletePath: (id) => `/api/v1/analytics/dashboards/${encodeURIComponent(id)}`,
    mapCreateBody: (payload) => ({
      name: payload.title,
      description: payload.subtitle,
      shareScope: normalizeShareScope(payload.data.shareScope ?? "org_members"),
      tags: payload.tags ?? [],
      isDefault: false,
    }),
  },
  reports: {
    listPath: "/api/v1/prices/report",
    createPath: "/api/v1/prices/schedule-report",
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      productId: params.filters?.text,
      region: params.filters?.tags?.[0],
      format: "json",
    }),
    mapCreateBody: (payload) => ({
      frequency: String(payload.data.frequency ?? "weekly"),
      ...(typeof payload.data.email === "string" && payload.data.email.trim().length > 0
        ? { email: payload.data.email.trim() }
        : {}),
      filters: {
        productIds: toStringArray(payload.data.productIds),
        marketIds: toStringArray(payload.data.marketIds),
      },
    }),
  },
  datasets: {
    listPath: "/api/v1/analytics/datasets",
  },
  templates: {
    listPath: "/api/v1/analytics/dashboards/templates",
    listQuery: (params) => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
      category: params.filters?.text ?? params.filters?.tags?.[0],
    }),
  },
  roles: {
    listPath: "/api/v1/auth/me",
    listMode: "collection",
    listQuery: () => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
    }),
    mapListRows: (payload) => {
      const me = unwrapApiData<unknown>(payload);
      const record = asRecord(me) ?? {};
      const user = asRecord(record.user) ?? record;
      const roles = toStringArray(user.roles);
      return roles.map((role) => ({
        id: role,
        name: role,
        code: role,
        description: `Role assigned to current user: ${role}`,
        status: "active",
      }));
    },
  },
  permissions: {
    listPath: "/api/v1/auth/me",
    listMode: "collection",
    listQuery: () => ({
      page: undefined,
      limit: undefined,
      search: undefined,
      status: undefined,
    }),
    mapListRows: (payload) => {
      const me = unwrapApiData<unknown>(payload);
      const record = asRecord(me) ?? {};
      const user = asRecord(record.user) ?? record;
      const permissions = toStringArray(user.permissions);
      return permissions.map((permission) => ({
        id: permission,
        code: permission,
        name: permission,
        description: `Permission available to current user: ${permission}`,
        status: "active",
      }));
    },
  },
};

function buildListQuery(config: EntityApiConfig, params: ListParams): Record<string, unknown> {
  const base: Record<string, unknown> = {
    page: params.pagination.page,
    limit: params.pagination.pageSize,
  };

  if (params.filters?.text) {
    base.search = params.filters.text;
  }
  if (params.filters?.status?.[0]) {
    base.status = params.filters.status[0];
  }
  if (params.sort?.field) {
    base.sortBy = params.sort.field;
    base.sortDirection = params.sort.direction;
  }

  const overrides = config.listQuery?.(params) ?? {};
  return {
    ...base,
    ...overrides,
  };
}

async function listRemote(entityKey: EntityKey, config: EntityApiConfig, params: ListParams): Promise<ListResult<EntityRecord>> {
  if (!config.listPath) {
    throw new Error("List endpoint not configured");
  }

  const query = toQueryString(buildListQuery(config, params));
  const resolvedListPath = await resolvePath(config.listPath);
  const path = query.length > 0 ? `${resolvedListPath}?${query}` : resolvedListPath;
  const payload = await apiRequest<unknown>(path, { method: "GET" }, { auth: true });
  let rows = config.mapListRows ? config.mapListRows(payload, params) : extractCollection(payload);
  if (rows.length === 0 && config.listMode === "single") {
    const single = config.mapGetRow ? config.mapGetRow(payload, `${entityKey}-single`) : extractSingle(payload);
    if (Object.keys(single).length > 0) {
      rows = [single];
    }
  }
  const normalized = rows.map((row, index) => mapRemoteRecord(entityKey, row, index));

  const remotePagination = extractRemotePagination(
    payload,
    params.pagination.page,
    params.pagination.pageSize,
    normalized.length
  );
  if (remotePagination) {
    return {
      items: normalized,
      pagination: remotePagination,
    };
  }

  return applyListParams(normalized, params);
}

async function getRemote(entityKey: EntityKey, config: EntityApiConfig, id: string): Promise<EntityRecord> {
  if (!config.getPath) {
    throw new Error("Get endpoint not configured");
  }

  const path = await resolvePath(config.getPath(id));
  const payload = await apiRequest<unknown>(path, { method: "GET" }, { auth: true });
  const row = config.mapGetRow ? config.mapGetRow(payload, id) : extractSingle(payload);
  return mapRemoteRecord(entityKey, { ...row, id }, 0);
}

async function createRemote(entityKey: EntityKey, config: EntityApiConfig, payload: CreatePayload): Promise<EntityRecord> {
  if (!config.createPath) {
    throw new Error("Create endpoint not configured");
  }

  const method = config.createMethod ?? "POST";
  const path = await resolvePath(config.createPath);
  const body = config.mapCreateBody ? config.mapCreateBody(payload) : defaultCreateBody(payload);
  const response = await apiRequest<unknown>(
    path,
    {
      method,
      body: JSON.stringify(body),
    },
    { auth: true }
  );

  const row = extractSingle(response);
  const normalized = mapRemoteRecord(entityKey, row, 0);
  if (normalized.id && !normalized.id.startsWith(`${entityKey}-remote-`)) {
    return normalized;
  }

  return {
    ...normalized,
    title: payload.title,
    subtitle: payload.subtitle,
    status: payload.status ?? normalized.status,
    tags: payload.tags ?? normalized.tags,
    data: {
      ...normalized.data,
      ...payload.data,
    },
  };
}

async function updateRemote(entityKey: EntityKey, config: EntityApiConfig, id: string, payload: UpdatePayload): Promise<EntityRecord> {
  if (!config.updatePath) {
    throw new Error("Update endpoint not configured");
  }

  const method = config.updateMethod ?? "PATCH";
  const path = await resolvePath(config.updatePath(id));
  const body = config.mapUpdateBody ? config.mapUpdateBody(id, payload) : defaultUpdateBody(payload);
  const response = await apiRequest<unknown>(
    path,
    {
      method,
      body: JSON.stringify(body),
    },
    { auth: true }
  );

  const row = extractSingle(response);
  const normalized = mapRemoteRecord(entityKey, { ...row, id }, 0);
  return {
    ...normalized,
    title: payload.title ?? normalized.title,
    subtitle: payload.subtitle ?? normalized.subtitle,
    data: {
      ...normalized.data,
      ...(payload.data ?? {}),
    },
  };
}

async function deleteRemote(config: EntityApiConfig, id: string): Promise<void> {
  if (!config.deletePath) {
    throw new Error("Delete endpoint not configured");
  }

  const method = config.deleteMethod ?? "DELETE";
  const path = await resolvePath(config.deletePath(id));
  await apiRequest<unknown>(
    path,
    {
      method,
      body: config.deleteBody ? JSON.stringify(config.deleteBody(id)) : undefined,
    },
    { auth: true }
  );
}

async function changeStatusRemote(
  entityKey: EntityKey,
  config: EntityApiConfig,
  id: string,
  status: string,
  note?: string
): Promise<EntityRecord> {
  const request = config.statusRequest?.(id, status, note);
  if (!request) {
    if (!config.updatePath) {
      throw new Error("Status endpoint not configured");
    }

    const path = await resolvePath(config.updatePath(id));
    const response = await apiRequest<unknown>(
      path,
      {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      },
      { auth: true }
    );
    return mapRemoteRecord(entityKey, { ...extractSingle(response), id, status }, 0);
  }

  const response = await apiRequest<unknown>(
    await resolvePath(request.path),
    {
      method: request.method,
      body: request.body ? JSON.stringify(request.body) : undefined,
    },
    { auth: true }
  );

  const row = extractSingle(response);
  if (Object.keys(row).length === 0 && config.getPath) {
    try {
      const latest = await getRemote(entityKey, config, id);
      return {
        ...latest,
        status,
        updatedAt: new Date().toISOString(),
      };
    } catch {
      // Ignore and fall back to synthetic payload mapping below.
    }
  }
  const normalized = mapRemoteRecord(entityKey, { ...row, id, status }, 0);
  return {
    ...normalized,
    status,
    updatedAt: new Date().toISOString(),
  };
}

async function runActionRemote(
  config: EntityApiConfig,
  actionId: string,
  actorId: string,
  targetId?: string
): Promise<{ message: string }> {
  const request = config.actionRequest?.(actionId, actorId, targetId);
  if (!request) {
    throw new Error("Action endpoint not configured");
  }

  const response = await apiRequest<unknown>(
    await resolvePath(request.path),
    {
      method: request.method,
      body: request.body ? JSON.stringify(request.body) : undefined,
    },
    { auth: true }
  );

  return {
    message: request.messageFromResponse?.(response) ?? request.message ?? "Action completed successfully.",
  };
}

function createRealEntityService<K extends EntityKey>(entityKey: K): EntityService<K> {
  const mock = mockEntityServices[entityKey] as EntityService<K>;
  const config = ENTITY_API_CONFIG[entityKey];

  if (!config) {
    return mock;
  }

  return {
    listX: (params) =>
      withFallback(
        () => listRemote(entityKey, config, params as ListParams) as Promise<ListResult<EntityRecord<K>>>,
        () => mock.listX(params)
      ),
    getX: (id) =>
      config.getPath
        ? withFallback(
            () => getRemote(entityKey, config, id) as Promise<EntityRecord<K>>,
            () => mock.getX(id)
          )
        : mock.getX(id),
    createX: (payload) =>
      config.createPath
        ? withFallback(
            () => createRemote(entityKey, config, payload as CreatePayload) as Promise<EntityRecord<K>>,
            () => mock.createX(payload)
          )
        : mock.createX(payload),
    updateX: (id, payload) =>
      config.updatePath
        ? withFallback(
            () => updateRemote(entityKey, config, id, payload as UpdatePayload) as Promise<EntityRecord<K>>,
            () => mock.updateX(id, payload)
          )
        : mock.updateX(id, payload),
    deleteX: (id, actorId) =>
      config.deletePath
        ? withFallback(
            () => deleteRemote(config, id),
            () => mock.deleteX(id, actorId)
          )
        : mock.deleteX(id, actorId),
    changeStatus: (id, actorId, status, note) =>
      config.statusRequest || config.updatePath
        ? withFallback(
            () => changeStatusRemote(entityKey, config, id, status, note) as Promise<EntityRecord<K>>,
            () => mock.changeStatus(id, actorId, status, note)
          )
        : mock.changeStatus(id, actorId, status, note),
    runAction: (actionId, actorId, targetId) =>
      config.actionRequest
        ? withFallback(
            () => runActionRemote(config, actionId, actorId, targetId),
            () => mock.runAction(actionId, actorId, targetId)
          )
        : mock.runAction(actionId, actorId, targetId),
  };
}

const entityKeys = Object.keys(mockEntityServices) as EntityKey[];

export const entityServices = Object.fromEntries(
  entityKeys.map((key) => [key, createRealEntityService(key)])
) as {
  [K in EntityKey]: EntityService<K>;
};
