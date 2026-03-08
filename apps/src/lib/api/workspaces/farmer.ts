import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const farmerWorkspaceApi = createWorkspaceEndpointApi("farmer", API_ENDPOINT_CATALOG);
