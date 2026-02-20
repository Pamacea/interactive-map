/**
 * Slug utility functions
 * Generates unique, URL-friendly identifiers for entities
 */

/**
 * Remove file extension from a filename
 * e.g., "image.png" -> "image", "document.pdf.txt" -> "document.pdf"
 */
function removeFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf(".");
  // Only remove if there's a dot and it's not the first character (hidden files)
  if (lastDotIndex > 0) {
    return filename.substring(0, lastDotIndex);
  }
  return filename;
}

/**
 * Generate a URL-friendly slug from text
 * - Lowercase
 * - Remove accents
 * - Remove file extensions (for filenames)
 * - Replace spaces with hyphens
 * - Remove special characters
 */
export function generateSlug(text: string | null | undefined): string {
  if (!text) return `untitled-${Date.now()}`;

  // First remove file extension if present (e.g., "image.png" -> "image")
  const withoutExtension = removeFileExtension(text);

  return withoutExtension
    .toLowerCase()
    .normalize("NFD") // Decompose accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars (except hyphens)
    .trim()
    .replace(/\s+/g, "-") // Spaces to hyphens
    .replace(/-+/g, "-") // Multiple hyphens to single
    .substring(0, 50); // Max length
}

/**
 * Generate a unique slug by appending suffix if needed
 * Usage: await generateUniqueSlug("pin", gameWorldId, "My Title", prisma.pin)
 *
 * @param type - Entity type for logging (unused but useful for context)
 * @param worldId - World ID to scope uniqueness
 * @param baseSlug - The base slug to use
 * @param checkExists - Function to check if slug exists
 * @param excludeId - ID to exclude from check (when updating existing entity)
 */
export async function generateUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>,
  excludeId?: string
): Promise<string> {
  let slug = baseSlug;
  let suffix = 1;

  // Check if base slug is available
  let exists = excludeId
    ? await checkExists(slug, excludeId)
    : await checkExists(slug);

  // If exists, try with suffixes
  while (exists) {
    slug = `${baseSlug}-${suffix++}`;
    exists = excludeId
      ? await checkExists(slug, excludeId)
      : await checkExists(slug);

    if (suffix > 1000) {
      throw new Error("Could not generate unique slug after 1000 attempts");
    }
  }

  return slug;
}

/**
 * Extract slug from entity name/title
 * Shortcut for generateSlug with common naming
 */
export function slugFromName(name: string | null | undefined): string {
  return generateSlug(name);
}
