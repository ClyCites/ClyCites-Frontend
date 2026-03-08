import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const financeWorkspaceApi = createWorkspaceEndpointApi("finance", () => API_ENDPOINT_CATALOG);
