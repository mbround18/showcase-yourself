# Tasks

## Cleanup
- [x] Delete `package.json.bak`
- [x] Rewrite root `package.json` (drop webpack/Yew + dead unconfigured Husky block, add real orchestration/lint/test scripts)
- [x] Rewrite root `README.md`
- [x] Add `compose.env.example` (committed template; `compose.env` itself is gitignored, pre-existing)

## Backend
- [x] Add `openidconnect`, `actix-session`, `actix-cors` to `Cargo.toml`
- [x] `models.rs`: `User`, `ContactStatus`, extend `Contact`
- [x] `auth.rs`: login/callback/logout/me routes + `AdminUser` extractor
- [x] `admin.rs`: list/get/patch/delete contact routes
- [x] `contact.rs`: set status/created_at/submitted_by on insert
- [x] `main.rs`: wire CORS, session middleware, new routes
- [x] Backend unit test: role resolution (`cargo test` + `cargo clippy` both clean)

## Infra
- [x] `compose.yaml`: `keycloak` + `keycloak-db` services
- [x] `ops/keycloak/realm-export.json`: seeded client + owner + non-owner test users
- [x] `compose.env`: new env vars
- [x] Verified end-to-end with real `docker compose`: OIDC discovery, `/auth/login` redirect w/ PKCE to public Keycloak URL, session cookie, `/auth/me`, nginx `/api/` proxy rewrite (fixed a pre-existing nginx upstream DNS race + a proxy_pass variable path-stripping bug along the way)

## Frontend
- [x] Add `react-router-dom`
- [x] `App.tsx`: real routes
- [x] `RequireOwner.tsx` guard component (re-verifies against backend on every route entry)
- [x] `Header.tsx`: router-based nav + auth-aware links
- [x] `Contact.tsx`: prefill email from session
- [x] `ui/table.tsx` primitive
- [x] `pages/admin/ContactsTable.tsx`
- [x] `pages/admin/ContactDetail.tsx`
- [x] `Login.tsx` page
- [x] `tsc -b`, `vite build`, `oxlint` all clean

## E2E
- [x] `e2e/` Playwright workspace + config
- [x] Anonymous contact submission test
- [x] Owner login → admin access test
- [x] Non-owner login denied (UI + direct API) test
- [x] Status transitions + delete test
- [x] Unauthenticated `/admin` direct-nav denied test
- [x] Verified 5/5 passing against the live docker compose stack (incl. seeded Keycloak realm)

### Bugs found and fixed along the way (via real end-to-end testing, not just code review)
- `CsrfMiddleware::new()` never actually issued tokens (no `.set_cookie()` call) -- pre-existing, contact form CSRF was silently broken before this work started
- CSRF extractor's cookie/header names didn't match the middleware's configured names or the frontend's `X-CSRF-Token` header -- registered `CsrfCookieConfig`/`CsrfHeaderConfig` app_data to align them
- `actix-governor`'s middleware position relative to `actix-cors`/`actix-session` broke body-type inference -- CSRF must be the innermost `.wrap()`
- Naive `serialize_with` on `Contact`/`User` DB structs corrupted Mongo writes (the same `Serialize` impl is used for both BSON writes and JSON responses) -- fixed via a dedicated `ContactView` response type instead
- `ingress/nginx.conf`'s `location /` still had the trailing-slash `proxy_pass` bug (collapses every request to the frontend's root) -- same class of bug as the `/api/` block, just not caught there yet
- No SPA fallback (`try_files ... /index.html`) on the frontend's own nginx -- direct navigation/refresh to any client-side route 404'd once real routing replaced the old fake `useState` "router"
- Governor's original `2s/request` limit (fine for the old 2-route app) was too tight once real pages fire multiple API calls per render (auth check + CSRF + data) -- loosened to `10 req/s, burst 20`

## CI
- [x] CI job: bring up stack, run `cargo test` + `playwright test`, gate `docker-release`
