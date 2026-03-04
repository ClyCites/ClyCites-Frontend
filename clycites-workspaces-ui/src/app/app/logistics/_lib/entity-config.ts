import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const LOGISTICS_WORKSPACE_ID = "logistics" as const;

export const LOGISTICS_ENTITY_KEYS = [
  "shipments",
  "routes",
  "vehicles",
  "drivers",
  "trackingEvents",
  "coldChainLogs",
] as const satisfies readonly EntityKey[];

export type LogisticsEntityKey = (typeof LOGISTICS_ENTITY_KEYS)[number];

export interface LogisticsEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const LOGISTICS_ENTITY_FEATURES: Record<LogisticsEntityKey, LogisticsEntityFeatures> = {
  shipments: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
  },
  routes: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  vehicles: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  drivers: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  trackingEvents: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  coldChainLogs: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: ["flag-violations"],
  },
};

export function isLogisticsEntityKey(value: string): value is LogisticsEntityKey {
  return LOGISTICS_ENTITY_KEYS.includes(value as LogisticsEntityKey);
}

export function getLogisticsEntityDefinition(entityKey: LogisticsEntityKey): EntityDefinition<LogisticsEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<LogisticsEntityKey>;
}

export function getLogisticsEntityFeatures(entityKey: LogisticsEntityKey): LogisticsEntityFeatures {
  return LOGISTICS_ENTITY_FEATURES[entityKey];
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
