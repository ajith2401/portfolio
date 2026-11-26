# Acceptance report — editorial platform (Portfolio + Portfolio Admin)

Branches (both kept; `main` untouched; nothing pushed, merged or deployed):

- `portfolio` → `feature/portfolio-editorial-seo`, code head **`5f7acc9`** (this report is committed on top of it; run `git log -1` for the final hash)
- `portfolio_admin` → `feature/portfolio-admin-editorial-studio`, code head **`55985da`**

All evidence is from a throwaway local MongoDB (127.0.0.1:27218, databases named `*_test`). It has been **stopped and its
test databases dropped.** **No production database write, index change, backfill or deployment was performed.** Admin files
that pre-date this work and are intentionally unstaged: `package.json`, `AGENTS.md`, `scripts/read-db-collections.mjs`.

**Verdict: ready for owner review; not yet production-deployed.** One verification is blocked (real Cloudinary deletion,
§3) and the production steps in `PRODUCTION_READINESS.md` need the owner's separate approval.

---

## 1. Implemented and independently verified (fresh runs at the heads above)

| Check                                                                    | Result                                                                                                                                                                    |
| ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio unit tests (`npm test`)                                        | 204 tests: 201 pass, 3 skipped, 0 fail                                                                                                                                    |
| Admin unit tests (`npm test`)                                            | 184 tests: 183 pass, 1 skipped, 0 fail                                                                                                                                    |
| Lint, both repos                                                         | 0 errors (Portfolio 55 warnings, Admin 41)                                                                                                                                |
| Production builds                                                        | Portfolio (`next build --webpack`) and Admin (`next build`) both compile                                                                                                  |
| Contract lock (v1.2.0), peer identity, model parity                      | match; 12 model files identical                                                                                                                                           |
| Playwright specs 01–04 (Admin only, real Chrome)                         | 30/30 pass                                                                                                                                                                |
| Shared-DB integration, specs 05, 07, 08, 09, 10 (phase 1)                | 50/50 pass; phase 2 (spec 06, dead revalidate URL) 2/2 pass. Phase 1 had one failure on first run of spec 10, a test-harness defect (random value in a test title); fixed |
| Shared limiter, two production instances (`verify-shared-ratelimit.mjs`) | 6/6 pass (see Phase 6)                                                                                                                                                    |

### Phase 1 — publishing security (spec 07, real HTTP against production builds)

- Legacy writing write APIs (and Admin `rate` routes) retired: 410 for POST/PUT/PATCH/DELETE with no key, bogus bearer, bogus key.
  **Defect found and fixed:** Admin `rate` routes applied unmoderated ratings to public aggregates.
- Comments: draft/archived/missing/malformed targets rejected; published → `pending`, hidden from the list until approved, no reviewer email.
- Cloudinary **ownership** rules (foreign cloud/folder/host, traversal, shared asset → `keptBecauseShared`): verified at route level.
  The real `destroy` call is **not** verified (§3).
- Slugs: no duplicate current slug, history slugs never reissued, 8 simultaneous creates → 8 distinct slugs.
  **Defect found and fixed:** a lost claim race failed the author's save; it now retries with a suffix.
- JSON-LD: hostile titles cannot break out of `ld+json` on `/books`, `/spotlight/<slug>`, `/blog`, `/`.

### Phase 2 — Books

- One shared visibility policy (contract v1.2.0): `published` and legacy no-`status` are public; `draft`, `archived`, unknown and
  `null` are hidden. Applied to detail by slug/id, `/api/books`, related, spotlight, `/books`, sitemap, search and short links.
  **Defect found and fixed:** `/s/<code>` resolved draft/archived Books (and unpublished writings, posts, projects).
- Legacy Portfolio Book PUT/PATCH/DELETE retired (410); **the Admin owns Book writes** and calls Portfolio
  `POST /api/revalidate {section:'book', slug, previousSlugs}`. A shared-DB lifecycle test covers create → publish → hide → unhide → delete → stale-link behaviour.
  Revalidation failures never fail the save; the editor shows a warning (spec 06).

### Phase 4 — broken poem hero / cover images (Portfolio `3770677`, Admin `a793f6e`)

Root causes, found with browser and network evidence:

1. `proxy.js` crashed when the request had no `Host` header. Next's internal image-optimizer fetch sends none, so every
   optimized image 500'd. Fixed (falls back to `nextUrl.host`).
2. A legacy document with `images: null` crashed the shared `pickImages` (JS default parameters do not catch `null`), which
   made `/quill` show "Unable to load writings". Fixed in the contract (guarded, synced to the Admin).
3. Hero, list card and related card each had their own ad-hoc fallback. Replaced by `resolveCoverSrc` + `CoverImage`: absent/null/empty/
   malformed images, or an `onError`, render a deliberate gradient panel with the title glyph and category.

Tests: `tests/cover-src.test.mjs`; Admin spec 09 (absent/null/empty/malformed/valid, hero + list + related).

### Phase 5 — spec 03 persistence/conflict flake: **no reproduction, no root cause**

Spec 03's autosave/failed-PUT test passed 120/120 in isolated repeats and 48/48 under ~2× CPU oversubscription, with no retries
and no weakened assertions. The earlier intermittent failure is therefore **not explained and not claimed fixed.** One
further unexplained spec 06 failure was seen once earlier and not reproduced. Both are listed as open risks.

### Phase 6 — rate limiting and client-IP trust (Portfolio `5f7acc9`)

- Before: per-instance in-memory limiter (each serverless instance had its own budget).
- Now: `rateLimitShared` — atomic `$inc` per (key, window) in a TTL-indexed `ratelimits` MongoDB collection, used by comments,
  contact, OTP email/SMS, search, short-url and subscribe. No new paid service (MongoDB is already a dependency). If the store
  errors or does not answer within 1.5 s, it degrades to the per-instance limiter (never fails open, never 5xx on that path).
- Client identity does **not** trust caller-controlled forwarding headers. `x-vercel-forwarded-for` is honoured **only when the
  platform-set `VERCEL` env var is present**; `x-forwarded-for` is honoured only with `TRUSTED_PROXY=<n>` naming the exact
  number of trusted hops; otherwise all forwarding headers are ignored and callers share one bucket (spoof-proof, but coarse).
- Evidence: unit tests; real-Mongo concurrency (60 concurrent → exactly 20 admitted);
  `scripts/verify-shared-ratelimit.mjs` with **two production instances on one DB**: rotating spoofed headers across both
  instances admitted exactly 30 of 40 (a per-instance limiter would admit 60); one counter row, not one per spoofed header;
  both instances 429 once spent; a restarted instance still sees the spent budget; with the store unreachable, 35 concurrent
  requests → exactly 5 are 429 (fallback still limits).
- Not verified: behaviour on real Vercel (header injection by Vercel's edge). Recommended defence in depth: a Vercel WAF rate-limit rule on the same routes (see `PRODUCTION_READINESS.md` §3).

### Phase 7 — SEO / social items

- Spec 10 (8 public pages, Tamil title fixture): every `ld+json` block parses and each page has **at most one** `BreadcrumbList`.
- Book Tamil slug / historical Book URL behaviour and OG route are covered by specs 05, 08 and existing unit tests; OG route returns a 1200×630 PNG locally.
- `next-pwa` is removed; a self-destructing `sw.js` clears old workers. No PWA feature is claimed.

## 2. Implemented but not fully verified

- **Slug registry only partially protective until the backfill is applied** (`PRODUCTION_READINESS.md` §4). Dry run never run on production.
- **Hidden-Book staleness** depends on the Admin's revalidate call reaching the Portfolio (`PORTFOLIO_REVALIDATE_URL` must use `www`); otherwise up to 1 h.
- **OG route on Vercel** (`@napi-rs/canvas` + bundled Tamil font tracing): unverified outside local.
- **Responsive/visual checks** at 390/820/1440 px were measured earlier for the writing page and editor and covered by spec 09 for covers; they were **not re-run** across all pages in this final pass.
- Test-isolation defects in my own tests were found and fixed (stale ISR cache across restarts, seed not clearing `slugclaims`, random test titles, a stale port-holding server).

## 3. Blocked / not done

- **Real Cloudinary deletion test (Phase 3): BLOCKED — no isolated Cloudinary credentials were available.** No mock is claimed as
  verification. The owner can run `scripts/verify-cloudinary-deletion.mjs` in the Admin with a **dedicated test cloud**; it uploads its own
  throwaway image (random id `writings/zz-verify-…`), requires `--i-am-using-a-test-account`, deletes it through the production code path and confirms `classifyDestroyResult` → `deleted`. It never touches
  existing production assets.
- **Production steps awaiting separate owner approval:** text-index drop/recreate on `writings`, slug-registry backfill, Vercel env setup, first
  runtime creation of the `ratelimits` TTL index, deployment.
- Open findings not fixed: apex-host revalidate URL is redirected (use `www`); sitemap ignores `seo.robots.index=false`; `/\evil.com` is
  treated as internal by the contract's `urls.js`; legacy Markdown body HTML-encoding; no version CAS on legacy documents without
  `version`; `totalResults` in search may count hidden records (only page contents were checked); production Book documents with `status: null` not yet counted.
- Not testable here: real IME, screen readers, real touch devices, Vercel runtime behaviour, long-lived service-worker cleanup.
