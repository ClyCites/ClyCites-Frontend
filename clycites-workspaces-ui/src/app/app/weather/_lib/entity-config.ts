import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const WEATHER_WORKSPACE_ID = "weather" as const;

export const WEATHER_ENTITY_KEYS = [
  "stations",
  "forecasts",
  "weatherAlerts",
  "alertRules",
] as const satisfies readonly EntityKey[];

export type WeatherEntityKey = (typeof WEATHER_ENTITY_KEYS)[number];

export interface WeatherEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const WEATHER_ENTITY_FEATURES: Record<WeatherEntityKey, WeatherEntityFeatures> = {
  stations: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["refresh-profile-weather"],
    enabledToolbarActionIds: ["refresh-weather-admin", "check-weather-providers", "retry-weather-deliveries", "expire-weather-alerts", "prune-weather-snapshots"],
  },
  forecasts: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: ["refresh-forecast"],
  },
  weatherAlerts: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["acknowledge", "escalate", "resolve"],
    enabledToolbarActionIds: [],
  },
  alertRules: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["activate-rule", "disable-rule"],
    enabledToolbarActionIds: [],
  },
};

export function isWeatherEntityKey(value: string): value is WeatherEntityKey {
  return WEATHER_ENTITY_KEYS.includes(value as WeatherEntityKey);
}

export function getWeatherEntityDefinition(entityKey: WeatherEntityKey): EntityDefinition<WeatherEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<WeatherEntityKey>;
}

export function getWeatherEntityFeatures(entityKey: WeatherEntityKey): WeatherEntityFeatures {
  return WEATHER_ENTITY_FEATURES[entityKey];
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
