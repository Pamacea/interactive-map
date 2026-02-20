import { z } from "zod";
import type { PinType as PrismaPinType, LoreCategory as PrismaLoreCategory } from "@prisma/client";

// ============================================
// SEARCH SCHEMAS
// ============================================

/**
 * Search filters schema
 */
export const SearchFiltersSchema = z.object({
  contentType: z.enum(["all", "pins", "lore"]).default("all"),
  pinType: z.enum(["CITY", "VILLAGE", "POI", "CHARACTER", "DUNGEON", "SHOP", "QUEST", "TREASURE", "CUSTOM"]).optional(),
  loreCategory: z.enum(["GENERAL", "HISTORY", "GEOGRAPHY", "CHARACTERS", "FACTIONS", "MAGIC", "ITEMS", "QUESTS", "CUSTOM"]).optional(),
  layerId: z.string().optional(),
});

export type SearchFilters = z.infer<typeof SearchFiltersSchema>;

/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
  worldId: z.string().min(1, "World ID is required"),
  query: z.string().min(1, "Search query is required").max(200, "Search query too long"),
  filters: SearchFiltersSchema.optional(),
  limit: z.number().min(1).max(100).default(50),
});

export type SearchQuery = z.infer<typeof SearchQuerySchema>;

/**
 * Search result item types
 */
export interface PinSearchResult {
  type: "pin";
  id: string;
  title: string;
  description: string | null;
  pinType: PrismaPinType;
  latitude: number;
  longitude: number;
  layerId: string | null;
  layerName: string | null;
  icon: string | null;
  color: string;
  relevance: number;
}

export interface LoreSearchResult {
  type: "lore";
  id: string;
  title: string;
  content: string;
  category: PrismaLoreCategory;
  slug: string;
  relevance: number;
}

export type SearchResultItem = PinSearchResult | LoreSearchResult;

export interface SearchResults {
  pins: PinSearchResult[];
  lore: LoreSearchResult[];
  total: number;
  query: string;
}
