import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const adminWorkspaceApi = createWorkspaceEndpointApi("admin", API_ENDPOINT_CATALOG);
