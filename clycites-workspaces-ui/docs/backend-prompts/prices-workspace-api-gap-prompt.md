You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Prices workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `prices`
- Entities: `commodities`, `marketPrices`, `priceEstimations`, `pricePredictions`, `recommendations`, `marketSignals`, `dataSources`
- Keep existing products/prices/market-intelligence endpoints backward compatible.

Current frontend alignment (already wired):
1. `commodities`
- Uses:
  - `GET /api/v1/products`
  - `POST /api/v1/products`
  - `GET /api/v1/products/{id}`
  - `PUT /api/v1/products/{id}`
  - `DELETE /api/v1/products/{id}`
- Also uses market-intelligence read actions:
  - `GET /api/v1/market-intelligence/insights`
  - `GET /api/v1/market-intelligence/trends`
  - `GET /api/v1/market-intelligence/compare`

2. `marketPrices`
- Uses:
  - `GET /api/v1/prices`
  - `POST /api/v1/prices`
  - `GET /api/v1/prices/{id}`
  - `PUT /api/v1/prices/{id}`
  - `DELETE /api/v1/prices/{id}`
- Gap:
  - UI status model is `captured|validated|published`; ensure payload includes either aligned status or canonical `uiStatus` mapping.

3. `marketSignals`
- Uses:
  - `GET /api/v1/market-intelligence/alerts`
  - `POST /api/v1/market-intelligence/alerts`
  - `PATCH /api/v1/market-intelligence/alerts/{alertId}`
  - `DELETE /api/v1/market-intelligence/alerts/{alertId}`
- Frontend status model: `new|investigating|investigated|dismissed`.
- Gap:
  - Ensure deterministic status mapping for alert payloads (`active/investigated/...` -> UI statuses).

4. `priceEstimations`
- Current backend support is only prediction-style create:
  - `POST /api/v1/pricing/predict`
- Missing for full entity UX:
  - `GET /api/v1/pricing/estimations`
  - `GET /api/v1/pricing/estimations/{estimationId}`
  - `PATCH /api/v1/pricing/estimations/{estimationId}`
  - `DELETE /api/v1/pricing/estimations/{estimationId}`
- Frontend status model: `draft|submitted|approved`.

5. `pricePredictions`
- Current backend support is create-only prediction:
  - `POST /api/v1/prices/predict`
- Missing for full entity UX:
  - `GET /api/v1/prices/predictions`
  - `GET /api/v1/prices/predictions/{predictionId}`
  - `PATCH /api/v1/prices/predictions/{predictionId}`
  - `DELETE /api/v1/prices/predictions/{predictionId}`
  - Optional action endpoint:
    - `POST /api/v1/prices/predictions/{predictionId}/regenerate`
- Frontend status model: `generated|compared|archived`.

6. `recommendations`
- Current backend support is read-only recommendation endpoint:
  - `GET /api/v1/market-intelligence/price-recommendation`
- Missing for entity workflow:
  - `POST /api/v1/market-intelligence/recommendations`
  - `GET /api/v1/market-intelligence/recommendations/{recommendationId}`
  - `PATCH /api/v1/market-intelligence/recommendations/{recommendationId}`
  - `DELETE /api/v1/market-intelligence/recommendations/{recommendationId}`
  - Optional workflow endpoints:
    - `POST /api/v1/market-intelligence/recommendations/{recommendationId}/approve`
    - `POST /api/v1/market-intelligence/recommendations/{recommendationId}/publish`
- Frontend status model: `draft|approved|published|retracted`.

7. `dataSources`
- Current frontend uses weather provider health endpoint as placeholder:
  - `GET /api/v1/weather/admin/providers`
- Missing dedicated price data-source management endpoints:
  - `GET /api/v1/market-intelligence/data-sources`
  - `POST /api/v1/market-intelligence/data-sources`
  - `GET /api/v1/market-intelligence/data-sources/{sourceId}`
  - `PATCH /api/v1/market-intelligence/data-sources/{sourceId}`
  - `DELETE /api/v1/market-intelligence/data-sources/{sourceId}`
  - Optional action endpoint:
    - `POST /api/v1/market-intelligence/data-sources/{sourceId}/refresh`
- Frontend status model: `active|paused|disabled`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document valid transitions and clear `400` validation errors for invalid transitions.

3. Authorization and scoping
- Enforce org/user scoping for all prices and market-intelligence resources.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add/update all prices workspace endpoints, request schemas, response schemas, enums, and examples in `/api/docs.json`.

5. Compatibility
- Existing endpoints must remain functional for current consumers.
- New endpoints should be additive and non-breaking.

Tests to add/update:
1. Commodities CRUD and insight/trend/compare queries.
2. Market prices CRUD + status mapping contract.
3. Market signals CRUD + status mapping contract.
4. Price estimations CRUD + workflow transitions.
5. Price predictions create/list/get/update/delete (+ regenerate if added).
6. Recommendations CRUD/workflow (approve/publish/retract).
7. Data sources CRUD + refresh action.
8. OpenAPI contract snapshot for prices workspace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing prices endpoint additions and status harmonization.
