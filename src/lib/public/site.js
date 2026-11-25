// Canonical site origin for metadata and generated URLs.
// Order: NEXT_PUBLIC_SITE_URL (set per environment) -> production default -> http://localhost:<PORT|3000> in dev/test.
// Never ends with a slash. Invalid values are ignored.
export const PRODUCTION_SITE_URL = 'https://www.ajithkumarr.com';

function clean(value) {
  if (!value || typeof value !== 'string') return null;
  try {
    const u = new URL(value.trim());
    if (u.protocol !== 'http:' && u.protocol !== 'https:') return null;
    return u.origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(env = process.env) {
  const configured = clean(env.NEXT_PUBLIC_SITE_URL);
  if (configured) return configured;
  if (env.NODE_ENV === 'production') return PRODUCTION_SITE_URL;
  return `http://localhost:${env.PORT || 3000}`;
}
