# ClyCites Multi-Dashboard Frontend

Production-oriented Next.js + TypeScript frontend for the ClyCites platform.  
Implements role-aware dashboards, centralized API client contract enforcement, tenant scoping, super-admin controls, low-bandwidth mode, and test coverage.

## Implemented Scope

- Role-aware dashboard shell and nav for:
  - Farmer
  - Buyer
  - Trader/Supplier
  - Expert
  - Organization Admin
  - Super Admin
- Centralized API client with:
  - `/api/v1` base normalization
  - response envelope parsing (`success/data/error/meta`)
  - request correlation support (`meta.requestId`)
  - retry/backoff for transient `429/5xx`
  - auth refresh flow + logout on refresh failure
  - org header injection: `X-Organization-Id`
  - super-admin headers: `X-Super-Admin-Mode`, `X-Super-Admin-Reason`
  - idempotency for orders/payments writes: `Idempotency-Key`
- Feature modules:
  - dashboard overview (`/dashboard`)
  - token vault (`/dashboard/tokens`)
  - super-admin control center (`/dashboard/super-admin`)
  - logistics board + timeline + POD upload validation (`/dashboard/logistics`)
  - orders/payments workflows (`/dashboard/orders-payments`)
  - organization dashboard (`/dashboard/organization`)
  - expert dashboard (`/dashboard/expert`)
  - audit dashboard (`/dashboard/audit`)
- Low-bandwidth mode:
  - Data Saver toggle
  - reduced polling intervals
  - less aggressive query refresh policy
  - lazy-loaded heavy chart component
- Accessibility and mobile behavior:
  - responsive dashboard shell
  - mobile nav strip
  - focusable controls and semantic forms

## Environment

Copy `.env.example` to `.env.local` and adjust values.

```env
NEXT_PUBLIC_API_BASE=http://localhost:5000
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

## Install

```bash
pnpm install
```

## Run

```bash
pnpm dev -- --port 3001
```

Open: `http://localhost:3001`

## Scripts

- `pnpm dev` - start dev server
- `pnpm build` - production build
- `pnpm start` - run production build
- `pnpm lint` - eslint checks
- `pnpm test:unit` - Vitest unit tests
- `pnpm test:e2e` - Playwright end-to-end tests
- `pnpm screenshots` - generate role dashboard screenshots into `docs/screenshots`

## Test Accounts (Role Matrix)

Use seeded backend users matching these roles, or adapt credentials in tests:

- `farmer@clycites.com` / `SecurePass123!`
- `buyer@clycites.com` / `SecurePass123!`
- `trader@clycites.com` / `SecurePass123!`
- `expert@clycites.com` / `SecurePass123!`
- `orgadmin@clycites.com` / `SecurePass123!`
- `superadmin@clycites.com` / `SecurePass123!`

## Testing Coverage

### Unit

- RBAC guard logic (`canAccessRoute`)
- Role guard rendering (`RoleGate`)
- API client behaviors:
  - auth/org/idempotency headers
  - retry/backoff
  - refresh-on-401
  - normalized errors with requestId

### E2E

- login + role routing
- token create/rotate/revoke
- org boundary header behavior
- super-admin privileged actions requiring reason headers

## Deliverables Included

- App code under `src/`
- `.env.example`
- Route-to-endpoint mapping: `docs/route-to-endpoint-mapping.md`
- Screenshot workflow + generated artifacts path: `docs/screenshots/`

## Security Notes

- Access token stored in `sessionStorage` (not local storage)
- No token secret logging in app flows
- Refresh failure triggers token removal + auth state reset
- Token secret shown once at create/rotate in UI
