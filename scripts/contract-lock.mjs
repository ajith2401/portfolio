// Keeps src/lib/content-contract identical across portfolio and portfolio_admin.
//   node scripts/contract-lock.mjs write            record hashes in CONTRACT.lock.json
//   node scripts/contract-lock.mjs check            fail if files differ from the lock
//   node scripts/contract-lock.mjs peer <repo-path> fail if the other repo's contract differs
import { createHash } from "node:crypto";
import { readdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, resolve } from "node:path";

const REL = "src/lib/content-contract";
const LOCK = "CONTRACT.lock.json";

function hashDir(root) {
  const dir = join(root, REL);
  const files = {};
  for (const f of readdirSync(dir)
    .filter((n) => n.endsWith(".js"))
    .sort()) {
    files[f] = createHash("sha256")
      .update(readFileSync(join(dir, f)))
      .digest("hex");
  }
  return files;
}

function diff(a, b) {
  const names = new Set([...Object.keys(a), ...Object.keys(b)]);
  return [...names].filter((n) => a[n] !== b[n]);
}

const [mode = "check", peerPath] = process.argv.slice(2);
const root = process.cwd();
const current = hashDir(root);

if (mode === "write") {
  writeFileSync(
    join(root, REL, LOCK),
    JSON.stringify({ files: current }, null, 2) + "\n",
  );
  console.log(`Wrote ${REL}/${LOCK} (${Object.keys(current).length} files)`);
} else if (mode === "check") {
  const lockPath = join(root, REL, LOCK);
  if (!existsSync(lockPath)) {
    console.error("Missing lock file");
    process.exit(1);
  }
  const bad = diff(current, JSON.parse(readFileSync(lockPath, "utf8")).files);
  if (bad.length) {
    console.error(
      "Contract files changed without updating the lock:",
      bad.join(", "),
    );
    process.exit(1);
  }
  console.log("Contract matches lock");
} else if (mode === "peer") {
  if (!peerPath) {
    console.error("Usage: peer <repo-path>");
    process.exit(2);
  }
  const bad = diff(current, hashDir(resolve(peerPath)));
  if (bad.length) {
    console.error("Contract differs from peer repo in:", bad.join(", "));
    process.exit(1);
  }
  console.log("Contract identical in both repositories");
} else {
  console.error("Unknown mode");
  process.exit(2);
}
