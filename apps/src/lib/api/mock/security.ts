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
import { withSimulation } from "@/lib/store";
import type { OnboardingProfile, UserSecuritySettings } from "@/lib/auth/types";

export const securityService = {
  async getSettings(userId: string): Promise<UserSecuritySettings> {
    return withSimulation(() => getSecuritySettings(userId));
  },

  async updateSettings(
    userId: string,
    patch: Partial<Omit<UserSecuritySettings, "userId" | "backupCodes" | "updatedAt">>
  ): Promise<UserSecuritySettings> {
    return withSimulation(() => updateSecuritySettings(userId, patch));
  },

  async rotateBackupCodes(userId: string): Promise<UserSecuritySettings> {
    return withSimulation(() => rotateBackupCodes(userId));
  },

  async listSessions(userId: string) {
    return withSimulation(() => listSecuritySessions(userId));
  },

  async terminateSession(userId: string, sessionId: string) {
    return withSimulation(() => terminateSecuritySession(userId, sessionId));
  },

  async getOnboarding(userId: string) {
    return withSimulation(() => getOnboardingProfile(userId));
  },

  async isOnboardingComplete(userId: string): Promise<boolean> {
    return withSimulation(() => isOnboardingComplete(userId));
  },

  async saveOnboarding(userId: string, payload: Omit<OnboardingProfile, "userId" | "completedAt">) {
    return withSimulation(() =>
      saveOnboardingProfile({
        ...payload,
        userId,
        completedAt: new Date().toISOString(),
      })
    );
  },

  initializeForUser(userId: string, defaults?: Partial<UserSecuritySettings>) {
    initializeSecurityForUser(userId, defaults);
  },
};
