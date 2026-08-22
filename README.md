# showcase-yourself

A personal portfolio site: React/Vite frontend, an Actix (Rust) backend, MongoDB for
storage, and generic OpenID Connect sign-in (Keycloak locally, any OIDC-compliant
provider in production) backing an owner-only admin portal for contact submissions.

## Architecture

- `frontend/` — React + Vite + Tailwind, served as static files by nginx in
  production, by Vite's dev server locally.
- `backend/` — Actix Web (Rust). Owns Mongo, session cookies, CSRF, OAuth/OIDC, and
  the admin API. See `specs/001-oauth-admin-portal/` for the design.
- `ingress/` — nginx reverse proxy: `/api/*` → backend, everything else → frontend.
  This is the single entry point (`http://localhost:5173` locally).
- `mongo`, `keycloak` + `keycloak-db` — data store and local/dev identity provider,
  defined in `compose.yaml`.

Authorization model: **the backend is the sole authority.** Every admin-only
operation is enforced server-side (see `backend/src/auth.rs`'s `AdminUser`
extractor), independent of anything the frontend does. The frontend's route guard
(`RequireOwner`) re-checks `GET /api/auth/me` against the backend on every protected
route entry rather than trusting cached client state.

## Local development

```sh
cp compose.env.example compose.env   # then fill in real values, see below
npm run up                           # docker compose up -d --build
```

Visit `http://localhost:5173`. The compose stack seeds a local Keycloak realm
(`ops/keycloak/realm-export.json`) with two test users so sign-in works out of the
box:

| Username  | Password           | Role (via `OWNER_EMAIL_ADDRESS`) |
| --------- | ------------------ | --------------------------------- |
| `owner`   | `owner-password`   | owner — gets `/admin`             |
| `visitor` | `visitor-password` | visitor                           |

`npm run dev` starts the hot-reloading dev variant (`frontend-dev`, `backend-dev`)
instead. `npm run down` tears the stack down.

### Env vars (`compose.env`, gitignored — copy from `compose.env.example`)

| Var | Purpose |
| --- | --- |
| `DATABASE_URL` | Mongo connection string |
| `OWNER_EMAIL_ADDRESS` | Email that, once signed in via OIDC, grants the `owner` role |
| `OIDC_ISSUER_URL` | OIDC discovery issuer, reachable from the **backend** |
| `OIDC_CLIENT_ID` / `OIDC_CLIENT_SECRET` | Your OIDC client credentials |
| `OIDC_REDIRECT_URL` | Backend's own callback, reachable from the **browser** |
| `OIDC_RESOLVE_DOMAIN` / `OIDC_RESOLVE_VIA` | Optional dev-only escape hatch: when the issuer hostname (needed for issuer-consistency with what the browser uses) isn't directly routable from inside the backend's container, resolve it to something that is. Unset in production against a real IdP. |
| `SESSION_SECRET` | Signs the session cookie |
| `SESSION_COOKIE_SECURE` | Set `true` in production (HTTPS); `false` for local plain-HTTP dev |
| `FRONTEND_URL` | Used for CORS and post-login redirects |

Swapping the local Keycloak for a real OIDC provider (Auth0, Google, Okta, a hosted
Keycloak, ...) in production is a config change only — the backend speaks generic
OIDC, nothing provider-specific.

## Tests

```sh
npm run test:backend   # cargo test
npm run test:e2e       # Playwright, against a running compose stack
npm test                # both
```

CI (`.github/workflows/docker-release.yml`) runs both before publishing images.

## Linting

```sh
npm run lint    # frontend (oxlint) + backend (cargo fmt --check, cargo clippy)
```
