# Plan: Generic OIDC Auth + Admin Portal

## Architecture

**Auth flow** — Authorization Code + PKCE against a generic OIDC provider
(`openidconnect` crate). Backend routes:
- `GET /auth/login` — builds PKCE verifier/state, stashes in a short-lived signed
  cookie, redirects to the IdP authorize URL.
- `GET /auth/callback` — exchanges the code, fetches the userinfo claims, upserts a
  `users` document keyed by `(provider, subject)`, resolves `role` by comparing email
  to `OWNER_EMAIL_ADDRESS`, establishes an `actix-session` session, redirects the
  browser to `FRONTEND_URL` (`/admin` for owners, `/` for visitors).
- `POST /auth/logout` — clears the session.
- `GET /auth/me` — `{ authenticated, email, role }`. Called by the frontend before
  rendering any protected UI; never cached as an authorization decision.

**Authorization** — an `AdminUser` extractor (`FromRequest`) reads the session and
403s unless `role == Owner`. Every `/admin/*` route takes it as an argument. This is
the actual enforcement point; the frontend guard is UX only.

**Data model** (`backend/src/models.rs`):
```rust
struct User { id, provider, subject, email, role, created_at, last_login_at }
enum ContactStatus { New, Lead, InContact, Archived }
struct Contact { id, name, email, message, status, submitted_by: Option<ObjectId>, created_at, updated_at }
```

**Admin API** (`backend/src/admin.rs`, all behind `AdminUser`):
`GET /admin/contacts`, `GET /admin/contacts/{id}`, `PATCH /admin/contacts/{id}`
(status transitions), `DELETE /admin/contacts/{id}` (hard delete).

**Frontend** — `react-router-dom` replaces the `useState` page-switch in `App.tsx`.
Routes: `/`, `/about`, `/projects`, `/contact`, `/login`, `/admin` (protected),
`/admin/contacts/:id` (protected). `RequireOwner` wrapper calls `GET /api/auth/me` on
every protected-route entry before rendering. `Header.tsx` shows Admin/Sign
out vs Sign in based on that same check. `Contact.tsx` pre-fills (editable) email
from the session if present.

**Infra** — `compose.yaml` gets a `keycloak` + `keycloak-db` (Postgres) service pair
for local/dev with a seeded realm (`ops/keycloak/realm-export.json`: one owner test
user, one non-owner test user, one client). New env vars land in `compose.env`.
`ingress/nginx.conf` needs no changes — `/auth/*` and `/admin/*` ride the existing
`/api/` → backend proxy block.

**CORS/session** — `actix-cors` restricted to `FRONTEND_URL`, credentials enabled;
session cookie httpOnly, `Secure` in prod, `SameSite=Lax`.

## Env vars (new)

`OWNER_EMAIL_ADDRESS`, `OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`,
`OIDC_REDIRECT_URL`, `SESSION_SECRET`, `FRONTEND_URL`. Documented in root
`.env.example` alongside the existing `DATABASE_URL`.

## Testing

- Backend unit test: role resolution (email match → Owner, mismatch → Visitor,
  case-insensitive).
- Playwright e2e (`e2e/`) against the full compose stack incl. seeded Keycloak realm —
  see `spec.md` requirement 7 for exact scenarios.
- CI: new job brings up the stack, runs `cargo test` + `playwright test`, gates the
  existing `docker-release` job.

See `tasks.md` for the ordered execution checklist.
