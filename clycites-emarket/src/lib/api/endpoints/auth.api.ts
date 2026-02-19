import { api, setToken, removeToken } from "../http";
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
};
