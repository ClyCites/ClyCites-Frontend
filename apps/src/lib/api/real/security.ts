import type { OnboardingProfile, UserSecuritySettings } from "@/lib/auth/types";
import type { SecurityServiceContract } from "@/lib/api/contracts";
import { apiRequest, unwrapApiData } from "@/lib/api/real/http";
import {
  getOnboardingProfile,
  getSecuritySettings,
  initializeSecurityForUser,
  isOnboardingComplete,
  listSecuritySessions,
  rotateBackupCodes,
  saveOnboardingProfile,
  terminateSecuritySession,
  updateSecuritySettings,
} from "@/lib/store/security";

function normalizeSettings(local: UserSecuritySettings): UserSecuritySettings {
  return {
    ...local,
    updatedAt: new Date().toISOString(),
  };
}

export const securityService: SecurityServiceContract = {
  async getSettings(userId: string): Promise<UserSecuritySettings> {
    const local = getSecuritySettings(userId);

    try {
      await apiRequest<unknown>("/api/v1/security/devices", { method: "GET" }, { auth: true });
      return normalizeSettings(local);
    } catch {
      return local;
    }
  },

  async updateSettings(
    userId: string,
    patch: Partial<Omit<UserSecuritySettings, "userId" | "backupCodes" | "updatedAt">>
  ): Promise<UserSecuritySettings> {
    const next = updateSecuritySettings(userId, patch);

    try {
      if (patch.mfaEnabled === false) {
        await apiRequest<unknown>(
          "/api/v1/security/mfa",
          {
            method: "DELETE",
            body: JSON.stringify({
              confirmToken: next.backupCodes[0] ?? "000000",
            }),
          },
          { auth: true }
        );
      }

      if (patch.mfaEnabled) {
        if (patch.mfaMethod === "email") {
          await apiRequest<unknown>("/api/v1/security/mfa/email/enable", { method: "POST" }, { auth: true });
          await apiRequest<unknown>("/api/v1/security/mfa/email/request", { method: "POST" }, { auth: true });
        }

        if (patch.mfaMethod === "authenticator") {
          await apiRequest<unknown>("/api/v1/security/mfa/totp/setup", { method: "POST" }, { auth: true });
        }
      }
    } catch {
      // Keep local settings updated even if remote endpoints are unavailable.
    }

    return next;
  },

  async rotateBackupCodes(userId: string): Promise<UserSecuritySettings> {
    let next = rotateBackupCodes(userId);

    try {
      const payload = await apiRequest<unknown>("/api/v1/security/mfa/totp/setup", { method: "POST" }, { auth: true });
      const data = unwrapApiData<Record<string, unknown>>(payload);
      const backupCodes = Array.isArray(data.backupCodes)
        ? data.backupCodes.filter((item): item is string => typeof item === "string")
        : [];

      if (backupCodes.length > 0) {
        next = updateSecuritySettings(userId, {
          mfaEnabled: true,
          mfaMethod: "authenticator",
          passkeyEnabled: next.passkeyEnabled,
          loginAlerts: next.loginAlerts,
          trustedDevicesOnly: next.trustedDevicesOnly,
        });
        next = {
          ...next,
          backupCodes,
        };
      }
    } catch {
      // Local backup code rotation has already been completed.
    }

    return next;
  },

  async listSessions(userId: string) {
    try {
      const payload = await apiRequest<unknown>("/api/v1/security/devices", { method: "GET" }, { auth: true });
      const data = unwrapApiData<Record<string, unknown>>(payload);
      const rows = Array.isArray(data.data) ? data.data : [];

      return rows
        .map((item) => {
          if (!item || typeof item !== "object") return null;
          const row = item as Record<string, unknown>;
          return {
            id: String(row.deviceId ?? row.id ?? "unknown"),
            userId,
            device: String(row.name ?? row.userAgent ?? "Unknown device"),
            location: String(row.location ?? "Unknown location"),
            ipAddress: String(row.ip ?? row.ipAddress ?? "0.0.0.0"),
            lastSeenAt: String(row.lastSeenAt ?? new Date().toISOString()),
            createdAt: String(row.createdAt ?? new Date().toISOString()),
            current: Boolean(row.isCurrent),
            trusted: Boolean(row.isTrusted),
          };
        })
        .filter((item): item is NonNullable<typeof item> => Boolean(item));
    } catch {
      return listSecuritySessions(userId);
    }
  },

  async terminateSession(userId: string, sessionId: string) {
    try {
      await apiRequest<unknown>(`/api/v1/security/devices/${encodeURIComponent(sessionId)}/block`, { method: "POST" }, { auth: true });
    } catch {
      // Fallback to local session termination.
    }

    return terminateSecuritySession(userId, sessionId);
  },

  async getOnboarding(userId: string) {
    return getOnboardingProfile(userId);
  },

  async isOnboardingComplete(userId: string): Promise<boolean> {
    return isOnboardingComplete(userId);
  },

  async saveOnboarding(userId: string, payload: Omit<OnboardingProfile, "userId" | "completedAt">) {
    return saveOnboardingProfile({
      ...payload,
      userId,
      completedAt: new Date().toISOString(),
    });
  },

  initializeForUser(userId: string, defaults?: Partial<UserSecuritySettings>) {
    initializeSecurityForUser(userId, defaults);
  },
};
