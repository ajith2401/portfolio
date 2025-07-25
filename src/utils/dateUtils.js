// src/utils/dateUtils.js

/**
 * Formats a date string into a human-readable format
 * Handles various date formats and edge cases
 * @param {string|Date|null|undefined} dateInput - The date to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted date string
 */
export function formatDate(dateInput, options = {}) {
  // Handle null, undefined, or empty values
  if (!dateInput) {
    return options.fallback || 'Date not available';
  }

  try {
    let date;

    // Handle different input types
    if (dateInput instanceof Date) {
      date = dateInput;
    } else if (typeof dateInput === 'string') {
      // Handle various string formats
      date = new Date(dateInput);
    } else if (typeof dateInput === 'number') {
      // Handle timestamps
      date = new Date(dateInput);
    } else {
      throw new Error('Invalid date input type');
    }

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      console.warn('Invalid date encountered:', dateInput);
      return options.fallback || 'Invalid date';
    }

    // Default formatting options
    const formatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options.format
    };

    // Return formatted date
    return date.toLocaleDateString('en-US', formatOptions);
  } catch (error) {
    console.error('Date formatting error:', error, 'Input:', dateInput);
    return options.fallback || 'Date unavailable';
  }
}

/**
 * Formats a date to show just the year
 * @param {string|Date|null|undefined} dateInput - The date to format
 * @returns {string} Year as string
 */
export function formatYear(dateInput) {
  return formatDate(dateInput, {
    format: { year: 'numeric' },
    fallback: '—'
  });
}

/**
 * Formats a date to show relative time (e.g., "2 days ago")
 * @param {string|Date|null|undefined} dateInput - The date to format
 * @returns {string} Relative time string
 */
export function formatRelativeTime(dateInput) {
  if (!dateInput) return 'Unknown time';

  try {
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid date';

    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
    
    return `${Math.floor(diffInSeconds / 31536000)} years ago`;
  } catch (error) {
    console.error('Relative time formatting error:', error);
    return 'Unknown time';
  }
}

/**
 * Gets the best available date from multiple date fields
 * @param {Object} item - Object containing potential date fields
 * @returns {string|Date|null} The best available date
 */
export function getBestDate(item) {
  return item.publishedAt || item.createdAt || item.updatedAt || null;
}