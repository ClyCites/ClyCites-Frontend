import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const FARMER_WORKSPACE_ID = "farmer" as const;

export const FARMER_ENTITY_KEYS = [
  "farmers",
  "farms",
  "plots",
  "crops",
  "inputs",
  "tasks",
  "advisories",
  "weatherAlerts",
  "priceSignals",
] as const satisfies readonly EntityKey[];

export type FarmerEntityKey = (typeof FARMER_ENTITY_KEYS)[number];

export interface FarmerEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const FARMER_ENTITY_FEATURES: Record<FarmerEntityKey, FarmerEntityFeatures> = {
  farmers: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["submit-verification", "verify-profile", "reject-profile"],
  },
  farms: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: false,
    allowStatus: false,
  },
  plots: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: false,
    allowStatus: false,
  },
  crops: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  inputs: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  tasks: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  advisories: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["publish", "acknowledge"],
  },
  weatherAlerts: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["acknowledge", "resolve"],
    enabledToolbarActionIds: [],
  },
  priceSignals: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
};

export function isFarmerEntityKey(value: string): value is FarmerEntityKey {
  return FARMER_ENTITY_KEYS.includes(value as FarmerEntityKey);
}

export function getFarmerEntityDefinition(entityKey: FarmerEntityKey): EntityDefinition<FarmerEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<FarmerEntityKey>;
}

export function getFarmerEntityFeatures(entityKey: FarmerEntityKey): FarmerEntityFeatures {
  return FARMER_ENTITY_FEATURES[entityKey];
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
