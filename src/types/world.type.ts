import { z } from "zod";

export const PermissionEnum = z.enum(["READER", "EDITOR", "OWNER"]);
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

export const MapLayerSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullable(),
  isVisible: z.boolean().default(true),
  opacity: z.number().default(1.0),
  zIndex: z.number().default(0),
  offsetX: z.number().default(0),
  offsetY: z.number().default(0),
  scale: z.number().default(1.0),
  minZoom: z.number().default(0),
  maxZoom: z.number().default(200),
  gameWorldId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const PinSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  pinType: PinTypeEnum.default("CUSTOM"),
  latitude: z.number(),
  longitude: z.number(),
  icon: z.string().nullable(),
  color: z.string().default("#3b82f6"),
  size: z.number().default(32),
  isVisible: z.boolean().default(true),
  properties: z.any().nullable(),
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  layerId: z.string().cuid().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const LoreEntrySchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  category: LoreCategoryEnum.default("GENERAL"),
  isVisible: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const WorldMemberSchema = z.object({
  id: z.string().cuid(),
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  permission: PermissionEnum.default("READER"),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const GameWorldSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  map: z.string().nullable(),
  isPublished: z.boolean().default(false),
  isPublic: z.boolean().default(true),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  layers: z.array(MapLayerSchema).optional(),
  pins: z.array(PinSchema).optional(),
  loreEntries: z.array(LoreEntrySchema).optional(),
  _count: z
    .object({
      pins: z.number(),
      loreEntries: z.number(),
    })
    .optional(),
});

// Optimized world type for initial page load (excludes pins and loreEntries)
export const OptimizedWorldLayerSchema = z.object({
  id: z.string().cuid(),
  name: z.string(),
  description: z.string().nullable(),
  isVisible: z.boolean(),
  opacity: z.number(),
  zIndex: z.number(),
  offsetX: z.number(),
  offsetY: z.number(),
  scale: z.number(),
});

export const OptimizedWorldSchema = z.object({
  id: z.string().cuid(),
  title: z.string(),
  description: z.string().nullable(),
  map: z.string().nullable(),
  isPublished: z.boolean(),
  isPublic: z.boolean(),
  userId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
  user: z.object({
    name: z.string().nullable(),
    image: z.string().nullable(),
  }),
  layers: z.array(OptimizedWorldLayerSchema),
});

export const GameWorldInputSchema = GameWorldSchema.pick({
  title: true,
  description: true,
  isPublic: true,
});

export type GameWorld = z.infer<typeof GameWorldSchema>;
export type GameWorldInput = z.infer<typeof GameWorldInputSchema>;
export type MapLayer = z.infer<typeof MapLayerSchema>;
export type Pin = z.infer<typeof PinSchema>;
export type LoreEntry = z.infer<typeof LoreEntrySchema>;
export type WorldMember = z.infer<typeof WorldMemberSchema>;
export type Permission = z.infer<typeof PermissionEnum>;
export type PinType = z.infer<typeof PinTypeEnum>;
export type LoreCategory = z.infer<typeof LoreCategoryEnum>;
export type OptimizedWorld = z.infer<typeof OptimizedWorldSchema>;
export type OptimizedWorldLayer = z.infer<typeof OptimizedWorldLayerSchema>;
