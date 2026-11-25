// src/utils/slugGenerator.js
/**
 * Generates SEO-friendly URL slugs from titles
 * Thin wrapper over the shared slug contract (src/lib/content-contract/slug.js).
 */

export { generateSlug } from '../lib/content-contract/slug.js';

import {
  ensureUniqueSlug as contractEnsureUniqueSlug,
  validateSlug as contractValidateSlug,
} from '../lib/content-contract/slug.js';

/**
 * Legacy signature kept for existing callers: findFunction(slug, excludeId) resolves truthy if taken.
 * Delegates to the shared contract (suffixes -2, -3 ...; never returns an invalid slug).
 */
export async function ensureUniqueSlug(baseSlug, findFunction, excludeId = null) {
  return contractEnsureUniqueSlug(baseSlug, async (slug) => Boolean(await findFunction(slug, excludeId)));
}

/** Boolean wrapper over the shared contract validator (Tamil letters allowed). */
export function validateSlug(slug) {
  return contractValidateSlug(slug).valid;
}

/**
 * Sanitizes user input for slug creation
 * @param {string} input 
 */
export function sanitizeForSlug(input) {
  if (!input) return '';
  
  return input
    .trim()
    .substring(0, 200) // Limit input length
    .replace(/[<>]/g, ''); // Remove potential XSS characters
}

/**
 * Returns a safe URL for a content item, using slug if available, otherwise _id.
 * @param {object} item - The content item (must have slug and _id fields)
 * @param {string} section - The section (e.g., 'blog', 'quill', 'devfolio', 'spotlight')
 * @returns {string} SEO-friendly URL
 */
export function getSafeUrl(item, section) {
  if (!item || !section) return '/';
  const identifier = item.slug || item._id;
  return `/${section}/${identifier}`;
}