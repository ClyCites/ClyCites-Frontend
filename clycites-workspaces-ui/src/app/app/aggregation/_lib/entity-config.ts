import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const AGGREGATION_WORKSPACE_ID = "aggregation" as const;

export const AGGREGATION_ENTITY_KEYS = [
  "warehouses",
  "storageBins",
  "batches",
  "qualityGrades",
  "stockMovements",
  "spoilageReports",
] as const satisfies readonly EntityKey[];

export type AggregationEntityKey = (typeof AGGREGATION_ENTITY_KEYS)[number];

export interface AggregationEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const AGGREGATION_ENTITY_FEATURES: Record<AggregationEntityKey, AggregationEntityFeatures> = {
  warehouses: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  storageBins: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  batches: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  qualityGrades: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  stockMovements: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  spoilageReports: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
};

export function isAggregationEntityKey(value: string): value is AggregationEntityKey {
  return AGGREGATION_ENTITY_KEYS.includes(value as AggregationEntityKey);
}

export function getAggregationEntityDefinition(entityKey: AggregationEntityKey): EntityDefinition<AggregationEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<AggregationEntityKey>;
}

export function getAggregationEntityFeatures(entityKey: AggregationEntityKey): AggregationEntityFeatures {
  return AGGREGATION_ENTITY_FEATURES[entityKey];
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
