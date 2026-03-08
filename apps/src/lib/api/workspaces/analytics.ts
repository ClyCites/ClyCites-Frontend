import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const analyticsWorkspaceApi = createWorkspaceEndpointApi("analytics", API_ENDPOINT_CATALOG);