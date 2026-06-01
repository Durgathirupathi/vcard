/**
 * Security Utility Library
 * Implements sanitization, XSS mitigation, and tenant authorization helpers.
 */

/**
 * Sanitizes URLs to prevent Stored XSS (e.g. javascript:alert(1) injections)
 * in public business card templates.
 */
export function sanitizeUrl(url: string | undefined): string {
  if (!url) return '';
  const trimmed = url.trim();
  const lowercase = trimmed.toLowerCase();
  
  // Explicitly block scripting protocols
  if (
    lowercase.startsWith('javascript:') || 
    lowercase.startsWith('data:') || 
    lowercase.startsWith('vbscript:') ||
    lowercase.includes('<script')
  ) {
    return '#';
  }
  
  // Safe protocols allowed for user navigation
  if (
    lowercase.startsWith('http://') ||
    lowercase.startsWith('https://') ||
    lowercase.startsWith('mailto:') ||
    lowercase.startsWith('tel:')
  ) {
    return trimmed;
  }
  
  // Support auto-prepending https to absolute domains (like apex.studio -> https://apex.studio)
  if (trimmed.match(/^[a-zA-Z0-9-.]+\.[a-zA-Z]{2,}/)) {
    return `https://${trimmed}`;
  }
  
  return trimmed;
}

/**
 * Validates text inputs against potential XSS injection attacks.
 * Replaces basic HTML entities to keep data rendering safe.
 */
export function sanitizeText(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
