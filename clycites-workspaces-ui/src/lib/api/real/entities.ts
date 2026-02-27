import { ENTITY_DEFINITIONS, WORKSPACE_ENTITY_MAP } from "@/lib/store/catalog";
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
  getPath?: (id: string) => string;
  createPath?: string;
  updatePath?: (id: string) => string;
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
  const id = String(record.id ?? record._id ?? record.uuid ?? fallbackId);
  const title = normalizeTitle(entityKey, record, id);
  const subtitle = normalizeSubtitle(record);
  const status =
    (typeof record.status === "string" && record.status) ||
    (typeof record.state === "string" && record.state) ||
    (typeof record.workflowStatus === "string" && record.workflowStatus) ||
    (typeof record.lifecycleStatus === "string" && record.lifecycleStatus) ||
    ENTITY_DEFINITIONS[entityKey].defaultStatus;

  const tags = toStringArray(record.tags);
  const derivedTags = [
    ...tags,
    ...toStringArray(record.scopes),
    ...toStringArray(record.cropTypes),
    ...toStringArray(record.categories),
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
  const path = query.length > 0 ? `${config.listPath}?${query}` : config.listPath;
  const payload = await apiRequest<unknown>(path, { method: "GET" }, { auth: true });
  const rows = extractCollection(payload);
  const normalized = rows.map((row, index) => mapRemoteRecord(entityKey, row, index));
  return applyListParams(normalized, params);
}

async function getRemote(entityKey: EntityKey, config: EntityApiConfig, id: string): Promise<EntityRecord> {
  if (!config.getPath) {
    throw new Error("Get endpoint not configured");
  }

  const payload = await apiRequest<unknown>(config.getPath(id), { method: "GET" }, { auth: true });
  const row = extractSingle(payload);
  return mapRemoteRecord(entityKey, { ...row, id }, 0);
}

async function createRemote(entityKey: EntityKey, config: EntityApiConfig, payload: CreatePayload): Promise<EntityRecord> {
  if (!config.createPath) {
    throw new Error("Create endpoint not configured");
  }

  const body = config.mapCreateBody ? config.mapCreateBody(payload) : defaultCreateBody(payload);
  const response = await apiRequest<unknown>(
    config.createPath,
    {
      method: "POST",
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

  const body = config.mapUpdateBody ? config.mapUpdateBody(id, payload) : defaultUpdateBody(payload);
  const response = await apiRequest<unknown>(
    config.updatePath(id),
    {
      method: "PATCH",
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
  await apiRequest<unknown>(
    config.deletePath(id),
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

    const response = await apiRequest<unknown>(
      config.updatePath(id),
      {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
      },
      { auth: true }
    );
    return mapRemoteRecord(entityKey, { ...extractSingle(response), id, status }, 0);
  }

  const response = await apiRequest<unknown>(
    request.path,
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
