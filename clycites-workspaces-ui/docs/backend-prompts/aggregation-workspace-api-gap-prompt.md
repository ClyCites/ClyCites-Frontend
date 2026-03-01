You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Aggregation workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `aggregation`
- Entities: `warehouses`, `storageBins`, `batches`, `qualityGrades`, `stockMovements`, `spoilageReports`
- Keep existing logistics and pest-disease endpoints backward compatible.

Current frontend alignment (already wired):
1. `warehouses`
- Mapped to logistics collection points:
  - `GET /api/v1/logistics/collection-points`
  - `POST /api/v1/logistics/collection-points`
  - `GET /api/v1/logistics/collection-points/{id}`
  - `PATCH /api/v1/logistics/collection-points/{id}`
  - `DELETE /api/v1/logistics/collection-points/{id}`
- Frontend status model: `active | maintenance | inactive`
- Current backend model is type/address centric and does not expose a clear lifecycle status field for warehouse operations.

2. `storageBins`
- No dedicated API endpoints currently.
- Add dedicated bin endpoints:
  - `GET /api/v1/aggregation/warehouses/{warehouseId}/bins`
  - `POST /api/v1/aggregation/warehouses/{warehouseId}/bins`
  - `GET /api/v1/aggregation/bins/{binId}`
  - `PATCH /api/v1/aggregation/bins/{binId}`
  - `DELETE /api/v1/aggregation/bins/{binId}`
- Suggested schema:
  - `warehouseId`, `name`, `capacity`, `capacityUnit`, `temperatureControl`, `currentLoad`, `status` (`available|occupied|maintenance`).

3. `batches`
- No dedicated API endpoints currently.
- Add dedicated batch endpoints:
  - `GET /api/v1/aggregation/batches`
  - `POST /api/v1/aggregation/batches`
  - `GET /api/v1/aggregation/batches/{batchId}`
  - `PATCH /api/v1/aggregation/batches/{batchId}`
  - `DELETE /api/v1/aggregation/batches/{batchId}`
- Suggested schema:
  - `commodity`, `quantity`, `unit`, `grade`, `warehouseId`, `binId`, `receivedAt`, `status` (`received|stored|dispatched|closed`).

4. `qualityGrades`
- No dedicated API endpoints currently.
- Add dedicated quality grading endpoints:
  - `GET /api/v1/aggregation/quality-grades`
  - `POST /api/v1/aggregation/quality-grades`
  - `GET /api/v1/aggregation/quality-grades/{gradeId}`
  - `PATCH /api/v1/aggregation/quality-grades/{gradeId}`
  - `DELETE /api/v1/aggregation/quality-grades/{gradeId}`
- Suggested schema:
  - `batchId`, `grade`, `notes`, `assessedBy`, `assessedAt`, `status` (`draft|verified|final`).

5. `stockMovements`
- Currently mapped to shipment endpoints:
  - `GET /api/v1/logistics/shipments`
  - `POST /api/v1/logistics/shipments`
  - `PATCH /api/v1/logistics/shipments/{id}/status`
- Missing for full entity UX:
  - `GET /api/v1/aggregation/stock-movements/{movementId}`
  - `PATCH /api/v1/aggregation/stock-movements/{movementId}`
  - `DELETE /api/v1/aggregation/stock-movements/{movementId}`
- If logistics shipment endpoints remain the source of truth, add an aggregation projection endpoint that returns stock-movement-native fields:
  - `movementType` (`receive|transfer|dispatch`), `sourceId`, `destinationId`, `quantity`, `status` (`draft|confirmed|completed|rejected`).

6. `spoilageReports`
- Currently mapped to outbreak listing endpoint:
  - `GET /api/v1/pest-disease/outbreaks`
- This is not a true spoilage CRUD model.
- Add dedicated spoilage report endpoints:
  - `GET /api/v1/aggregation/spoilage-reports`
  - `POST /api/v1/aggregation/spoilage-reports`
  - `GET /api/v1/aggregation/spoilage-reports/{reportId}`
  - `PATCH /api/v1/aggregation/spoilage-reports/{reportId}`
  - `DELETE /api/v1/aggregation/spoilage-reports/{reportId}`
- Suggested schema:
  - `batchId`, `quantity`, `unit`, `cause`, `reportedAt`, `reportedBy`, `status` (`reported|approved|closed`).

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` on paginated list endpoints.

2. Status contract
- Return explicit status fields aligned with frontend enums, or include canonical `uiStatus` where backend domain statuses differ.

3. Authorization and scoping
- Enforce org ownership on aggregation resources.
- Return correct `401/403/404` semantics.

4. OpenAPI updates
- Add all new aggregation endpoints, schemas, params, and examples to `/api/docs.json`.
- Document allowed status transitions and enums.

5. Compatibility
- Existing logistics and pest-disease routes must continue to work for current consumers.
- New aggregation routes should be additive, not breaking.

Tests to add/update:
1. Warehouses lifecycle with explicit status mapping.
2. Storage bins CRUD.
3. Batches CRUD.
4. Quality grades CRUD.
5. Stock movement get/update/delete and status transition rules.
6. Spoilage reports CRUD.
7. OpenAPI contract snapshot for all added aggregation endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing added aggregation endpoints and status contract changes.
