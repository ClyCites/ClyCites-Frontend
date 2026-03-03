You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Weather workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `weather`
- Entities: `stations`, `forecasts`, `weatherAlerts`, `alertRules`
- Keep existing weather endpoints backward compatible.

Current frontend alignment (already wired):
1. `stations` (mapped to weather profiles)
- Uses:
  - `GET /api/v1/weather/profiles/me`
  - `POST /api/v1/weather/profiles`
  - `GET /api/v1/weather/profiles/{id}`
  - `PATCH /api/v1/weather/profiles/{id}`
  - `DELETE /api/v1/weather/profiles/{id}`
- Also uses admin actions:
  - `POST /api/v1/weather/admin/refresh`
  - `GET /api/v1/weather/admin/providers`
  - `POST /api/v1/weather/admin/retry-deliveries`
  - `POST /api/v1/weather/admin/expire-alerts`
  - `POST /api/v1/weather/admin/prune-snapshots`
  - `POST /api/v1/weather/admin/profiles/{profileId}/refresh`
- Gap:
  - For workspace-level station management, we need an org-scoped list endpoint for multiple profiles (not only `me`):
    - `GET /api/v1/weather/profiles` with pagination/filtering and role-aware scoping.

2. `forecasts`
- Uses:
  - `GET /api/v1/weather/profiles/{profileId}/forecast`
  - Refresh action currently calls `POST /api/v1/weather/admin/refresh` (global refresh).
- Gap:
  - Need a profile-specific refresh endpoint suitable for UI action on selected forecast/profile, e.g.:
    - `POST /api/v1/weather/profiles/{profileId}/forecast/refresh`
  - Optional: expose forecast snapshot/history endpoints for auditability:
    - `GET /api/v1/weather/profiles/{profileId}/forecast/history`

3. `weatherAlerts`
- Uses:
  - `GET /api/v1/weather/org/{orgId}/alerts`
  - `GET /api/v1/weather/alerts/{id}`
  - `POST /api/v1/weather/alerts/{id}/acknowledge`
  - `POST /api/v1/weather/alerts/{id}/dismiss`
  - `POST /api/v1/weather/alerts/{id}/escalate`
- Frontend status model: `new | acknowledged | escalated | resolved`.
- Gap:
  - Ensure response payload has an explicit status field matching this model (or provide `uiStatus`).
  - Add optional resolution metadata in dismiss/escalate responses (`resolvedBy`, `resolvedAt`, `reason`).

4. `alertRules`
- Uses:
  - `GET /api/v1/weather/rules`
  - `POST /api/v1/weather/rules`
  - `GET /api/v1/weather/rules/{id}`
  - `PATCH /api/v1/weather/rules/{id}`
  - `DELETE /api/v1/weather/rules/{id}`
- Frontend workflow actions:
  - Activate / Disable (mapped to PATCH with `active`)
- Gap:
  - Add explicit rule test endpoint for UI toolbar action parity:
    - `POST /api/v1/weather/rules/{id}/test`
  - Return deterministic status in payload (`draft|active|disabled`) or canonical `uiStatus`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document valid transitions and reject invalid transitions with clear `400` responses.

3. Authorization and scoping
- Enforce role-aware access for org-wide weather profile listing and admin weather actions.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add/update all weather endpoints, schemas, enums, and examples in `/api/docs.json`.
- Ensure request/response payloads match implementation exactly.

5. Compatibility
- Existing weather endpoints must continue to work for current consumers.
- New endpoints should be additive and non-breaking.

Tests to add/update:
1. Weather profile list/create/update/delete with org scoping.
2. Forecast profile-specific refresh flow.
3. Weather alert status transitions (acknowledge/escalate/dismiss) and response contract.
4. Alert rule CRUD + activate/disable + rule test endpoint.
5. OpenAPI contract snapshot for weather workspace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing weather endpoint additions and status contract harmonization.
