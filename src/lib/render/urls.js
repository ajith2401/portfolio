// URL policy shared by both renderers. Only http/https/mailto/site-relative; everything else is dropped.
import { isSafeUrl } from "../content-contract/index.js";

const SITE_HOSTS = new Set(["www.ajithkumarr.com", "ajithkumarr.com"]);

/** -> { href, rel, external } or null when the URL must not be rendered as a link. */
export function linkAttrs(href) {
  if (!isSafeUrl(href)) return null;
  const v = String(href).trim();
  if (v.startsWith("/")) return { href: v, rel: "noopener noreferrer", external: false };
  let u;
  try { u = new URL(v); } catch { return null; }
  if (u.protocol === "mailto:") return { href: v, rel: "noopener noreferrer", external: false };
  const internal = SITE_HOSTS.has(u.hostname);
  return {
    href: v,
    rel: internal ? "noopener noreferrer" : "noopener noreferrer nofollow ugc",
    external: !internal,
  };
}

/** Image sources: http(s) or site-relative only (no mailto:, no data:). */
export function imageSrc(src) {
  if (!isSafeUrl(src)) return null;
  const v = String(src).trim();
  if (v.startsWith("/")) return v;
  try {
    const p = new URL(v).protocol;
    return p === "https:" || p === "http:" ? v : null;
  } catch {
    return null;
  }
}
