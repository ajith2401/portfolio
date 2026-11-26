# Acceptance report — editorial platform (Portfolio + Portfolio Admin)

Branches (both kept; `main` untouched; nothing pushed, merged or deployed):

- `portfolio` → `feature/portfolio-editorial-seo`, head `f08a7b2`
- `portfolio_admin` → `feature/portfolio-admin-editorial-studio`, head `26f082c`

All evidence below is from a throwaway local MongoDB (127.0.0.1, databases named `*_test`). **No production database
write, index change or deployment was performed.** Admin files that pre-date this work and are intentionally
unstaged: `package.json`, `AGENTS.md`, `scripts/read-db-collections.mjs`.

**Verdict: not production-ready.** Phases 1 and 2 are implemented and verified at route level on production builds,
but Phases 3–7 (below) are not finished and the production steps in `docs/PRODUCTION_READINESS.md` have not been approved or run.

---

## 1. Implemented and independently verified (fresh runs after the latest commits)

| Check                                                                            | Result                                                                                                                                                          |
| -------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Portfolio unit tests (`npm test`)                                                | 158 pass, 2 skipped, 0 fail (160)                                                                                                                               |
| Admin unit tests (`npm test`)                                                    | 172 pass, 1 skipped, 0 fail (173)                                                                                                                               |
| Admin real-MongoDB tests (`tests/db/*`, run by explicit path; not in `npm test`) | 7/7 pass                                                                                                                                                        |
| Lint, both repos                                                                 | 0 errors (55 / 44 warnings)                                                                                                                                     |
| Production build, Portfolio (webpack)                                            | succeeds. A first build **failed** (`'use client'` below an import in 5 components; lint and unit tests did not catch it). Fixed in `f08a7b2` with a guard test |
| Production build, Admin                                                          | succeeds                                                                                                                                                        |
| Contract lock, peer identity, model parity                                       | match; 12 model files identical                                                                                                                                 |
| Playwright specs 01–04 (Admin only, real Chrome)                                 | 30/30 pass in this run                                                                                                                                          |
| Playwright specs 05 + 07 (both apps, one shared DB) + 06                         | 27 + 1 pass, twice in a row                                                                                                                                     |

**Phase 1 findings — route-level negative tests (spec 07, real HTTP against production builds):**

- **Legacy writing APIs:** POST/PUT/PATCH/DELETE on `/api/writings` and `/api/writings/<id>`, with no key, a bogus bearer and a bogus `x-api-key`, all return 410, plus `/rate` and `/comments` POST. No alternate route reaches the old write code.
- **Comments and ratings:** `POST /api/comments` on draft, archived, missing and malformed ids is rejected; a published target is accepted as `pending`, absent from the public list, with no reviewer email, and does not change `averageRating`/`totalRatings`. Once approved it is listed (still without email). Admin `comments` on draft/archived/missing/malformed → 404.
  **Defect found and fixed by this testing:** the Admin `rate` routes (writings, tech-blog, projects) applied unmoderated ratings to public aggregates; now retired (410).
- **Cloudinary ownership:** unauthenticated → 401/403; image of another writing → 404 and the other writing is unchanged; foreign cloud, other folder, foreign host, traversal, bare id, empty, `javascript:` → 400/404 with the document unchanged; legitimate delete detaches the image and leaves other writings alone; a shared asset is detached but reported `keptBecauseShared`.
- **Slugs through the real API:** a taken current slug is never stored twice (the second writing is suffixed; rename onto it → 409); a slug in another writing's history is never handed out and a rename onto it → 409; 8 simultaneous creates of one slug → 8 × 201, 8 distinct slugs, exactly one holder of the base slug, 8 registry rows; a failed (invalid) create leaves no orphan claim.
  **Defect found and fixed:** a lost claim race used to fail the author's save; it now retries with a suffix.
- **JSON-LD:** hostile title/description (`</script><script>…`, `&`, `<b>`, U+2028/U+2029) on `/books`, `/spotlight/<slug>`, `/blog`, `/`: every `ld+json` block parses and contains no raw `<`, `>` or separators; the injected script never appears raw. Unit test additionally covers every file that emits JSON-LD (16).

**Phase 2 — Book visibility (spec 07, published / draft / archived / legacy-no-status fixtures):**

- Detail by slug and by id (`/spotlight/…`), `/api/books`, `/api/books/<slug|id>`, `/related`, `/spotlight`, `/books`, `/sitemap.xml`, `/api/search` (paged walk) and short links `/s/<code>`: hidden books are 404/absent with no title in the response; published and legacy books remain visible (positive controls).
  **Defect found and fixed by this testing:** `/s/<code>` resolved draft/archived Books (and unpublished writings, blog posts, projects) in metadata and redirects.
- Pagination: results of every page of a search contain no hidden record. Not checked: whether `totalResults` counts hidden records.

**Slug registry on a real MongoDB** (7/7): unique index; two simultaneous claims for the same slug → exactly one winner; different slugs → both win; current and historical collisions; rename keeps the old claim; failed-save compensation releases only the caller's claim; repeat claim is idempotent. The backfill dry run on a seeded database wrote 0 rows and reported:
`writings 4, currentSlugs 4, historicalSlugs 4, distinctSlugs 6, alreadyInRegistry 0, expectedNewRegistryRecords 6, duplicateWithinOneWriting 1, invalidSlugs 1, conflictsNeedingManualResolution 1`.

## 2. Implemented but not fully verified

- **Slug registry is only partially protective in production until the backfill is applied** (see `PRODUCTION_READINESS.md` §4). The dry run has not been run against production; `--apply` has not been run anywhere real.
- **Cloudinary:** ownership logic is verified, but the actual `destroy` call was never exercised against real Cloudinary (tests use a dummy cloud name).
- **Hidden Book staleness:** after hiding a Book, `/books`, `/spotlight` and the sitemap stay cached up to 1 h unless `POST /api/revalidate {section:'book'}` is called. The target exists and is unit-tested; nothing calls it (Books have no Admin editor). `/books` renders a hardcoded list, so DB Books never appear there.
- **Spec 03 flake** (Admin editor persistence/conflict tests): still **no root cause**. It passed 30/30 this run and passed on earlier isolated reruns, but it failed intermittently before. It has not been run repeatedly in a controlled loop, so it must not be called fixed.
- **Test-isolation defects found in my own tests** (fixed, not product bugs): the seed did not clear `slugclaims`, and spec 05 reused slugs while the Portfolio's on-disk ISR cache survived restarts. Both caused false failures.
- Earlier review findings still open: apex-host revalidate URL is redirected (use `www`), sitemap ignores `robots.index=false`, `/\evil.com` link treated as internal, legacy Markdown body HTML-encoding, version CAS on legacy documents without `version`.
- No horizontal overflow at 390/820/1440 px on the public writing page and the editor (measured earlier; not re-run in this window).

## 3. Not implemented or blocked

- **Phase 3** broken poem hero image (browser inspection, attractive no-cover design, absent/null/empty/malformed image tests): not started in this window.
- **Phase 4** rate limiter and client-IP trust on Vercel (spoofed/missing `X-Forwarded-For`), auth fallback, DTO/error/log hygiene: not done. The limiter is in-memory per instance.
- **Phase 5** Book Tamil slug via the shared contract, social OG image with local image loading, poem-card previews, duplicate BreadcrumbList removal, `next-pwa` decision, Tamil IME / touch / keyboard / screen-reader checks: not done.
- **Phase 6** root cause of the spec 03 flake: not found.
- **Phase 7** full shared-DB publishing rerun with additional negative tests: spec 05 + 07 pass, but the wider negative set is not complete.
- **Production steps awaiting owner approval:** text-index drop/recreate on `writings`, slug-registry backfill, Vercel env setup. Not run.
- Not testable here: real IME, screen readers, real touch devices, Vercel runtime behaviour of the OG route, long-lived service-worker cleanup.
