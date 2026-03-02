import { z } from "zod";

/**
 * Pin validation schemas for I/O operations
 * Follows project pattern: All external data validated with Zod
 */

// Enum from Prisma schema
export const PinTypeSchema = z.enum([
  "CITY",
  "VILLAGE",
  "POI",
  "CHARACTER",
  "DUNGEON",
  "SHOP",
  "QUEST",
  "TREASURE",
  "CUSTOM",
]);

export type PinTypeZod = z.infer<typeof PinTypeSchema>;

/**
 * Core Pin schema - matches Prisma Pin model
 */
export const PinSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional().nullable(),
  pinType: PinTypeSchema.default("CUSTOM"),
  latitude: z.number().min(0, "Latitude must be between 0 and 1").max(1, "Latitude must be between 0 and 1"),
  longitude: z.number().min(0, "Longitude must be between 0 and 1").max(1, "Longitude must be between 0 and 1"),
  icon: z.string().max(100).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").default("#3b82f6"),
  size: z.number().int().min(16).max(128).default(32),
  opacity: z.number().min(0).max(1).default(1.0),
  isVisible: z.boolean().default(true),
  properties: z.any().optional().nullable(), // JSON for custom RPG data
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  layerId: z.string().cuid().optional().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Pin = z.infer<typeof PinSchema>;

/**
 * Create Pin input schema (server action / API)
 */
export const CreatePinSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200),
    description: z.string().max(5000).optional(),
    pinType: PinTypeSchema.default("CUSTOM"),
    latitude: z.number().min(0, "Latitude must be between 0 and 1").max(1, "Latitude must be between 0 and 1"),
    longitude: z.number().min(0, "Longitude must be between 0 and 1").max(1, "Longitude must be between 0 and 1"),
    icon: z.string().max(100).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional().default("#3b82f6"),
    size: z.number().int().min(16).max(128).optional().default(32),
    opacity: z.number().min(0).max(1).optional().default(1.0),
    minZoom: z.number().min(0, "Min zoom must be at least 0").max(200, "Min zoom cannot exceed 200").default(0),
    maxZoom: z.number().min(0, "Max zoom must be at least 0").max(200, "Max zoom cannot exceed 200").default(200),
    isVisible: z.boolean().optional().default(true),
    properties: z.any().optional(),
    gameWorldId: z.string().cuid(),
    layerId: z.string().cuid().optional(),
  })
  .refine((data) => data.minZoom < data.maxZoom, {
    message: "Min zoom must be less than max zoom",
    path: ["minZoom"], // Error will be attached to minZoom field
  });

export type CreatePinInput = z.infer<typeof CreatePinSchema>;

/**
 * Update Pin input schema
 */
export const UpdatePinSchema = z
  .object({
    id: z.string().cuid(),
    title: z.string().min(1).max(200).optional(),
    slug: z.string().max(100).regex(/^[a-z0-9-]*$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional().nullable(),
    description: z.string().max(5000).optional(),
    pinType: PinTypeSchema.optional(),
    latitude: z.number().min(0, "Latitude must be between 0 and 1").max(1, "Latitude must be between 0 and 1").optional(),
    longitude: z.number().min(0, "Longitude must be between 0 and 1").max(1, "Longitude must be between 0 and 1").optional(),
    icon: z.string().max(100).optional(),
    color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
    size: z.number().int().min(16).max(128).optional(),
    opacity: z.number().min(0).max(1).optional(),
    minZoom: z.number().min(0, "Min zoom must be at least 0").max(200, "Min zoom cannot exceed 200").optional(),
    maxZoom: z.number().min(0, "Max zoom must be at least 0").max(200, "Max zoom cannot exceed 200").optional(),
    isVisible: z.boolean().optional(),
    properties: z.any().optional(),
    layerId: z.string().cuid().optional().nullable(),
  })
  .refine((data) => {
    // Only validate if both zoom fields are provided
    if (data.minZoom !== undefined && data.maxZoom !== undefined) {
      return data.minZoom < data.maxZoom;
    }
    return true;
  }, {
    message: "Min zoom must be less than max zoom",
    path: ["minZoom"], // Error will be attached to minZoom field
  });

export type UpdatePinInput = z.infer<typeof UpdatePinSchema>;

/**
 * Pin query filters schema
 */
export const PinFiltersSchema = z.object({
  gameWorldId: z.string().cuid(),
  pinTypes: z.array(PinTypeSchema).optional(),
  layerIds: z.array(z.string().cuid()).optional(),
  searchTerm: z.string().optional(),
  showVisibleOnly: z.boolean().optional(),
});

export type PinFilters = z.infer<typeof PinFiltersSchema>;

/**
 * Pin coordinates for map placement (normalized 0-1 range)
 */
export const PinCoordinatesSchema = z.object({
  latitude: z.number().min(0, "Latitude must be between 0 and 1").max(1, "Latitude must be between 0 and 1"),
  longitude: z.number().min(0, "Longitude must be between 0 and 1").max(1, "Longitude must be between 0 and 1"),
});

export type PinCoordinates = z.infer<typeof PinCoordinatesSchema>;

/**
 * Quick pin creation (minimal fields)
 */
export const QuickPinSchema = z.object({
  title: z.string().min(1).max(200),
  latitude: z.number().min(0, "Latitude must be between 0 and 1").max(1, "Latitude must be between 0 and 1"),
  longitude: z.number().min(0, "Longitude must be between 0 and 1").max(1, "Longitude must be between 0 and 1"),
  gameWorldId: z.string().cuid(),
  pinType: PinTypeSchema.default("CUSTOM"),
});

export type QuickPinInput = z.infer<typeof QuickPinSchema>;
