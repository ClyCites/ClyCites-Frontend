You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Production workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `production`
- Entities: `cropCycles`, `growthStages`, `sensorReadings`, `pestIncidents`, `yieldPredictions`
- Keep existing endpoints backward compatible.

Current frontend alignment (already wired):
1. `cropCycles`
- Uses crop-production endpoints:
  - `GET /api/v1/farmers/{farmerId}/production/crops`
  - `POST /api/v1/farmers/{farmerId}/production/crops`
  - `GET /api/v1/farmers/production/crops/{cropId}`
  - `PATCH /api/v1/farmers/production/crops/{cropId}`
  - `DELETE /api/v1/farmers/production/crops/{cropId}`
- Frontend status model: `planned | active | completed`
- Backend status model currently: `planned | in_progress | harvested | sold | stored | failed`
- Requirement: return a consistent status field and/or a canonical mapping field so frontend status transitions are deterministic.

2. `growthStages`
- No dedicated growth-stage resource currently; frontend is deriving rows from crop production records.
- Add dedicated growth stage APIs:
  - `GET /api/v1/farmers/{farmerId}/production/growth-stages`
  - `POST /api/v1/farmers/{farmerId}/production/growth-stages`
  - `GET /api/v1/farmers/production/growth-stages/{stageId}`
  - `PATCH /api/v1/farmers/production/growth-stages/{stageId}`
  - `DELETE /api/v1/farmers/production/growth-stages/{stageId}`
- Suggested schema:
  - `cycleId`, `cropId`, `stage` (`seed|vegetative|flowering|maturity|harvested`), `observedAt`, `notes`, `status`.

3. `sensorReadings`
- Current support: read history only:
  - `GET /api/v1/weather/profiles/{profileId}/conditions/history`
- Missing for full entity UX:
  - `GET /api/v1/weather/conditions/{readingId}`
  - `PATCH /api/v1/weather/conditions/{readingId}` (flag/verify workflows)
  - Optional ingestion endpoint if manual capture is needed:
    - `POST /api/v1/weather/profiles/{profileId}/conditions`
- Frontend status model: `captured | flagged | verified`.

4. `pestIncidents`
- Current support:
  - `GET /api/v1/pest-disease/farmers/{farmerId}/reports`
  - `GET /api/v1/pest-disease/reports/{reportId}`
  - `POST /api/v1/pest-disease/reports/{reportId}/review`
  - `POST /api/v1/pest-disease/detect` (multipart/form-data with required `images`)
- Gap:
  - Frontend generic entity forms are JSON-based and cannot post multipart image arrays.
- Add JSON-friendly create/update endpoints for workspace CRUD parity:
  - `POST /api/v1/pest-disease/farmers/{farmerId}/reports`
  - `PATCH /api/v1/pest-disease/reports/{reportId}`
  - `DELETE /api/v1/pest-disease/reports/{reportId}`
- Add explicit assignment lifecycle endpoint(s):
  - `POST /api/v1/pest-disease/reports/{reportId}/assign`
  - `POST /api/v1/pest-disease/reports/{reportId}/close`
- Status harmonization needed:
  - Frontend: `created | assigned | resolved | closed`
  - Backend currently query enum: `pending | ai_analyzed | expert_reviewed | resolved`

5. `yieldPredictions`
- There is no dedicated yield-prediction resource.
- Frontend currently has to reuse pricing prediction APIs as a placeholder.
- Add dedicated yield prediction endpoints:
  - `GET /api/v1/farmers/{farmerId}/production/yield-predictions`
  - `POST /api/v1/farmers/{farmerId}/production/yield-predictions`
  - `GET /api/v1/farmers/production/yield-predictions/{predictionId}`
  - `PATCH /api/v1/farmers/production/yield-predictions/{predictionId}`
  - `DELETE /api/v1/farmers/production/yield-predictions/{predictionId}`
  - `POST /api/v1/farmers/production/yield-predictions/{predictionId}/refresh`
- Suggested payload fields:
  - `cropId`, `predictedYield`, `confidence`, `horizonDays`, `modelVersion`, `status` (`generated|refreshed|archived`).

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned with frontend enums, or return a canonical `uiStatus` to avoid client-side guesswork.

3. Authorization and scoping
- Enforce farmer/org ownership on all production resources.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add all new endpoints/params/schemas/examples to `/api/docs.json`.
- Document status enums and transition rules.

5. Compatibility
- Do not break existing consumers of current production/pest/weather routes.

Tests to add/update:
1. Crop production CRUD + status transitions/mapping.
2. Growth stages CRUD.
3. Sensor reading read/update (flag/verify) flow.
4. Pest incident JSON create/update/delete + assign/close flow.
5. Yield prediction CRUD + refresh flow.
6. OpenAPI contract snapshot for all added production endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing added production-workspace endpoints and status contract updates.
