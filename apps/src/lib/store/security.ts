import type {
  MfaMethod,
  OnboardingProfile,
  SecuritySession,
  SecurityState,
  UserSecuritySettings,
} from "@/lib/auth/types";

const STORAGE_KEY = "clycites.security.v1";

let memoryState: SecurityState | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function nowIso(): string {
  return new Date().toISOString();
}

function randomId(prefix: string): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

function createDefaultState(): SecurityState {
  return {
    version: 1,
    onboarding: {},
    settings: {},
    sessions: {},
  };
}

function loadState(): SecurityState {
  if (memoryState) return memoryState;

  if (!isBrowser()) {
    memoryState = createDefaultState();
    return memoryState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    memoryState = createDefaultState();
    return memoryState;
  }

  try {
    memoryState = JSON.parse(raw) as SecurityState;
    return memoryState;
  } catch {
    memoryState = createDefaultState();
    return memoryState;
  }
}

function persistState(state: SecurityState): void {
  memoryState = state;
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveWithMutation<T>(mutate: (state: SecurityState) => T): T {
  const state = loadState();
  const result = mutate(state);
  persistState(state);
  return result;
}

function generateBackupCodes(): string[] {
  return Array.from({ length: 8 }).map(() => Math.random().toString(36).slice(2, 10).toUpperCase());
}

function defaultSettings(userId: string): UserSecuritySettings {
  return {
    userId,
    mfaEnabled: false,
    mfaMethod: "authenticator",
    passkeyEnabled: false,
    loginAlerts: true,
    trustedDevicesOnly: false,
    backupCodes: generateBackupCodes(),
    updatedAt: nowIso(),
  };
}

function defaultSessions(userId: string): SecuritySession[] {
  const now = nowIso();
  return [
    {
      id: randomId("sess"),
      userId,
      device: "Current browser session",
      location: "Kampala, UG",
      ipAddress: "102.90.14.18",
      createdAt: now,
      lastSeenAt: now,
      current: true,
      trusted: true,
    },
    {
      id: randomId("sess"),
      userId,
      device: "Mobile app",
      location: "Entebbe, UG",
      ipAddress: "102.88.22.73",
      createdAt: now,
      lastSeenAt: now,
      current: false,
      trusted: false,
    },
  ];
}

export function getSecuritySettings(userId: string): UserSecuritySettings {
  return saveWithMutation((state) => {
    if (!state.settings[userId]) {
      state.settings[userId] = defaultSettings(userId);
    }

    return deepClone(state.settings[userId]);
  });
}

export function updateSecuritySettings(
  userId: string,
  patch: Partial<Omit<UserSecuritySettings, "userId" | "backupCodes" | "updatedAt">> & {
    mfaMethod?: MfaMethod;
  }
): UserSecuritySettings {
  return saveWithMutation((state) => {
    const current = state.settings[userId] ?? defaultSettings(userId);
    state.settings[userId] = {
      ...current,
      ...patch,
      updatedAt: nowIso(),
      userId,
      backupCodes: current.backupCodes,
    };

    return deepClone(state.settings[userId]);
  });
}

export function rotateBackupCodes(userId: string): UserSecuritySettings {
  return saveWithMutation((state) => {
    const current = state.settings[userId] ?? defaultSettings(userId);
    state.settings[userId] = {
      ...current,
      backupCodes: generateBackupCodes(),
      updatedAt: nowIso(),
    };

    return deepClone(state.settings[userId]);
  });
}

export function listSecuritySessions(userId: string): SecuritySession[] {
  return saveWithMutation((state) => {
    if (!state.sessions[userId] || state.sessions[userId].length === 0) {
      state.sessions[userId] = defaultSessions(userId);
    }

    return deepClone(state.sessions[userId]);
  });
}

export function terminateSecuritySession(userId: string, sessionId: string): SecuritySession[] {
  return saveWithMutation((state) => {
    if (!state.sessions[userId]) {
      state.sessions[userId] = defaultSessions(userId);
    }

    state.sessions[userId] = state.sessions[userId].filter((session) => session.id !== sessionId || session.current);
    return deepClone(state.sessions[userId]);
  });
}

export function getOnboardingProfile(userId: string): OnboardingProfile | null {
  const state = loadState();
  const profile = state.onboarding[userId];
  return profile ? deepClone(profile) : null;
}

export function saveOnboardingProfile(profile: OnboardingProfile): OnboardingProfile {
  return saveWithMutation((state) => {
    state.onboarding[profile.userId] = profile;
    return deepClone(profile);
  });
}

export function isOnboardingComplete(userId: string): boolean {
  return Boolean(loadState().onboarding[userId]);
}

export function initializeSecurityForUser(userId: string, defaults?: Partial<UserSecuritySettings>): void {
  saveWithMutation((state) => {
    if (!state.settings[userId]) {
      state.settings[userId] = {
        ...defaultSettings(userId),
        ...defaults,
        userId,
        updatedAt: nowIso(),
        backupCodes: defaults?.backupCodes ?? generateBackupCodes(),
      };
    }

    if (!state.sessions[userId] || state.sessions[userId].length === 0) {
      state.sessions[userId] = defaultSessions(userId);
    }
  });
}
