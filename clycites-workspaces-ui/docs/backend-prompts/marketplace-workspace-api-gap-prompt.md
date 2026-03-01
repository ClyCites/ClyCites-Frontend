You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Marketplace workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `marketplace`
- Entities: `listings`, `rfqs`, `orders`, `contracts`, `negotiations`, `reviews`
- Keep existing marketplace, orders, disputes, messaging, and reputation endpoints backward compatible.

Current frontend alignment (already wired):
1. `listings`
- Uses:
  - `GET /api/v1/listings`
  - `POST /api/v1/listings`
  - `GET /api/v1/listings/{id}`
  - `PATCH /api/v1/listings/{id}`
  - `DELETE /api/v1/listings/{id}`
- Also uses media linkage action through media service.
- Frontend status model: `draft | published | paused | closed`.

2. `rfqs` (currently mapped to offers)
- Uses:
  - `GET /api/v1/offers`
  - `POST /api/v1/offers`
  - `GET /api/v1/offers/{offerId}`
  - `POST /api/v1/offers/{offerId}/accept`
  - `POST /api/v1/offers/{offerId}/withdraw`
- Frontend status model: `open | responded | shortlisted | closed`.
- Backend offer statuses may differ (e.g., pending/accepted/rejected/withdrawn/countered).
- Requirement: expose canonical status mapping field (or native enum alignment) for deterministic UI behavior.

3. `orders`
- Uses:
  - `GET /api/v1/orders/my-orders`
  - `POST /api/v1/orders`
  - `GET /api/v1/orders/{id}`
  - `PATCH /api/v1/orders/{id}/status`
- Frontend status model: `created | accepted | rejected | fulfilled | cancelled`.
- Ensure status transitions are validated and documented.

4. `contracts` (currently mapped to disputes as a placeholder)
- Current placeholder uses:
  - `GET /api/v1/disputes`
  - `POST /api/v1/disputes`
  - `GET /api/v1/disputes/{id}`
  - `POST /api/v1/disputes/{id}/resolve`
  - `POST /api/v1/disputes/{id}/close`
- This is not a true contract domain model.
- Add dedicated contract endpoints:
  - `GET /api/v1/marketplace/contracts`
  - `POST /api/v1/marketplace/contracts`
  - `GET /api/v1/marketplace/contracts/{contractId}`
  - `PATCH /api/v1/marketplace/contracts/{contractId}`
  - `DELETE /api/v1/marketplace/contracts/{contractId}`
  - `POST /api/v1/marketplace/contracts/{contractId}/sign`
- Suggested contract status enum: `draft | under_review | active | completed | terminated`.

5. `negotiations` (mapped to messaging conversations)
- Uses:
  - `GET /api/v1/messaging/conversations`
  - `POST /api/v1/messaging/conversations`
  - `GET /api/v1/messaging/conversations/{id}`
  - `PATCH /api/v1/messaging/conversations/{id}/archive`
  - `POST /api/v1/messaging/conversations/{id}/messages`
- Frontend entity needs a stable negotiation status model: `open | agreed | stalled | closed`.
- Add an optional negotiation-focused endpoint set (or add explicit fields in conversation payload) to avoid client-side inference.

6. `reviews` (mapped to reputation ratings)
- Uses:
  - `GET /api/v1/reputation/users/{userId}/ratings`
  - `POST /api/v1/reputation/ratings`
- Missing for full entity UX parity:
  - `GET /api/v1/reputation/ratings/{ratingId}`
  - `PATCH /api/v1/reputation/ratings/{ratingId}`
  - `DELETE /api/v1/reputation/ratings/{ratingId}`
  - Optional moderation endpoint for publish/hide workflow:
    - `POST /api/v1/reputation/ratings/{ratingId}/moderate`
- Frontend status model: `draft | published | hidden`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for paginated list endpoints.

2. Status contract
- Return explicit status fields aligned with frontend enums, or provide canonical `uiStatus` fields where backend enums differ.
- Document status transition rules and invalid transition errors.

3. Authorization and scoping
- Enforce org/user scoping for listings, offers, orders, contracts, negotiations, and ratings.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add all new endpoints/params/schemas/examples to `/api/docs.json`.
- Ensure operationIds, request bodies, response schemas, and enums match implementation.

5. Compatibility
- Existing endpoints must remain functional for current consumers.
- New marketplace endpoints should be additive and non-breaking.

Tests to add/update:
1. Listings CRUD and status updates.
2. RFQ/offer lifecycle and status mapping to frontend model.
3. Orders create + status transition validation.
4. Contracts CRUD + sign flow (new dedicated contract APIs).
5. Negotiation thread lifecycle with message actions and close/archive behavior.
6. Reviews CRUD/moderation workflow.
7. OpenAPI contract snapshot for all added/updated marketplace endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing marketplace endpoint additions and status contract harmonization.
