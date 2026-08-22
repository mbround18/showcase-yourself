# Spec: Generic OIDC Auth + Admin Portal for Contact Submissions

## Problem

The site has no auth, one write-only contact endpoint, no real routing, and stale
webpack/Yew-era scaffolding left over from a prior rewrite. The owner needs a way to
sign in, see who has contacted them, and triage those submissions, without hardcoding
the site to a single OAuth vendor.

## Requirements

1. **Sign-in is optional for visitors.** The contact form must keep working
   anonymously; email is required either way (as it is today) and is only pre-filled,
   never forced, from an OAuth session.
2. **Generic OIDC.** Auth is implemented against the OpenID Connect protocol, not a
   Keycloak-specific API. One provider is configured at a time via env vars
   (`OIDC_ISSUER_URL`, `OIDC_CLIENT_ID`, `OIDC_CLIENT_SECRET`). Swapping to Auth0,
   Google, Okta, etc. later must be a config change only. A Keycloak container is
   provided for local/dev so the stack works out of the box.
3. **Owner detection.** `OWNER_EMAIL_ADDRESS` (env var) is compared, case-insensitively,
   against the authenticated user's OIDC email claim. A match grants the `owner` role;
   anything else is a `visitor`.
4. **Backend is the sole authority.** Every admin-only operation (list/view/update/delete
   contact submissions) is enforced server-side by an extractor that 403s non-owners,
   independent of anything the frontend does. The frontend route guard re-checks
   `GET /api/auth/me` against the backend on every protected-route entry — it never
   trusts cached client state to decide access.
5. **Admin portal.** The owner gets a table of all contact submissions (name, email,
   status, submitted date) and a detail view per submission. From either, the owner can
   set status to `Lead` or `In Contact`, `Archive` (reversible — just a status), or
   permanently delete (hard delete, no undo).
6. **Cleanup.** Remove the dead `package.json.bak`, the stale webpack/Yew root
   `package.json` and `README.md`, and replace them with content that matches the
   actual React/Vite + Actix + Mongo + OIDC + Docker Compose stack.
7. **E2E coverage.** Playwright tests cover: anonymous contact submission, owner login
   and admin access, non-owner login being denied both in the UI and directly against
   the API, status transitions + delete, and unauthenticated direct navigation to
   `/admin` being denied.

## Non-goals

- Multi-provider simultaneous login (single configured OIDC provider only).
- Soft-delete/recovery window for deleted contacts (hard delete per owner's explicit
  choice).
- Account linking across multiple OIDC providers for the same person.
