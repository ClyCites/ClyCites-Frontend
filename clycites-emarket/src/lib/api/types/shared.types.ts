// ── Pagination ────────────────────────────────────────────────────────────────

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ── API Envelope ──────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Array<{ field: string; message: string }>;
  status: number;
}

// ── Query params ──────────────────────────────────────────────────────────────

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── User / Auth ───────────────────────────────────────────────────────────────

export type UserRole = "farmer" | "buyer" | "org_admin" | "expert" | "platform_admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  profilePhoto?: string;
  phone?: string;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  expiresIn: number;
  tokenType: "Bearer";
}

// ── Product ───────────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  category: string;
  unit: string;
  description?: string;
}
