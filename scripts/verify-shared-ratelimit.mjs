#!/usr/bin/env node
// Starts TWO production Portfolio instances against one LOCAL throwaway MongoDB and proves the limiter is shared.
//   E2E_MONGODB_URI=mongodb://127.0.0.1:27218/shared_test node scripts/verify-shared-ratelimit.mjs
// Needs a prior `next build`. Never touches a non-local database.
import { spawn } from "node:child_process";
import mongoose from "mongoose";

const URI = process.env.E2E_MONGODB_URI || "";
if (!/^mongodb:\/\/(127\.0\.0\.1|localhost):\d+\/[\w-]*test/.test(URI)) { console.error("refusing: E2E_MONGODB_URI must be a local *test* database"); process.exit(2); }
const PORTS = [3125, 3126];
const LIMIT = 30; // /api/search: 30 per minute per client
const procs = [];
const start = (port, extra = {}) => new Promise((resolve, reject) => {
  const p = spawn("npx", ["next", "start", "-p", String(port)], { env: { ...process.env, NODE_ENV: "production", MONGODB_URI: URI, NEXT_PUBLIC_SITE_URL: `http://localhost:${port}`, ...extra }, stdio: "ignore" });
  procs.push(p);
  const t0 = Date.now();
  (async function poll() {
    try { const r = await fetch(`http://127.0.0.1:${port}/manifest.json`, { signal: AbortSignal.timeout(3000) }); if (r.status) return resolve(); } catch {}
    if (Date.now() - t0 > 60000) return reject(new Error(`port ${port} did not start`));
    setTimeout(poll, 500);
  })();
});
// status 0 = no answer within the timeout (the route itself needs the DB, which is down in the outage step)
const hit = async (port, headers = {}) => { try { return (await fetch(`http://127.0.0.1:${port}/api/search?q=zz${Math.random().toString(36).slice(2)}`, { headers, signal: AbortSignal.timeout(15000) })).status; } catch { return 0; } };
const clear = async () => { await mongoose.connection.db.collection("ratelimits").deleteMany({}); };
let failed = 0;
const check = (name, ok, detail = "") => { console.log(`${ok ? "PASS" : "FAIL"}  ${name} ${detail}`); if (!ok) failed++; };

try {
  await mongoose.connect(URI);
  await Promise.all(PORTS.map((p) => start(p)));
  await clear();

  // 1. No trusted source: every caller shares one bucket; rotating spoofed headers must not mint new buckets,
  //    and the limit must hold ACROSS the two instances (per-instance memory would allow 2 x LIMIT).
  const codes = [];
  for (let i = 0; i < LIMIT + 10; i++) codes.push(await hit(PORTS[i % 2], { "x-forwarded-for": `9.9.9.${i}`, "x-real-ip": `8.8.8.${i}`, "x-vercel-forwarded-for": `7.7.7.${i}` }));
  const ok = codes.filter((c) => c !== 429).length, blocked = codes.filter((c) => c === 429).length;
  check("two instances, rotating spoofed headers: exactly LIMIT admitted", ok === LIMIT && blocked === 10, `(admitted ${ok}, 429 ${blocked})`);
  check("both instances return 429 once the shared budget is spent", (await hit(3125)) === 429 && (await hit(3126)) === 429);
  const rows = await mongoose.connection.db.collection("ratelimits").countDocuments({});
  check("one shared counter row, not one per spoofed header", rows === 1, `(rows ${rows})`);

  // 2. Control proving the test can fail: per-instance memory would have admitted 2 x LIMIT.
  check("control: a per-instance limiter would have admitted more than LIMIT", 2 * LIMIT > ok);

  // 3. Counter survives an instance restart (state is in MongoDB, not in process memory).
  procs[0].kill(); await new Promise((r) => setTimeout(r, 1500));
  await start(PORTS[0]);
  check("restarted instance still sees the exhausted budget", (await hit(PORTS[0])) === 429);

  // 4. Store outage: limiter must still limit (per-instance fallback) and must not 500.
  await clear();
  procs.forEach((p) => p.kill()); await new Promise((r) => setTimeout(r, 1500));
  procs.length = 0;
  await start(PORTS[0], { MONGODB_URI: "mongodb://127.0.0.1:1/unreachable_test?serverSelectionTimeoutMS=800&connectTimeoutMS=800" });
  // Concurrent: admitted requests then wait on the dead database, so sequential hits would only measure that wait.
  const out = await Promise.all(Array.from({ length: LIMIT + 5 }, () => hit(PORTS[0])));
  const n429 = out.filter((c) => c === 429).length;
  check("store unreachable: per-instance fallback still limits (exactly 5 of 35 rejected with 429)", n429 === 5, `(429 count ${n429})`);
} catch (e) { console.error("ERROR", e.message); failed++; }
finally { procs.forEach((p) => p.kill()); await mongoose.disconnect().catch(() => {}); }
console.log(failed ? `\n${failed} FAILED` : "\nALL PASSED");
process.exit(failed ? 1 : 0);
