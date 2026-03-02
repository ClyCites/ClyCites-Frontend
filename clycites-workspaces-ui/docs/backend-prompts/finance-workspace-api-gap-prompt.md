You are working in the ClyCites backend repository.

Goal:
Complete API support for the entire Finance workspace so frontend entity pages run fully in real API mode without mock fallbacks.

Scope:
- Workspace: `finance`
- Entities: `wallets`, `transactions`, `escrowAccounts`, `payouts`, `invoices`, `credits`, `insurancePolicies`
- Keep existing payments endpoints backward compatible.

Current frontend alignment (already wired):
1. `wallets`
- Uses:
  - `GET /api/v1/payments/wallet`
- Existing additional operations:
  - `POST /api/v1/payments/wallet/deposit`
  - `POST /api/v1/payments/wallet/withdraw`
- Frontend currently treats wallet as a read-focused entity page.
- Requirement: expose stable wallet status fields for UI (`active|frozen`) and a safe way to perform top-up/withdraw workflows from workspace flows.

2. `transactions`
- Uses:
  - `GET /api/v1/payments/transactions`
- Current query support includes: `page`, `limit`, `type`, `status`, `startDate`, `endDate`.
- Frontend status model: `pending | completed | failed | reversed`.
- Backend enum currently includes `cancelled` instead of `reversed`.
- Requirement: provide canonical status mapping (`uiStatus`) or align enum contract.

3. `escrowAccounts`
- Uses:
  - `GET /api/v1/payments/escrow`
  - `POST /api/v1/payments/escrow/initiate`
  - `GET /api/v1/payments/escrow/{escrowId}`
  - `POST /api/v1/payments/escrow/{escrowId}/release`
  - `POST /api/v1/payments/escrow/{escrowId}/refund`
- Frontend status model: `created | funded | released | refunded | closed`.
- Backend list status filter currently: `active | released | refunded | disputed | all`.
- Requirement: return explicit status mapping so UI state is deterministic.

4. `payouts`
- Currently mapped to transactions + withdraw:
  - `GET /api/v1/payments/transactions?type=debit`
  - `POST /api/v1/payments/wallet/withdraw`
- Frontend status model: `requested | processing | paid | failed`.
- Backend transaction statuses are different.
- Requirement: provide dedicated payout resource APIs for clean CRUD/read model:
  - `GET /api/v1/payments/payouts`
  - `POST /api/v1/payments/payouts`
  - `GET /api/v1/payments/payouts/{payoutId}`
  - `PATCH /api/v1/payments/payouts/{payoutId}`
  - `DELETE /api/v1/payments/payouts/{payoutId}`
  - Optional workflow: `POST /api/v1/payments/payouts/{payoutId}/approve`, `POST /api/v1/payments/payouts/{payoutId}/fail`

5. `invoices`
- No finance invoice endpoints currently in staging OpenAPI.
- Add dedicated invoice APIs:
  - `GET /api/v1/finance/invoices`
  - `POST /api/v1/finance/invoices`
  - `GET /api/v1/finance/invoices/{invoiceId}`
  - `PATCH /api/v1/finance/invoices/{invoiceId}`
  - `DELETE /api/v1/finance/invoices/{invoiceId}`
  - Optional: `POST /api/v1/finance/invoices/{invoiceId}/export`
- Frontend status model: `draft | issued | paid | overdue | cancelled`.

6. `credits`
- No credit application endpoints currently in staging OpenAPI.
- Add dedicated credit APIs:
  - `GET /api/v1/finance/credits`
  - `POST /api/v1/finance/credits`
  - `GET /api/v1/finance/credits/{creditId}`
  - `PATCH /api/v1/finance/credits/{creditId}`
  - `DELETE /api/v1/finance/credits/{creditId}`
  - Workflow endpoints:
    - `POST /api/v1/finance/credits/{creditId}/approve`
    - `POST /api/v1/finance/credits/{creditId}/reject`
    - `POST /api/v1/finance/credits/{creditId}/disburse`
- Frontend status model: `applied | under_review | approved | rejected | disbursed`.

7. `insurancePolicies`
- No insurance policy endpoints currently in staging OpenAPI.
- Add dedicated insurance APIs:
  - `GET /api/v1/finance/insurance/policies`
  - `POST /api/v1/finance/insurance/policies`
  - `GET /api/v1/finance/insurance/policies/{policyId}`
  - `PATCH /api/v1/finance/insurance/policies/{policyId}`
  - `DELETE /api/v1/finance/insurance/policies/{policyId}`
  - Optional claim workflow:
    - `POST /api/v1/finance/insurance/policies/{policyId}/claims`
    - `PATCH /api/v1/finance/insurance/claims/{claimId}`
- Frontend status model: `active | claim_open | claim_resolved | expired`.

Cross-cutting requirements:
1. Response contract consistency
- Keep success envelope: `{ success: true, data, meta? }`
- Include `meta.pagination` for paginated lists.

2. Status contract
- Return explicit status fields aligned to frontend enums, or include canonical `uiStatus`.
- Document transition rules and invalid transition errors (`400`).

3. Authorization and scoping
- Enforce org/user scoping for all finance resources.
- Correct `401/403/404` semantics.

4. OpenAPI updates
- Add/refresh all finance endpoints, schemas, enums, request/response examples in `/api/docs.json`.

5. Compatibility
- Existing `/api/v1/payments/*` endpoints must continue to work.
- New endpoints should be additive and non-breaking.

Tests to add/update:
1. Wallet read + deposit/withdraw workflows.
2. Transaction list filtering and status mapping contract.
3. Escrow lifecycle (initiate/release/refund) and status mapping.
4. Payouts CRUD/workflow (new dedicated endpoints).
5. Invoices CRUD + status transitions.
6. Credits CRUD + approve/reject/disburse transitions.
7. Insurance policies CRUD + claim lifecycle.
8. OpenAPI contract snapshot for all finance endpoints.

Deliverables:
1. Backend implementation.
2. Automated tests for each added capability.
3. Updated OpenAPI docs.
4. Short changelog listing finance endpoint additions and status harmonization.
