// Stable content hash of everything the OG card depends on (ETag + ?v= cache-buster). Pure, no canvas.
import { createHash } from 'node:crypto';
import { clampTitle } from './layout.js';

export function cardVersion({ title, category, language, host }) {
  return createHash('sha1')
    .update(JSON.stringify([clampTitle(title), category || '', language || '', host || '', 'v1']))
    .digest('hex').slice(0, 12);
}
