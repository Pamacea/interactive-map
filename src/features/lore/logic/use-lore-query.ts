"use client";

import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/shared/lib/providers";
import {
  getLoreEntryById,
  getLoreEntriesByWorld,
} from "@/features/lore/actions/lore";
import type { LoreEntry } from "@prisma/client";

/**
 * Query keys for lore operations
 */
export const loreKeys = {
  all: ["lore"] as const,
  worlds: () => [...loreKeys.all, "worlds"] as const,
  world: (worldId: string) => [...loreKeys.worlds(), worldId] as const,
  detail: (id: string) => [...loreKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch lore entries for a world
 */
export function useLoreEntries(worldId: string) {
  return useQuery<LoreEntry[]>({
    queryKey: loreKeys.world(worldId),
    queryFn: () => getLoreEntriesByWorld(worldId),
    staleTime: CACHE_TIMES.WORLD,
    enabled: !!worldId,
  });
}

/**
 * Hook to fetch a single lore entry by ID
 */
export function useLoreEntry(loreId: string) {
  return useQuery<LoreEntry | null>({
    queryKey: loreKeys.detail(loreId),
    queryFn: () => getLoreEntryById(loreId),
    staleTime: CACHE_TIMES.WORLD,
    enabled: !!loreId,
  });
}
