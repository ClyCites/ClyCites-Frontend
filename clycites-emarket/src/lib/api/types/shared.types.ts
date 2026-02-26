// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage?: boolean;
  hasPrevPage?: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ── API Envelope ──────────────────────────────────────────────────────────────

export interface ApiMeta {
  requestId?: string;
  timestamp?: string;
  pagination?: PaginationMeta;
  impersonatedUserId?: string;
  [key: string]: unknown;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  message?: string;
  meta?: ApiMeta;
}

export interface ApiError extends ApiErrorPayload {
  status: number;
  requestId?: string;
  meta?: ApiMeta;
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── User / Auth ───────────────────────────────────────────────────────────────

export type UserRole =
  | "farmer"
  | "buyer"
  | "trader"
  | "supplier"
  | "expert"
  | "org_admin"
  | "admin"
  | "platform_admin"
  | "super_admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isVerified?: boolean;
  isEmailVerified?: boolean;
  isPhoneVerified?: boolean;
  profilePhoto?: string;
  phone?: string;
  profile?: Record<string, unknown>;
  organizationIds?: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number | string;
  tokenType?: "Bearer";
}

export type ApiTokenType = "personal" | "organization" | "super_admin";
export type ApiTokenStatus = "active" | "revoked" | "expired";

export interface ApiToken {
  id: string;
  tokenId?: string;
  tokenType: ApiTokenType;
  name: string;
  description?: string;
  tokenPrefix?: string;
  orgId?: string;
  scopes: string[];
  status: ApiTokenStatus;
  expiresAt?: string | null;
  lastUsedAt?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ApiTokenUsage {
  token: ApiToken;
  summary?: {
    totalRequests: number;
    successResponses: number;
    clientErrors: number;
    serverErrors: number;
  };
  requestsByDay?: Array<{ date: string; count: number }>;
  since?: string;
  days?: number;
  lastUsedAt?: string | null;
  lastUsedIp?: string | null;
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  description?: string;
}
