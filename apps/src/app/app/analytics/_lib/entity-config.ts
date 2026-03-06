import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const ANALYTICS_WORKSPACE_ID = "analytics" as const;

export const ANALYTICS_ENTITY_KEYS = [
  "datasets",
  "charts",
  "dashboards",
  "reports",
  "templates",
] as const satisfies readonly EntityKey[];

export type AnalyticsEntityKey = (typeof ANALYTICS_ENTITY_KEYS)[number];

export interface AnalyticsEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const ANALYTICS_ENTITY_FEATURES: Record<AnalyticsEntityKey, AnalyticsEntityFeatures> = {
  datasets: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  charts: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  dashboards: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  reports: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  templates: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
};

export function isAnalyticsEntityKey(value: string): value is AnalyticsEntityKey {
  return ANALYTICS_ENTITY_KEYS.includes(value as AnalyticsEntityKey);
}

export function getAnalyticsEntityDefinition(entityKey: AnalyticsEntityKey): EntityDefinition<AnalyticsEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<AnalyticsEntityKey>;
}

export function getAnalyticsEntityFeatures(entityKey: AnalyticsEntityKey): AnalyticsEntityFeatures {
  return ANALYTICS_ENTITY_FEATURES[entityKey];
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
