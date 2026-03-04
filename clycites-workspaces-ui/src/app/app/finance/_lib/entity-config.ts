import type { EntityActionDefinition, EntityDefinition, EntityKey } from "@/lib/store/types";
import { ENTITY_DEFINITIONS } from "@/lib/store/catalog";

export const FINANCE_WORKSPACE_ID = "finance" as const;

export const FINANCE_ENTITY_KEYS = [
  "wallets",
  "transactions",
  "escrowAccounts",
  "payouts",
  "invoices",
  "credits",
  "insurancePolicies",
] as const satisfies readonly EntityKey[];

export type FinanceEntityKey = (typeof FINANCE_ENTITY_KEYS)[number];

export interface FinanceEntityFeatures {
  allowCreate: boolean;
  allowEdit: boolean;
  allowDelete: boolean;
  allowStatus: boolean;
  enabledWorkflowActionIds?: string[];
  enabledToolbarActionIds?: string[];
}

export const FINANCE_ENTITY_FEATURES: Record<FinanceEntityKey, FinanceEntityFeatures> = {
  wallets: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  transactions: {
    allowCreate: false,
    allowEdit: false,
    allowDelete: false,
    allowStatus: false,
  },
  escrowAccounts: {
    allowCreate: true,
    allowEdit: false,
    allowDelete: false,
    allowStatus: true,
    enabledWorkflowActionIds: ["release-escrow", "refund-escrow"],
  },
  payouts: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
  invoices: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
    enabledToolbarActionIds: [],
  },
  credits: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: true,
    enabledWorkflowActionIds: ["approve-credit", "reject-credit", "disburse-credit"],
  },
  insurancePolicies: {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    allowStatus: false,
  },
};

export function isFinanceEntityKey(value: string): value is FinanceEntityKey {
  return FINANCE_ENTITY_KEYS.includes(value as FinanceEntityKey);
}

export function getFinanceEntityDefinition(entityKey: FinanceEntityKey): EntityDefinition<FinanceEntityKey> {
  return ENTITY_DEFINITIONS[entityKey] as EntityDefinition<FinanceEntityKey>;
}

export function getFinanceEntityFeatures(entityKey: FinanceEntityKey): FinanceEntityFeatures {
  return FINANCE_ENTITY_FEATURES[entityKey];
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
