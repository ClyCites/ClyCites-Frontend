You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Admin workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `admin`
- Entities: `users`, `orgs`, `roles`, `permissions`, `apiTokens`, `moduleToggles`
- Keep existing auth/admin/organization endpoints backward compatible.

Current frontend alignment (already wired):
1. `users`
- Uses:
  - `GET /api/v1/organizations/{id}/members`
  - `POST /api/v1/organizations/{id}/members/invite`
  - `PATCH /api/v1/organizations/{id}/members/{memberId}/role`
  - `DELETE /api/v1/organizations/{id}/members/{memberId}`
- Gap:
  - Frontend status model is `active|disabled`, but membership APIs are role-focused.
  - Add explicit member lifecycle/status support (or canonical `uiStatus`), e.g.:
    - `POST /api/v1/organizations/{id}/members/{memberId}/disable`
    - `POST /api/v1/organizations/{id}/members/{memberId}/enable`

2. `orgs`
- Uses:
  - `GET /api/v1/organizations/me`
  - `POST /api/v1/organizations`
  - `GET /api/v1/organizations/{id}`
  - `PATCH /api/v1/organizations/{id}`
- Gaps:
  - No delete/archive endpoint for org lifecycle in admin workspace.
  - Frontend status model is `active|disabled`; add explicit enable/disable behavior (or `uiStatus`) in response contract.
  - Optional for super-admin views: add platform-wide organizations list endpoint (not only `me` scope), e.g.:
    - `GET /api/v1/admin/organizations`

3. `roles`
- Current frontend source:
  - `GET /api/v1/auth/me` (derived roles of current user)
- Gap:
  - Add dedicated role management endpoints:
    - `GET /api/v1/admin/roles`
    - `POST /api/v1/admin/roles`
    - `GET /api/v1/admin/roles/{roleId}`
    - `PATCH /api/v1/admin/roles/{roleId}`
    - `DELETE /api/v1/admin/roles/{roleId}`
  - Frontend status model: `active|deprecated`.

4. `permissions`
- Current frontend source:
  - `GET /api/v1/auth/me` (derived current-user permissions)
- Gap:
  - Add permission catalog endpoints:
    - `GET /api/v1/admin/permissions`
    - `GET /api/v1/admin/permissions/{permissionId}`
  - Optional permission governance endpoints:
    - `POST /api/v1/admin/permissions`
    - `PATCH /api/v1/admin/permissions/{permissionId}`
    - `DELETE /api/v1/admin/permissions/{permissionId}`
  - Frontend status model: `active|deprecated`.

5. `apiTokens`
- Uses:
  - `GET /api/v1/auth/tokens`
  - `POST /api/v1/auth/tokens`
  - `GET /api/v1/auth/tokens/{id}`
  - `PATCH /api/v1/auth/tokens/{id}`
  - `POST /api/v1/auth/tokens/{id}/rotate`
  - `POST /api/v1/auth/tokens/{id}/revoke`
  - `GET /api/v1/auth/tokens/{id}/usage`
- Frontend status model: `active|revoked|expired`.
- Gap:
  - Ensure deterministic token status in list/detail payloads (or include `uiStatus`) and clear lifecycle transition errors.

6. `moduleToggles`
- Uses:
  - `GET /api/v1/admin/system/feature-flags`
  - `PATCH /api/v1/admin/system/feature-flags`
- Frontend treats each workspace flag as an entity (`enabled|disabled`).
- Gap:
  - Optional convenience endpoints for per-workspace flag operations:
    - `GET /api/v1/admin/system/feature-flags/{workspaceId}`
    - `PATCH /api/v1/admin/system/feature-flags/{workspaceId}`
  - Ensure response payload exposes stable workspace IDs and boolean enabled state for each module.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document valid transitions and reject invalid transitions with clear `400` responses.

3. Authorization and scoping
- Enforce role-aware access for org admin vs super admin.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add/update all admin workspace endpoints, schemas, enums, and examples in `/api/docs.json`.
- Keep implementation and docs in sync.

5. Compatibility
- Existing `/api/v1/auth/*`, `/api/v1/organizations/*`, and `/api/v1/admin/system/*` routes must continue to work.
- New capabilities should be additive and non-breaking.

Tests to add/update:
1. Organization members invite/update-role/remove + status enable/disable (if added).
2. Organization create/list/get/update + status/disable semantics.
3. Roles CRUD lifecycle.
4. Permissions catalog and lifecycle endpoints.
5. API tokens create/update/rotate/revoke/usage + status contract.
6. Module toggles read/update and workspace-level consistency.
7. OpenAPI contract snapshot for admin workspace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing admin endpoint additions and status-contract harmonization.
