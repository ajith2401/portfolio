// DB part runs only against a LOCAL throwaway mongod: MONGODB_TEST_URI=mongodb://127.0.0.1:27019/portfolio_test
import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  generateSlug as legacyGenerate,
  validateSlug as legacyValidate,
} from "../src/utils/slugGenerator.js";
import { generateSlug } from "../src/lib/content-contract/slug.js";
import { resolveBookRoute } from "../src/lib/public/book-routing.js";

const uri = process.env.MONGODB_TEST_URI;
const skip =
  !uri || !/^mongodb:\/\/(127\.0\.0\.1|localhost)[:/]/.test(uri)
    ? "set MONGODB_TEST_URI to a LOCAL throwaway mongod"
    : false;

test("legacy slugGenerator now delegates to the shared contract", () => {
  for (const t of ["Hello World", "It's  a Test!", "மழை இரவு", "a_b"])
    assert.equal(legacyGenerate(t), generateSlug(t));
  assert.equal(legacyGenerate("My First Book"), "my-first-book"); // existing ASCII output is unchanged
  assert.equal(legacyValidate("மழை-இரவு"), true);
  assert.equal(legacyValidate("674617c2a56c8f57d03659b4"), false);
});

test("resolveBookRoute: render by slug, redirect from history, 404 otherwise", async () => {
  const deps = {
    byId: async () => null,
    bySlug: async (s) =>
      s === "new-slug" || s === "நிலா" ? { slug: s } : null,
    byHistory: async (s) =>
      s === "old-slug" || s === "பழைய" ? { slug: "new-slug" } : null,
  };
  assert.equal((await resolveBookRoute("new-slug", deps)).action, "render");
  assert.equal(
    (await resolveBookRoute(encodeURIComponent("நிலா"), deps)).action,
    "render",
  );
  assert.deepEqual(await resolveBookRoute("old-slug", deps), {
    action: "redirect",
    to: "/spotlight/new-slug",
  });
  assert.equal(
    (await resolveBookRoute(encodeURIComponent("பழைய"), deps)).action,
    "redirect",
  );
  assert.equal((await resolveBookRoute("nope", deps)).action, "notfound");
  assert.equal((await resolveBookRoute("%E0%A4%A", deps)).action, "notfound"); // malformed encoding
});

test("Book model: slug stability, duplicates, history", { skip }, async (t) => {
  const { Book } = await import("../src/models/book.model.js");
  await mongoose.connect(uri);
  t.after(() => mongoose.disconnect());
  await Book.deleteMany({});
  await Book.syncIndexes();
  const base = { description: "d", publishYear: 2020 };

  const a = await Book.create({ ...base, title: "My First Book" });
  assert.equal(a.slug, "my-first-book");
  const dup = await Book.create({ ...base, title: "My First Book" });
  assert.equal(dup.slug, "my-first-book-2");
  const ta = await Book.create({ ...base, title: "மழை இரவு" });
  assert.equal(
    ta.slug,
    "மழை-இரவு",
    "Tamil title is accepted (old ASCII validator rejected it)",
  );

  a.title = "Totally Different Title";
  await a.save();
  assert.equal(
    a.slug,
    "my-first-book",
    "title edit must NOT change a stored slug",
  );
  assert.equal(a.slugHistory.length, 0);

  // A legacy doc inserted without slugHistory still loads and saves.
  await Book.collection.insertOne({
    title: "Legacy",
    slug: "legacy-book",
    description: "d",
    publishYear: 2001,
    status: "published",
    language: "Tamil",
    genre: "Poetry",
  });
  const legacy = await Book.findOne({ slug: "legacy-book" });
  legacy.description = "changed";
  await legacy.save();
  assert.equal(legacy.slug, "legacy-book");

  // Explicit slug change records history.
  a.slug = "renamed-book";
  await a.save();
  assert.deepEqual(
    a.slugHistory.map((h) => h.slug),
    ["my-first-book"],
  );
  a.slug = "renamed-again";
  await a.save();
  assert.deepEqual(
    a.slugHistory.map((h) => h.slug),
    ["my-first-book", "renamed-book"],
  );
  // Changing back removes it from history (no self-redirect loop).
  a.slug = "my-first-book";
  await a.save();
  assert.ok(!a.slugHistory.some((h) => h.slug === "my-first-book"));

  // Cannot take another book's live slug or reserved history slug.
  const b = await Book.create({ ...base, title: "Other" });
  b.slug = "legacy-book";
  await assert.rejects(b.save(), /already used/);
  const c = await Book.findById(b._id);
  c.slug = "renamed-book";
  await assert.rejects(c.save(), /already used/);
  // New book whose title equals a reserved history slug gets a suffix instead.
  const d = await Book.create({ ...base, title: "Renamed Book" });
  assert.equal(d.slug, "renamed-book-2");
  // Invalid slugs rejected.
  const e = await Book.findById(b._id);
  e.slug = "Bad Slug!";
  await assert.rejects(e.save());
  const f = await Book.findById(b._id);
  f.slug = "674617c2a56c8f57d03659b4";
  await assert.rejects(f.save());
  await Book.deleteMany({});
});
