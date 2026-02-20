/**
 * HTML sanitization utilities for XSS prevention
 *
 * IMPORTANT: DOMPurify should be installed for production use.
 * Run: npm install dompurify @types/dompurify
 *
 * Until DOMPurify is installed, we use basic HTML escaping.
 */

// Try to import DOMPurify, fallback to basic escaping
let DOMPurify: any = null;

try {
  // Dynamic import for DOMPurify (client-side only)
  if (typeof window !== "undefined") {
    require("dompurify");
    DOMPurify = (window as any).DOMPurify;
  }
} catch (e) {
  // DOMPurify not installed, will use fallback
}

/**
 * Basic HTML entity encoding for XSS prevention
 * This is a FALLBACK - DOMPurify should be used in production
 */
export function escapeHtml(unsafe: string): string {
  return String(unsafe)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Sanitize HTML content to prevent XSS attacks
 *
 * Uses DOMPurify if available (client-side), falls back to basic escaping.
 * For server-side use, always rely on markdown libraries with built-in sanitization.
 *
 * @param html - Raw HTML string to sanitize
 * @param options - DOMPurify options (only used if DOMPurify is available)
 * @returns Sanitized HTML string safe to render
 */
export function sanitizeHtml(html: string, options?: any): string {
  if (!html) return "";

  // Use DOMPurify if available (client-side)
  if (DOMPurify && typeof DOMPurify.sanitize === "function") {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: [
        "p", "br", "strong", "b", "em", "i", "u", "a",
        "h1", "h2", "h3", "h4", "h5", "h6",
        "ul", "ol", "li", "blockquote", "code", "pre",
        "div", "span", "hr", "img", "sub", "sup"
      ],
      ALLOWED_ATTR: [
        "href", "title", "alt", "src", "class", "id",
        "target", "rel", "data-id", "data-slug", "data-title"
      ],
      ALLOW_DATA_ATTR: true,
      SAFE_FOR_TEMPLATES: true,
      ...options
    });
  }

  // Fallback: basic HTML escaping (converts HTML to text, not ideal for rich content)
  // This is a safety measure - content won't render as HTML but will be safe
  return escapeHtml(html);
}

/**
 * Sanitize URL to prevent javascript: and data: attacks
 */
export function sanitizeUrl(url: string): string {
  if (!url) return "";

  const trimmed = url.trim().toLowerCase();

  // Block dangerous protocols
  if (trimmed.startsWith("javascript:") ||
      trimmed.startsWith("data:") ||
      trimmed.startsWith("vbscript:") ||
      trimmed.startsWith("file:")) {
    return "";
  }

  // Only allow http, https, mailto, tel
  if (!trimmed.startsWith("http://") &&
      !trimmed.startsWith("https://") &&
      !trimmed.startsWith("mailto:") &&
      !trimmed.startsWith("tel:")) {
    return "";
  }

  return url;
}

/**
 * Safe JSON stringify for embedding in data attributes
 * Prevents XSS via JSON injection
 */
export function safeJsonStringify(obj: unknown): string {
  try {
    // JSON.stringify naturally escapes HTML special characters
    // But we add extra protection by checking for dangerous patterns
    const json = JSON.stringify(obj);

    // Check for script tags or dangerous patterns
    if (/<script|javascript:|on\w+\s*=/i.test(json)) {
      console.error("[sanitize] Potentially dangerous content detected in JSON");
      // Return empty object instead of risky content
      return "{}";
    }

    return json;
  } catch (e) {
    console.error("[sanitize] Failed to stringify JSON:", e);
    return "{}";
  }
}
