import { z } from "zod";

/**
 * Lore validation schemas for I/O operations
 * Follows project pattern: All external data validated with Zod
 */

// Enum from Prisma schema
export const LoreCategoryEnum = z.enum([
  "GENERAL",
  "HISTORY",
  "GEOGRAPHY",
  "CHARACTERS",
  "FACTIONS",
  "MAGIC",
  "ITEMS",
  "QUESTS",
  "CUSTOM",
]);

export type LoreCategory = z.infer<typeof LoreCategoryEnum>;

/**
 * Core LoreEntry schema - matches Prisma LoreEntry model
 */
export const LoreEntrySchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  content: z.string().min(1, "Content is required"),
  slug: z.string().min(1, "Slug is required").max(200),
  category: LoreCategoryEnum.default("GENERAL"),
  isVisible: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type LoreEntry = z.infer<typeof LoreEntrySchema>;

/**
 * Create LoreEntry input schema (server action / API)
 */
export const CreateLoreEntrySchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    content: z.string().min(1, "Content is required").max(50000, "Content too long"),
    category: LoreCategoryEnum.default("GENERAL"),
    isVisible: z.boolean().default(false),
    isPublic: z.boolean().default(true),
    gameWorldId: z.string().cuid(),
  })
  .transform((data) => {
    // Auto-generate slug from title
    const slug = data.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    return {
      ...data,
      slug,
    };
  });

export type CreateLoreEntryInput = z.infer<typeof CreateLoreEntrySchema>;

/**
 * Update LoreEntry input schema
 */
export const UpdateLoreEntrySchema = z
  .object({
    id: z.string().cuid(),
    title: z.string().min(1).max(200).optional(),
    content: z.string().min(1).max(50000).optional(),
    category: LoreCategoryEnum.optional(),
    isVisible: z.boolean().optional(),
    isPublic: z.boolean().optional(),
    slug: z.string().optional(), // Optional slug field
  })
  .transform((data) => {
    // If title is being updated, regenerate slug
    if (data.title) {
      const slug = data.title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/[\s_-]+/g, "-")
        .replace(/^-+|-+$/g, "");

      return {
        ...data,
        slug,
      };
    }
    return data;
  });

export type UpdateLoreEntryInput = z.infer<typeof UpdateLoreEntrySchema>;

/**
 * Lore query filters schema
 */
export const LoreFiltersSchema = z.object({
  gameWorldId: z.string().cuid(),
  categories: z.array(LoreCategoryEnum).optional(),
  searchTerm: z.string().optional(),
  showVisibleOnly: z.boolean().optional(),
});

export type LoreFilters = z.infer<typeof LoreFiltersSchema>;

/**
 * Quick lore creation (minimal fields)
 */
export const QuickLoreSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(50000),
  gameWorldId: z.string().cuid(),
  category: LoreCategoryEnum.default("GENERAL"),
});

export type QuickLoreInput = z.infer<typeof QuickLoreSchema>;
