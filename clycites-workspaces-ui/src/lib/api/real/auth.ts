import type { RegisterAccountPayload, RegistrationAccountType } from "@/lib/auth/types";
import { ROLE_DEFINITIONS, WORKSPACES } from "@/lib/store/catalog";
import type { Permission, RoleId, WorkspaceId, AuthSession, UserAccount, Organization } from "@/lib/store/types";
import type { AuthServiceContract, MfaPolicy } from "@/lib/api/contracts";
import { apiRequest, ApiRequestError, clearTokens, getStoredTokens, storeTokens, unwrapApiData } from "@/lib/api/real/http";

const ACTIVE_WORKSPACE_KEY = "clycites.real.activeWorkspace";
const MFA_STATUS_CACHE_KEY = "clycites.real.mfa.status";
const MFA_REQUIRED_CODE = "MFA_REQUIRED";

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function readMfaStatusCache(): Record<string, boolean> {
  if (!isBrowser()) return {};
  const raw = window.localStorage.getItem(MFA_STATUS_CACHE_KEY);
  if (!raw) return {};

  try {
    return JSON.parse(raw) as Record<string, boolean>;
  } catch {
    return {};
  }
}

function writeMfaStatusCache(next: Record<string, boolean>): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(MFA_STATUS_CACHE_KEY, JSON.stringify(next));
}

function cacheMfaStatus(email: string, enabled: boolean): void {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return;
  const state = readMfaStatusCache();
  state[normalized] = enabled;
  writeMfaStatusCache(state);
}

function getCachedMfaStatus(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return false;
  return Boolean(readMfaStatusCache()[normalized]);
}

function setActiveWorkspace(workspace: WorkspaceId): void {
  if (!isBrowser()) return;
  window.localStorage.setItem(ACTIVE_WORKSPACE_KEY, workspace);
}

function getActiveWorkspace(): WorkspaceId | null {
  if (!isBrowser()) return null;
  const value = window.localStorage.getItem(ACTIVE_WORKSPACE_KEY);
  if (!value) return null;

  const allowed = new Set(WORKSPACES.map((workspace) => workspace.id));
  return allowed.has(value as WorkspaceId) ? (value as WorkspaceId) : null;
}

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim();
  if (!trimmed) {
    return { firstName: "ClyCites", lastName: "User" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: "User" };
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(" "),
  };
}

function roleForRegistration(accountType: RegistrationAccountType): "farmer" | "buyer" | "trader" | "expert" {
  return accountType === "sole" ? "farmer" : "trader";
}

function parseRoleIds(source: unknown): RoleId[] {
  if (!Array.isArray(source)) return [];

  const knownRoles = new Set<RoleId>(Object.keys(ROLE_DEFINITIONS) as RoleId[]);
  return source
    .map((value) => (typeof value === "string" ? value : ""))
    .filter((value): value is RoleId => knownRoles.has(value as RoleId));
}

function permissionsFromRoles(roles: RoleId[]): Permission[] {
  const permissionSet = new Set<Permission>();
  roles.forEach((role) => {
    ROLE_DEFINITIONS[role]?.permissions.forEach((permission) => permissionSet.add(permission));
  });
  return [...permissionSet];
}

function normalizeWorkspaceModules(input: unknown): WorkspaceId[] {
  if (!Array.isArray(input)) {
    return WORKSPACES.map((workspace) => workspace.id);
  }

  const valid = new Set<WorkspaceId>(WORKSPACES.map((workspace) => workspace.id));
  const mapped = input
    .map((value) => (typeof value === "string" ? value : ""))
    .filter((value): value is WorkspaceId => valid.has(value as WorkspaceId));

  return mapped.length > 0 ? mapped : WORKSPACES.map((workspace) => workspace.id);
}

function normalizeOrganization(raw: Record<string, unknown> | undefined): Organization {
  return {
    id: String(raw?.id ?? "org-real"),
    name: String(raw?.name ?? raw?.orgName ?? "ClyCites Organization"),
    enabledModules: normalizeWorkspaceModules(raw?.enabledModules),
  };
}

function normalizeUser(raw: Record<string, unknown>, organization: Organization): Omit<UserAccount, "password"> {
  const roles = parseRoleIds(raw.roles);
  const permissionSource = raw.permissions;
  const permissions =
    Array.isArray(permissionSource) && permissionSource.every((item) => typeof item === "string")
      ? (permissionSource as Permission[])
      : permissionsFromRoles(roles.length > 0 ? roles : ["org_admin"]);

  const firstName = typeof raw.firstName === "string" ? raw.firstName : "ClyCites";
  const lastName = typeof raw.lastName === "string" ? raw.lastName : "User";

  return {
    id: String(raw.id ?? raw.userId ?? raw._id ?? "user-real"),
    name: String(raw.name ?? `${firstName} ${lastName}`.trim()),
    email: String(raw.email ?? "user@clycites.com"),
    orgId: String(raw.orgId ?? raw.organizationId ?? organization.id),
    roles: roles.length > 0 ? roles : ["org_admin"],
    permissions,
    createdAt: String(raw.createdAt ?? new Date().toISOString()),
    updatedAt: String(raw.updatedAt ?? new Date().toISOString()),
  };
}

function normalizeSessionFromMe(payload: unknown): AuthSession {
  const data = unwrapApiData<Record<string, unknown>>(payload);
  const dataAsRecord = data && typeof data === "object" ? data : {};

  const nestedUser = dataAsRecord.user;
  const rawUser = nestedUser && typeof nestedUser === "object" ? (nestedUser as Record<string, unknown>) : dataAsRecord;
  const nestedOrg = dataAsRecord.organization;
  const rawOrg = nestedOrg && typeof nestedOrg === "object" ? (nestedOrg as Record<string, unknown>) : undefined;

  const organization = normalizeOrganization(rawOrg);
  const user = normalizeUser(rawUser, organization);
  const mfaEnabled = typeof rawUser.isMfaEnabled === "boolean" ? rawUser.isMfaEnabled : undefined;
  if (typeof mfaEnabled === "boolean") {
    cacheMfaStatus(user.email, mfaEnabled);
  }

  const preferred = getActiveWorkspace();
  const activeWorkspace = preferred && organization.enabledModules.includes(preferred)
    ? preferred
    : organization.enabledModules[0] ?? "farmer";

  setActiveWorkspace(activeWorkspace);

  const tokens = getStoredTokens();
  return {
    token: tokens?.accessToken ?? "",
    user,
    organization,
    activeWorkspace,
  };
}

async function fetchSession(): Promise<AuthSession | null> {
  const tokens = getStoredTokens();
  if (!tokens?.accessToken) return null;

  try {
    const payload = await apiRequest<unknown>("/api/v1/auth/me", { method: "GET" }, { auth: true });
    return normalizeSessionFromMe(payload);
  } catch {
    return null;
  }
}

async function sendOtpForLogin(email: string): Promise<void> {
  await apiRequest<unknown>(
    "/api/v1/auth/resend-otp",
    {
      method: "POST",
      body: JSON.stringify({ email, purpose: "login" }),
    },
    { auth: false }
  );
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function asNonEmptyString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value : undefined;
}

function asText(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function parseLoginTokens(payload: unknown): { accessToken?: string; refreshToken?: string } {
  const root = asRecord(payload) ?? {};
  const data = asRecord(unwrapApiData<Record<string, unknown>>(payload)) ?? {};
  const nestedTokens = asRecord(data.tokens) ?? asRecord(root.tokens);

  const accessToken =
    asNonEmptyString(nestedTokens?.accessToken) ??
    asNonEmptyString(data.accessToken) ??
    asNonEmptyString(data.token) ??
    asNonEmptyString(root.accessToken) ??
    asNonEmptyString(root.token);

  const refreshToken =
    asNonEmptyString(nestedTokens?.refreshToken) ??
    asNonEmptyString(data.refreshToken) ??
    asNonEmptyString(root.refreshToken);

  return { accessToken, refreshToken };
}

function normalizeSessionFromLoginPayload(payload: unknown, token: string): AuthSession | null {
  const root = asRecord(payload) ?? {};
  const data = asRecord(unwrapApiData<Record<string, unknown>>(payload)) ?? {};

  const userRecord = asRecord(data.user) ?? asRecord(root.user) ?? data;
  if (!userRecord) return null;

  const organizationRecord = asRecord(data.organization) ?? asRecord(root.organization) ?? undefined;
  const organization = normalizeOrganization(organizationRecord);
  const user = normalizeUser(userRecord, organization);

  const preferred = getActiveWorkspace();
  const activeWorkspace =
    preferred && organization.enabledModules.includes(preferred)
      ? preferred
      : organization.enabledModules[0] ?? "farmer";

  setActiveWorkspace(activeWorkspace);

  return {
    token,
    user,
    organization,
    activeWorkspace,
  };
}

function hasMfaFlag(record: Record<string, unknown>): boolean {
  const flags = [
    record.requiresMfa,
    record.mfaRequired,
    record.requiresOtp,
    record.otpRequired,
    record.twoFactorRequired,
  ];
  if (flags.some((value) => value === true)) return true;

  const nextAction = asText(record.nextAction);
  const nextStep = asText(record.nextStep);
  const status = asText(record.status);
  const challenge = asText(record.challenge);

  return (
    nextAction.includes("otp") ||
    nextAction.includes("mfa") ||
    nextStep.includes("otp") ||
    nextStep.includes("mfa") ||
    status.includes("otp") ||
    status.includes("mfa") ||
    challenge.includes("otp") ||
    challenge.includes("mfa")
  );
}

function payloadRequiresMfa(payload: unknown): boolean {
  const root = asRecord(payload);
  if (!root) return false;
  if (hasMfaFlag(root)) return true;

  const data = asRecord(root.data);
  if (data && hasMfaFlag(data)) return true;

  const error = asRecord(root.error);
  if (error && hasMfaFlag(error)) return true;

  return false;
}

function isMfaChallengeError(error: ApiRequestError): boolean {
  const code = asText(error.code);
  const message = asText(error.message);
  const details = asRecord(error.details);

  if (code.includes("mfa") || code.includes("otp")) return true;
  if (message.includes("mfa") || message.includes("otp") || message.includes("one-time")) return true;

  if (details) {
    const detailsCode = asText(details.code) || asText(details.errorCode) || asText(details.error);
    const detailsMessage = asText(details.message) || asText(asRecord(details.error)?.message);
    if (detailsCode.includes("mfa") || detailsCode.includes("otp")) return true;
    if (detailsMessage.includes("mfa") || detailsMessage.includes("otp") || detailsMessage.includes("one-time")) return true;
    if (payloadRequiresMfa(details)) return true;
  }

  return false;
}

function createMfaRequiredError(email: string): Error & { code: string; email: string } {
  const error = new Error("Multi-factor verification is required to continue.") as Error & { code: string; email: string };
  error.name = "AuthMfaRequiredError";
  error.code = MFA_REQUIRED_CODE;
  error.email = email.trim().toLowerCase();
  return error;
}

export const authService: AuthServiceContract = {
  async login(email: string, password: string): Promise<AuthSession> {
    let payload: unknown;
    try {
      payload = await apiRequest<unknown>(
        "/api/v1/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
        { auth: false }
      );
    } catch (error) {
      if (error instanceof ApiRequestError && isMfaChallengeError(error)) {
        cacheMfaStatus(email, true);
        try {
          await sendOtpForLogin(email);
        } catch {
          // Best effort; backend may already issue OTP during login challenge.
        }
        throw createMfaRequiredError(email);
      }
      throw error;
    }

    const data = unwrapApiData<Record<string, unknown>>(payload);
    const dataAsRecord = data && typeof data === "object" ? data : {};

    const { accessToken, refreshToken } = parseLoginTokens(payload);
    const payloadUser = dataAsRecord.user;
    const userRecord = payloadUser && typeof payloadUser === "object" ? (payloadUser as Record<string, unknown>) : dataAsRecord;
    const payloadSecurity =
      dataAsRecord.security && typeof dataAsRecord.security === "object"
        ? (dataAsRecord.security as Record<string, unknown>)
        : undefined;
    const mfaEnabled =
      typeof payloadSecurity?.isMfaEnabled === "boolean"
        ? payloadSecurity.isMfaEnabled
        : typeof userRecord.isMfaEnabled === "boolean"
          ? userRecord.isMfaEnabled
          : undefined;
    if (typeof mfaEnabled === "boolean") {
      cacheMfaStatus(email, mfaEnabled);
    }

    if (payloadRequiresMfa(payload) && !accessToken) {
      cacheMfaStatus(email, true);
      try {
        await sendOtpForLogin(email);
      } catch {
        // Best effort.
      }
      throw createMfaRequiredError(email);
    }

    if (accessToken) {
      storeTokens({ accessToken, refreshToken: refreshToken || undefined });
    }

    const session = await fetchSession();
    if (session) {
      return session;
    }

    if (accessToken) {
      const fallbackSession = normalizeSessionFromLoginPayload(payload, accessToken);
      if (fallbackSession) {
        return fallbackSession;
      }
    }

    throw new Error("Login succeeded but no active session could be resolved.");
  },

  async requestLoginOtp(email: string): Promise<void> {
    await sendOtpForLogin(email);
    cacheMfaStatus(email, true);
  },

  async me(): Promise<AuthSession | null> {
    return fetchSession();
  },

  async logout(): Promise<void> {
    try {
      await apiRequest<unknown>("/api/v1/auth/logout", { method: "POST" }, { auth: true });
    } catch {
      // Ignore remote logout failures; local cleanup still happens.
    } finally {
      clearTokens();
      if (isBrowser()) {
        window.localStorage.removeItem(ACTIVE_WORKSPACE_KEY);
      }
    }
  },

  async switchWorkspace(workspace: WorkspaceId): Promise<AuthSession> {
    setActiveWorkspace(workspace);
    const session = await fetchSession();
    if (!session) {
      throw new Error("No active session");
    }

    return {
      ...session,
      activeWorkspace: workspace,
    };
  },

  getCredentials() {
    return [];
  },

  async register(payload: RegisterAccountPayload) {
    const names = splitName(payload.fullName);

    const body = {
      firstName: names.firstName,
      lastName: names.lastName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: roleForRegistration(payload.accountType),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || "Africa/Kampala",
      language: "en",
      profile: {
        displayName: payload.fullName,
        nationality: payload.country,
        address: {
          city: payload.region,
          country: payload.country,
        },
        preferences: {
          preferredContactMethod: "email",
        },
      },
    };

    const response = await apiRequest<unknown>(
      "/api/v1/auth/register",
      {
        method: "POST",
        body: JSON.stringify(body),
      },
      { auth: false }
    );

    const data = unwrapApiData<Record<string, unknown>>(response);
    const dataAsRecord = data && typeof data === "object" ? data : {};

    return {
      userId: String(dataAsRecord.userId ?? dataAsRecord.id ?? payload.email),
      accountType: payload.accountType,
      email: payload.email,
    };
  },

  async requestPasswordReset(email: string): Promise<void> {
    await apiRequest<unknown>(
      "/api/v1/auth/forgot-password",
      {
        method: "POST",
        body: JSON.stringify({ email }),
      },
      { auth: false }
    );
  },

  async resetPassword(email: string, code: string, newPassword: string): Promise<void> {
    await apiRequest<unknown>(
      "/api/v1/auth/reset-password",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
          newPassword,
        }),
      },
      { auth: false }
    );
  },

  getMfaPolicy(email: string): MfaPolicy {
    const requiresMfa = getCachedMfaStatus(email);
    return {
      requiresMfa,
      challengeHint: requiresMfa
        ? "Enter the one-time code for your activated MFA method."
        : "MFA is not active on this account. Enable it from Profile > Security after sign-in.",
    };
  },

  async verifyMfaCode(email: string, code: string): Promise<void> {
    if (!code.trim()) {
      throw new Error("MFA code is required.");
    }

    await apiRequest<unknown>(
      "/api/v1/auth/verify-otp",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          code,
          purpose: "login",
        }),
      },
      { auth: false }
    );
  },

  hasToken(): boolean {
    return Boolean(getStoredTokens()?.accessToken);
  },
};
