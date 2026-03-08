import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const expertWorkspaceApi = createWorkspaceEndpointApi("expert", API_ENDPOINT_CATALOG);
