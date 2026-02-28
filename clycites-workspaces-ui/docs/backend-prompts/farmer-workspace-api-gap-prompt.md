You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Farmer workspace so frontend entity pages can run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `farmer`
- Entities: `farmers`, `farms`, `plots`, `crops`, `inputs`, `tasks`, `advisories`, `weatherAlerts`, `priceSignals`
- Do not use legacy endpoints for new behavior (`/api/v1/farmers/legacy/*`).

Current frontend expectations:
1. `farmers`
- CRUD profile on `/api/v1/farmers/profiles*`
- Verification workflow:
  - `POST /api/v1/farmers/profiles/{id}/verify` (`verified`/`rejected`)
  - `POST /api/v1/farmers/profiles/{id}/verify/submit`
- Needs deterministic lifecycle status: `draft|submitted|verified|rejected`

2. `farms`
- List/create/update already partially present:
  - `GET/POST /api/v1/farmers/{farmerId}/farms`
  - `PATCH /api/v1/farmers/farms/{farmId}`
- Missing for full entity UX:
  - `GET /api/v1/farmers/farms/{farmId}`
  - `DELETE /api/v1/farmers/farms/{farmId}` (soft delete preferred)

3. `plots`
- No dedicated modern endpoint set.
- Add dedicated plot APIs:
  - `GET /api/v1/farmers/{farmerId}/plots`
  - `POST /api/v1/farmers/{farmerId}/plots`
  - `GET /api/v1/farmers/plots/{plotId}`
  - `PATCH /api/v1/farmers/plots/{plotId}`
  - `DELETE /api/v1/farmers/plots/{plotId}`

4. `crops`
- Current support: list from production feed + create crop production.
- Add missing endpoints:
  - `GET /api/v1/farmers/{farmerId}/production/crops`
  - `GET /api/v1/farmers/production/crops/{cropId}`
  - `PATCH /api/v1/farmers/production/crops/{cropId}`
  - `DELETE /api/v1/farmers/production/crops/{cropId}`

5. `inputs`
- No dedicated input management endpoints.
- Add:
  - `GET /api/v1/farmers/{farmerId}/inputs`
  - `POST /api/v1/farmers/{farmerId}/inputs`
  - `GET /api/v1/farmers/inputs/{inputId}`
  - `PATCH /api/v1/farmers/inputs/{inputId}`
  - `DELETE /api/v1/farmers/inputs/{inputId}`

6. `tasks` (currently mapped to inquiries)
- Current support: create/list + follow-up/respond actions.
- Add missing CRUD-style support:
  - `GET /api/v1/expert-portal/inquiries/{id}`
  - `PATCH /api/v1/expert-portal/inquiries/{id}`
  - `DELETE /api/v1/expert-portal/inquiries/{id}`

7. `advisories`
- Current support: list/create/send/acknowledge.
- Missing for full workflow parity:
  - `GET /api/v1/expert-portal/advisories/{id}`
  - `PATCH /api/v1/expert-portal/advisories/{id}`
  - `DELETE /api/v1/expert-portal/advisories/{id}`
  - Review lifecycle endpoint(s) to support submit/approve/reject, e.g.:
    - `POST /api/v1/expert-portal/advisories/{id}/submit`
    - `POST /api/v1/expert-portal/advisories/{id}/review`

8. `weatherAlerts`
- Current support: list/get/acknowledge/dismiss.
- Missing:
  - Escalation endpoint:
    - `POST /api/v1/weather/alerts/{id}/escalate`
  - Optional admin simulation endpoint (if supported by product):
    - `POST /api/v1/weather/admin/simulate`

9. `priceSignals` (market-intelligence alerts)
- `GET/POST /api/v1/market-intelligence/alerts` and `PATCH/DELETE /{alertId}` already exist.
- Ensure filter/query support aligns with UI (`status`, `active`, region/product filters).

Cross-cutting requirements:
1. Response contract consistency:
- Success envelope should remain consistent with existing API patterns:
  - `{ success: true, data, meta? }`
- Include pagination meta where list endpoints are paginated.

2. Status model harmonization:
- Return explicit status fields that map cleanly to frontend entity statuses.
- Avoid requiring client-side guesswork from mixed fields.

3. Authorization:
- Enforce org/user scoping on all farmer workspace resources.
- Return proper `401/403/404` semantics.

4. OpenAPI updates:
- Add all new endpoints, params, schemas, and response bodies to `/api/docs.json`.
- Include request examples and enums for status transitions.

5. Backward compatibility:
- Keep existing endpoints working.
- Add new endpoints without breaking existing consumers.

Tests to add/update:
1. Farmer profile verification lifecycle.
2. Farms CRUD including delete.
3. Plots CRUD.
4. Crops CRUD.
5. Inputs CRUD.
6. Inquiry update/delete.
7. Advisory update/delete/review workflow.
8. Weather alert escalation.
9. OpenAPI snapshot/contract validation for new endpoints.

Deliverables:
1. Backend code changes.
2. Automated tests for each new capability.
3. Updated OpenAPI docs.
4. Short migration/changelog note listing added farmer-workspace endpoints.
