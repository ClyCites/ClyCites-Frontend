import {
  changeEntityStatus,
  createEntity,
  deleteEntity,
  getEntity,
  listEntities,
  runEntityAction,
  updateEntity,
} from "@/lib/store";
import type { EntityKey, EntityRecord, ListParams, ListResult } from "@/lib/store/types";

export interface EntityService<K extends EntityKey> {
  listX: (params: ListParams) => Promise<ListResult<EntityRecord<K>>>;
  getX: (id: string) => Promise<EntityRecord<K>>;
  createX: (payload: {
    actorId: string;
    title: string;
    subtitle?: string;
    status?: string;
    tags?: string[];
    data: Record<string, unknown>;
  }) => Promise<EntityRecord<K>>;
  updateX: (
    id: string,
    payload: {
      actorId: string;
      title?: string;
      subtitle?: string;
      tags?: string[];
      data?: Record<string, unknown>;
    }
  ) => Promise<EntityRecord<K>>;
  deleteX: (id: string, actorId: string) => Promise<void>;
  changeStatus: (id: string, actorId: string, status: string, note?: string) => Promise<EntityRecord<K>>;
  runAction: (actionId: string, actorId: string, targetId?: string) => Promise<{ message: string }>;
}

function createEntityService<K extends EntityKey>(entityKey: K): EntityService<K> {
  return {
    listX: (params) => listEntities(entityKey, params),
    getX: (id) => getEntity(entityKey, id),
    createX: (payload) => createEntity(entityKey, payload),
    updateX: (id, payload) => updateEntity(entityKey, id, payload),
    deleteX: (id, actorId) => deleteEntity(entityKey, id, actorId),
    changeStatus: (id, actorId, status, note) => changeEntityStatus(entityKey, id, actorId, status, note),
    runAction: (actionId, actorId, targetId) => runEntityAction(entityKey, actionId, actorId, targetId),
  };
}

const entityKeys: EntityKey[] = [
  "farmers",
  "farms",
  "plots",
  "crops",
  "inputs",
  "tasks",
  "advisories",
  "weatherAlerts",
  "priceSignals",
  "cropCycles",
  "growthStages",
  "sensorReadings",
  "pestIncidents",
  "yieldPredictions",
  "warehouses",
  "storageBins",
  "batches",
  "qualityGrades",
  "stockMovements",
  "spoilageReports",
  "listings",
  "rfqs",
  "orders",
  "contracts",
  "negotiations",
  "reviews",
  "shipments",
  "routes",
  "vehicles",
  "drivers",
  "trackingEvents",
  "coldChainLogs",
  "wallets",
  "transactions",
  "escrowAccounts",
  "payouts",
  "invoices",
  "credits",
  "insurancePolicies",
  "stations",
  "forecasts",
  "alertRules",
  "commodities",
  "marketPrices",
  "priceEstimations",
  "pricePredictions",
  "recommendations",
  "marketSignals",
  "dataSources",
  "knowledgeBaseArticles",
  "researchReports",
  "fieldCases",
  "assignments",
  "reviewQueue",
  "datasets",
  "charts",
  "dashboards",
  "reports",
  "templates",
  "users",
  "orgs",
  "roles",
  "permissions",
  "apiTokens",
  "moduleToggles",
];

export const entityServices = Object.fromEntries(
  entityKeys.map((key) => [key, createEntityService(key)])
) as {
  [K in EntityKey]: EntityService<K>;
};
