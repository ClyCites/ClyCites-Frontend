import { api, getRefreshToken, removeToken, setRefreshToken, setToken } from "../http";
import type {
  ApiToken,
  ApiTokenUsage,
  AuthAccountPayload,
  AuthSecurityState,
  AuthTokens,
  DeviceRecord,
  PaginatedResponse,
  TotpSetupResponse,
  TotpVerifyResponse,
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

type LoginResponse = Partial<AuthTokens> & { user?: User; security?: AuthSecurityState };
type CreateOrRotateTokenResponse = { token: ApiToken; secret: string };

function asRecord(value: unknown): Record<string, unknown> | null {
  return value !== null && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null;
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function asExpiresIn(value: unknown): string | number | undefined {
  if (typeof value === "string" || typeof value === "number") return value;
  return undefined;
}

function extractAuthTokens(payload: unknown): Partial<AuthTokens> {
  const root = asRecord(payload);
  if (!root) return {};

  const containers = [
    root,
    asRecord(root.tokens),
    asRecord(root.token),
    asRecord(root.auth),
    asRecord(root.session),
    asRecord(root.credentials),
  ].filter((entry): entry is Record<string, unknown> => !!entry);

  const accessToken = containers
    .map((entry) => asString(entry.accessToken) ?? asString(entry.access_token) ?? asString(entry.jwt) ?? asString(entry.token))
    .find(Boolean);

  const refreshToken = containers
    .map((entry) => asString(entry.refreshToken) ?? asString(entry.refresh_token))
    .find(Boolean);

  const expiresIn = containers
    .map((entry) => asExpiresIn(entry.expiresIn ?? entry.expires_in))
    .find((value) => value !== undefined);

  return {
    accessToken,
    refreshToken,
    expiresIn,
  };
}

function extractUser(payload: unknown): User | undefined {
  const root = asRecord(payload);
  if (!root) return undefined;

  const candidate = asRecord(root.user)
    ?? asRecord(root.me)
    ?? asRecord(root.profile)
    ?? asRecord(root.account);

  return candidate ? (candidate as unknown as User) : undefined;
}

function toSecurityState(value: Record<string, unknown> | null): AuthSecurityState | undefined {
  if (!value) return undefined;

  const toBool = (input: unknown, fallback = false) => (typeof input === "boolean" ? input : fallback);
  const toNum = (input: unknown, fallback = 0) => (typeof input === "number" ? input : fallback);

  return {
    isMfaEnabled: toBool(value.isMfaEnabled),
    passwordResetRequired: toBool(value.passwordResetRequired),
    requiresIdentityVerification: toBool(value.requiresIdentityVerification),
    suspiciousActivityDetected: toBool(value.suspiciousActivityDetected),
    failedLoginAttempts: toNum(value.failedLoginAttempts),
    lockedUntil: asString(value.lockedUntil),
    isLocked: toBool(value.isLocked),
  };
}

function isLikelyUserRecord(value: Record<string, unknown>): boolean {
  return typeof value.id === "string"
    && typeof value.email === "string"
    && typeof value.role === "string";
}

function extractAuthAccountPayload(payload: unknown): AuthAccountPayload {
  const root = asRecord(payload);
  if (!root) {
    throw new Error("Account payload is missing.");
  }

  const nestedUser = asRecord(root.user);
  const nestedSecurity = asRecord(root.security);
  const nestedOnboarding = asRecord(root.onboarding);

  if (nestedUser) {
    return {
      user: nestedUser as unknown as User,
      security: toSecurityState(nestedSecurity) ?? {
        isMfaEnabled: false,
        passwordResetRequired: false,
        requiresIdentityVerification: false,
        suspiciousActivityDetected: false,
        failedLoginAttempts: 0,
        isLocked: false,
      },
      onboarding: nestedOnboarding
        ? {
            profileCompletionScore:
              typeof nestedOnboarding.profileCompletionScore === "number"
                ? nestedOnboarding.profileCompletionScore
                : undefined,
            requiresEmailVerification:
              typeof nestedOnboarding.requiresEmailVerification === "boolean"
                ? nestedOnboarding.requiresEmailVerification
                : undefined,
          }
        : undefined,
    };
  }

  if (isLikelyUserRecord(root)) {
    return {
      user: root as unknown as User,
      security: toSecurityState(root) ?? {
        isMfaEnabled: false,
        passwordResetRequired: false,
        requiresIdentityVerification: false,
        suspiciousActivityDetected: false,
        failedLoginAttempts: 0,
        isLocked: false,
      },
    };
  }

  throw new Error("Account payload did not include user data.");
}

function extractSecurity(payload: unknown): AuthSecurityState | undefined {
  const root = asRecord(payload);
  if (!root) return undefined;
  return toSecurityState(asRecord(root.security)) ?? toSecurityState(root);
}

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const payload = await api.post<unknown>("/auth/login", data, { skipAuth: true });
    const tokens = extractAuthTokens(payload);
    const user = extractUser(payload);
    const security = extractSecurity(payload);

    if (!tokens.accessToken) {
      throw new Error("Login response did not include an access token.");
    }

    setToken(tokens.accessToken);
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken);
    }

    return { ...tokens, user, security };
  },

  register: (data: RegisterRequest) =>
    api.post<{ message: string }>("/auth/register", data, { skipAuth: true }),

  logout: async () => {
    const refreshToken = getRefreshToken();
    try {
      await api.post("/auth/logout", refreshToken ? { refreshToken } : undefined);
    } finally {
      removeToken();
    }
  },

  me: async (): Promise<AuthAccountPayload> => {
    const payload = await api.get<unknown>("/auth/me");
    return extractAuthAccountPayload(payload);
  },

  updateMyProfile: async (data: Record<string, unknown>): Promise<AuthAccountPayload> => {
    const payload = await api.patch<unknown>("/auth/me/profile", data);
    return extractAuthAccountPayload(payload);
  },

  refreshToken: async () => {
    const existingRefreshToken = getRefreshToken();
    if (!existingRefreshToken) {
      throw new Error("No refresh token available.");
    }

    const payload = await api.post<unknown>("/auth/refresh-token", { refreshToken: existingRefreshToken }, {
      skipAuth: true,
      skipRefresh: true,
    });
    const tokens = extractAuthTokens(payload);

    if (!tokens.accessToken) {
      throw new Error("Refresh token response did not include an access token.");
    }

    setToken(tokens.accessToken);
    if (tokens.refreshToken) {
      setRefreshToken(tokens.refreshToken);
    }

    return tokens as AuthTokens;
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

  setupTotp: () => api.post<TotpSetupResponse>("/security/mfa/totp/setup"),

  verifyTotp: (token: string) => api.post<TotpVerifyResponse>("/security/mfa/totp/verify", { token }),

  enableEmailOtp: () => api.post("/security/mfa/email/enable"),

  requestEmailOtp: () => api.post("/security/mfa/email/request"),

  disableMfa: (data?: { confirmToken?: string; password?: string }) =>
    api.delete("/security/mfa", data),

  listDevices: () => api.get<DeviceRecord[]>("/security/devices"),

  verifyDevice: (deviceId: string) => api.post(`/security/devices/${deviceId}/verify`),

  blockDevice: (deviceId: string, reason?: string) =>
    api.post(`/security/devices/${deviceId}/block`, reason ? { reason } : undefined),

  revokeDevice: (deviceId: string) => api.delete(`/security/devices/${deviceId}`),

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
