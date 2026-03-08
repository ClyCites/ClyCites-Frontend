import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const productionWorkspaceApi = createWorkspaceEndpointApi("production", API_ENDPOINT_CATALOG);
