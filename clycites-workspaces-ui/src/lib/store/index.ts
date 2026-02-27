import {
  ENTITY_DEFINITIONS,
  SEARCHABLE_ENTITIES,
  WORKSPACE_ENTITY_MAP,
  WORKSPACES,
  getEntityDefinition,
} from "@/lib/store/catalog";
import { createSeedState } from "@/lib/store/seed";
import type { RegisterAccountPayload, RegistrationResult } from "@/lib/auth/types";
import { initializeSecurityForUser } from "@/lib/store/security";
import type {
  AuditFilterParams,
  AuditRecord,
  AuthSession,
  DatabaseState,
  EntityKey,
  EntityRecord,
  ListParams,
  ListResult,
  LoginResponse,
  NotificationFilterParams,
  Organization,
  Permission,
  RoleId,
  SessionRecord,
  UserAccount,
  WorkspaceId,
} from "@/lib/store/types";

const STORAGE_KEY = "clycites.mock.store.v1";

let memoryState: DatabaseState | null = null;

function isBrowser(): boolean {
  return typeof window !== "undefined";
}

function deepClone<T>(value: T): T {
  if (typeof structuredClone === "function") {
    return structuredClone(value);
  }
  return JSON.parse(JSON.stringify(value)) as T;
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

function loadState(): DatabaseState {
  if (memoryState) return memoryState;

  if (!isBrowser()) {
    memoryState = createSeedState();
    return memoryState;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    memoryState = createSeedState();
    return memoryState;
  }

  try {
    const parsed = JSON.parse(raw) as DatabaseState;
    memoryState = parsed;
    return memoryState;
  } catch {
    memoryState = createSeedState();
    return memoryState;
  }
}

function persistState(state: DatabaseState): void {
  memoryState = state;
  if (!isBrowser()) return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function saveWithMutation<T>(mutate: (state: DatabaseState) => T): T {
  const state = loadState();
  const result = mutate(state);
  persistState(state);
  return result;
}

export function resetStore(): void {
  memoryState = createSeedState();
  if (isBrowser()) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(memoryState));
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export class MockApiError extends Error {
  code: string;

  constructor(message: string, code = "MOCK_API_ERROR") {
    super(message);
    this.name = "MockApiError";
    this.code = code;
  }
}

export async function withSimulation<T>(operation: () => T | Promise<T>, forceError = false): Promise<T> {
  const state = loadState();
  const runtime = state.runtime;
  const jitter = Math.round(Math.random() * runtime.jitterMs);
  await delay(runtime.latencyMs + jitter);

  const shouldFail = forceError || (runtime.enableRandomErrors && Math.random() < runtime.errorRate);
  if (shouldFail) {
    throw new MockApiError("Simulated backend failure. Retry the operation.", "SIMULATED_FAILURE");
  }

  return operation();
}

function compareValues(a: unknown, b: unknown): number {
  if (a === b) return 0;
  if (a === null || a === undefined) return -1;
  if (b === null || b === undefined) return 1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b));
}

function readPath(source: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = source;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function matchesDateRange(value: string, from?: string, to?: string): boolean {
  const target = new Date(value).getTime();
  if (Number.isNaN(target)) return false;
  if (from) {
    const fromTime = new Date(from).getTime();
    if (!Number.isNaN(fromTime) && target < fromTime) return false;
  }
  if (to) {
    const toTime = new Date(to).getTime();
    if (!Number.isNaN(toTime) && target > toTime) return false;
  }
  return true;
}

function matchesEntityFilters(record: EntityRecord, params?: ListParams): boolean {
  const filters = params?.filters;
  if (!filters) return true;

  if (filters.text) {
    const needle = filters.text.toLowerCase();
    const haystack = [record.title, record.subtitle ?? "", record.status, record.tags.join(" "), JSON.stringify(record.data)]
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(needle)) {
      return false;
    }
  }

  if (filters.status && filters.status.length > 0 && !filters.status.includes(record.status)) {
    return false;
  }

  if (filters.tags && filters.tags.length > 0) {
    const tagsSet = new Set(record.tags);
    const hasAll = filters.tags.every((tag) => tagsSet.has(tag));
    if (!hasAll) return false;
  }

  if (filters.dateRange && !matchesDateRange(record.createdAt, filters.dateRange.from, filters.dateRange.to)) {
    return false;
  }

  return true;
}

function paginate<T>(items: T[], page: number, pageSize: number): ListResult<T> {
  const currentPage = Math.max(page, 1);
  const currentSize = Math.max(pageSize, 1);
  const start = (currentPage - 1) * currentSize;
  const paged = items.slice(start, start + currentSize);

  return {
    items: paged,
    pagination: {
      page: currentPage,
      pageSize: currentSize,
      total: items.length,
    },
  };
}

function appendAudit(
  state: DatabaseState,
  payload: {
    actorId: string;
    action: AuditRecord["action"];
    entityType: string;
    entityId: string;
    workspace?: WorkspaceId;
    summary: string;
    fromStatus?: string;
    toStatus?: string;
    metadata?: Record<string, unknown>;
  }
): void {
  const timestamp = nowIso();
  state.auditLogs.unshift({
    id: randomId("audit"),
    actorId: payload.actorId,
    action: payload.action,
    entityType: payload.entityType,
    entityId: payload.entityId,
    workspace: payload.workspace,
    summary: payload.summary,
    fromStatus: payload.fromStatus,
    toStatus: payload.toStatus,
    metadata: payload.metadata,
    tags: [payload.entityType, payload.action],
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: payload.actorId,
    updatedBy: payload.actorId,
  });
}

function appendNotification(
  state: DatabaseState,
  payload: {
    actorId: string;
    title: string;
    message: string;
    workspace?: WorkspaceId;
    link?: string;
    severity?: "info" | "success" | "warning" | "error";
    entityType?: string;
    entityId?: string;
  }
): void {
  const timestamp = nowIso();
  state.notifications.unshift({
    id: randomId("notif"),
    title: payload.title,
    message: payload.message,
    read: false,
    severity: payload.severity ?? "info",
    link: payload.link,
    workspace: payload.workspace,
    entityType: payload.entityType,
    entityId: payload.entityId,
    tags: [payload.workspace ?? "global"],
    createdAt: timestamp,
    updatedAt: timestamp,
    createdBy: payload.actorId,
    updatedBy: payload.actorId,
  });
}

function sanitizeUser(user: UserAccount): Omit<UserAccount, "password"> {
  const { password, ...safeUser } = user;
  void password;
  return safeUser;
}

function getUserById(state: DatabaseState, userId: string): UserAccount {
  const user = state.users.find((candidate) => candidate.id === userId);
  if (!user) throw new MockApiError("User not found", "USER_NOT_FOUND");
  return user;
}

function getOrganization(state: DatabaseState, orgId: string): Organization {
  const organization = state.organizations.find((candidate) => candidate.id === orgId);
  if (!organization) throw new MockApiError("Organization not found", "ORG_NOT_FOUND");
  return organization;
}

function permissionsFromRoles(state: DatabaseState, roles: RoleId[]): Permission[] {
  const permissionSet = new Set<Permission>();
  roles.forEach((roleId) => {
    const role = state.roles.find((candidate) => candidate.id === roleId);
    role?.permissions.forEach((permission) => permissionSet.add(permission));
  });
  return [...permissionSet];
}

function findWorkspaceForEntity(entityKey: EntityKey): WorkspaceId {
  const workspace = (Object.keys(WORKSPACE_ENTITY_MAP) as WorkspaceId[]).find((key) =>
    WORKSPACE_ENTITY_MAP[key].includes(entityKey)
  );
  return workspace ?? "admin";
}

export function getRuntimeConfig() {
  return deepClone(loadState().runtime);
}

export async function updateRuntimeConfig(actorId: string, patch: Partial<DatabaseState["runtime"]>) {
  return withSimulation(() =>
    saveWithMutation((state) => {
      state.runtime = {
        ...state.runtime,
        ...patch,
      };

      appendAudit(state, {
        actorId,
        action: "update",
        entityType: "runtime",
        entityId: "runtime",
        workspace: "admin",
        summary: "Updated mock runtime simulation settings",
        metadata: patch,
      });

      return deepClone(state.runtime);
    })
  );
}

export async function listEntities<K extends EntityKey>(entityKey: K, params: ListParams): Promise<ListResult<EntityRecord<K>>> {
  return withSimulation(() => {
    const state = loadState();
    const records = (state.entities[entityKey] ?? []) as EntityRecord<K>[];

    const filtered = records.filter((record) => matchesEntityFilters(record, params));
    const sorted = [...filtered].sort((left, right) => {
      const field = params.sort?.field ?? "updatedAt";
      const direction = params.sort?.direction ?? "desc";
      const leftValue = readPath(left as unknown as Record<string, unknown>, field);
      const rightValue = readPath(right as unknown as Record<string, unknown>, field);
      const compared = compareValues(leftValue, rightValue);
      return direction === "asc" ? compared : -compared;
    });

    return paginate(sorted, params.pagination.page, params.pagination.pageSize);
  });
}

export async function getEntity<K extends EntityKey>(entityKey: K, id: string): Promise<EntityRecord<K>> {
  return withSimulation(() => {
    const state = loadState();
    const record = state.entities[entityKey].find((item) => item.id === id) as EntityRecord<K> | undefined;
    if (!record) throw new MockApiError("Entity not found", "NOT_FOUND");
    return deepClone(record);
  });
}

function syncAdminEntitySideEffects<K extends EntityKey>(state: DatabaseState, entityKey: K, record: EntityRecord<K>): void {
  if (entityKey === "users") {
    const data = record.data as unknown as {
      name?: string;
      email?: string;
      orgId?: string;
      roles?: RoleId[] | string;
    };

    const existing = state.users.find((user) => user.id === record.id);
    const roles: RoleId[] = Array.isArray(data.roles)
      ? data.roles as RoleId[]
      : typeof data.roles === "string"
        ? data.roles.split(",").map((item) => item.trim()).filter(Boolean) as RoleId[]
        : ["farmer_agent"];

    const permissionSet = new Set<Permission>();
    roles.forEach((role) => {
      const roleDefinition = state.roles.find((candidate) => candidate.id === role);
      roleDefinition?.permissions.forEach((permission) => permissionSet.add(permission));
    });

    if (existing) {
      existing.name = data.name ?? existing.name;
      existing.email = data.email ?? existing.email;
      existing.orgId = data.orgId ?? existing.orgId;
      existing.roles = roles;
      existing.permissions = [...permissionSet];
      existing.updatedAt = nowIso();
    } else {
      state.users.push({
        id: record.id,
        name: data.name ?? record.title,
        email: data.email ?? `${record.id}@clycites.io`,
        password: "change-me",
        orgId: data.orgId ?? state.organizations[0]?.id ?? "org-1",
        roles,
        permissions: [...permissionSet],
        createdAt: nowIso(),
        updatedAt: nowIso(),
      });
    }
  }

  if (entityKey === "orgs") {
    const data = record.data as unknown as { name?: string; enabledModules?: WorkspaceId[] | string };
    const existing = state.organizations.find((org) => org.id === record.id);
    const enabledModules = Array.isArray(data.enabledModules)
      ? data.enabledModules
      : typeof data.enabledModules === "string"
        ? data.enabledModules.split(",").map((item) => item.trim()).filter(Boolean) as WorkspaceId[]
        : WORKSPACES.map((workspace) => workspace.id);

    if (existing) {
      existing.name = data.name ?? existing.name;
      existing.enabledModules = enabledModules;
    } else {
      state.organizations.push({
        id: record.id,
        name: data.name ?? record.title,
        enabledModules,
      });
    }
  }
}

export async function createEntity<K extends EntityKey>(
  entityKey: K,
  payload: {
    actorId: string;
    title: string;
    subtitle?: string;
    status?: string;
    tags?: string[];
    data: EntityRecord<K>["data"];
  }
): Promise<EntityRecord<K>> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const definition = ENTITY_DEFINITIONS[entityKey];
      const workspace = findWorkspaceForEntity(entityKey);
      const timestamp = nowIso();
      const record: EntityRecord<K> = {
        id: randomId(entityKey),
        entity: entityKey,
        workspace,
        title: payload.title,
        subtitle: payload.subtitle,
        status: payload.status ?? definition.defaultStatus,
        data: payload.data,
        tags: payload.tags ?? [workspace],
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: payload.actorId,
        updatedBy: payload.actorId,
      };

      (state.entities[entityKey] as EntityRecord<K>[]).unshift(record);
      syncAdminEntitySideEffects(state, entityKey, record);

      appendAudit(state, {
        actorId: payload.actorId,
        action: "create",
        entityType: entityKey,
        entityId: record.id,
        workspace,
        summary: `Created ${entityKey} record ${record.title}`,
      });

      appendNotification(state, {
        actorId: payload.actorId,
        title: `${definition.label} created`,
        message: `${record.title} has been created in ${workspace}.`,
        workspace,
        link: `/app/${workspace}/${entityKey}`,
        entityType: entityKey,
        entityId: record.id,
      });

      return deepClone(record);
    })
  );
}

export async function updateEntity<K extends EntityKey>(
  entityKey: K,
  id: string,
  payload: {
    actorId: string;
    title?: string;
    subtitle?: string;
    tags?: string[];
    data?: Partial<EntityRecord<K>["data"]>;
  }
): Promise<EntityRecord<K>> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const collection = state.entities[entityKey] as EntityRecord<K>[];
      const existing = collection.find((record) => record.id === id);
      if (!existing) throw new MockApiError("Entity not found", "NOT_FOUND");

      const merged: EntityRecord<K> = {
        ...existing,
        title: payload.title ?? existing.title,
        subtitle: payload.subtitle ?? existing.subtitle,
        tags: payload.tags ?? existing.tags,
        data: {
          ...existing.data,
          ...(payload.data ?? {}),
        },
        updatedAt: nowIso(),
        updatedBy: payload.actorId,
      };

      const index = collection.findIndex((record) => record.id === id);
      collection[index] = merged;
      syncAdminEntitySideEffects(state, entityKey, merged);

      appendAudit(state, {
        actorId: payload.actorId,
        action: "update",
        entityType: entityKey,
        entityId: id,
        workspace: merged.workspace,
        summary: `Updated ${entityKey} record ${merged.title}`,
      });

      return deepClone(merged);
    })
  );
}

export async function deleteEntity(entityKey: EntityKey, id: string, actorId: string): Promise<void> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const collection = state.entities[entityKey];
      const index = collection.findIndex((record) => record.id === id);
      if (index < 0) throw new MockApiError("Entity not found", "NOT_FOUND");
      const [deleted] = collection.splice(index, 1);

      if (entityKey === "users") {
        state.users = state.users.filter((user) => user.id !== id);
      }
      if (entityKey === "orgs") {
        state.organizations = state.organizations.filter((org) => org.id !== id);
      }

      appendAudit(state, {
        actorId,
        action: "delete",
        entityType: entityKey,
        entityId: id,
        workspace: deleted.workspace,
        summary: `Deleted ${entityKey} record ${deleted.title}`,
      });
    })
  );
}

export async function changeEntityStatus<K extends EntityKey>(
  entityKey: K,
  id: string,
  actorId: string,
  nextStatus: string,
  note?: string
): Promise<EntityRecord<K>> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const collection = state.entities[entityKey] as EntityRecord<K>[];
      const existing = collection.find((record) => record.id === id);
      if (!existing) throw new MockApiError("Entity not found", "NOT_FOUND");

      const previousStatus = existing.status;
      existing.status = nextStatus;
      existing.updatedAt = nowIso();
      existing.updatedBy = actorId;

      appendAudit(state, {
        actorId,
        action: "status_change",
        entityType: entityKey,
        entityId: id,
        workspace: existing.workspace,
        summary: `Changed ${entityKey} status from ${previousStatus} to ${nextStatus}`,
        fromStatus: previousStatus,
        toStatus: nextStatus,
        metadata: note ? { note } : undefined,
      });

      appendNotification(state, {
        actorId,
        title: `${getEntityDefinition(entityKey)?.label ?? entityKey} status changed`,
        message: `${existing.title} is now ${nextStatus}.`,
        workspace: existing.workspace,
        severity: nextStatus.includes("reject") || nextStatus.includes("violation") ? "warning" : "success",
        link: `/app/${existing.workspace}/${entityKey}`,
        entityType: entityKey,
        entityId: id,
      });

      return deepClone(existing);
    })
  );
}
export async function runEntityAction(
  entityKey: EntityKey,
  actionId: string,
  actorId: string,
  targetId?: string
): Promise<{ message: string }> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const workspace = findWorkspaceForEntity(entityKey);
      const target = targetId ? state.entities[entityKey].find((record) => record.id === targetId) : undefined;

      if (actionId === "run-weather-simulation") {
        const created = {
          id: randomId("weatherAlerts"),
          entity: "weatherAlerts" as const,
          workspace: "weather" as const,
          title: `Simulated Alert ${new Date().toLocaleTimeString()}`,
          subtitle: "Generated from active alert rules",
          status: "new",
          data: {
            severity: "high",
            location: "Mukono",
            assignedTo: "Regional Officer",
          },
          tags: ["simulation", "weather"],
          createdAt: nowIso(),
          updatedAt: nowIso(),
          createdBy: actorId,
          updatedBy: actorId,
        };
        state.entities.weatherAlerts.unshift(created);

        appendNotification(state, {
          actorId,
          title: "Weather simulation completed",
          message: "New weather alert generated from rule simulation.",
          workspace: "weather",
          link: "/app/weather/weatherAlerts",
          severity: "warning",
          entityType: "weatherAlerts",
          entityId: created.id,
        });
      }

      if (actionId === "refresh-prediction" || actionId === "generate-prediction") {
        const targetEntity = actionId === "refresh-prediction" ? "yieldPredictions" : "pricePredictions";
        const source = targetEntity === "yieldPredictions" ? state.entities.yieldPredictions[0] : state.entities.pricePredictions[0];
        if (source) {
          source.updatedAt = nowIso();
          source.updatedBy = actorId;
          source.status = targetEntity === "yieldPredictions" ? "refreshed" : "generated";
        }
      }

      if (actionId === "send-message" && target) {
        const currentCount = Number((target.data as Record<string, unknown>).messageCount ?? 0);
        (target.data as Record<string, unknown>).messageCount = currentCount + 1;
        (target.data as Record<string, unknown>).lastMessage = `Message sent at ${new Date().toLocaleString()}`;
      }

      if (actionId === "flag-violations") {
        const violating = state.entities.coldChainLogs.filter((record) => {
          const data = record.data as Record<string, unknown>;
          return Boolean(data.violation);
        });

        violating.forEach((record) => {
          appendNotification(state, {
            actorId,
            title: "Cold chain violation detected",
            message: `${record.title} exceeded threshold and needs action.`,
            workspace: "logistics",
            severity: "error",
            link: "/app/logistics/coldChainLogs",
            entityType: "coldChainLogs",
            entityId: record.id,
          });
        });
      }

      if (actionId === "create-token") {
        const token = {
          id: randomId("token"),
          entity: "apiTokens" as const,
          workspace: "admin" as const,
          title: `API Token ${new Date().toISOString().slice(11, 19)}`,
          subtitle: "Generated token (show once)",
          status: "active",
          data: {
            name: "Generated Token",
            scopes: ["orders:read"],
            rateLimit: 500,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 90).toISOString(),
            revoked: false,
            tokenPreview: `cly_live_${Math.random().toString(36).slice(2, 14)}`,
          },
          tags: ["token", "generated"],
          createdAt: nowIso(),
          updatedAt: nowIso(),
          createdBy: actorId,
          updatedBy: actorId,
        };
        state.entities.apiTokens.unshift(token);
      }

      if (actionId === "test-rule") {
        appendNotification(state, {
          actorId,
          title: "Rule test successful",
          message: "Alert rule matched sample payload and produced warning action.",
          workspace: "weather",
          link: "/app/weather/alertRules",
          severity: "info",
        });
      }

      if (actionId === "export-report" || actionId === "export-invoice") {
        appendNotification(state, {
          actorId,
          title: "Export prepared",
          message: "Mock export generated. Download integration can replace this later.",
          workspace,
          link: `/app/${workspace}/${entityKey}`,
          severity: "success",
          entityType: entityKey,
          entityId: target?.id,
        });
      }

      appendAudit(state, {
        actorId,
        action: "simulate",
        entityType: entityKey,
        entityId: targetId ?? actionId,
        workspace,
        summary: `Executed action ${actionId} for ${entityKey}`,
      });

      return {
        message: `${actionId} executed successfully`,
      };
    })
  );
}

export async function listAuditLogs(params: AuditFilterParams): Promise<ListResult<AuditRecord>> {
  return withSimulation(() => {
    const state = loadState();
    let items = [...state.auditLogs];

    if (params.actorId) {
      items = items.filter((item) => item.actorId === params.actorId);
    }
    if (params.action) {
      items = items.filter((item) => item.action === params.action);
    }
    if (params.entityType) {
      items = items.filter((item) => item.entityType === params.entityType);
    }
    if (params.text) {
      const needle = params.text.toLowerCase();
      items = items.filter((item) => item.summary.toLowerCase().includes(needle));
    }
    if (params.dateRange) {
      items = items.filter((item) => matchesDateRange(item.createdAt, params.dateRange?.from, params.dateRange?.to));
    }

    return paginate(items, params.page, params.pageSize);
  });
}

export async function listNotifications(params: NotificationFilterParams) {
  return withSimulation(() => {
    const state = loadState();
    let items = [...state.notifications];

    if (params.workspace) {
      items = items.filter((notification) => notification.workspace === params.workspace || notification.workspace === undefined);
    }
    if (params.unreadOnly) {
      items = items.filter((notification) => !notification.read);
    }

    return paginate(items, params.page, params.pageSize);
  });
}

export async function markNotificationRead(notificationId: string, read: boolean, actorId: string): Promise<void> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const target = state.notifications.find((notification) => notification.id === notificationId);
      if (!target) throw new MockApiError("Notification not found", "NOT_FOUND");
      target.read = read;
      target.updatedAt = nowIso();
      target.updatedBy = actorId;
    })
  );
}

export async function markAllNotificationsRead(actorId: string): Promise<void> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      state.notifications = state.notifications.map((notification) => ({
        ...notification,
        read: true,
        updatedAt: nowIso(),
        updatedBy: actorId,
      }));
    })
  );
}

export async function globalSearch(query: string) {
  return withSimulation(() => {
    const state = loadState();
    const needle = query.trim().toLowerCase();
    if (!needle) return [];

    const results = SEARCHABLE_ENTITIES.flatMap((entityKey) => {
      return state.entities[entityKey]
        .filter((record) => {
          const haystack = [record.title, record.subtitle ?? "", record.status, JSON.stringify(record.data)]
            .join(" ")
            .toLowerCase();
          return haystack.includes(needle);
        })
        .map((record) => ({
          id: record.id,
          entity: entityKey,
          title: record.title,
          status: record.status,
          workspace: record.workspace,
          route: `/app/${record.workspace}/${entityKey}`,
          updatedAt: record.updatedAt,
        }));
    });

    return results.slice(0, 100);
  });
}

export async function registerAccount(payload: RegisterAccountPayload): Promise<RegistrationResult> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const email = payload.email.trim().toLowerCase();
      const existing = state.users.find((candidate) => candidate.email.toLowerCase() === email);
      if (existing) {
        throw new MockApiError("Email already registered", "EMAIL_IN_USE");
      }

      const timestamp = nowIso();
      const defaultSoleModules: WorkspaceId[] = ["farmer", "weather", "prices", "finance"];
      const organizationFallbackModules: WorkspaceId[] = [
        "farmer",
        "marketplace",
        "logistics",
        "finance",
        "weather",
        "prices",
      ];
      const enabledModules: WorkspaceId[] =
        payload.accountType === "organization"
          ? payload.enabledModules.length > 0
            ? payload.enabledModules
            : organizationFallbackModules
          : defaultSoleModules;

      const organization: Organization = {
        id: randomId("org"),
        name:
          payload.accountType === "organization"
            ? payload.organizationName.trim()
            : `${payload.fullName.trim()} Farm Operations`,
        enabledModules,
      };
      state.organizations.unshift(organization);

      const roles: RoleId[] = payload.accountType === "organization" ? ["org_admin"] : ["farmer_agent"];
      const permissions = permissionsFromRoles(state, roles);

      const user: UserAccount = {
        id: randomId("usr"),
        name: payload.fullName.trim(),
        email,
        password: payload.password,
        orgId: organization.id,
        roles,
        permissions,
        createdAt: timestamp,
        updatedAt: timestamp,
      };
      state.users.unshift(user);

      state.entities.orgs.unshift({
        id: organization.id,
        entity: "orgs",
        workspace: "admin",
        title: organization.name,
        subtitle:
          payload.accountType === "organization"
            ? `${payload.organizationType} organization`
            : "Sole operator account",
        status: "active",
        data: {
          name: organization.name,
          enabledModules: organization.enabledModules,
        },
        tags: ["registration", payload.accountType],
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: user.id,
        updatedBy: user.id,
      });

      state.entities.users.unshift({
        id: user.id,
        entity: "users",
        workspace: "admin",
        title: user.name,
        subtitle: user.email,
        status: "active",
        data: {
          name: user.name,
          email: user.email,
          orgId: user.orgId,
          roles: user.roles,
          phone: payload.phone,
          country: payload.country,
          region: payload.region,
        },
        tags: ["registration", payload.accountType],
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: user.id,
        updatedBy: user.id,
      });

      WORKSPACES.forEach((workspace) => {
        const enabled = organization.enabledModules.includes(workspace.id);
        state.entities.moduleToggles.unshift({
          id: `${organization.id}-${workspace.id}`,
          entity: "moduleToggles",
          workspace: "admin",
          title: `${organization.name} :: ${workspace.label}`,
          subtitle: enabled ? "Enabled" : "Disabled",
          status: enabled ? "enabled" : "disabled",
          data: {
            orgId: organization.id,
            workspace: workspace.id,
            enabled,
          },
          tags: ["registration", "module-toggle"],
          createdAt: timestamp,
          updatedAt: timestamp,
          createdBy: user.id,
          updatedBy: user.id,
        });
      });

      initializeSecurityForUser(user.id, {
        mfaEnabled: payload.accountType === "organization",
        mfaMethod: "authenticator",
        loginAlerts: true,
        passkeyEnabled: false,
        trustedDevicesOnly: false,
      });

      appendAudit(state, {
        actorId: user.id,
        action: "create",
        entityType: "registration",
        entityId: user.id,
        workspace: enabledModules[0] ?? "farmer",
        summary: `Registered ${payload.accountType} account for ${email}`,
      });

      appendNotification(state, {
        actorId: user.id,
        title: "Welcome to ClyCites",
        message:
          payload.accountType === "organization"
            ? "Organization account provisioned. Complete onboarding and configure security controls."
            : "Sole operator account provisioned. Complete onboarding to activate workspaces.",
        workspace: enabledModules[0] ?? "farmer",
        link: "/auth/onboarding",
        severity: "success",
      });

      return {
        userId: user.id,
        accountType: payload.accountType,
        email,
      };
    })
  );
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const user = state.users.find((candidate) => candidate.email.toLowerCase() === email.toLowerCase());
      if (!user || user.password !== password) {
        throw new MockApiError("Invalid credentials", "INVALID_CREDENTIALS");
      }

      const organization = getOrganization(state, user.orgId);
      const token = randomId("session");
      const defaultWorkspace = organization.enabledModules[0] ?? "farmer";
      const session: SessionRecord = {
        token,
        userId: user.id,
        activeWorkspace: defaultWorkspace,
        createdAt: nowIso(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      };

      state.sessions.unshift(session);

      appendAudit(state, {
        actorId: user.id,
        action: "login",
        entityType: "session",
        entityId: session.token,
        summary: `User ${user.email} logged in`,
        workspace: defaultWorkspace,
      });

      return {
        token,
        user: sanitizeUser(user),
        organization,
      };
    })
  );
}

export function findUserByEmail(email: string): Omit<UserAccount, "password"> | null {
  const normalized = email.trim().toLowerCase();
  if (!normalized) return null;

  const state = loadState();
  const user = state.users.find((candidate) => candidate.email.toLowerCase() === normalized);
  return user ? sanitizeUser(user) : null;
}

export async function resetUserPasswordByEmail(email: string, newPassword: string): Promise<void> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const normalized = email.trim().toLowerCase();
      const user = state.users.find((candidate) => candidate.email.toLowerCase() === normalized);
      if (!user) {
        throw new MockApiError("Account not found", "USER_NOT_FOUND");
      }

      user.password = newPassword;
      user.updatedAt = nowIso();
      state.sessions = state.sessions.filter((session) => session.userId !== user.id);

      appendAudit(state, {
        actorId: user.id,
        action: "update",
        entityType: "security",
        entityId: user.id,
        summary: `Password reset completed for ${user.email}`,
      });

      appendNotification(state, {
        actorId: user.id,
        title: "Password changed",
        message: "Your password was updated successfully. Sign in with your new credentials.",
        link: "/auth/login",
        severity: "success",
      });
    })
  );
}

export async function logout(token: string, actorId: string): Promise<void> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      state.sessions = state.sessions.filter((session) => session.token !== token);

      appendAudit(state, {
        actorId,
        action: "logout",
        entityType: "session",
        entityId: token,
        summary: `User ${actorId} logged out`,
      });
    })
  );
}

export async function resolveSession(token: string): Promise<AuthSession> {
  return withSimulation(() => {
    const state = loadState();
    const session = state.sessions.find((candidate) => candidate.token === token);
    if (!session) throw new MockApiError("Session expired", "SESSION_EXPIRED");

    const user = getUserById(state, session.userId);
    const organization = getOrganization(state, user.orgId);

    return {
      token: session.token,
      user: sanitizeUser(user),
      organization,
      activeWorkspace: session.activeWorkspace,
    };
  });
}

export async function updateSessionWorkspace(token: string, workspace: WorkspaceId): Promise<AuthSession> {
  return withSimulation(() =>
    saveWithMutation((state) => {
      const session = state.sessions.find((candidate) => candidate.token === token);
      if (!session) throw new MockApiError("Session expired", "SESSION_EXPIRED");
      session.activeWorkspace = workspace;

      const user = getUserById(state, session.userId);
      const organization = getOrganization(state, user.orgId);

      return {
        token: session.token,
        user: sanitizeUser(user),
        organization,
        activeWorkspace: session.activeWorkspace,
      };
    })
  );
}

export function hasPermission(user: Omit<UserAccount, "password">, permission: Permission): boolean {
  return user.permissions.includes(permission);
}

export function hasEntityPermission(user: Omit<UserAccount, "password">, entityKey: EntityKey, action: "read" | "write" | "delete" | "status"): boolean {
  return hasPermission(user, `entity.${entityKey}.${action}` as Permission);
}

export function hasWorkspaceAccess(user: Omit<UserAccount, "password">, organization: Organization, workspace: WorkspaceId): boolean {
  if (!organization.enabledModules.includes(workspace)) return false;
  return hasPermission(user, `workspace.${workspace}.access` as Permission);
}
