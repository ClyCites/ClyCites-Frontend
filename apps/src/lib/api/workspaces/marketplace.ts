import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const marketplaceWorkspaceApi = createWorkspaceEndpointApi("marketplace", API_ENDPOINT_CATALOG);
