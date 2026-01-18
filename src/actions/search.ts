"use server";

import { prisma } from "@/lib/prisma";
import { z } from "zod";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/lib/server-helpers";

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
  pinType: string;
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
  category: string;
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

// ============================================
// SEARCH HELPERS
// ============================================

/**
 * Calculate relevance score for a search match
 * Higher score = better match
 */
function calculateRelevance(
  query: string,
  title: string,
  content?: string | null
): number {
  const queryLower = query.toLowerCase();
  const titleLower = title.toLowerCase();
  const contentLower = content?.toLowerCase() || "";

  let score = 0;

  // Exact title match = 100 points
  if (titleLower === queryLower) {
    score += 100;
  }
  // Title starts with query = 80 points
  else if (titleLower.startsWith(queryLower)) {
    score += 80;
  }
  // Title contains query = 60 points
  else if (titleLower.includes(queryLower)) {
    score += 60;
  }

  // Count word matches in title (10 points each)
  const queryWords = queryLower.split(/\s+/).filter(w => w.length > 0);
  const titleWords = titleLower.split(/\s+/);
  queryWords.forEach(word => {
    if (titleWords.some(tw => tw.includes(word))) {
      score += 10;
    }
  });

  // Content matches (5 points each occurrence, max 25)
  if (contentLower) {
    const contentMatches = (contentLower.match(new RegExp(queryLower, "gi")) || []).length;
    score += Math.min(contentMatches * 5, 25);
  }

  return score;
}

/**
 * Highlight search terms in text
 */
function highlightText(text: string, query: string): string {
  if (!query) return text;

  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  return text.replace(regex, "__HIGHLIGHT__$1__ENDHIGHLIGHT__");
}

/**
 * Unescape highlighted text for display
 */
export async function unescapeHighlight(text: string): Promise<string> {
  return text
    .replace(/__HIGHLIGHT__/g, "<mark>")
    .replace(/__ENDHIGHLIGHT__/g, "</mark>");
}

// ============================================
// SEARCH ACTIONS
// ============================================

/**
 * Full-text search across world content (pins and lore)
 * @param data - Search query and filters
 * @returns Search results with pins and lore entries
 */
export async function searchWorld(data: SearchQuery): Promise<Result<SearchResults>> {
  return safeAsync(async () => {
    // Validate input
    const validated = SearchQuerySchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify user has access to the world
    await verifyWorldPermission(validated.worldId, user.id);

    const { worldId, query, filters, limit } = validated;
    const queryLower = query.toLowerCase();

    // Determine which content types to search
    const searchPins = !filters || filters.contentType === "all" || filters.contentType === "pins";
    const searchLore = !filters || filters.contentType === "all" || filters.contentType === "lore";

    // Execute searches in parallel
    const [pinsResults, loreResults] = await Promise.all([
      searchPins ? searchPinsInWorld(worldId, queryLower, filters, limit) : [],
      searchLore ? searchLoreInWorld(worldId, queryLower, filters, limit) : [],
    ]);

    // Sort by relevance
    const allResults = [...pinsResults, ...loreResults];
    const sortedResults = allResults.sort((a, b) => b.relevance - a.relevance);

    // Separate back into pins and lore for typed response
    const sortedPins = sortedResults
      .filter((r): r is PinSearchResult => r.type === "pin")
      .slice(0, limit);

    const sortedLore = sortedResults
      .filter((r): r is LoreSearchResult => r.type === "lore")
      .slice(0, limit);

    return {
      pins: sortedPins,
      lore: sortedLore,
      total: sortedPins.length + sortedLore.length,
      query: validated.query,
    };
  }, "searchWorld");
}

/**
 * Search pins in a world
 */
async function searchPinsInWorld(
  worldId: string,
  query: string,
  filters?: SearchFilters,
  limit: number = 50
): Promise<PinSearchResult[]> {
  // Build Prisma query
  const where: any = {
    gameWorldId: worldId,
    isVisible: true,
  };

  // Apply filters
  if (filters?.pinType) {
    where.pinType = filters.pinType;
  }

  if (filters?.layerId) {
    where.layerId = filters.layerId;
  }

  // Fetch pins
  const pins = await prisma.pin.findMany({
    where,
    include: {
      layer: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    take: limit * 2, // Fetch extra to filter and sort
  });

  // Filter by query text and calculate relevance
  const results: PinSearchResult[] = pins
    .map(pin => {
      const titleMatch = pin.title.toLowerCase().includes(query);
      const descMatch = pin.description?.toLowerCase().includes(query);

      if (!titleMatch && !descMatch) {
        return null;
      }

      const relevance = calculateRelevance(query, pin.title, pin.description);

      return {
        type: "pin" as const,
        id: pin.id,
        title: pin.title,
        description: pin.description,
        pinType: pin.pinType,
        latitude: pin.latitude,
        longitude: pin.longitude,
        layerId: pin.layerId,
        layerName: pin.layer?.name || null,
        icon: pin.icon,
        color: pin.color,
        relevance,
      };
    })
    .filter((pin): pin is PinSearchResult => pin !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  return results;
}

/**
 * Search lore entries in a world
 */
async function searchLoreInWorld(
  worldId: string,
  query: string,
  filters?: SearchFilters,
  limit: number = 50
): Promise<LoreSearchResult[]> {
  // Build Prisma query
  const where: any = {
    gameWorldId: worldId,
    isVisible: true,
  };

  // Apply filters
  if (filters?.loreCategory) {
    where.category = filters.loreCategory;
  }

  // Fetch lore entries
  const loreEntries = await prisma.loreEntry.findMany({
    where,
    take: limit * 2, // Fetch extra to filter and sort
  });

  // Filter by query text and calculate relevance
  const results: LoreSearchResult[] = loreEntries
    .map(lore => {
      const titleMatch = lore.title.toLowerCase().includes(query);
      const contentMatch = lore.content.toLowerCase().includes(query);

      if (!titleMatch && !contentMatch) {
        return null;
      }

      const relevance = calculateRelevance(query, lore.title, lore.content);

      return {
        type: "lore" as const,
        id: lore.id,
        title: lore.title,
        content: lore.content,
        category: lore.category,
        slug: lore.slug,
        relevance,
      };
    })
    .filter((lore): lore is LoreSearchResult => lore !== null)
    .sort((a, b) => b.relevance - a.relevance)
    .slice(0, limit);

  return results;
}

/**
 * Get search suggestions based on partial query
 * Returns top matching titles for autocomplete
 */
export async function getSearchSuggestions(
  worldId: string,
  partialQuery: string,
  limit: number = 10
): Promise<Result<string[]>> {
  return safeAsync(async () => {
    if (!partialQuery || partialQuery.length < 2) {
      return [];
    }

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify user has access to the world
    await verifyWorldPermission(worldId, user.id);

    const queryLower = partialQuery.toLowerCase();

    // Search pin titles and lore titles in parallel
    const [pins, lore] = await Promise.all([
      prisma.pin.findMany({
        where: {
          gameWorldId: worldId,
          isVisible: true,
          title: {
            contains: queryLower,
            mode: "insensitive",
          },
        },
        select: { title: true },
        take: limit,
      }),
      prisma.loreEntry.findMany({
        where: {
          gameWorldId: worldId,
          isVisible: true,
          title: {
            contains: queryLower,
            mode: "insensitive",
          },
        },
        select: { title: true },
        take: limit,
      }),
    ]);

    // Combine and deduplicate titles
    const titles = new Set([
      ...pins.map(p => p.title),
      ...lore.map(l => l.title),
    ]);

    // Sort by relevance (starts with > contains)
    const sortedTitles = Array.from(titles).sort((a, b) => {
      const aStarts = a.toLowerCase().startsWith(queryLower);
      const bStarts = b.toLowerCase().startsWith(queryLower);

      if (aStarts && !bStarts) return -1;
      if (!aStarts && bStarts) return 1;
      return a.localeCompare(b);
    });

    return sortedTitles.slice(0, limit);
  }, "getSearchSuggestions");
}
