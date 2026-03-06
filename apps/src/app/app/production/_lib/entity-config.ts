import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const PRODUCTION_WORKSPACE_ID = "production" as const;

export const PRODUCTION_ENTITY_KEYS = [
  "cropCycles",
  "growthStages",
  "sensorReadings",
  "pestIncidents",
  "yieldPredictions",
] as const satisfies readonly EntityKey[];

export type ProductionEntityKey = (typeof PRODUCTION_ENTITY_KEYS)[number];

export interface ProductionEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const PRODUCTION_ENTITY_FEATURES: Record<ProductionEntityKey, ProductionEntityFeatures> = {
  cropCycles: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  growthStages: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  sensorReadings: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  pestIncidents: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["resolve-incident", "close-incident"],
  },
  yieldPredictions: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: ["refresh-prediction"],
  },
};

export function isProductionEntityKey(value: string): value is ProductionEntityKey {
  return PRODUCTION_ENTITY_KEYS.includes(value as ProductionEntityKey);
}

export function getProductionEntityDefinition(entityKey: ProductionEntityKey): EntityDefinition<ProductionEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<ProductionEntityKey>;
}

export function getProductionEntityFeatures(entityKey: ProductionEntityKey): ProductionEntityFeatures {
  return PRODUCTION_ENTITY_FEATURES[entityKey];
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
