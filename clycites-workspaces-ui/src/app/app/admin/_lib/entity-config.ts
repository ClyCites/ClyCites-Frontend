import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const ADMIN_WORKSPACE_ID = "admin" as const;

export const ADMIN_ENTITY_KEYS = [
  "users",
  "orgs",
  "roles",
  "permissions",
  "apiTokens",
  "moduleToggles",
] as const satisfies readonly EntityKey[];

export type AdminEntityKey = (typeof ADMIN_ENTITY_KEYS)[number];

export interface AdminEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const ADMIN_ENTITY_FEATURES: Record<AdminEntityKey, AdminEntityFeatures> = {
  users: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  orgs: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  roles: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  permissions: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  apiTokens: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["revoke-token", "rotate-token-secret", "view-token-usage"],
    enabledToolbarActionIds: [],
  },
  moduleToggles: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: false,
    allowStatus: true,
    enabledToolbarActionIds: [],
  },
};

export function isAdminEntityKey(value: string): value is AdminEntityKey {
  return ADMIN_ENTITY_KEYS.includes(value as AdminEntityKey);
}

export function getAdminEntityDefinition(entityKey: AdminEntityKey): EntityDefinition<AdminEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<AdminEntityKey>;
}

export function getAdminEntityFeatures(entityKey: AdminEntityKey): AdminEntityFeatures {
  return ADMIN_ENTITY_FEATURES[entityKey];
}

export function getFilteredActions(
  actions: EntityActionDefinition[] | undefined,
  enabledActionIds: string[] | undefined
): EntityActionDefinition[] {
  const configured = actions ?? [];
  if (!enabledActionIds) {
    return configured;
  }

  const enabled = new Set(enabledActionIds);
  return configured.filter((action) => enabled.has(action.id));
}
