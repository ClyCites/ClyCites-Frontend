import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const PRICES_WORKSPACE_ID = "prices" as const;

export const PRICES_ENTITY_KEYS = [
  "commodities",
  "marketPrices",
  "priceEstimations",
  "pricePredictions",
  "recommendations",
  "marketSignals",
  "dataSources",
] as const satisfies readonly EntityKey[];

export type PricesEntityKey = (typeof PRICES_ENTITY_KEYS)[number];

export interface PricesEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const PRICES_ENTITY_FEATURES: Record<PricesEntityKey, PricesEntityFeatures> = {
  commodities: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledWorkflowActionIds: ["fetch-market-insights", "fetch-market-trends", "compare-market-regions"],
  },
  marketPrices: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  priceEstimations: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  pricePredictions: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  recommendations: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledWorkflowActionIds: [],
    enabledToolbarActionIds: [],
  },
  marketSignals: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
  },
  dataSources: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
};

export function isPricesEntityKey(value: string): value is PricesEntityKey {
  return PRICES_ENTITY_KEYS.includes(value as PricesEntityKey);
}

export function getPricesEntityDefinition(entityKey: PricesEntityKey): EntityDefinition<PricesEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<PricesEntityKey>;
}

export function getPricesEntityFeatures(entityKey: PricesEntityKey): PricesEntityFeatures {
  return PRICES_ENTITY_FEATURES[entityKey];
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
