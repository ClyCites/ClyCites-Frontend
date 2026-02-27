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

function mapRemoteRecord(entityKey: EntityKey, row: unknown, index = 0): EntityRecord {
  const record = asRecord(row) ?? {};
  const fallbackId = `${entityKey}-remote-${index + 1}`;
  const id = String(record.id ?? record._id ?? record.uuid ?? record.userId ?? record.memberId ?? fallbackId);
  const title = normalizeTitle(entityKey, record, id);
  const subtitle = normalizeSubtitle(record);
  const rawStatus =
    (typeof record.status === "string" ? record.status : undefined) ||
    (typeof record.state === "string" ? record.state : undefined) ||
    (typeof record.workflowStatus === "string" ? record.workflowStatus : undefined) ||
    (typeof record.lifecycleStatus === "string" ? record.lifecycleStatus : undefined) ||
    (typeof record.caseStatus === "string" ? record.caseStatus : undefined) ||
    (typeof record.stationStatus === "string" ? record.stationStatus : undefined) ||
    (typeof record.alertStatus === "string" ? record.alertStatus : undefined) ||
    (typeof record.reviewStatus === "string" ? record.reviewStatus : undefined);

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
  if (entityKey === "stations" && typeof record.stationStatus === "string") {
    status = record.stationStatus;
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

function advisoryUrgency(status?: string): "low" | "medium" | "high" | "critical" {
  if (!status) return "medium";
  const normalized = status.toLowerCase();
  if (normalized.includes("reject") || normalized.includes("critical")) return "critical";
  if (normalized.includes("approve") || normalized.includes("published")) return "high";
  if (normalized.includes("review")) return "medium";
  return "low";
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

  return resolved;
}

const ENTITY_API_CONFIG: Partial<Record<EntityKey, EntityApiConfig>> = {
  farmers: {
    listPath: "/api/v1/farmers/profiles",
    getPath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    createPath: "/api/v1/farmers/profiles",
    updatePath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/farmers/profiles/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      search: params.filters?.text,
      region: params.filters?.text,
    }),
    mapCreateBody: (payload) => ({
      businessName: payload.title,
      description: payload.subtitle,
      location: {
        region: String(payload.data.region ?? "Central"),
        district: String(payload.data.region ?? "Unknown"),
        village: String(payload.data.village ?? ""),
      },
      farmSize: Number(payload.data.farmSize ?? payload.data.farmSizeAcres ?? 1),
      cropTypes: toStringArray(payload.data.cropTypes),
    }),
    mapUpdateBody: (_id, payload) => ({
      businessName: payload.title,
      description: payload.subtitle,
      location: {
        region: String(payload.data?.region ?? "Central"),
        district: String(payload.data?.region ?? "Unknown"),
        village: String(payload.data?.village ?? ""),
      },
      farmSize: Number(payload.data?.farmSize ?? payload.data?.farmSizeAcres ?? 1),
      cropTypes: toStringArray(payload.data?.cropTypes),
    }),
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
    listPath: "/api/v1/weather/profiles",
    getPath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    createPath: "/api/v1/weather/profiles",
    updatePath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/weather/profiles/${encodeURIComponent(id)}`,
    listQuery: (params) => ({
      page: params.pagination.page,
      limit: params.pagination.pageSize,
      search: params.filters?.text,
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
      condition: String(payload.data.condition ?? payload.title),
      severity: String(payload.data.severity ?? "medium"),
      message: payload.subtitle ?? String(payload.data.action ?? "Rule triggered"),
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      condition: String(payload.data?.condition ?? payload.title ?? "condition"),
      severity: String(payload.data?.severity ?? "medium"),
      message: payload.subtitle ?? String(payload.data?.action ?? "Rule updated"),
      enabled: payload.data?.enabled,
    }),
    statusRequest: (id, status) => ({
      path: `/api/v1/weather/rules/${encodeURIComponent(id)}`,
      method: "PATCH",
      body: {
        enabled: status === "active",
      },
    }),
  },
  advisories: {
    listPath: "/api/v1/expert-portal/advisories",
    createPath: "/api/v1/expert-portal/advisories",
    listQuery: (params) => ({
      category: params.filters?.text,
      status: params.filters?.status?.[0],
    }),
    mapCreateBody: (payload) => ({
      title: payload.title,
      content: String(payload.data.notes ?? payload.subtitle ?? payload.title),
      category: String(payload.data.targetGroup ?? "general"),
      targetRegions: toStringArray(payload.data.region).length > 0 ? toStringArray(payload.data.region) : ["all"],
      targetCrops: toStringArray(payload.data.cropTypes),
      urgency: advisoryUrgency(payload.status),
    }),
    statusRequest: (id, status) => {
      if (status === "acknowledged") {
        return {
          path: `/api/v1/expert-portal/advisories/${encodeURIComponent(id)}/acknowledge`,
          method: "POST",
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
      summary: payload.subtitle,
      category: String(payload.data?.category ?? "general"),
      tags: toStringArray(payload.data?.tags).length > 0 ? toStringArray(payload.data?.tags) : payload.tags ?? [],
      cropTypes: toStringArray(payload.data?.cropTypes),
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
  apiTokens: {
    listPath: "/api/v1/auth/tokens",
    getPath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}`,
    createPath: "/api/v1/auth/tokens",
    updatePath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}`,
    deletePath: (id) => `/api/v1/auth/tokens/${encodeURIComponent(id)}/revoke`,
    deleteMethod: "POST",
    listQuery: (params) => ({
      status: params.filters?.status?.[0],
      tokenType: "personal",
    }),
    mapCreateBody: (payload) => ({
      tokenType: "personal",
      name: payload.title,
      description: payload.subtitle,
      scopes: toStringArray(payload.data.scopes).length > 0 ? toStringArray(payload.data.scopes) : ["orders:read"],
      rateLimit: Number(payload.data.rateLimit ?? 1000),
      expiresAt: payload.data.expiresAt,
      reason: "Created from workspace UI",
    }),
    mapUpdateBody: (_id, payload) => ({
      name: payload.title,
      description: payload.subtitle,
      scopes: toStringArray(payload.data?.scopes),
      rateLimit: Number(payload.data?.rateLimit ?? 1000),
      expiresAt: payload.data?.expiresAt,
    }),
    statusRequest: (id, status) => {
      if (status === "revoked") {
        return {
          path: `/api/v1/auth/tokens/${encodeURIComponent(id)}/revoke`,
          method: "POST",
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
      shareScope: String(payload.data.shareScope ?? "owner_only"),
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
      shareScope: String(payload.data?.shareScope ?? "owner_only"),
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
      shareScope: String(payload.data.shareScope ?? "org_members"),
      tags: payload.tags ?? [],
      isDefault: false,
    }),
  },
  datasets: {
    listPath: "/api/v1/analytics/datasets",
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
  const normalized = mapRemoteRecord(entityKey, { ...row, id, status }, 0);
  return {
    ...normalized,
    status,
    updatedAt: new Date().toISOString(),
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
    runAction: (actionId, actorId, targetId) => mock.runAction(actionId, actorId, targetId),
  };
}

const entityKeys = Object.keys(mockEntityServices) as EntityKey[];

export const entityServices = Object.fromEntries(
  entityKeys.map((key) => [key, createRealEntityService(key)])
) as {
  [K in EntityKey]: EntityService<K>;
};
