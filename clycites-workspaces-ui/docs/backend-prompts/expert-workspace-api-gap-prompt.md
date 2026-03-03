You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Expert workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `expert`
- Entities: `advisories`, `knowledgeBaseArticles`, `researchReports`, `fieldCases`, `assignments`, `reviewQueue`
- Keep existing expert-portal endpoints backward compatible.

Current frontend alignment (already wired):
1. `advisories`
- Uses:
  - `GET /api/v1/expert-portal/advisories`
  - `POST /api/v1/expert-portal/advisories`
  - `GET /api/v1/expert-portal/advisories/{id}`
  - `PATCH /api/v1/expert-portal/advisories/{id}`
  - `DELETE /api/v1/expert-portal/advisories/{id}`
  - `POST /api/v1/expert-portal/advisories/{id}/submit`
  - `POST /api/v1/expert-portal/advisories/{id}/review`
  - `POST /api/v1/expert-portal/advisories/{id}/send`
  - `POST /api/v1/expert-portal/advisories/{id}/acknowledge`
- Frontend status model: `draft|in_review|approved|rejected|published|acknowledged`.
- Gap:
  - Ensure API consistently returns status compatible with this model (or provide canonical `uiStatus`).

2. `knowledgeBaseArticles`
- Uses:
  - `GET /api/v1/expert-portal/knowledge`
  - `POST /api/v1/expert-portal/knowledge`
  - `GET /api/v1/expert-portal/knowledge/{id}`
  - `PATCH /api/v1/expert-portal/knowledge/{id}`
  - `POST /api/v1/expert-portal/knowledge/{id}/submit`
  - `POST /api/v1/expert-portal/knowledge/{id}/review`
  - `POST /api/v1/expert-portal/knowledge/{id}/publish`
- Frontend status model: `draft|in_review|approved|rejected|published|unpublished|archived`.
- Gap:
  - If article delete is supported by business logic, add `DELETE /api/v1/expert-portal/knowledge/{id}`.
  - Otherwise document explicit retention/no-delete behavior in OpenAPI descriptions.

3. `fieldCases`
- Uses:
  - `GET /api/v1/expert-portal/cases`
  - `POST /api/v1/expert-portal/inquiries` (temporary create path)
  - `POST /api/v1/expert-portal/cases/{id}/assign`
  - `POST /api/v1/expert-portal/cases/{id}/start`
  - `POST /api/v1/expert-portal/cases/{id}/submit`
- Frontend status model: `created|assigned|in_visit|resolved|closed`.
- Gaps:
  - Add canonical case detail endpoint:
    - `GET /api/v1/expert-portal/cases/{id}`
  - Add direct case CRUD lifecycle endpoints (or equivalent) so case records are first-class:
    - `POST /api/v1/expert-portal/cases`
    - `PATCH /api/v1/expert-portal/cases/{id}`
    - `DELETE /api/v1/expert-portal/cases/{id}` (if allowed)
  - Add close action endpoint to separate resolve vs close:
    - `POST /api/v1/expert-portal/cases/{id}/close`
  - Improve assignment ergonomics:
    - keep `POST /cases/{id}/assign` with `expertId`
    - add self-assign action for current expert (or make `expertId` optional when actor is expert), e.g.:
      - `POST /api/v1/expert-portal/cases/{id}/assign-self`

4. `assignments`
- Current frontend source:
  - `GET /api/v1/expert-portal/cases/my` (derived list)
- Frontend status model: `created|assigned|completed|cancelled`.
- Gap:
  - Add dedicated assignment resource endpoints for stable semantics:
    - `GET /api/v1/expert-portal/assignments`
    - `GET /api/v1/expert-portal/assignments/{id}`
    - optional `PATCH /api/v1/expert-portal/assignments/{id}` for reassignment/completion metadata.

5. `reviewQueue`
- Current frontend source:
  - `GET /api/v1/expert-portal/cases` with pending-like filters (derived queue)
- Frontend status model: `queued|in_review|approved|rejected`.
- Gap:
  - Add dedicated review queue endpoints:
    - `GET /api/v1/expert-portal/review-queue`
    - `GET /api/v1/expert-portal/review-queue/{id}`
    - `POST /api/v1/expert-portal/review-queue/{id}/approve`
    - `POST /api/v1/expert-portal/review-queue/{id}/reject`

6. `researchReports`
- Gap:
  - No dedicated endpoints currently exposed for this entity.
  - Add full API support:
    - `GET /api/v1/expert-portal/research-reports`
    - `POST /api/v1/expert-portal/research-reports`
    - `GET /api/v1/expert-portal/research-reports/{id}`
    - `PATCH /api/v1/expert-portal/research-reports/{id}`
    - `DELETE /api/v1/expert-portal/research-reports/{id}` (if policy allows)
    - workflow actions:
      - `POST /api/v1/expert-portal/research-reports/{id}/submit`
      - `POST /api/v1/expert-portal/research-reports/{id}/publish`
      - `POST /api/v1/expert-portal/research-reports/{id}/archive`
- Frontend status model: `draft|in_review|published|archived`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document valid transitions and return clear `400` errors for invalid transitions.

3. Authorization and scoping
- Enforce role-aware access across expert roles/admin roles.
- Correct `401/403/404` behavior for unauthorized, forbidden, and not-found.

4. OpenAPI updates
- Add/update all expert workspace endpoints, request schemas, response schemas, enums, and examples in `/api/docs.json`.
- Ensure implementation and docs stay in sync.

5. Compatibility
- Existing expert-portal endpoints must remain functional for current consumers.
- New capabilities should be additive and non-breaking.

Tests to add/update:
1. Advisories CRUD + submit/review/send/acknowledge transitions.
2. Knowledge article create/update + submit/review/publish transitions.
3. Field case lifecycle including assign/start/submit/close and self-assign behavior.
4. Assignments dedicated listing/details semantics.
5. Review queue list and approve/reject actions.
6. Research reports CRUD + workflow actions.
7. OpenAPI contract snapshot for expert workspace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing expert endpoint additions and status-contract harmonization.
