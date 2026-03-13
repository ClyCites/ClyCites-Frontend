import { apiRequest } from "@/lib/api/real/http";
import type { ApiEndpointCatalogEntry } from "@/lib/api/endpoint-catalog";
import type { WorkspaceId } from "@/lib/store/types";

export interface WorkspaceEndpointExecutionOptions {
  pathParams?: Record<string, string>;
  requestBody?: string;
}

export interface WorkspaceEndpointApi {
  workspaceId: WorkspaceId;
  listEndpoints: () => ApiEndpointCatalogEntry[];
  getEndpoint: (endpointId: string) => ApiEndpointCatalogEntry | undefined;
  executeEndpoint: (endpointId: string, options?: WorkspaceEndpointExecutionOptions) => Promise<unknown>;
}

function resolvePathTemplate(path: string, values: Record<string, string> | undefined): string {
  return path.replace(/\{([a-zA-Z0-9_]+)\}/g, (_match, key: string) => {
    const value = values?.[key]?.trim();
    if (!value) {
      throw new Error(`Missing value for "${key}".`);
    }
    return encodeURIComponent(value);
  });
}

function parseRequestBody(bodyText: string | undefined, method: ApiEndpointCatalogEntry["method"]): string | undefined {
  const acceptsBody = method === "POST" || method === "PUT" || method === "PATCH" || method === "DELETE";
  if (!acceptsBody) return undefined;
  if (!bodyText || bodyText.trim().length === 0) return undefined;
  return JSON.stringify(JSON.parse(bodyText));
}

export function createWorkspaceEndpointApi(
  workspaceId: WorkspaceId,
  getAllEndpoints: () => ApiEndpointCatalogEntry[]
): WorkspaceEndpointApi {
  const getWorkspaceEndpoints = (): ApiEndpointCatalogEntry[] =>
    getAllEndpoints().filter((endpoint) => endpoint.workspace === workspaceId);

  return {
    workspaceId,
    listEndpoints: () => getWorkspaceEndpoints(),
    getEndpoint: (endpointId) => getWorkspaceEndpoints().find((endpoint) => endpoint.id === endpointId),
    executeEndpoint: async (endpointId, options) => {
      const endpoint = getWorkspaceEndpoints().find((candidate) => candidate.id === endpointId);
      if (!endpoint) {
        throw new Error(`Endpoint "${endpointId}" was not found in workspace "${workspaceId}".`);
      }

      const path = resolvePathTemplate(endpoint.path, options?.pathParams);
      const body = parseRequestBody(options?.requestBody, endpoint.method);
      return apiRequest<unknown>(path, { method: endpoint.method, body }, { auth: true });
    },
  };
}
