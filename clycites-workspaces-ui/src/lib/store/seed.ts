import {
  ALL_PERMISSIONS,
  ENTITY_DEFINITIONS,
  ROLE_DEFINITIONS,
  WORKSPACES,
  WORKSPACE_ENTITY_MAP,
} from "@/lib/store/catalog";
import type {
  AppNotification,
  AuditRecord,
  DatabaseState,
  EntityCollectionMap,
  EntityDefinition,
  EntityKey,
  EntityRecord,
  Organization,
  RoleDefinition,
  UserAccount,
  WorkspaceId,
} from "@/lib/store/types";

function nowIso(): string {
  return new Date().toISOString();
}

function createEmptyCollections(): EntityCollectionMap {
  const keys = Object.keys(ENTITY_DEFINITIONS) as EntityKey[];
  const mapped = keys.map((key) => [key, []]);
  return Object.fromEntries(mapped) as EntityCollectionMap;
}

function setPathValue(target: Record<string, unknown>, path: string, value: unknown): void {
  const normalized = path.replace(/^data\./, "");
  const parts = normalized.split(".");
  let current: Record<string, unknown> = target;

  for (let index = 0; index < parts.length - 1; index += 1) {
    const part = parts[index];
    if (typeof current[part] !== "object" || current[part] === null) {
      current[part] = {};
    }
    current = current[part] as Record<string, unknown>;
  }

  current[parts[parts.length - 1]] = value;
}

function valueForField(fieldType: string, key: string, itemIndex: number): unknown {
  switch (fieldType) {
    case "number":
      return itemIndex * 10 + 1;
    case "date":
      return new Date(Date.now() + itemIndex * 86_400_000).toISOString().slice(0, 10);
    case "switch":
      return itemIndex % 2 === 0;
    case "select":
      return "";
    case "tags":
      return "sample,seed";
    default:
      if (key.toLowerCase().includes("email")) return `user${itemIndex + 1}@clycites.io`;
      if (key.toLowerCase().includes("phone")) return `+25670000${itemIndex + 10}`;
      return `${key.split(".").pop() ?? "value"}-${itemIndex + 1}`;
  }
}

function findEntityWorkspace(entityKey: EntityKey): WorkspaceId {
  const workspace = (Object.keys(WORKSPACE_ENTITY_MAP) as WorkspaceId[]).find((key) =>
    WORKSPACE_ENTITY_MAP[key].includes(entityKey)
  );
  return workspace ?? "admin";
}

function createGenericEntityRecords<K extends EntityKey>(
  definition: EntityDefinition<K>,
  actorId: string,
  count = 3
): EntityRecord<K>[] {
  const workspace = findEntityWorkspace(definition.key);

  return Array.from({ length: count }).map((_, index) => {
    const timestamp = nowIso();
    const status = definition.statuses[index % definition.statuses.length] ?? definition.defaultStatus;
    const data: Record<string, unknown> = {};

    definition.fields
      .filter((field) => field.key.startsWith("data."))
      .forEach((field) => {
        const rawValue = valueForField(field.type, field.key, index);
        const selectValue = field.options?.[0]?.value;
        const value = field.type === "select" ? selectValue ?? rawValue : rawValue;
        setPathValue(data, field.key, value);
      });

    return {
      id: `${definition.key}-${index + 1}`,
      entity: definition.key,
      workspace,
      title: `${definition.label} ${index + 1}`,
      subtitle: `Seeded ${definition.label.toLowerCase()} record for UI workflows`,
      status,
      data: data as unknown as EntityRecord<K>["data"],
      tags: [workspace, "seed"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
  });
}

function createUsers(): UserAccount[] {
  const timestamp = nowIso();
  return [
    {
      id: "usr-super",
      name: "ClyCites Super Admin",
      email: "superadmin@clycites.io",
      password: "super123",
      orgId: "org-1",
      roles: ["super_admin"],
      permissions: ROLE_DEFINITIONS.super_admin.permissions,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "usr-ops",
      name: "Operations Admin",
      email: "ops@clycites.io",
      password: "ops12345",
      orgId: "org-1",
      roles: ["org_admin"],
      permissions: ROLE_DEFINITIONS.org_admin.permissions,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "usr-farmer",
      name: "Farmer Jane",
      email: "farmer@clycites.io",
      password: "farmer123",
      orgId: "org-1",
      roles: ["farmer_agent"],
      permissions: ROLE_DEFINITIONS.farmer_agent.permissions,
      createdAt: timestamp,
      updatedAt: timestamp,
    },
    {
      id: "usr-expert",
      name: "Expert Alex",
      email: "expert@clycites.io",
      password: "expert123",
      orgId: "org-1",
      roles: ["expert_officer", "weather_analyst", "price_analyst"],
      permissions: [
        ...new Set([
          ...ROLE_DEFINITIONS.expert_officer.permissions,
          ...ROLE_DEFINITIONS.weather_analyst.permissions,
          ...ROLE_DEFINITIONS.price_analyst.permissions,
        ]),
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    },
  ];
}

function createAuditSeed(actorId: string): AuditRecord[] {
  const timestamp = nowIso();
  return [
    {
      id: "audit-1",
      actorId,
      action: "simulate",
      entityType: "system",
      entityId: "seed",
      summary: "Mock seed initialized",
      workspace: "admin",
      fromStatus: undefined,
      toStatus: undefined,
      metadata: { source: "seed" },
      tags: ["seed"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    },
  ];
}

function createNotificationsSeed(actorId: string): AppNotification[] {
  const timestamp = nowIso();
  return [
    {
      id: "notif-1",
      title: "Advisory needs review",
      message: "Rice blast advisory has been submitted for review.",
      read: false,
      severity: "warning",
      link: "/app/expert/advisories",
      workspace: "expert",
      entityType: "advisories",
      entityId: "advisories-1",
      tags: ["seed", "expert"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    },
    {
      id: "notif-2",
      title: "Cold chain violation",
      message: "Temperature exceeded threshold for shipment SHP-19.",
      read: false,
      severity: "error",
      link: "/app/logistics/coldChainLogs",
      workspace: "logistics",
      entityType: "coldChainLogs",
      entityId: "coldChainLogs-1",
      tags: ["seed", "logistics"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    },
    {
      id: "notif-3",
      title: "Price prediction refreshed",
      message: "Maize 7-day horizon prediction has been updated.",
      read: true,
      severity: "info",
      link: "/app/prices/pricePredictions",
      workspace: "prices",
      entityType: "pricePredictions",
      entityId: "pricePredictions-1",
      tags: ["seed", "prices"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    },
  ];
}

function createRoleList(): RoleDefinition[] {
  return Object.values(ROLE_DEFINITIONS);
}

export function createSeedState(): DatabaseState {
  const users = createUsers();
  const actorId = users[0].id;
  const organizations: Organization[] = [
    {
      id: "org-1",
      name: "ClyCites Cooperative Ltd",
      enabledModules: WORKSPACES.map((workspace) => workspace.id),
    },
    {
      id: "org-2",
      name: "Regional Produce Network",
      enabledModules: ["marketplace", "logistics", "finance", "weather", "prices"],
    },
  ];

  const entities = createEmptyCollections();

  (Object.values(ENTITY_DEFINITIONS) as EntityDefinition[]).forEach((definition) => {
    entities[definition.key] = createGenericEntityRecords(definition as EntityDefinition<EntityKey>, actorId) as EntityCollectionMap[EntityKey];
  });

  entities.users = users.map((user, index) => {
    const timestamp = nowIso();
    return {
      id: user.id,
      entity: "users",
      workspace: "admin",
      title: user.name,
      subtitle: user.email,
      status: index % 3 === 0 ? "disabled" : "active",
      data: {
        name: user.name,
        email: user.email,
        orgId: user.orgId,
        roles: user.roles,
      },
      tags: ["admin", "identity"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
  });

  entities.orgs = organizations.map((org) => {
    const timestamp = nowIso();
    return {
      id: org.id,
      entity: "orgs",
      workspace: "admin",
      title: org.name,
      subtitle: `${org.enabledModules.length} enabled modules`,
      status: "active",
      data: {
        name: org.name,
        enabledModules: org.enabledModules,
      },
      tags: ["admin", "org"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
  });

  entities.roles = createRoleList().map((role) => {
    const timestamp = nowIso();
    return {
      id: role.id,
      entity: "roles",
      workspace: "admin",
      title: role.label,
      subtitle: `${role.permissions.length} permissions`,
      status: "active",
      data: {
        name: role.label,
        permissions: role.permissions,
      },
      tags: ["admin", "rbac"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
  });

  entities.permissions = ALL_PERMISSIONS.slice(0, 80).map((permission, index) => {
    const timestamp = nowIso();
    return {
      id: `perm-${index + 1}`,
      entity: "permissions",
      workspace: "admin",
      title: permission,
      subtitle: "Generated permission definition",
      status: "active",
      data: {
        code: permission,
        description: `Permission flag for ${permission}`,
      },
      tags: ["admin", "permission"],
      createdAt: timestamp,
      updatedAt: timestamp,
      createdBy: actorId,
      updatedBy: actorId,
    };
  });

  entities.apiTokens = [
    {
      id: "token-1",
      entity: "apiTokens",
      workspace: "admin",
      title: "Marketplace Integrator",
      subtitle: "Primary org token",
      status: "active",
      data: {
        name: "Marketplace Integrator",
        scopes: ["orders:read", "shipments:write"],
        rateLimit: 1000,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 180).toISOString(),
        revoked: false,
        tokenPreview: "cly_live_xxxxx",
      },
      tags: ["admin", "token"],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      createdBy: actorId,
      updatedBy: actorId,
    },
    {
      id: "token-2",
      entity: "apiTokens",
      workspace: "admin",
      title: "Weather Feed Connector",
      subtitle: "Revoked test token",
      status: "revoked",
      data: {
        name: "Weather Feed Connector",
        scopes: ["weather:read"],
        rateLimit: 300,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
        revoked: true,
        tokenPreview: "cly_test_xxxxx",
      },
      tags: ["admin", "token"],
      createdAt: nowIso(),
      updatedAt: nowIso(),
      createdBy: actorId,
      updatedBy: actorId,
    },
  ];

  entities.moduleToggles = organizations.flatMap((org) =>
    WORKSPACES.map((workspace) => {
      const enabled = org.enabledModules.includes(workspace.id);
      const timestamp = nowIso();
      return {
        id: `${org.id}-${workspace.id}`,
        entity: "moduleToggles",
        workspace: "admin" as const,
        title: `${org.name} :: ${workspace.label}`,
        subtitle: enabled ? "Enabled" : "Disabled",
        status: enabled ? "enabled" : "disabled",
        data: {
          orgId: org.id,
          workspace: workspace.id,
          enabled,
        },
        tags: ["admin", "module-toggle"],
        createdAt: timestamp,
        updatedAt: timestamp,
        createdBy: actorId,
        updatedBy: actorId,
      };
    })
  );

  return {
    version: 1,
    users,
    organizations,
    roles: createRoleList(),
    sessions: [],
    entities,
    auditLogs: createAuditSeed(actorId),
    notifications: createNotificationsSeed(actorId),
    runtime: {
      latencyMs: 420,
      jitterMs: 220,
      errorRate: 0.08,
      enableRandomErrors: false,
    },
  };
}
