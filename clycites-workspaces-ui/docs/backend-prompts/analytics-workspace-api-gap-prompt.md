You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Analytics workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `analytics`
- Entities: `datasets`, `charts`, `dashboards`, `reports`, `templates`
- Keep existing analytics endpoints backward compatible.

Current frontend alignment (already wired):
1. `charts`
- Uses:
  - `GET /api/v1/analytics/charts`
  - `POST /api/v1/analytics/charts`
  - `GET /api/v1/analytics/charts/{id}`
  - `PUT /api/v1/analytics/charts/{id}`
  - `DELETE /api/v1/analytics/charts/{id}`
  - `POST /api/v1/analytics/charts/preview`
  - `POST /api/v1/analytics/charts/preview/export`
  - `POST /api/v1/analytics/charts/{id}/export`
- Gap:
  - Frontend chart entity status model is `draft|published|archived`; add explicit status support (or canonical `uiStatus`) and transitions for publish/archive workflows.

2. `dashboards`
- Uses:
  - `GET /api/v1/analytics/dashboards`
  - `POST /api/v1/analytics/dashboards`
  - `GET /api/v1/analytics/dashboards/{id}`
  - `DELETE /api/v1/analytics/dashboards/{id}`
  - `POST /api/v1/analytics/dashboards/{id}/charts`
  - `DELETE /api/v1/analytics/dashboards/{id}/charts/{chartId}`
  - `PATCH /api/v1/analytics/dashboards/{id}/sharing`
- Gaps:
  - Missing update endpoint for dashboard metadata/layout:
    - `PATCH /api/v1/analytics/dashboards/{id}`
  - Missing explicit reorder endpoint:
    - `PATCH /api/v1/analytics/dashboards/{id}/charts/reorder`
  - Frontend status model is `draft|published|archived`; add status support or canonical `uiStatus`.

3. `datasets`
- Uses:
  - `GET /api/v1/analytics/datasets`
- Gaps:
  - No dataset lifecycle management endpoints for workspace CRUD flows:
    - `POST /api/v1/analytics/datasets`
    - `GET /api/v1/analytics/datasets/{id}`
    - `PATCH /api/v1/analytics/datasets/{id}`
    - `DELETE /api/v1/analytics/datasets/{id}` (if policy allows)
  - Frontend status model is `active|deprecated`; include explicit status (or `uiStatus`).

4. `templates`
- Uses:
  - `GET /api/v1/analytics/dashboards/templates`
- Gaps:
  - No template CRUD endpoints for first-class template workflows:
    - `POST /api/v1/analytics/dashboards/templates`
    - `GET /api/v1/analytics/dashboards/templates/{id}`
    - `PATCH /api/v1/analytics/dashboards/templates/{id}`
    - `DELETE /api/v1/analytics/dashboards/templates/{id}` (if policy allows)
  - Frontend status model is `draft|published|archived`; include explicit status (or `uiStatus`).

5. `reports`
- Current frontend fallback mapping uses prices endpoints:
  - `GET /api/v1/prices/report`
  - `POST /api/v1/prices/schedule-report`
- Gap:
  - Add analytics-native reports resource so analytics workspace is not coupled to prices routes:
    - `GET /api/v1/analytics/reports`
    - `POST /api/v1/analytics/reports`
    - `GET /api/v1/analytics/reports/{id}`
    - `PATCH /api/v1/analytics/reports/{id}`
    - `DELETE /api/v1/analytics/reports/{id}` (if policy allows)
    - optional workflow/export actions:
      - `POST /api/v1/analytics/reports/{id}/generate`
      - `POST /api/v1/analytics/reports/{id}/export`
- Frontend status model is `generated|exported|archived`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document valid transitions and clear `400` responses for invalid transitions.

3. Authorization and scoping
- Enforce org/user scoping for analytics resources.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add/update all analytics workspace endpoints, schemas, enums, and examples in `/api/docs.json`.
- Keep implementation and OpenAPI synchronized.

5. Compatibility
- Existing analytics endpoints must remain functional for current consumers.
- New capabilities should be additive and non-breaking.

Tests to add/update:
1. Dataset list + CRUD lifecycle once added.
2. Chart CRUD + preview/export + publish/archive status transitions.
3. Dashboard CRUD + attach/remove/reorder charts + sharing updates.
4. Template CRUD lifecycle once added.
5. Analytics-native reports CRUD + generate/export workflows.
6. OpenAPI contract snapshot for analytics workspace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing analytics endpoint additions and status harmonization.
