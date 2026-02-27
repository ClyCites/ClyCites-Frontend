# ClyCites Dashboard Route-to-Endpoint Mapping

This mapping reflects the frontend routes implemented in this app and the ClyCites API groups consumed through `src/lib/api/endpoints/*`.

## Global / Auth

| Frontend route | Purpose | API endpoints |
|---|---|---|
| `/login`, `/register` | authentication | `POST /auth/login`, `POST /auth/register` |
| `/forgot-password`, `/reset-password` | password recovery | `POST /auth/forgot-password`, `POST /auth/reset-password` |
| app bootstrap/providers | session restoration | `GET /auth/me`, `POST /auth/refresh-token`, `POST /auth/logout` |

## Dashboard Shell

| Frontend route | Purpose | API endpoints |
|---|---|---|
| `/dashboard` | role-based KPI overview | `/analytics`, `/weather`, `/notifications` |
| `/dashboard/orders-payments` | orders + payments idempotent workflows | `/orders`, `/orders/my-orders`, `/orders/{id}`, `/payments` |
| `/dashboard/logistics` | collection points + shipment lifecycle + POD | `/logistics/collection-points*`, `/logistics/shipments*`, `/logistics/shipments/{id}/proof-of-delivery` |
| `/dashboard/tokens` | token management vault | `/auth/tokens*`, `/auth/tokens/{id}/rotate`, `/auth/tokens/{id}/revoke`, `/auth/tokens/{id}/usage` |
| `/dashboard/super-admin` | privileged controls | `/admin/system/maintenance`, `/admin/system/feature-flags`, `/auth/super-admin/impersonation*`, `/analytics/global`, `/audit` |
| `/dashboard/organization` | org scope and membership views | `/organizations/me`, `/organizations/{id}/members` |
| `/dashboard/expert` | expert portal summary | `/expert-portal` |
| `/dashboard/audit` | audit timeline | `/audit` |

## Existing Marketplace / Account Routes

| Frontend route group | API endpoints |
|---|---|
| `/market/**` | `/listings`, `/listings/{id}`, `/listings/{id}/offers`, `/offers`, `/offers/{id}` |
| `/sell/**` | `/listings`, `/listings/{id}` |
| `/orders/**` | `/orders`, `/orders/my-orders`, `/orders/{id}`, `/orders/{id}/status`, `/orders/{id}/cancel`, `/orders/{id}/confirm-delivery` |
| `/offers/**` | `/offers`, `/offers/{id}`, `/offers/{id}/counter`, `/offers/{id}/accept`, `/offers/{id}/reject`, `/offers/{id}/withdraw`, `/offers/{id}/messages` |
| `/settings` | `/auth/change-password`, `/security/mfa/totp/setup`, `/security/mfa/totp/verify`, `/security/mfa` |
| `/weather` | `/weather` |
| `/analytics` | `/analytics` |
| `/farms` | `/farmers/profiles`, `/farmers/profiles/me`, `/farmers/legacy` |

## Platform/Utility Integrations

| Concern | API endpoints |
|---|---|
| Organization context and tenant header | `/organizations/me` + `X-Organization-Id` |
| Notifications and messaging feed | `/notifications`, `/messaging` |
| Admin health probes | `/health`, `/ready`, `/version` |

## Header + Contract Enforcement

- Base URL is normalized to `${API_BASE}/api/v1`.
- Response envelope handling expects:
  - `{ success, data?, error?, meta? }`.
- Request headers added by centralized client:
  - `Authorization: Bearer <token>` (when authenticated)
  - `X-Organization-Id` (tenant context)
  - `X-Super-Admin-Mode: true` + `X-Super-Admin-Reason` (privileged super-admin mutations)
  - `Idempotency-Key` (orders/payments write operations)
