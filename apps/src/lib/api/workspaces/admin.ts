import { API_ENDPOINT_CATALOG } from "@/lib/api/endpoint-catalog";
import type { ApiEndpointCatalogEntry } from "@/lib/api/endpoint-catalog";
import { createWorkspaceEndpointApi } from "./base";

const ADMIN_PRIVILEGED_PATHS = new Set<string>([
	"/api/v1/auth/super-admin/tokens",
	"/api/v1/auth/super-admin/tokens/{grantId}",
	"/api/v1/auth/super-admin/impersonation",
	"/api/v1/auth/super-admin/impersonation/{sessionId}",
	"/api/v1/farmers/profiles/{id}/verify",
	"/api/v1/farmers/{farmerId}/membership/eligibility",
	"/api/v1/farmers/stats",
	"/api/v1/disputes/{id}/resolve",
	"/api/v1/disputes/admin/all",
	"/api/v1/disputes/admin/stats",
	"/api/v1/disputes/{id}/review",
	"/api/v1/disputes/{id}/mediator",
	"/api/v1/disputes/{id}/close",
	"/api/v1/notifications/templates",
	"/api/v1/notifications/templates/{id}",
	"/api/v1/notifications/admin/retry-failed",
	"/api/v1/notifications/admin/expire-old",
	"/api/v1/notifications/templates/seed",
	"/api/v1/prices/bulk-import",
	"/api/v1/prices/{id}",
	"/api/v1/pricing/train",
	"/api/v1/expert-portal/experts/{id}/verify",
	"/api/v1/expert-portal/experts/{id}/suspend",
	"/api/v1/expert-portal/cases/ai-feedback",
	"/api/v1/expert-portal/cases/{id}/assign",
	"/api/v1/expert-portal/review-queue/{id}/approve",
	"/api/v1/expert-portal/review-queue/{id}/reject",
	"/api/v1/expert-portal/research-reports/{id}/publish",
	"/api/v1/expert-portal/knowledge/{id}/review",
	"/api/v1/expert-portal/knowledge/{id}/publish",
	"/api/v1/expert-portal/advisories/{id}/review",
	"/api/v1/expert-portal/inquiries/unassigned",
	"/api/v1/expert-portal/inquiries/{id}/assign",
	"/api/v1/weather/rules",
	"/api/v1/weather/rules/{id}",
	"/api/v1/weather/rules/seed",
	"/api/v1/weather/admin/refresh",
	"/api/v1/weather/admin/profiles/{profileId}/refresh",
	"/api/v1/weather/admin/retry-deliveries",
	"/api/v1/weather/admin/expire-alerts",
	"/api/v1/weather/admin/prune-snapshots",
	"/api/v1/weather/admin/providers",
	"/api/v1/weather/admin/simulate",
	"/api/v1/audit/suspicious",
	"/api/v1/market-intelligence/alerts/check",
	"/api/v1/users/admin",
	"/api/v1/users/admin/{id}",
	"/api/v1/users/admin/{id}/status",
	"/api/v1/users/admin/{id}/unlock",
	"/api/v1/users/admin/{id}/restore",
	"/api/v1/admin/organizations",
	"/api/v1/admin/roles",
	"/api/v1/admin/roles/{roleId}",
	"/api/v1/admin/permissions",
	"/api/v1/admin/permissions/{permissionId}",
	"/api/v1/admin/system/maintenance",
	"/api/v1/admin/system/feature-flags",
	"/api/v1/admin/system/feature-flags/{workspaceId}",
	"/api/v1/ready",
	"/api/v1/version",
]);

function mapToAdminScope(endpoint: ApiEndpointCatalogEntry): ApiEndpointCatalogEntry {
	if (endpoint.workspace === "admin") return endpoint;
	return {
		...endpoint,
		id: `${endpoint.id}-admin`,
		workspace: "admin",
	};
}

function buildAdminEndpointCatalog(): ApiEndpointCatalogEntry[] {
	const directAdmin = API_ENDPOINT_CATALOG.filter((endpoint) => endpoint.workspace === "admin");
	const privileged = API_ENDPOINT_CATALOG.filter((endpoint) => ADMIN_PRIVILEGED_PATHS.has(endpoint.path)).map(mapToAdminScope);

	const deduped = new Map<string, ApiEndpointCatalogEntry>();
	[...directAdmin, ...privileged].forEach((entry) => {
		deduped.set(entry.id, entry);
	});
	return Array.from(deduped.values());
}

export const adminWorkspaceApi = createWorkspaceEndpointApi("admin", buildAdminEndpointCatalog);
