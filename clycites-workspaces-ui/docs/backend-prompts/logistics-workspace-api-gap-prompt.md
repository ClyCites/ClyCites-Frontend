You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Logistics workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `logistics`
- Entities: `shipments`, `routes`, `vehicles`, `drivers`, `trackingEvents`, `coldChainLogs`
- Keep existing logistics endpoints backward compatible.

Current frontend alignment (already wired):
1. `shipments`
- Uses existing shipment endpoints:
  - `GET /api/v1/logistics/shipments`
  - `POST /api/v1/logistics/shipments`
  - `GET /api/v1/logistics/shipments/{id}`
  - `PATCH /api/v1/logistics/shipments/{id}/status`
  - `POST /api/v1/logistics/shipments/{id}/tracking`
  - `POST /api/v1/logistics/shipments/{id}/proof-of-delivery`
- Frontend status model: `planned | in_transit | delivered | cancelled`.
- Backend status model currently: `created | assigned | picked_up | in_transit | delivered | cancelled | returned`.
- Requirement: expose canonical status mapping (or a dedicated `uiStatus`) to avoid client-side guesswork.

2. `routes`
- No dedicated route endpoints currently.
- Add dedicated route APIs:
  - `GET /api/v1/logistics/routes`
  - `POST /api/v1/logistics/routes`
  - `GET /api/v1/logistics/routes/{routeId}`
  - `PATCH /api/v1/logistics/routes/{routeId}`
  - `DELETE /api/v1/logistics/routes/{routeId}`
- Suggested schema:
  - `origin`, `destination`, `distanceKm`, `waypoints`, `status` (`draft|active|archived`).

3. `vehicles`
- No dedicated fleet vehicle endpoints currently.
- Add dedicated vehicle APIs:
  - `GET /api/v1/logistics/vehicles`
  - `POST /api/v1/logistics/vehicles`
  - `GET /api/v1/logistics/vehicles/{vehicleId}`
  - `PATCH /api/v1/logistics/vehicles/{vehicleId}`
  - `DELETE /api/v1/logistics/vehicles/{vehicleId}`
- Suggested schema:
  - `registration`, `capacityKg`, `coldChainEnabled`, `available`, `status` (`available|assigned|maintenance|inactive`).

4. `drivers`
- No dedicated driver endpoints currently.
- Add dedicated driver APIs:
  - `GET /api/v1/logistics/drivers`
  - `POST /api/v1/logistics/drivers`
  - `GET /api/v1/logistics/drivers/{driverId}`
  - `PATCH /api/v1/logistics/drivers/{driverId}`
  - `DELETE /api/v1/logistics/drivers/{driverId}`
- Suggested schema:
  - `name`, `phone`, `licenseNumber`, `available`, `status` (`available|assigned|inactive`).

5. `trackingEvents`
- Shipment tracking can be posted via `/shipments/{id}/tracking` but there is no standalone tracking event resource for listing/get/update/delete.
- Add dedicated tracking APIs:
  - `GET /api/v1/logistics/tracking-events`
  - `POST /api/v1/logistics/tracking-events`
  - `GET /api/v1/logistics/tracking-events/{eventId}`
  - `PATCH /api/v1/logistics/tracking-events/{eventId}`
  - `DELETE /api/v1/logistics/tracking-events/{eventId}`
- Suggested schema:
  - `shipmentId`, `location`, `note`, `eventType`, `recordedAt`, `status` (`created|verified|closed`).

6. `coldChainLogs`
- No dedicated cold-chain log endpoints currently.
- Add dedicated cold-chain APIs:
  - `GET /api/v1/logistics/cold-chain-logs`
  - `POST /api/v1/logistics/cold-chain-logs`
  - `GET /api/v1/logistics/cold-chain-logs/{logId}`
  - `PATCH /api/v1/logistics/cold-chain-logs/{logId}`
  - `DELETE /api/v1/logistics/cold-chain-logs/{logId}`
  - Optional workflow action endpoint:
    - `POST /api/v1/logistics/cold-chain-logs/flag-violations`
- Suggested schema:
  - `shipmentId`, `temperatureC`, `thresholdC`, `violation`, `capturedAt`, `status` (`normal|violation|resolved`).

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for list endpoints.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include a canonical `uiStatus` mapping.
- Validate status transitions and return clear `400` errors on invalid transitions.

3. Authorization and scoping
- Enforce org/user scoping for all logistics resources.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add all new endpoints/params/schemas/examples to `/api/docs.json`.
- Ensure enums and transition docs are explicit.

5. Compatibility
- Keep current logistics endpoints stable for existing clients.
- New logistics resources should be additive and non-breaking.

Tests to add/update:
1. Shipment create/list/get/status transition mapping.
2. Routes CRUD.
3. Vehicles CRUD.
4. Drivers CRUD.
5. Tracking events CRUD + relation to shipment timeline.
6. Cold-chain logs CRUD + violation flag workflow.
7. OpenAPI contract snapshot for all added logistics endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing logistics endpoint additions and status harmonization updates.
