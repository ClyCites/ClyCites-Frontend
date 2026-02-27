import { api } from "../http";
import { authApi } from "./auth.api";

export interface CollectionPoint {
  id: string;
  name: string;
  type: "collection_point" | "warehouse";
  organizationId?: string;
  status?: "active" | "inactive";
  address: {
    country: string;
    district: string;
    subCounty?: string;
    parish?: string;
    village?: string;
    line1?: string;
    line2?: string;
  };
  createdAt?: string;
}

export interface ShipmentTrackingEvent {
  id?: string;
  status: "created" | "assigned" | "picked_up" | "in_transit" | "delivered" | "cancelled" | "returned";
  note?: string;
  location?: string;
  createdAt?: string;
}

export interface Shipment {
  id: string;
  organizationId?: string;
  orderId?: string;
  status: ShipmentTrackingEvent["status"];
  from: Record<string, unknown>;
  to: Record<string, unknown>;
  trackingEvents?: ShipmentTrackingEvent[];
  createdAt?: string;
}

export interface MaintenanceModeState {
  enabled: boolean;
  message?: string;
  updatedAt?: string;
}

export interface FeatureFlagsState {
  flags: Record<string, boolean>;
  updatedAt?: string;
}

export interface PaymentRecord {
  id: string;
  orderId?: string;
  amount: number;
  currency?: string;
  status: "pending" | "paid" | "failed" | "refunded";
  method?: string;
  createdAt?: string;
}

export const farmersApi = {
  listProfiles: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/farmers/profiles", params),
  myProfile: () => api.get("/farmers/profiles/me"),
  listLegacy: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/farmers/legacy", params),
};

export const pricingApi = {
  prices: (params?: Record<string, string | number | boolean | undefined | null>) => api.get("/prices", params),
  pricing: (params?: Record<string, string | number | boolean | undefined | null>) => api.get("/pricing", params),
  markets: (params?: Record<string, string | number | boolean | undefined | null>) => api.get("/markets", params),
  marketIntelligence: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/market-intelligence", params),
};

export const paymentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get<PaymentRecord[]>("/payments", params),
  create: (
    payload: { orderId: string; amount: number; currency?: string; method?: string },
    options?: { idempotencyKey?: string }
  ) => api.post<PaymentRecord>("/payments", payload, options),
};

export const logisticsApi = {
  listCollectionPoints: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get<CollectionPoint[]>("/logistics/collection-points", params),
  createCollectionPoint: (payload: Partial<CollectionPoint>) =>
    api.post<CollectionPoint>("/logistics/collection-points", payload),
  updateCollectionPoint: (id: string, payload: Partial<CollectionPoint>) =>
    api.patch<CollectionPoint>(`/logistics/collection-points/${id}`, payload),
  deactivateCollectionPoint: (id: string) =>
    api.delete(`/logistics/collection-points/${id}`),

  listShipments: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get<Shipment[]>("/logistics/shipments", params),
  createShipment: (payload: {
    organizationId?: string;
    orderId?: string;
    from: Record<string, unknown>;
    to: Record<string, unknown>;
  }) => api.post<Shipment>("/logistics/shipments", payload),
  getShipmentById: (id: string) => api.get<Shipment>(`/logistics/shipments/${id}`),
  updateShipmentStatus: (id: string, payload: ShipmentTrackingEvent) =>
    api.patch<Shipment>(`/logistics/shipments/${id}/status`, payload),
  addTrackingEvent: (id: string, payload: ShipmentTrackingEvent) =>
    api.post(`/logistics/shipments/${id}/tracking`, payload),
  uploadProofOfDelivery: (id: string, formData: FormData) =>
    api.post(`/logistics/shipments/${id}/proof-of-delivery`, formData),
};

export const weatherApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/weather/alerts/stats", params),
};

export const analyticsApi = {
  dashboard: (params?: Record<string, string | number | boolean | undefined | null>) => {
    const role = typeof params?.role === "string" ? params.role : null;

    if (role === "farmer") {
      return api.get("/analytics/farmer/dashboard");
    }
    if (role === "org_admin") {
      return api.get("/analytics/org/dashboard");
    }
    if (role === "admin" || role === "platform_admin" || role === "super_admin") {
      return api.get("/analytics/admin/dashboard");
    }

    return api.get("/analytics/overview", params);
  },
  global: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/analytics/global", params),
};

export const expertPortalApi = {
  overview: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/expert-portal", params),
};

export const notificationsApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/notifications", params),
};

export const messagingApi = {
  conversations: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/messaging", params),
};

export const organizationsApi = {
  listMine: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/organizations/me", params),
  members: (id: string, params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get(`/organizations/${id}/members`, params),
};

export const usersApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/users", params),
};

export const superAdminApi = {
  getMaintenanceMode: () => api.get<MaintenanceModeState>("/admin/system/maintenance"),
  updateMaintenanceMode: (payload: { enabled: boolean; message?: string; reason: string }) =>
    api.patch<MaintenanceModeState>("/admin/system/maintenance", payload, {
      superAdminMode: true,
      superAdminReason: payload.reason,
    }),

  getFeatureFlags: () => api.get<FeatureFlagsState>("/admin/system/feature-flags"),
  updateFeatureFlags: (payload: { flags: Record<string, boolean>; reason: string }) =>
    api.patch<FeatureFlagsState>("/admin/system/feature-flags", payload, {
      superAdminMode: true,
      superAdminReason: payload.reason,
    }),

  listImpersonationSessions: () => authApi.listImpersonationSessions(),
  startImpersonation: authApi.startImpersonation,
  revokeImpersonationSession: authApi.revokeImpersonationSession,
};

export const auditApi = {
  list: (params?: Record<string, string | number | boolean | undefined | null>) =>
    api.get("/audit", params),
};

export const healthApi = {
  health: () => api.get("/health"),
  ready: () => api.get("/ready"),
  version: () => api.get("/version"),
};
