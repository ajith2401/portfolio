// src/utils/slugGenerator.js
/**
 * Generates SEO-friendly URL slugs from titles
 * Handles English, Tamil, and special characters
 */

export function generateSlug(title) {
  if (!title) return '';
  
  return title
    .toLowerCase()
    .trim()
    // Handle special characters and preserve international characters
    .replace(/[^\w\s\u0B80-\u0BFF-]/g, '') // Remove special chars, keep Tamil
    .replace(/\s+/g, '-')     // Replace spaces with hyphens
    .replace(/-+/g, '-')      // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, '')  // Remove leading/trailing hyphens
    .substring(0, 100);       // Limit length for URLs
}

/**
 * Ensures slug uniqueness by checking against existing slugs
 * @param {string} baseSlug - The base slug to check
 * @param {Function} findFunction - Function to check if slug exists
 * @param {string} excludeId - ID to exclude from uniqueness check (for updates)
 */
export async function ensureUniqueSlug(baseSlug, findFunction, excludeId = null) {
  if (!baseSlug) return null;
  
  let slug = baseSlug;
  let counter = 1;
  
  while (true) {
    const existingDoc = await findFunction(slug, excludeId);
    if (!existingDoc) {
      return slug;
    }
    
    slug = `${baseSlug}-${counter}`;
    counter++;
    
    // Prevent infinite loops
    if (counter > 1000) {
      return `${baseSlug}-${Date.now()}`;
    }
  }
}

/**
 * Validates slug format
 * @param {string} slug 
 */
export function validateSlug(slug) {
  if (!slug) return false;
  
  // Must be lowercase alphanumeric with hyphens only
  const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  return slugPattern.test(slug) && slug.length <= 100;
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