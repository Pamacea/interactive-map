/**
 * Centralized Error Messages for Validation
 *
 * Provides consistent, user-friendly error messages across all forms.
 * Supports i18n hooks in the future.
 */

export const ERROR_MESSAGES = {
  // Required fields
  required: (field: string) => `${field} is required`,
  requiredGeneric: "This field is required",

  // Length validations
  tooShort: (field: string, min: number) =>
    `${field} must be at least ${min} character${min > 1 ? "s" : ""}`,
  tooLong: (field: string, max: number) =>
    `${field} must be less than ${max} character${max > 1 ? "s" : ""}`,

  // Format validations
  invalidEmail: "Please enter a valid email address",
  invalidUrl: "Please enter a valid URL",
  invalidHexColor: "Invalid color format (use #RRGGBB)",
  invalidSlug: "Slug must contain only lowercase letters, numbers, and hyphens",
  invalidCoordinates: "Invalid coordinates",
  invalidNumber: "Please enter a valid number",
  invalidInteger: "Please enter a whole number",

  // Range validations
  outOfRange: (field: string, min: number, max: number) =>
    `${field} must be between ${min} and ${max}`,
  min: (field: string, min: number) => `${field} must be at least ${min}`,
  max: (field: string, max: number) => `${field} must be at most ${max}`,

  // Specific fields
  latitudeOutOfRange: "Latitude must be between -90 and 90",
  longitudeOutOfRange: "Longitude must be between -180 and 180",
  zoomOutOfRange: "Zoom level must be between 0 and 200",
  sizeOutOfRange: "Size must be between 16 and 128 pixels",
  opacityOutOfRange: "Opacity must be between 0 and 1",

  // File validations
  fileTooLarge: (maxSize: string) => `File size must be less than ${maxSize}`,
  invalidFileType: (allowed: string[]) =>
    `Invalid file type. Allowed: ${allowed.join(", ")}`,
  imageRequired: "Please select an image",
  fileRequired: "Please select a file",

  // Relationship validations
  worldRequired: "Please select a world",
  layerRequired: "Please select a layer",

  // Server errors
  saveFailed: "Failed to save. Please try again.",
  loadFailed: "Failed to load. Please try again.",
  deleteFailed: "Failed to delete. Please try again.",
  uploadFailed: "Failed to upload. Please try again.",

  // Permissions
  unauthorized: "You don't have permission to perform this action",
  loginRequired: "You must be logged in to perform this action",

  // Network
  networkError: "Network error. Please check your connection.",
  timeout: "Request timed out. Please try again.",
} as const;

export type ErrorMessageKey = keyof typeof ERROR_MESSAGES;

/**
 * Get a formatted error message
 */
export function getErrorMessage(
  key: ErrorMessageKey,
  ...args: any[]
): string {
  const message = ERROR_MESSAGES[key];
  if (typeof message === "function") {
    return message(...args);
  }
  return message;
}

/**
 * Format Zod error into user-friendly message
 */
export function formatZodError(error: import("zod").ZodError): Record<string, string> {
  const formatted: Record<string, string> = {};

  error.errors.forEach((err) => {
    const path = err.path.join(".");
    formatted[path] = err.message;
  });

  return formatted;
}

/**
 * Get the first error message from a Zod error
 */
export function getFirstZodError(error: import("zod").ZodError): string | null {
  return error.errors[0]?.message ?? null;
}
