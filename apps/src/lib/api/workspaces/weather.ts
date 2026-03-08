import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

export const weatherWorkspaceApi = createWorkspaceEndpointApi("weather", API_ENDPOINT_CATALOG);
