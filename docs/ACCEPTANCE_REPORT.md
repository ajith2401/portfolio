# Acceptance report — editorial platform (Portfolio + Portfolio Admin)

Branches: `portfolio` → `feature/portfolio-editorial-seo`; `portfolio_admin` → `feature/portfolio-admin-editorial-studio`.
Nothing was pushed, merged, deployed or run against production. All evidence is from a throwaway local MongoDB.

## 1. Implemented and independently verified

- **End-to-end publishing on one shared test DB** (real production builds of both apps, real Chrome): create Tamil poem → autosave → preview → SEO → draft is 404 publicly → publish → public render, `<br>` line breaks, SEO title, canonical, `og:image` (1200×630 PNG), one BreadcrumbList + work JSON-LD, sitemap → edit + on-demand revalidation → slug change (old URL permanently redirects) → unpublish (route 404, sitemap/list exclude). Plus: bad/missing revalidate secret rejected; unreachable revalidate URL still saves and warns. Re-run green on the final builds (specs 05 6/6, 06 1/1).
- Unit tests: Portfolio 82 pass / 2 skipped / 0 fail (after last fix); Admin suite green earlier. Lint: 0 errors (warnings only). Contract lock + model parity identical across repos. Both production builds succeeded (before the final small Portfolio fix; see §2).
- Admin Playwright specs 01–04: 29/30 first full run; the single failure (spec 03 "category switch", then "Keep mine and overwrite") passed on isolated and repeated reruns → intermittent, see §2.
- No horizontal overflow at 390 / 820 / 1440 px on the public writing page and the admin editor (measured).
- Fail-safes verified locally: missing `REVALIDATE_SECRET` → 503; missing `ADMIN_API_KEY` → 401; empty `JWT_SECRET` → login 500, no cookie.
- Independent code review (separate agent): admin write routes auth/origin-checked; Tiptap content validated; renderers escape and drop unsafe URLs; public writing queries all status-filtered; revalidate fails closed.

## 2. Implemented but not fully verified

- **Fix commit 2a32515** (draft/archived books hidden on sitemap, /spotlight, /books, /api/books, search, related; OG image path added to revalidation targets): unit tests + lint pass; **production build, browser check and a regression test were not run.**
- **Intermittent Playwright failures** in spec 03 (two different tests, each passing on rerun; one took 17 min before timing out). Cause not found; possibly slow `page.evaluate` under load.
- **Broken hero image** on a public poem with no cover (alt text shown, large blank area) in my screenshot. `QuillPageHeader.js` is unchanged by this branch and `public/placeholder.jpg` is valid; cause not determined (possibly the local image optimizer). Not confirmed on `main`.
- Desktop screenshot of the OG card and `Cache-Control` mismatch (route sets `s-maxage=86400`, live response showed `max-age=3600`) not examined.
- Review findings not fixed (all from code reading, not reproduced): legacy key-gated `PUT/POST /api/writings` on the public site bypass version check, slug history and SEO sanitising; admin `deleteImage` can remove another writing's Cloudinary asset; un-escaped JSON-LD on older blog/book/project pages; comments/ratings accepted on drafts; slug-history entries can be taken by another writing; sitemap ignores `robots.index=false`; `/\evil.com` link treated as internal; legacy Markdown `body` gets HTML-encoded; version CAS on documents lacking a `version` field; apex-host `PORTFOLIO_REVALIDATE_URL` would be redirected (use the `www` URL).
- Contract parity was byte-identical per the reviewer and the lock tool.

## 3. Not implemented, blocked, or untested

- **Production steps awaiting owner approval:** text-index drop/recreate on `writings` (runbook + read-only inspector in `docs/PRODUCTION_READINESS.md`), Vercel env setup. Not run.
- Not tested: real IME input, screen readers, real Cloudinary, real touch devices, Vercel runtime behaviour of the `@napi-rs/canvas` OG route and font tracing, old `next-pwa` service-worker cleanup in a long-lived browser.
- In-memory rate limiter is per instance only.
- Other known follow-ups: unauthenticated order/payment/subscribe routes, Admin DELETE image handling, techblog ASCII slug validator, log-only `x-forwarded-for` reads.

**Verdict:** the publishing scenario is verified end to end locally, but the system should not be called production-ready until §2 items are triaged and §3 production steps are approved and run.
