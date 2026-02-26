import { api, removeToken, setToken } from "../http";
import type {
  ApiToken,
  ApiTokenUsage,
  AuthTokens,
  PaginatedResponse,
  User,
} from "../types/shared.types";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

interface ResetPasswordByCodeRequest {
  email: string;
  code: string;
  newPassword: string;
}

interface ApiTokenCreateRequest {
  tokenType?: "personal" | "organization" | "super_admin";
  name: string;
  description?: string;
  orgId?: string;
  scopes: string[];
  rateLimit?: {
    requestsPerMinute?: number;
    burst?: number;
  };
  expiresAt?: string;
  allowedIps?: string[];
  reason?: string;
}

interface ApiTokenUpdateRequest {
  name?: string;
  description?: string;
  scopes?: string[];
  rateLimit?: {
    requestsPerMinute?: number;
    burst?: number;
  };
  allowedIps?: string[];
  expiresAt?: string | null;
  reason?: string;
}

type LoginResponse = AuthTokens & { user?: User };
type CreateOrRotateTokenResponse = { token: ApiToken; secret: string };

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", data, { skipAuth: true });
    if (response.accessToken) setToken(response.accessToken);
    return response;
  },

  register: (data: RegisterRequest) =>
    api.post<{ message: string }>("/auth/register", data, { skipAuth: true }),

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      removeToken();
    }
  },

  me: () => api.get<User>("/auth/me"),

  refreshToken: async () => {
    const response = await api.post<AuthTokens>("/auth/refresh-token", undefined, {
      skipAuth: true,
      skipRefresh: true,
    });
    if (response.accessToken) setToken(response.accessToken);
    return response;
  },

  forgotPassword: (email: string) =>
    api.post("/auth/forgot-password", { email }, { skipAuth: true }),

  resetPasswordByCode: (request: ResetPasswordByCodeRequest) =>
    api.post("/auth/reset-password", request, { skipAuth: true }),

  resetPassword: (tokenOrCode: string, newPassword: string, email?: string) =>
    email
      ? api.post("/auth/reset-password", { email, code: tokenOrCode, newPassword }, { skipAuth: true })
      : api.post("/auth/reset-password", { token: tokenOrCode, newPassword }, { skipAuth: true }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/auth/change-password", { currentPassword, newPassword }),

  verifyOtp: (email: string, code: string, purpose: "verification" | "password_reset" | "login" = "verification") =>
    api.post("/auth/verify-otp", { email, code, purpose }, { skipAuth: true }),

  resendOtp: (email: string, purpose: "verification" | "password_reset" | "login" = "verification") =>
    api.post("/auth/resend-otp", { email, purpose }, { skipAuth: true }),

  verifyEmail: (token: string) =>
    api.post("/auth/verify-email", { token }, { skipAuth: true }),

  setupTotp: () =>
    api.post<{ secret: string; qrCodeUri?: string; qrCodeUrl?: string; backupCodes?: string[] }>(
      "/security/mfa/totp/setup"
    ),

  verifyTotp: (token: string) =>
    api.post("/security/mfa/totp/verify", { token }),

  disableMfa: (data?: { confirmToken?: string; password?: string }) =>
    api.delete("/security/mfa", data),

  // ── API token management ────────────────────────────────────────────────────

  listTokens: (params?: {
    tokenType?: "personal" | "organization" | "super_admin";
    status?: "active" | "revoked" | "expired";
    orgId?: string;
  }) => api.get<ApiToken[]>("/auth/tokens", params),

  getTokenById: (id: string) => api.get<ApiToken>(`/auth/tokens/${id}`),

  createToken: (data: ApiTokenCreateRequest) =>
    api.post<CreateOrRotateTokenResponse>("/auth/tokens", data),

  updateToken: (id: string, data: ApiTokenUpdateRequest) =>
    api.patch<ApiToken>(`/auth/tokens/${id}`, data),

  rotateToken: (id: string, reason: string) =>
    api.post<CreateOrRotateTokenResponse>(`/auth/tokens/${id}/rotate`, { reason }),

  revokeToken: (id: string, reason: string) =>
    api.post<ApiToken>(`/auth/tokens/${id}/revoke`, { reason }),

  getTokenUsage: (id: string, sinceDays = 7) =>
    api.get<ApiTokenUsage>(`/auth/tokens/${id}/usage`, { sinceDays }),

  // ── Super Admin token grants ───────────────────────────────────────────────

  listSuperAdminTokens: () => api.get<PaginatedResponse<unknown> | unknown[]>("/auth/super-admin/tokens"),

  createSuperAdminToken: (data: { scopes: string[]; reason: string; expiresInMinutes?: number }) =>
    api.post<{ token: string; grantId: string; expiresAt: string }>("/auth/super-admin/tokens", data),

  revokeSuperAdminToken: (grantId: string, reason: string) =>
    api.delete(`/auth/super-admin/tokens/${grantId}`, { reason }),

  // ── Super Admin impersonation ───────────────────────────────────────────────

  listImpersonationSessions: () => api.get<unknown[]>("/auth/super-admin/impersonation"),

  startImpersonation: (data: {
    targetUserId: string;
    reason: string;
    ttlMinutes?: number;
    scopes?: string[];
  }) => api.post<{ sessionId: string; token: string }>("/auth/super-admin/impersonation", data),

  revokeImpersonationSession: (sessionId: string, reason: string) =>
    api.delete(`/auth/super-admin/impersonation/${sessionId}`, { reason }),
};
