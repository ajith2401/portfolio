// Pure: pick a usable cover URL from a writing's `images` object, or null.
// Accepts a same-origin path ("/x.jpg") or an https URL. Everything else (missing, null, empty, whitespace,
// non-string, malformed, protocol-relative, javascript:/data:, http) yields null so the UI shows its designed fallback.
export function resolveCoverSrc(images, keys = ['small', 'medium', 'large']) {
  if (!images || typeof images !== 'object') return null;
  for (const k of keys) {
    const v = images[k];
    if (typeof v !== 'string') continue;
    const s = v.trim();
    if (!s || s.length > 2048) continue;
    if (s.startsWith('/') && !s.startsWith('//') && !s.includes('\\')) return s;
    try {
      const u = new URL(s);
      if (u.protocol === 'https:' && u.hostname.includes('.')) return s;
    } catch { /* malformed: try next key */ }
  }
  return null;
}
