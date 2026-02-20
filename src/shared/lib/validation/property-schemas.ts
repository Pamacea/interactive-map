/**
 * Shared Validation Schemas for Property Panels
 *
 * Centralized Zod schemas used across pins, layers, worlds, lore, and gallery.
 * Eliminates duplication and ensures consistent validation rules.
 */

import { z } from "zod";

// ============================================================================
// BASE SCHEMAS - Reusable validation blocks
// ============================================================================

/**
 * Title/name validation - used across all entities
 */
export const TitleSchema = z
  .string()
  .min(1, "Title is required")
  .max(200, "Title must be less than 200 characters");

/**
 * Slug validation for SEO-friendly URLs
 */
export const SlugSchema = z
  .string()
  .min(1, "Slug is required")
  .max(100, "Slug must be less than 100 characters")
  .regex(/^[a-z0-9-]*$/, "Slug must contain only lowercase letters, numbers, and hyphens");

/**
 * Short description validation
 */
export const ShortDescriptionSchema = z
  .string()
  .max(500, "Description must be less than 500 characters")
  .optional()
  .nullable();

/**
 * Long description/content validation
 */
export const LongDescriptionSchema = z
  .string()
  .min(1, "Content is required")
  .max(50000, "Content must be less than 50000 characters");

/**
 * Hex color validation
 */
export const HexColorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color format (use #RRGGBB)");

/**
 * Coordinate validation
 */
export const LatitudeSchema = z
  .number()
  .min(-90, "Latitude must be between -90 and 90")
  .max(90, "Latitude must be between -90 and 90");

export const LongitudeSchema = z
  .number()
  .min(-180, "Longitude must be between -180 and 180")
  .max(180, "Longitude must be between -180 and 180");

export const CoordinatesSchema = z.object({
  latitude: LatitudeSchema,
  longitude: LongitudeSchema,
});

/**
 * Size validation (for icons, markers, etc.)
 */
export const SizeSchema = z
  .number()
  .int("Size must be an integer")
  .min(16, "Size must be at least 16px")
  .max(128, "Size must be at most 128px");

/**
 * Opacity validation (0-1)
 */
export const OpacitySchema = z
  .number()
  .min(0, "Opacity must be between 0 and 1")
  .max(1, "Opacity must be between 0 and 1");

/**
 * Zoom level validation
 */
export const ZoomLevelSchema = z
  .number()
  .int("Zoom level must be an integer")
  .min(0, "Zoom level must be at least 0")
  .max(200, "Zoom level must be at most 200");

/**
 * URL validation
 */
export const UrlSchema = z.string().url("Invalid URL format");

/**
 * CUID validation (for Prisma IDs)
 */
export const CuidSchema = z.string().cuid();

/**
 * Image URL with fallback validation
 */
export const ImageUrlSchema = z
  .string()
  .url("Invalid image URL")
  .nullable()
  .optional();

// ============================================================================
// COMPOSED SCHEMAS - Common combinations
// ============================================================================

/**
 * Base entity fields (id, timestamps)
 */
export const BaseEntitySchema = z.object({
  id: CuidSchema,
  createdAt: z.date(),
  updatedAt: z.date(),
});

/**
 * Ownership fields
 */
export const OwnershipSchema = z.object({
  userId: CuidSchema,
  gameWorldId: CuidSchema,
});

/**
 * Visibility fields
 */
export const VisibilitySchema = z.object({
  isVisible: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  isPublished: z.boolean().default(false),
});

/**
 * Position/offset fields (for layers, images)
 */
export const PositionSchema = z.object({
  offsetX: z.number().default(0),
  offsetY: z.number().default(0),
});

/**
 * Scale validation
 */
export const ScaleSchema = z
  .number()
  .min(0.1, "Scale must be at least 0.1")
  .max(3, "Scale must be at most 3");

/**
 * Layer/appearance fields
 */
export const LayerAppearanceSchema = z.object({
  opacity: OpacitySchema.default(1.0),
  scale: ScaleSchema.default(1.0),
  ...PositionSchema.shape,
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type Title = z.infer<typeof TitleSchema>;
export type Slug = z.infer<typeof SlugSchema>;
export type HexColor = z.infer<typeof HexColorSchema>;
export type Coordinates = z.infer<typeof CoordinatesSchema>;
export type Size = z.infer<typeof SizeSchema>;
export type Opacity = z.infer<typeof OpacitySchema>;
export type ZoomLevel = z.infer<typeof ZoomLevelSchema>;
export type Scale = z.infer<typeof ScaleSchema>;
