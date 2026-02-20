/**
 * Query Provider Configuration
 *
 * Centralized cache times for TanStack Query
 */

export const CACHE_TIMES = {
  /** Rarely changing data (worlds, layers, regions) */
  WORLD: 1000 * 60 * 5, // 5 minutes

  /** User-generated content (pins, characters, lore) */
  CONTENT: 1000 * 60 * 2, // 2 minutes

  /** Fast-changing data (comments, presence) */
  REALTIME: 1000 * 30, // 30 seconds

  /** Static data (tags, types) */
  STATIC: 1000 * 60 * 30, // 30 minutes
} as const;

export const STALE_TIMES = {
  ...CACHE_TIMES,
} as const;

export const GC_TIMES = {
  /** Default garbage collection time */
  DEFAULT: 1000 * 60 * 30, // 30 minutes

  /** For rarely accessed data */
  RARE: 1000 * 60 * 10, // 10 minutes
} as const;
