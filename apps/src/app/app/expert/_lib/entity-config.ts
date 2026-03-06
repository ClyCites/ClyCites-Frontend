import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const EXPERT_WORKSPACE_ID = "expert" as const;

export const EXPERT_ENTITY_KEYS = [
  "advisories",
  "knowledgeBaseArticles",
  "researchReports",
  "fieldCases",
  "assignments",
  "reviewQueue",
] as const satisfies readonly EntityKey[];

export type ExpertEntityKey = (typeof EXPERT_ENTITY_KEYS)[number];

export interface ExpertEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const EXPERT_ENTITY_FEATURES: Record<ExpertEntityKey, ExpertEntityFeatures> = {
  advisories: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["submit-review", "approve", "reject", "publish", "acknowledge"],
  },
  knowledgeBaseArticles: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["submit-review", "approve", "reject", "publish"],
  },
  researchReports: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["submit-report", "publish-report", "archive-report"],
  },
  fieldCases: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["assign-case", "start-visit", "resolve-case", "close-case"],
  },
  assignments: {
    allowCreate: false,
    allowEdit: true,
    allowDelete: false,
    allowStatus: false,
  },
  reviewQueue: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["approve-review", "reject-review"],
  },
};

export function isExpertEntityKey(value: string): value is ExpertEntityKey {
  return EXPERT_ENTITY_KEYS.includes(value as ExpertEntityKey);
}

export function getExpertEntityDefinition(entityKey: ExpertEntityKey): EntityDefinition<ExpertEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<ExpertEntityKey>;
}

export function getExpertEntityFeatures(entityKey: ExpertEntityKey): ExpertEntityFeatures {
  return EXPERT_ENTITY_FEATURES[entityKey];
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
