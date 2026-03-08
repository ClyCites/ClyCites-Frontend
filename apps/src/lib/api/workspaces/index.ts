import type { ApiEndpointCatalogEntry, ApiMethod } from "@/lib/api/endpoint-catalog";
import type { WorkspaceId } from "@/lib/store/types";
import { adminWorkspaceApi } from "./admin";
import { aggregationWorkspaceApi } from "./aggregation";
import { analyticsWorkspaceApi } from "./analytics";
import type { WorkspaceEndpointApi, WorkspaceEndpointExecutionOptions } from "./base";
import { expertWorkspaceApi } from "./expert";
import { farmerWorkspaceApi } from "./farmer";
import { financeWorkspaceApi } from "./finance";
import { logisticsWorkspaceApi } from "./logistics";
import { marketplaceWorkspaceApi } from "./marketplace";
import { pricesWorkspaceApi } from "./prices";
import { productionWorkspaceApi } from "./production";
import { weatherWorkspaceApi } from "./weather";

const WORKSPACE_API_MAP: Record<WorkspaceId, WorkspaceEndpointApi> = {
  admin: adminWorkspaceApi,
  aggregation: aggregationWorkspaceApi,
  analytics: analyticsWorkspaceApi,
  expert: expertWorkspaceApi,
  farmer: farmerWorkspaceApi,
  finance: financeWorkspaceApi,
  logistics: logisticsWorkspaceApi,
  marketplace: marketplaceWorkspaceApi,
  prices: pricesWorkspaceApi,
  production: productionWorkspaceApi,
  weather: weatherWorkspaceApi,
};

function getWorkspaceApi(workspaceId: WorkspaceId): WorkspaceEndpointApi {
  return WORKSPACE_API_MAP[workspaceId];
}

export type { ApiEndpointCatalogEntry, ApiMethod, WorkspaceEndpointExecutionOptions };

export function listWorkspaceEndpoints(workspaceId: WorkspaceId): ApiEndpointCatalogEntry[] {
  return getWorkspaceApi(workspaceId).listEndpoints();
}

export function getWorkspaceEndpoint(workspaceId: WorkspaceId, endpointId: string): ApiEndpointCatalogEntry | undefined {
  return getWorkspaceApi(workspaceId).getEndpoint(endpointId);
}

export function executeWorkspaceEndpoint(
  workspaceId: WorkspaceId,
  endpointId: string,
  options?: WorkspaceEndpointExecutionOptions
): Promise<unknown> {
  return getWorkspaceApi(workspaceId).executeEndpoint(endpointId, options);
}
