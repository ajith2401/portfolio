# Production readiness — editorial platform

Status: **preparation only.** Nothing in this document has been run against production. Every
operation below needs the owner's separate, explicit approval at the time it is run.

Covers both repos: `portfolio` (public) and `portfolio_admin` (editor). They share one MongoDB
database and the `src/lib/content-contract/` module (byte-identical; `node scripts/contract-lock.mjs peer <path>`).

---

## 1. Text-index change on `writings` (owner-run, not yet done)

### Why

`main` declares `ContentIndex` with MongoDB's defaults: `default_language: "english"` and
`language_override: "language"`. Writings store `language` as `"Tamil"` / `"English"`, and MongoDB
treats that field as a language _code_. Verified locally against MongoDB:

- Building the old-style index on a collection that already holds a `language: "Tamil"` document fails:
  `language override unsupported: Tamil` (code 17262).
- With the old index in place, inserting a `language: "Tamil"` document is rejected.

The branch declares `default_language: "none"` and `language_override: "textSearchLanguage"` (a field no
document sets), so `language` is just data and no English stemming is applied to Tamil text. Weights are
unchanged (title 10, tags 5, body 1). MongoDB cannot alter a text index in place: **drop and recreate.**

### Step 0 — inspect (read-only, safe to run now)

```
MONGODB_URI='<production uri>' node scripts/inspect-text-index.mjs
# or: node scripts/inspect-text-index.mjs --uri-env SOME_OTHER_VARIABLE
```

Only `listIndexes`, a document estimate and `collStats` are issued. It prints host and database
(never credentials), the live index, the model's intended index, a verdict (`MATCH`, `DIFFERS`, `ABSENT`)
and the exact commands it _would_ run. It does not execute them. Verified locally for both `MATCH` and `DIFFERS`.

### Backup (before any change)

- Atlas: take an on-demand snapshot (or confirm continuous backup is on) and note its id/time.
- Or: `mongodump --uri "$MONGODB_URI" --collection writings --out <dir>` (documents only; indexes are
  re-creatable from the commands below, and the _old_ definition is recorded in the Step 0 output — save it).

### Operation

1. `db.writings.dropIndex("ContentIndex")`
2. `db.writings.createIndex({ title: "text", body: "text", tags: "text" },
{ name: "ContentIndex", weights: { title: 10, tags: 5, body: 1 },
  default_language: "none", language_override: "textSearchLanguage" })`
3. Re-run Step 0: expect `MATCH`.
4. Smoke: public search for a known Tamil word returns the expected writing.

### Impact

- Between steps 1 and 2, `$text` queries fail ("text index required"): public search is briefly unavailable.
  Everything else (reading, publishing) is unaffected. The window is short for a small collection; confirm the size with Step 0 first.
- Do it in a quiet period; run steps 1–2 back to back from one shell.
- Search ranking changes slightly: no English stemming on titles/bodies. Tamil text was never stemmed correctly.

### Rollback

Drop `ContentIndex` and recreate the saved old definition from Step 0. Note the old definition cannot
be rebuilt while any document has `language: "Tamil"/"English"`; rolling back therefore means restoring
from the backup, or accepting no text index until the code is also rolled back.

### Approval gate

**Request to owner:** approve (a) running Step 0 against production, and (b) separately, running the
operation in a stated window. Neither has been done.

---

## 2. Environment variables (names only — never commit or paste values)

### Admin (`portfolio_admin`)

| Name                                                                   | Required    | Behaviour when missing / bad (verified)                                                                                                                                                                               |
| ---------------------------------------------------------------------- | ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                          | yes         | App cannot read/write. Must be the **same database** as the Portfolio.                                                                                                                                                |
| `JWT_SECRET`                                                           | yes         | **Fails closed in production:** login with valid credentials returns 500 and sets no cookie. The built-in development placeholder is also rejected in production (unit-tested).                                       |
| `ADMIN_ALLOWED_ORIGINS`                                                | yes (prod)  | Comma list of admin origins for the CSRF/CORS check.                                                                                                                                                                  |
| `PORTFOLIO_REVALIDATE_URL`                                             | recommended | `https://<public-site>/api/revalidate`. `http` is accepted only for localhost. If unset/invalid the save still succeeds and the editor shows a warning; the public site then refreshes only on its 1-hour ISR window. |
| `REVALIDATE_SECRET`                                                    | recommended | Must equal the Portfolio's. Unset → same warning, save still succeeds.                                                                                                                                                |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | for images  | Image upload fails with an error; text editing unaffected.                                                                                                                                                            |
| `REDIS_URL`                                                            | optional    | Rate-limit/cache backing.                                                                                                                                                                                             |
| `RESEND_API_KEY`                                                       | optional    | Email.                                                                                                                                                                                                                |
| `NEXT_PUBLIC_APP_URL`                                                  | optional    | Public base URL of the admin.                                                                                                                                                                                         |

### Portfolio (`portfolio`)

| Name                                                                                                                                                     | Required                                         | Behaviour when missing / bad (verified)                                                                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `MONGODB_URI`                                                                                                                                            | yes                                              | Same database as the Admin.                                                                                                              |
| `REVALIDATE_SECRET`                                                                                                                                      | yes (≥16 chars)                                  | **Unset → `/api/revalidate` returns 503** for every caller; wrong secret → 401.                                                          |
| `ADMIN_API_KEY`                                                                                                                                          | only if the legacy write API is used (≥24 chars) | **Unset or short → every administrative write returns 401** ("not configured").                                                          |
| `NEXT_PUBLIC_SITE_URL` (or `SITE_URL`, `NEXT_PUBLIC_APP_URL`)                                                                                            | yes                                              | Canonical URLs, JSON-LD, sitemap and OG image URLs are built from it. Must be the production origin (`https://www…`), no trailing slash. |
| `TRUSTED_PROXY`                                                                                                                                          | no                                               | Set only when behind a proxy that overwrites `X-Forwarded-For`; on Vercel the platform headers are used automatically.                   |
| `RESEND_API_KEY`, `EMAIL_USER`, `EMAIL_APP_PASSWORD`, `CLOUDINARY_*`, `RAZORPAY_*` / `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `TWILIO_*`, `NEXT_PUBLIC_FIREBASE_*` | per feature                                      | Unrelated to editorial publishing.                                                                                                       |

### Fail-safe results (run locally, production mode, throwaway DB)

- Portfolio without `REVALIDATE_SECRET`: `POST /api/revalidate` → **503** (with or without a bearer).
- Portfolio without `ADMIN_API_KEY`: `POST /api/writings` → **401**.
- Admin with empty `JWT_SECRET`, valid credentials: **500, no session cookie.** Control with a secret: 200 + cookie.
- Admin, unauthenticated: `/admin/*` → 307 to `/login`; `GET /api/writings` returns published items only.
- Admin cannot reach the public site (bad `PORTFOLIO_REVALIDATE_URL`): publish **succeeds**, editor shows
  "The public site could not be reached for a refresh."

### Gotcha found while testing

Next loads each app's own `.env`. An _unset_ shell variable does **not** disable a value from `.env`;
only an explicitly empty value does. Run local tests with explicit values for every variable you care about.

### Vercel instructions (do not apply until approved)

1. Use **one** value for `REVALIDATE_SECRET` in both projects (generate with `openssl rand -hex 32`; paste into
   Vercel; do not store in git).
2. Admin project: set `PORTFOLIO_REVALIDATE_URL=https://www.<domain>/api/revalidate`, `ADMIN_ALLOWED_ORIGINS`,
   `JWT_SECRET` (new random, ≥32 bytes), `MONGODB_URI`.
3. Portfolio project: set `NEXT_PUBLIC_SITE_URL=https://www.<domain>` (Production scope), `REVALIDATE_SECRET`,
   `MONGODB_URI`. Add `ADMIN_API_KEY` only if the legacy write routes must stay usable.
4. Scope to **Production** (and Preview only with a _non-production_ database).
5. After deploy: run the Step 0 inspector, then the §1 operation in the approved window; then publish a
   synthetic test writing and confirm the public page updates within seconds.

---

## 3. Known limits (not blockers for review, but not proven)

- Vercel runtime behaviour of the OG image route (`@napi-rs/canvas` binary + bundled Noto Sans Tamil font tracing) is unverified; locally it returns a 1200×630 PNG.
- The in-memory rate limiter is per instance (not shared across serverless instances).
- If `/api/revalidate` fails, the public page stays stale until the next ISR window (≤1 h).
- Old service workers installed by the removed `next-pwa` are replaced by a self-destructing worker; not tested in a long-lived browser profile.

---

## 4. Slug registry rollout (Admin; owner-run, not yet done)

### What it is

`slugclaims` is an Admin-only collection with a **unique index on `slug`**. Creating or renaming a writing
claims the slug first (one atomic insert), and releases it if the save then fails. Old slugs stay claimed after
a rename so the 308 redirect can never be hijacked. It is not part of the shared contract.

### Important limit until the backfill has run

**The registry cannot guarantee collision protection for legacy slugs.** Writings and slug-history entries that
existed before the registry have no claim row, so two concurrent requests can still race for a slug that only
exists in `writings.slug` / `writings.slugHistory`. Today the route also checks `writings` directly
(`$or: [{slug}, {"slugHistory.slug"}]`), which closes the non-concurrent case, but only the registry makes the
check atomic. Treat the guarantee as **partial until existing claims are backfilled**.

### Steps (each needs the owner's explicit approval)

1. **Dry run (read-only, safe to run now):**
   `MONGODB_URI='<production uri>' node scripts/backfill-slug-registry.mjs` (add `--json` for machine output).
   Reports: writings, current slugs, historical slugs, distinct slugs, already in registry, expected new
   registry records, duplicates inside one writing, invalid slugs, conflicts needing manual resolution.
   It writes nothing.
2. **Resolve every listed conflict and invalid slug by hand** (the script registers a conflicting slug to the first
   writing it sees; decide the real owner first).
3. **Apply** (owner-approved window): the same command with `--apply`. It only inserts missing claim rows
   (idempotent; re-running is safe). Create the unique index first by letting the Admin start once, or run
   `SlugClaim.init()`.
4. Re-run the dry run: expect `expectedNewRegistryRecords: 0`.

Verified locally on disposable MongoDB: dry run on a seeded database wrote 0 rows and reported the conflict and invalid
slug correctly; 7 real-database tests cover simultaneous claims (same and different slugs), historical collisions,
rename, failed-save compensation and idempotent retry. **No production database was touched.**

### Public-site refresh after unpublishing a Book

`/books`, `/spotlight` and the sitemap are ISR (1 h). After hiding a Book, call `POST /api/revalidate` with
`{ "slug": "<book-slug>", "section": "book" }` to refresh those paths at once. Nothing in the Admin calls this yet
(Books have no Admin editor), so until it does, a hidden Book can remain visible in cached listings for up to 1 hour.
