#!/usr/bin/env node
// READ-ONLY dry run for the `writings` text-index change. It never creates, drops or modifies anything.
//
//   MONGODB_URI=... node scripts/inspect-text-index.mjs            # inspects the DB named in MONGODB_URI
//   node scripts/inspect-text-index.mjs --uri-env OTHER_ENV_NAME    # read the URI from another variable
//
// Prints: target host/db (credentials never printed), the index MongoDB has now, the index the
// model declares, whether they match, and the exact steps an owner would run (not executed here).
// Only listIndexes, a document count and a collection size are called against the server.
import mongoose from "mongoose";
import { Writing } from "../src/models/writings.model.js";

const envName = process.argv.includes("--uri-env")
  ? process.argv[process.argv.indexOf("--uri-env") + 1]
  : "MONGODB_URI";
const uri = process.env[envName];
if (!uri) {
  console.error(`${envName} is not set. Nothing was contacted.`);
  process.exit(2);
}

// Credentials are never echoed: only host(s) and db name.
function describeTarget(u) {
  try {
    const url = new URL(u.replace(/^mongodb(\+srv)?:\/\//, "http://"));
    return {
      host: url.host.replace(/^.*@/, ""),
      db: url.pathname.replace(/^\//, "") || "(default)",
    };
  } catch {
    return { host: "(unparseable)", db: "(unparseable)" };
  }
}

const intended = Writing.schema
  .indexes()
  .find(([spec]) => Object.values(spec).includes("text"));
if (!intended) {
  console.error("The model declares no text index.");
  process.exit(2);
}
const [intendedSpec, intendedOpts] = intended;
const want = {
  name: intendedOpts.name,
  key: intendedSpec,
  weights: intendedOpts.weights,
  default_language: intendedOpts.default_language,
  language_override: intendedOpts.language_override,
};

const target = describeTarget(uri);
console.log(
  `Target: host=${target.host} db=${target.db}   (read-only: listIndexes + counts only)`,
);
await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 8000,
  autoIndex: false,
  autoCreate: false,
});
const coll = mongoose.connection.db.collection(Writing.collection.name);

const indexes = await coll
  .listIndexes()
  .toArray()
  .catch((e) => {
    if (e.codeName === "NamespaceNotFound") return [];
    throw e;
  });
const live = indexes.find(
  (i) => i.textIndexVersion || Object.values(i.key).includes("text"),
);
const docCount = await coll.estimatedDocumentCount();
const stats = await mongoose.connection.db
  .command({ collStats: coll.collectionName })
  .catch(() => null);

const norm = (i) => ({
  name: i.name,
  weights: i.weights,
  default_language: i.default_language ?? "english",
  language_override: i.language_override ?? "language",
});
const wantN = norm({ ...want });
const liveN = live ? norm(live) : null;

const same =
  liveN &&
  liveN.name === wantN.name &&
  liveN.default_language === wantN.default_language &&
  liveN.language_override === wantN.language_override &&
  JSON.stringify(Object.entries(liveN.weights || {}).sort()) ===
    JSON.stringify(Object.entries(wantN.weights || {}).sort());

console.log("\nLive text index :", liveN ? JSON.stringify(liveN) : "NONE");
console.log("Model intends   :", JSON.stringify(wantN));
console.log(
  `Documents: ~${docCount}` +
    (stats
      ? `   dataSize: ${(stats.size / 1048576).toFixed(2)} MiB   existing indexSize: ${(stats.totalIndexSize / 1048576).toFixed(2)} MiB`
      : ""),
);
console.log(
  "\nVerdict:",
  same
    ? "MATCH — nothing to do."
    : liveN
      ? "DIFFERS — the index must be dropped and recreated."
      : "ABSENT — the index must be created.",
);

// Why a mismatch matters: with the default override field `language`, a document whose language is
// "Tamil"/"English" is rejected by MongoDB when the index exists ("language override unsupported").
if (liveN && liveN.language_override === "language") {
  const bad = await coll
    .countDocuments({ language: { $in: ["Tamil", "English"] } })
    .catch(() => null);
  console.log(
    `Risk with the live index: ${bad ?? "?"} document(s) carry language 'Tamil'/'English'; MongoDB rejects inserting or updating such documents while this index exists (verified locally: 'language override unsupported').`,
  );
}

if (!same) {
  console.log(
    "\nPLAN (NOT EXECUTED — owner runs this, after a backup, with separate approval):",
  );
  if (liveN)
    console.log(
      `  1. db.${coll.collectionName}.dropIndex(${JSON.stringify(liveN.name)})`,
    );
  console.log(
    `  ${liveN ? 2 : 1}. db.${coll.collectionName}.createIndex(${JSON.stringify(want.key)}, ${JSON.stringify(
      {
        name: want.name,
        weights: want.weights,
        default_language: want.default_language,
        language_override: want.language_override,
        background: true,
      },
    )})`,
  );
  console.log(
    "  Between the steps, $text queries fail ('text index required'); keep that window short (seconds at this size).",
  );
}
await mongoose.disconnect();
