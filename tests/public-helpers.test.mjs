import test from "node:test";
import assert from "node:assert/strict";
import { resolveWritingRoute } from "../src/lib/public/writing-routing.js";
import { toPublicComment, escapeRegExp, escapeXml } from "../src/lib/public/comments.js";
import { cdata, plainTextToHtml, writingFeedItem } from "../src/lib/public/feed.js";

const ID = "674617c2a56c8f57d03659b4";
const pub = (o) => ({ _id: ID, status: "published", slug: "மழை-நாள்", title: "மழை நாள்", body: "மழை", ...o });
const lookups = (docs) => ({
  byId: async (id) => docs.find((d) => String(d._id) === id) || null,
  bySlug: async (s) => docs.find((d) => d.slug === s) || null,
  byHistory: async (s) => docs.find((d) => (d.slugHistory || []).some((h) => h.slug === s)) || null,
});

test("route: current slug renders (percent-encoded Tamil)", async () => {
  const r = await resolveWritingRoute(encodeURIComponent("மழை-நாள்"), lookups([pub()]));
  assert.equal(r.action, "render");
});
test("route: published ObjectId redirects to slug; draft ObjectId is 404", async () => {
  assert.deepEqual(
    (({ action, slug, reason }) => ({ action, slug, reason }))(await resolveWritingRoute(ID, lookups([pub()]))),
    { action: "redirect", slug: "மழை-நாள்", reason: "objectId" },
  );
  assert.equal((await resolveWritingRoute(ID, lookups([pub({ status: "draft" })]))).action, "notfound");
});
test("route: slug history redirects once, never to itself, never from draft", async () => {
  const doc = pub({ slug: "new", slugHistory: [{ slug: "old" }, { slug: "new" }] });
  const r = await resolveWritingRoute("old", lookups([doc]));
  assert.deepEqual([r.action, r.slug], ["redirect", "new"]);
  assert.equal((await resolveWritingRoute("new", lookups([doc]))).action, "render"); // current beats history, no loop
  assert.equal((await resolveWritingRoute("old", lookups([{ ...doc, status: "draft" }]))).action, "notfound");
});
test("route: malformed percent-encoding and junk are 404", async () => {
  assert.equal((await resolveWritingRoute("%E0%A4%A", lookups([]))).action, "notfound");
  assert.equal((await resolveWritingRoute("x".repeat(500), lookups([]))).action, "notfound");
});
test("comments: public shape drops email and moderation", () => {
  const c = toPublicComment({ _id: 1, name: "a", email: "x@y.z", comment: "hi", rating: 5, status: "approved", createdAt: "2025-01-01" });
  assert.deepEqual(Object.keys(c).sort(), ["_id", "comment", "createdAt", "name", "rating"]);
});
test("escapes", () => {
  assert.equal(escapeRegExp("a.*(b)"), "a\\.\\*\\(b\\)");
  assert.equal(escapeXml(`<a href="x">&'`), "&lt;a href=&quot;x&quot;&gt;&amp;&apos;");
});
test("feed: CDATA cannot be terminated; item is plain-text HTML, Tamil kept", () => {
  assert.ok(!cdata("a]]>b<script>").replace("]]]]><![CDATA[>", "").includes("]]>b"));
  const it = writingFeedItem({ title: "t", slug: "மழை", category: "poem", body: "வானம்\n\n<script>alert(1)</script>", status: "published" });
  assert.ok(!it.contentHtml.includes("<script"));
  assert.ok(it.contentHtml.includes("வானம்"));
  assert.ok(it.link.endsWith("/quill/" + encodeURIComponent("மழை")));
  assert.equal(writingFeedItem({ title: "x" }), null);
  assert.equal(plainTextToHtml("a\nb"), "<p>a<br/>b</p>");
});
