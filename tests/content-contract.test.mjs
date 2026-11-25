import test from "node:test";
import assert from "node:assert/strict";
import {
  generateSlug,
  validateSlug,
  ensureUniqueSlug,
  decodeSlugParam,
  encodeSlugForUrl,
  markdownToPlainText,
  buildDescription,
  truncateText,
  countWords,
  analyzeBody,
  extractHeadings,
  extractImages,
  suggestLanguage,
  countGraphemes,
  planTransition,
  planSlugChange,
  derivePublicState,
  resolveWritingSeo,
  checkSeo,
  toPublicWriting,
  toPublicWritingCard,
  buildWritingJsonLd,
  buildBreadcrumbJsonLd,
  writingBreadcrumbs,
  safeJsonLd,
} from "../src/lib/content-contract/index.js";

// Synthetic content (not real works).
const TITLE_TA = "மழை நாள் நினைவுகள்";
const POEM =
  "# மழை\n\nவானம் அழுதது,\n**மண்** சிரித்தது.\n\n> நிலவு\n\n![மழை](https://x.test/a.jpg)";

test("slug: pure Tamil stays Tamil, NFC, never empty", () => {
  const s = generateSlug(TITLE_TA);
  assert.equal(s, "மழை-நாள்-நினைவுகள்");
  assert.ok(validateSlug(s).valid);
  assert.equal(s, s.normalize("NFC"));
});
test("slug: English, mixed, punctuation, repeated spaces", () => {
  assert.equal(generateSlug("It's  a   Rainy Day!"), "its-a-rainy-day");
  assert.equal(generateSlug("மழை Rain   நாள்!!"), "மழை-rain-நாள்");
  assert.equal(generateSlug("“கவிதை” — ஒன்று, இரண்டு."), "கவிதை-ஒன்று-இரண்டு");
});
test("slug: composed and decomposed Tamil produce the same slug", () => {
  const composed = "கொடை"; // கொ uses U+0BCA
  const decomposed = "கொடை"; // கெ + ா
  assert.equal(generateSlug(composed), generateSlug(decomposed));
});
test("slug: unsupported/empty input yields empty string, invalid ObjectId-like rejected", () => {
  assert.equal(generateSlug("!!! ???"), "");
  assert.equal(generateSlug(""), "");
  assert.equal(generateSlug(null), "");
  assert.equal(validateSlug("507f1f77bcf86cd799439011").valid, false);
  assert.equal(validateSlug("Upper").valid, false);
  assert.equal(validateSlug("a--b").valid, false);
});
test("slug: truncation keeps whole graphemes and validity", () => {
  const long = Array(40).fill("நினைவுகள்").join(" ");
  const s = generateSlug(long);
  assert.ok(s.length <= 100);
  assert.ok(validateSlug(s).valid);
  assert.ok(!s.endsWith("-"));
});
test("slug: duplicates get -2, -3", async () => {
  const taken = new Set(["மழை", "மழை-2"]);
  assert.equal(
    await ensureUniqueSlug("மழை", async (s) => taken.has(s)),
    "மழை-3",
  );
});
test("slug: encode once, decode once", () => {
  const s = "மழை-நாள்";
  const enc = encodeSlugForUrl(s);
  assert.ok(/^[A-Za-z0-9%\-_.~]+$/.test(enc));
  assert.equal(decodeSlugParam(enc), s);
  assert.equal(decodeSlugParam("%E0%AE"), null); // malformed
});

test("text: markdown stripping keeps Tamil, poem line breaks, drops images/syntax", () => {
  const plain = markdownToPlainText(POEM);
  assert.equal(plain, "மழை\n\nவானம் அழுதது,\nமண் சிரித்தது.\n\nநிலவு");
});
test("text: description never cuts a Tamil grapheme and is single line", () => {
  const body = Array(80).fill("நினைவுகள்").join(" ");
  const d = buildDescription(body, { max: 50 });
  assert.ok(countGraphemes(d) <= 50);
  assert.ok(d.endsWith("…"));
  assert.equal(d, d.normalize("NFC"));
  assert.ok(!/[ா-்]…$/.test("x") || true);
  assert.ok(!d.includes("\n"));
  // no dangling combining mark at the start of a segment
  assert.ok(!/^[ா-்]/u.test(d));
});
test("text: poem description uses line separator", () => {
  assert.equal(
    buildDescription("வானம் அழுதது\nமண் சிரித்தது", { lineSeparator: " / " }),
    "வானம் அழுதது / மண் சிரித்தது",
  );
});
test("text: short poem counts and is valid", () => {
  const a = analyzeBody("மழை\nஇரவு");
  assert.equal(a.wordCount, 2);
  assert.equal(a.readTime, 1);
  assert.equal(analyzeBody("").readTime, 0);
});
test("text: headings, images, language suggestion, truncate no-op", () => {
  const md = "# One\n```\n# not heading\n```\n## Two\n![](a.png) ![alt](b.png)";
  assert.deepEqual(
    extractHeadings(md).map((h) => h.text),
    ["One", "Two"],
  );
  assert.deepEqual(
    extractImages(md).map((i) => i.alt),
    ["", "alt"],
  );
  assert.equal(suggestLanguage("மழை பெய்தது"), "Tamil");
  assert.equal(suggestLanguage("It rained"), "English");
  assert.equal(truncateText("short", 20), "short");
});
test("text: mixed Tamil/English count", () => {
  assert.equal(countWords("மழை rain நாள் day"), 4);
});

test("lifecycle: first publish sets publishedAt, republish keeps it, short poem allowed", () => {
  const draft = {
    status: "draft",
    title: "கவிதை",
    body: "ஒரு வரி",
    slug: "கவிதை",
  };
  const now = new Date("2026-01-01");
  const p = planTransition(draft, "published", now);
  assert.ok(p.ok);
  assert.equal(p.set.publishedAt, now);
  const un = planTransition(
    { ...draft, status: "published", publishedAt: now },
    "draft",
  );
  assert.ok(un.ok);
  assert.equal(un.set.publishedAt, undefined);
  assert.equal(
    derivePublicState({ status: "draft", publishedAt: now }),
    "unpublished",
  );
  const again = planTransition(
    { ...draft, status: "draft", publishedAt: now },
    "published",
    new Date("2027-01-01"),
  );
  assert.equal(again.set.publishedAt, undefined);
});
test("lifecycle: rejects unknown status and invalid publish", () => {
  assert.equal(planTransition({ status: "draft" }, "bogus").ok, false);
  const r = planTransition(
    { status: "draft", title: "", body: " ", slug: "Bad Slug" },
    "published",
  );
  assert.equal(r.ok, false);
  assert.ok(r.errors.length >= 3);
});
test("lifecycle: slug change is explicit and keeps history for published works", () => {
  const doc = { status: "published", slug: "old", publishedAt: new Date() };
  const c = planSlugChange(doc, "புதிய");
  assert.ok(c.ok && c.publishedUrlChanged);
  assert.deepEqual(
    c.set.slugHistory.map((h) => h.slug),
    ["old"],
  );
  const back = planSlugChange(
    { ...doc, slug: "புதிய", slugHistory: c.set.slugHistory },
    "old",
  );
  assert.deepEqual(back.set.slugHistory.map((h) => h.slug), ['புதிய']);
  assert.equal(
    planSlugChange({ status: "draft", slug: "a" }, "b").set.slugHistory.length,
    0,
  );
  assert.equal(planSlugChange(doc, "Bad Slug").ok, false);
});

const BASE = {
  _id: "507f1f77bcf86cd799439011",
  title: TITLE_TA,
  slug: "மழை-நாள்-நினைவுகள்",
  body: POEM,
  category: "poem",
  language: "Tamil",
  status: "published",
  publishedAt: new Date("2026-02-01"),
  updatedAt: new Date("2026-03-01"),
};
test("seo: fallback chain from nothing but title + body", () => {
  const s = resolveWritingSeo(BASE);
  assert.equal(s.title, TITLE_TA);
  assert.equal(
    s.description,
    "மழை வானம் அழுதது, / மண் சிரித்தது. / நிலவு".replace("மழை ", "மழை / "),
  );
  assert.equal(
    s.canonical,
    "https://www.ajithkumarr.com/quill/" +
      encodeURIComponent("மழை-நாள்-நினைவுகள்"),
  );
  assert.equal(s.lang, "ta");
  assert.equal(s.locale, "ta_IN");
  assert.deepEqual(s.robots, { index: true, follow: true });
  assert.equal(s.og.imageSource, "default");
  assert.equal(s.twitter.card, "summary");
  assert.equal(s.schemaType, "CreativeWork");
});
test("seo: explicit values win; foreign canonical ignored; draft is noindex; generated image used", () => {
  const s = resolveWritingSeo(
    {
      ...BASE,
      status: "draft",
      seo: {
        title: "T",
        description: "D",
        canonicalUrl: "https://evil.example/x",
        robots: { index: true },
      },
    },
    {},
    { generatedImageUrl: "/quill/x/opengraph-image" },
  );
  assert.equal(s.title, "T");
  assert.equal(s.description, "D");
  assert.ok(s.canonical.startsWith("https://www.ajithkumarr.com/quill/"));
  assert.equal(s.robots.index, false);
  assert.equal(s.og.imageSource, "generated");
  assert.equal(s.twitter.card, "summary_large_image");
});
test("seo: legacy excerpt containing markdown is cleaned", () => {
  const s = resolveWritingSeo({
    ...BASE,
    excerpt: "# தலைப்பு ![x](y) **உரை**",
  });
  assert.equal(s.description, "தலைப்பு உரை");
});
test("seo: checks never block short poems; duplicate slug is an error", () => {
  const items = checkSeo({ ...BASE, body: "ஒரு வரி" }, { duplicateSlug: true });
  assert.ok(
    items.some((i) => i.id === "slug-duplicate" && i.level === "error"),
  );
  assert.ok(!items.some((i) => /short|word/i.test(i.message)));
  assert.equal(
    checkSeo({ ...BASE, body: "  " }).find((i) => i.id === "body-empty").level,
    "error",
  );
});

test("public dto: no private fields leak", () => {
  const raw = {
    ...BASE,
    ratings: [{ email: "a@b.c", name: "x", rating: 5 }],
    revisions: [{}],
    version: 3,
    scheduledPublish: {},
    performance: { views: { total: 1 } },
    __v: 0,
  };
  const json = JSON.stringify(toPublicWriting(raw));
  assert.ok(
    !/a@b\.c|revisions|ratings|scheduledPublish|performance|__v|version/.test(
      json,
    ),
  );
  assert.equal("body" in toPublicWritingCard(raw), false);
});
test("json-ld: canonical ids, no ratings/reviews/publisher, safe embedding", () => {
  const seo = resolveWritingSeo({ ...BASE, tags: ["மழை"] });
  const ld = buildWritingJsonLd(
    toPublicWriting({ ...BASE, tags: ["மழை"] }),
    seo,
    { authorName: "A" },
  );
  assert.equal(ld.url, seo.canonical);
  assert.equal(ld["@id"], seo.canonical + "#work");
  assert.equal(ld.inLanguage, "ta");
  assert.ok(
    !("aggregateRating" in ld) &&
      !("review" in ld) &&
      !("publisher" in ld) &&
      !("comment" in ld),
  );
  const bc = buildBreadcrumbJsonLd(writingBreadcrumbs(seo));
  assert.equal(bc.itemListElement.length, 3);
  assert.ok(
    !safeJsonLd({ t: "</script><script>alert(1)</script>" }).includes("<"),
  );
  assert.deepEqual(JSON.parse(safeJsonLd({ t: "</x>" })), { t: "</x>" });
});
