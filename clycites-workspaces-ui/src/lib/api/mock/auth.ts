import { CREDENTIAL_HINTS } from "@/lib/store/catalog";
import {
  findUserByEmail,
  login as loginStore,
  logout as logoutStore,
  registerAccount,
  resetUserPasswordByEmail,
  resolveSession,
  updateSessionWorkspace,
} from "@/lib/store";
import type { AuthProfileUpdatePayload, OtpPurpose, RegisterAccountPayload } from "@/lib/auth/types";
import { getSecuritySettings } from "@/lib/store/security";
import type { AuthSession, WorkspaceId } from "@/lib/store/types";

const SESSION_TOKEN_KEY = "clycites.session.token";
const MFA_DEMO_CODE = "123456";
const PASSWORD_RESET_DEMO_CODE = "654321";
const PASSWORD_RESET_KEY = "clycites.auth.password-reset";

interface PasswordResetChallenge {
  email: string;
  code: string;
  requestedAt: string;
  expiresAt: string;
}

function readPasswordResetState(): Record<string, PasswordResetChallenge> {
  if (!isBrowser()) return {};
  const raw = window.localStorage.getItem(PASSWORD_RESET_KEY);
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, PasswordResetChallenge>;
  } catch {
    return {};
  }
}

function writePasswordResetState(next: Record<string, PasswordResetChallenge>): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(PASSWORD_RESET_KEY, JSON.stringify(next));
}

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readToken(): string | null {
  if (!isBrowser()) return null;
  return window.localStorage.getItem(SESSION_TOKEN_KEY);
}

function writeToken(token: string): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(SESSION_TOKEN_KEY, token);
}

function clearToken(): void {
  if (!isBrowser()) return;
  window.localStorage.removeItem(SESSION_TOKEN_KEY);
}

export const authService = {
  async login(email: string, password: string): Promise<AuthSession> {
    const loginResult = await loginStore(email, password);
    writeToken(loginResult.token);
    return resolveSession(loginResult.token);
  },

  async requestLoginOtp(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      throw new Error("Email is required.");
    }
    // Mock adapter treats login OTP challenge as client-driven.
  },

  async verifyOtp(email: string, code: string, purpose: OtpPurpose): Promise<void> {
    const normalized = code.replace(/\s+/g, "");
    if (purpose === "password_reset") {
      const state = readPasswordResetState();
      const challenge = state[email.trim().toLowerCase()];
      if (!challenge || challenge.code !== normalized) {
        throw new Error("Invalid OTP code.");
      }
      return;
    }

    if (normalized !== MFA_DEMO_CODE) {
      throw new Error("Invalid OTP code.");
    }
  },

  async resendOtp(email: string, purpose: OtpPurpose): Promise<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      throw new Error("Email is required.");
    }

    if (purpose === "password_reset") {
      const user = findUserByEmail(normalized);
      if (!user) {
        return;
      }

      const state = readPasswordResetState();
      state[normalized] = {
        email: normalized,
        code: PASSWORD_RESET_DEMO_CODE,
        requestedAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
      };
      writePasswordResetState(state);
    }
  },

  async me(): Promise<AuthSession | null> {
    const token = readToken();
    if (!token) return null;

    try {
      return await resolveSession(token);
    } catch {
      clearToken();
      return null;
    }
  },

  async logout(actorId?: string): Promise<void> {
    const token = readToken();
    if (!token) return;

    try {
      await logoutStore(token, actorId ?? "system");
    } finally {
      clearToken();
    }
  },

  async updateMyProfile(payload: AuthProfileUpdatePayload): Promise<AuthSession> {
    const token = readToken();
    if (!token) {
      throw new Error("No active session token");
    }

    const session = await resolveSession(token);
    const firstName = payload.firstName?.trim() || "";
    const lastName = payload.lastName?.trim() || "";
    const nextName = `${firstName} ${lastName}`.trim() || session.user.name;

    return {
      ...session,
      user: {
        ...session.user,
        name: nextName,
      },
    };
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    if (!currentPassword.trim() || !newPassword.trim()) {
      throw new Error("Current and new passwords are required.");
    }

    const token = readToken();
    if (!token) {
      throw new Error("No active session token");
    }

    const session = await resolveSession(token);
    await resetUserPasswordByEmail(session.user.email, newPassword);
    clearToken();
  },

  async switchWorkspace(workspace: WorkspaceId): Promise<AuthSession> {
    const token = readToken();
    if (!token) {
      throw new Error("No active session token");
    }

    return updateSessionWorkspace(token, workspace);
  },

  getCredentials() {
    return CREDENTIAL_HINTS;
  },

  async register(payload: RegisterAccountPayload) {
    return registerAccount(payload);
  },

  async requestPasswordReset(email: string): Promise<void> {
    const normalized = email.trim().toLowerCase();
    if (!normalized) {
      throw new Error("Email is required.");
    }

    const user = findUserByEmail(normalized);
    if (!user) {
      return;
    }

    const state = readPasswordResetState();
    state[normalized] = {
      email: normalized,
      code: PASSWORD_RESET_DEMO_CODE,
      requestedAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 1000 * 60 * 15).toISOString(),
    };
    writePasswordResetState(state);
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    const normalizedEmail = email.trim().toLowerCase();
    const normalizedCode = code.trim();
    if (!normalizedEmail || !normalizedCode || !newPassword.trim()) {
      throw new Error("Email, reset code, and new password are required.");
    }
    if (newPassword.length < 12) {
      throw new Error("New password must be at least 12 characters.");
    }

    const state = readPasswordResetState();
    const challenge = state[normalizedEmail];
    if (!challenge) {
      throw new Error("No reset request found for this email.");
    }

    if (new Date(challenge.expiresAt).getTime() < Date.now()) {
      delete state[normalizedEmail];
      writePasswordResetState(state);
      throw new Error("Reset code has expired. Request a new code.");
    }

    if (challenge.code !== normalizedCode) {
      throw new Error("Invalid reset code.");
    }

    await resetUserPasswordByEmail(normalizedEmail, newPassword);
    delete state[normalizedEmail];
    writePasswordResetState(state);
  },

  getMfaPolicy(email: string) {
    const normalized = email.trim().toLowerCase();
    const user = findUserByEmail(normalized);
    const settings = user ? getSecuritySettings(user.id) : null;
    const requiresMfa = Boolean(settings?.mfaEnabled);
    const methodLabel = settings?.mfaMethod ?? "authenticator";

    return {
      requiresMfa,
      challengeHint: requiresMfa
        ? `Use your ${methodLabel} code (demo code: ${MFA_DEMO_CODE}).`
        : "MFA is currently disabled. Activate it after sign-in from Profile > Security.",
    };
  },

  async verifyMfaCode(_email: string, code: string): Promise<void> {
    const normalized = code.replace(/\s+/g, "");
    if (normalized !== MFA_DEMO_CODE) {
      throw new Error("Invalid MFA code.");
    }
  },

  hasToken(): boolean {
    return Boolean(readToken());
  },
};
