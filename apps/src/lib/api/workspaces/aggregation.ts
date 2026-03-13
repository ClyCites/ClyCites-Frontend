import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const aggregationWorkspaceApi = createWorkspaceEndpointApi("aggregation", () => API_ENDPOINT_CATALOG);
