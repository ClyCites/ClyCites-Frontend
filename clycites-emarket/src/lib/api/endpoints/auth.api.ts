import { api, http, setToken, removeToken } from "../http";
import type { User, AuthTokens } from "../types/shared.types";

interface LoginRequest { email: string; password: string; }
interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role?: string;
  phone?: string;
}

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthTokens & { user: User }> => {
    const res = await api.post<AuthTokens & { user: User }>("/v1/auth/login", data);
    if (res.accessToken) setToken(res.accessToken);
    return res;
  },

  register: (data: RegisterRequest) =>
    api.post<{ message: string }>("/v1/auth/register", data),

  logout: async () => {
    try { await api.post("/v1/auth/logout"); } finally { removeToken(); }
  },

  me: () => api.get<User>("/v1/auth/me"),

  refreshToken: async () => {
    const res = await api.post<AuthTokens>("/v1/auth/refresh-token");
    if (res.accessToken) setToken(res.accessToken);
    return res;
  },

  forgotPassword: (email: string) =>
    api.post("/v1/auth/forgot-password", { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post("/v1/auth/reset-password", { token, newPassword }),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post("/v1/auth/change-password", { currentPassword, newPassword }),

  verifyEmail: (token: string) =>
    api.post("/v1/auth/verify-email", { token }),

  // ── MFA & Security ───────────────────────────────────────────────────────────

  setupMfa: () => api.post<{ secret: string; qrCodeUrl: string }>("/v1/auth/setup-mfa"),

  verifyMfa: (token: string) => api.post("/v1/auth/verify-mfa", { token }),

  setupTotp: () =>
    api.post<{ secret: string; qrCodeUri: string; backupCodes: string[] }>("/v1/security/mfa/totp/setup"),

  verifyTotp: (token: string) => api.post("/v1/security/mfa/totp/verify", { token }),

  enableEmailOtp: () => api.post("/v1/security/mfa/email/enable"),

  requestEmailOtp: () => api.post("/v1/security/mfa/email/request"),

  disableMfa: (data?: { confirmToken?: string; password?: string }) =>
    http("/v1/security/mfa", { method: "DELETE", body: data }),

  // ── Device Management ────────────────────────────────────────────────────────

  getDevices: () =>
    api.get<{ deviceId: string; name: string; userAgent: string; ip: string; isTrusted: boolean; isBlocked: boolean; lastSeenAt: string; createdAt: string }[]>("/v1/security/devices"),

  verifyDevice: (deviceId: string) => api.post(`/v1/security/devices/${deviceId}/verify`),

  blockDevice: (deviceId: string) => api.post(`/v1/security/devices/${deviceId}/block`),

  revokeDevice: (deviceId: string) => api.delete(`/v1/security/devices/${deviceId}`),
};
