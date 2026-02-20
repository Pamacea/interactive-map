/**
 * Queries - TanStack Query fetch functions
 *
 * Centralized query functions for fetching server data.
 * Use these with useQuery for consistent data fetching.
 *
 * Usage:
 *   const { data } = useQuery({
 *     queryKey: queryKeys.pins.list(worldId),
 *     queryFn: () => queries.pins.list(worldId),
 *   })
 */

import {
  getWorldById,
  getWorldWithData,
  getWorldsByUser,
} from "@/features/worlds/actions";
import {
  getPinsByWorld,
  getPinById,
} from "@/features/pins/actions";
import {
  getLayersByWorld,
  getLayerById,
} from "@/features/world-editor/actions";
import {
  getLoreEntriesByWorld,
  getLoreEntryById,
} from "@/features/lore/actions";
import {
  getCharactersByWorld,
  getCharacterById,
} from "@/features/characters/actions";
import {
  getGalleryItemsByWorld,
} from "@/features/gallery/actions";
import {
  getCommentsByWorld,
  getCommentsByPin,
} from "@/features/comments/actions";
import {
  getWorldVersions,
} from "@/features/versions/actions";
import type { OptimizedWorld } from "@/types/world.type";

// ============================================================================
// Cache Times
// ============================================================================

export const CACHE_TIMES = {
  /** World metadata - changes rarely */
  WORLD: 1000 * 60 * 5, // 5 minutes

  /** Pins data - changes moderately */
  PINS: 1000 * 60 * 2, // 2 minutes

  /** Layers - changes rarely */
  LAYERS: 1000 * 60 * 5, // 5 minutes

  /** Lore entries - changes moderately */
  LORE: 1000 * 60 * 3, // 3 minutes

  /** Characters - changes moderately */
  CHARACTERS: 1000 * 60 * 3, // 3 minutes

  /** Gallery items - changes moderately */
  GALLERY: 1000 * 60 * 5, // 5 minutes

  /** Comments - changes frequently */
  COMMENTS: 1000 * 30, // 30 seconds

  /** Versions - changes rarely */
  VERSIONS: 1000 * 60 * 5, // 5 minutes

  /** Members - changes rarely */
  MEMBERS: 1000 * 60 * 5, // 5 minutes

  /** Activity - changes frequently */
  ACTIVITY: 1000 * 30, // 30 seconds

  /** Presence - changes very frequently */
  PRESENCE: 1000 * 10, // 10 seconds
} as const;

// ============================================================================
// Query Functions
// ============================================================================

export const queries = {
  // ==========================================================================
  // Worlds
  // ==========================================================================
  worlds: {
    /**
     * Get all worlds for current user
     */
    lists: async (filters: { userId?: string; search?: string } = {}) => {
      const _result = await getWorldsByUser(filters.userId ?? "");
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get world by ID
     */
    detail: async (id: string): Promise<OptimizedWorld | null> => {
      const _result = await getWorldById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get world with all related data (layers + pins)
     * Use for initial world load
     */
    complete: async (id: string) => {
      const _result = await getWorldWithData(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  },

  // ==========================================================================
  // Pins
  // ==========================================================================
  pins: {
    /**
     * Get all pins for a world
     */
    list: async (worldId: string): Promise<Pin[]> => {
      const _result = await getPinsByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get single pin by ID
     */
    detail: async (id: string): Promise<Pin> => {
      const _result = await getPinById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get pins by layer
     */
    byLayer: async (layerId: string): Promise<Pin[]> => {
      // Get all pins and filter by layer
      // TODO: Add dedicated server action for this
      const _worldId = ""; // Would need to be passed or derived
      const _result = await getPinsByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.filter((pin) => pin.layerId === layerId);
    },
  },

  // ==========================================================================
  // Layers
  // ==========================================================================
  layers: {
    /**
     * Get all layers for a world
     */
    list: async (worldId: string): Promise<OptimizedWorldLayer[]> => {
      const _result = await getLayersByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get single layer by ID
     */
    detail: async (id: string): Promise<OptimizedWorldLayer> => {
      const _result = await getLayerById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  },

  // ==========================================================================
  // Lore
  // ==========================================================================
  lore: {
    /**
     * Get all lore entries for a world
     */
    list: async (worldId: string): Promise<LoreEntry[]> => {
      const _result = await getLoreEntriesByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get single lore entry by ID
     */
    detail: async (id: string): Promise<LoreEntry> => {
      const _result = await getLoreEntryById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get lore entries by category
     */
    byCategory: async (worldId: string, category: string): Promise<LoreEntry[]> => {
      const _result = await getLoreEntriesByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.filter((lore) => lore.category === category);
    },
  },

  // ==========================================================================
  // Characters
  // ==========================================================================
  characters: {
    /**
     * Get all characters for a world
     */
    list: async (worldId: string): Promise<Character[]> => {
      const _result = await getCharactersByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get single character by ID
     */
    detail: async (id: string): Promise<Character> => {
      const _result = await getCharacterById(id);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get characters by type
     */
    byType: async (worldId: string, type: string): Promise<Character[]> => {
      const _result = await getCharactersByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.filter((char) => char.characterType === type);
    },

    /**
     * Get characters by faction
     */
    byFaction: async (worldId: string, faction: string): Promise<Character[]> => {
      const _result = await getCharactersByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data.filter((char) => char.faction === faction);
    },
  },

  // ==========================================================================
  // Gallery
  // ==========================================================================
  gallery: {
    /**
     * Get all gallery items for a world
     */
    list: async (worldId: string): Promise<GalleryItemWithRelations[]> => {
      const _result = await getGalleryItemsByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get single gallery item by ID
     * (Not directly available, would need to be added to actions)
     */
    detail: async (_id: string): Promise<GalleryItemWithRelations | null> => {
      // Get all and filter - not ideal but works for now
      // TODO: Add getGalleryItemById to actions
      return null;
    },

    /**
     * Get gallery items for a pin
     */
    byPin: async (_pinId: string): Promise<GalleryItemWithRelations[]> => {
      // Get world from pin and filter
      // TODO: Add dedicated server action
      return [];
    },

    /**
     * Get gallery items for a lore entry
     */
    byLore: async (_loreId: string): Promise<GalleryItemWithRelations[]> => {
      // TODO: Add dedicated server action
      return [];
    },
  },

  // ==========================================================================
  // Comments
  // ==========================================================================
  comments: {
    /**
     * Get all comments for a world
     */
    list: async (worldId: string): Promise<CommentWithUser[]> => {
      const _result = await getCommentsByWorld(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },

    /**
     * Get comments for a specific pin
     */
    byPin: async (pinId: string): Promise<CommentWithUser[]> => {
      const _result = await getCommentsByPin(pinId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  },

  // ==========================================================================
  // Versions
  // ==========================================================================
  versions: {
    /**
     * Get all versions for a world
     */
    list: async (worldId: string) => {
      const _result = await getWorldVersions(worldId);
      if (!result.success) {
        throw new Error(result.error.message);
      }
      return result.data;
    },
  },
} as const;

// ============================================================================
// Query Hooks Factory (optional - for convenience)
// ============================================================================

/**
 * Create a query hook with default options
 */
export const createQueryHook = <TArgs extends unknown[], TResult>(
  queryFn: (...args: TArgs) => Promise<TResult>,
  _getDefaultOptions: () => import("@tanstack/react-query").UseQueryOptions<TResult> = () => ({})
) => {
  return (...args: TArgs) => {
    // This would be used with useQuery
    // For now, just return the query function
    return queryFn(...args);
  };
};
