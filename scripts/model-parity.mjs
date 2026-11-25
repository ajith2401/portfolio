// Verifies src/models is byte-identical in both repos. Usage: node scripts/model-parity.mjs <path-to-peer-repo>
import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import path from 'node:path';
const peer = process.argv[2];
if (!peer) { console.error('usage: node scripts/model-parity.mjs <peer-repo>'); process.exit(2); }
const h = (f) => createHash('sha256').update(readFileSync(f)).digest('hex');
const dirA = path.resolve('src/models'), dirB = path.resolve(peer, 'src/models');
const a = readdirSync(dirA).sort(), b = readdirSync(dirB).sort();
let bad = 0;
for (const n of new Set([...a, ...b])) {
  if (!a.includes(n) || !b.includes(n)) { console.error(`MISSING ${n}`); bad++; }
  else if (h(path.join(dirA, n)) !== h(path.join(dirB, n))) { console.error(`DIFFERS ${n}`); bad++; }
}
if (bad) process.exit(1);
console.log(`Models identical in both repositories (${a.length} files)`);
