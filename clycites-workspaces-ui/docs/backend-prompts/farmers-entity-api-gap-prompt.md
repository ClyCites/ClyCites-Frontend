You are working in the ClyCites backend codebase.

Goal:
Close the remaining API contract gaps for the `farmers` entity so the frontend workflow is fully deterministic in real API mode.

Context:
- Frontend uses these endpoints:
  - `GET /api/v1/farmers/profiles`
  - `POST /api/v1/farmers/profiles`
  - `GET /api/v1/farmers/profiles/{id}`
  - `PATCH /api/v1/farmers/profiles/{id}`
  - `DELETE /api/v1/farmers/profiles/{id}`
  - `POST /api/v1/farmers/profiles/{id}/verify` with body `{ status: "verified" | "rejected", reason?: string }`
  - `POST /api/v1/farmers/profiles/{id}/verify/submit` with body `{ notes?: string }`
- Frontend status model for farmers is: `draft | submitted | verified | rejected`.
- Existing docs expose `verified` boolean filter, but frontend also needs explicit verification lifecycle status.

Required backend work:
1. Add explicit verification status to farmer profile model/DTO:
   - `verificationStatus: "draft" | "submitted" | "verified" | "rejected"`
   - `verificationSubmittedAt?: string`
   - `verificationReviewedAt?: string`
   - `verificationReason?: string`
2. Ensure verification endpoints return updated profile payload:
   - `POST /profiles/{id}/verify` should return `{ success, data: FarmerProfile }`
   - `POST /profiles/{id}/verify/submit` should return `{ success, data: FarmerProfile }`
3. Extend list endpoint filtering:
   - Support `verificationStatus` query param on `GET /profiles`
   - Keep `verified` for backward compatibility
   - If both are provided, `verificationStatus` wins
4. Keep pagination metadata consistent (`meta.pagination.page/limit/total/totalPages`).
5. Update OpenAPI docs so schemas match runtime responses exactly.

Behavior rules:
- `verify/submit` transitions:
  - `draft|rejected -> submitted`
- `verify` transitions:
  - `submitted -> verified` or `submitted -> rejected`
- Reject invalid transitions with `400` and clear error message.

Acceptance criteria:
- Existing farmers CRUD tests pass.
- New tests cover:
  - status transitions and validation
  - `verificationStatus` list filtering
  - response body contract on `verify` and `verify/submit`
- OpenAPI `docs.json` reflects all new fields/params/responses.

Output expected from you:
1. Code changes
2. Test additions/updates
3. Short changelog with modified files
