import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const MARKETPLACE_WORKSPACE_ID = "marketplace" as const;

export const MARKETPLACE_ENTITY_KEYS = [
  "listings",
  "rfqs",
  "orders",
  "contracts",
  "negotiations",
  "reviews",
] as const satisfies readonly EntityKey[];

export type MarketplaceEntityKey = (typeof MARKETPLACE_ENTITY_KEYS)[number];

export interface MarketplaceEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const MARKETPLACE_ENTITY_FEATURES: Record<MarketplaceEntityKey, MarketplaceEntityFeatures> = {
  listings: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: ["fetch-linked-media"],
  },
  rfqs: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  orders: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  contracts: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["open-dispute", "resolve-dispute", "close-dispute"],
  },
  negotiations: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: ["send-message"],
  },
  reviews: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
};

export function isMarketplaceEntityKey(value: string): value is MarketplaceEntityKey {
  return MARKETPLACE_ENTITY_KEYS.includes(value as MarketplaceEntityKey);
}

export function getMarketplaceEntityDefinition(entityKey: MarketplaceEntityKey): EntityDefinition<MarketplaceEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<MarketplaceEntityKey>;
}

export function getMarketplaceEntityFeatures(entityKey: MarketplaceEntityKey): MarketplaceEntityFeatures {
  return MARKETPLACE_ENTITY_FEATURES[entityKey];
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
