import { z } from "zod";

/**
 * Pin validation schemas for I/O operations
 * Follows project pattern: All external data validated with Zod
 */

// Enum from Prisma schema
export const PinTypeEnum = z.enum([
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

export type PinType = z.infer<typeof PinTypeEnum>;

/**
 * Core Pin schema - matches Prisma Pin model
 */
export const PinSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  description: z.string().max(5000, "Description too long").optional().nullable(),
  pinType: PinTypeEnum.default("CUSTOM"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  icon: z.string().max(100).optional().nullable(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Invalid hex color").default("#3b82f6"),
  size: z.number().int().min(16).max(128).default(32),
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
export const CreatePinSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().max(5000).optional(),
  pinType: PinTypeEnum.default("CUSTOM"),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  icon: z.string().max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).default("#3b82f6"),
  size: z.number().int().min(16).max(128).default(32),
  isVisible: z.boolean().default(true),
  properties: z.any().optional(),
  gameWorldId: z.string().cuid(),
  layerId: z.string().cuid().optional(),
});

export type CreatePinInput = z.infer<typeof CreatePinSchema>;

/**
 * Update Pin input schema
 */
export const UpdatePinSchema = z.object({
  id: z.string().cuid(),
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(5000).optional(),
  pinType: PinTypeEnum.optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  icon: z.string().max(100).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  size: z.number().int().min(16).max(128).optional(),
  isVisible: z.boolean().optional(),
  properties: z.any().optional(),
  layerId: z.string().cuid().optional().nullable(),
});

export type UpdatePinInput = z.infer<typeof UpdatePinSchema>;

/**
 * Pin query filters schema
 */
export const PinFiltersSchema = z.object({
  gameWorldId: z.string().cuid(),
  pinTypes: z.array(PinTypeEnum).optional(),
  layerIds: z.array(z.string().cuid()).optional(),
  searchTerm: z.string().optional(),
  showVisibleOnly: z.boolean().optional(),
});

export type PinFilters = z.infer<typeof PinFiltersSchema>;

/**
 * Pin coordinates for map placement
 */
export const PinCoordinatesSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export type PinCoordinates = z.infer<typeof PinCoordinatesSchema>;

/**
 * Quick pin creation (minimal fields)
 */
export const QuickPinSchema = z.object({
  title: z.string().min(1).max(200),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  gameWorldId: z.string().cuid(),
  pinType: PinTypeEnum.default("CUSTOM"),
});

export type QuickPinInput = z.infer<typeof QuickPinSchema>;
