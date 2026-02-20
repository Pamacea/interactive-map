/**
 * Query Keys Factory - Centralized query key definitions
 *
 * Provides type-safe query keys for TanStack Query.
 * Follows the factory pattern for hierarchical key structure.
 *
 * Usage:
 *   queryKey: queryKeys.pins.world(worldId)
 *   queryClient.invalidateQueries({ queryKey: queryKeys.pins.all })
 */

export const queryKeys = {
  // ==========================================================================
  // Worlds
  // ==========================================================================
  worlds: {
    all: ["worlds"] as const,
    lists: () => [...queryKeys.worlds.all, "list"] as const,
    list: (filters: { userId?: string; search?: string }) =>
      [...queryKeys.worlds.lists(), filters] as const,
    details: () => [...queryKeys.worlds.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.worlds.details(), id] as const,
    complete: (id: string) => [...queryKeys.worlds.all, "complete", id] as const,
  },

  // ==========================================================================
  // Pins
  // ==========================================================================
  pins: {
    all: ["pins"] as const,
    lists: () => [...queryKeys.pins.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.pins.lists(), worldId] as const,
    details: () => [...queryKeys.pins.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.pins.details(), id] as const,
    byLayer: (layerId: string) => [...queryKeys.pins.all, "layer", layerId] as const,
  },

  // ==========================================================================
  // Layers
  // ==========================================================================
  layers: {
    all: ["layers"] as const,
    lists: () => [...queryKeys.layers.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.layers.lists(), worldId] as const,
    details: () => [...queryKeys.layers.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.layers.details(), id] as const,
  },

  // ==========================================================================
  // Lore
  // ==========================================================================
  lore: {
    all: ["lore"] as const,
    lists: () => [...queryKeys.lore.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.lore.lists(), worldId] as const,
    details: () => [...queryKeys.lore.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.lore.details(), id] as const,
    byCategory: (worldId: string, category: string) =>
      [...queryKeys.lore.list(worldId), "category", category] as const,
  },

  // ==========================================================================
  // Characters
  // ==========================================================================
  characters: {
    all: ["characters"] as const,
    lists: () => [...queryKeys.characters.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.characters.lists(), worldId] as const,
    details: () => [...queryKeys.characters.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.characters.details(), id] as const,
    byType: (worldId: string, type: string) =>
      [...queryKeys.characters.list(worldId), "type", type] as const,
    byFaction: (worldId: string, faction: string) =>
      [...queryKeys.characters.list(worldId), "faction", faction] as const,
  },

  // ==========================================================================
  // Gallery
  // ==========================================================================
  gallery: {
    all: ["gallery"] as const,
    lists: () => [...queryKeys.gallery.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.gallery.lists(), worldId] as const,
    details: () => [...queryKeys.gallery.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.gallery.details(), id] as const,
    byPin: (pinId: string) => [...queryKeys.gallery.all, "pin", pinId] as const,
    byLore: (loreId: string) => [...queryKeys.gallery.all, "lore", loreId] as const,
  },

  // ==========================================================================
  // Comments
  // ==========================================================================
  comments: {
    all: ["comments"] as const,
    lists: () => [...queryKeys.comments.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.comments.lists(), worldId] as const,
    details: () => [...queryKeys.comments.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.comments.details(), id] as const,
    byPin: (pinId: string) => [...queryKeys.comments.all, "pin", pinId] as const,
  },

  // ==========================================================================
  // Versions
  // ==========================================================================
  versions: {
    all: ["versions"] as const,
    lists: () => [...queryKeys.versions.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.versions.lists(), worldId] as const,
    details: () => [...queryKeys.versions.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.versions.details(), id] as const,
  },

  // ==========================================================================
  // Members
  // ==========================================================================
  members: {
    all: ["members"] as const,
    lists: () => [...queryKeys.members.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.members.lists(), worldId] as const,
  },

  // ==========================================================================
  // Activity
  // ==========================================================================
  activity: {
    all: ["activity"] as const,
    lists: () => [...queryKeys.activity.all, "list"] as const,
    list: (worldId: string) => [...queryKeys.activity.lists(), worldId] as const,
  },

  // ==========================================================================
  // Presence
  // ==========================================================================
  presence: {
    all: ["presence"] as const,
    world: (worldId: string) => [...queryKeys.presence.all, "world", worldId] as const,
  },
} as const;

// ============================================================================
// Type Helpers
// ============================================================================

export type QueryKey = typeof queryKeys;
