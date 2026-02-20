"use client";

import { useQuery } from "@tanstack/react-query";
import { CACHE_TIMES } from "@/shared/lib/providers";
import {
  getCharacterById,
  getCharactersByWorld,
} from "@/features/characters/actions";
import type { CharacterWithRelations } from "@/features/characters";

/**
 * Query keys for character operations
 */
export const characterKeys = {
  all: ["characters"] as const,
  worlds: () => [...characterKeys.all, "worlds"] as const,
  world: (worldId: string) => [...characterKeys.worlds(), worldId] as const,
  detail: (id: string) => [...characterKeys.all, "detail", id] as const,
};

/**
 * Hook to fetch characters for a world
 */
export function useCharacters(worldId: string) {
  return useQuery<Character[]>({
    queryKey: characterKeys.world(worldId),
    queryFn: () => getCharactersByWorld(worldId),
    staleTime: CACHE_TIMES.WORLD,
    enabled: !!worldId,
  });
}

/**
 * Hook to fetch a single character by ID with full relations
 */
export function useCharacter(characterId: string) {
  return useQuery<CharacterWithRelations | null>({
    queryKey: characterKeys.detail(characterId),
    queryFn: () => getCharacterById(characterId),
    staleTime: CACHE_TIMES.WORLD,
    enabled: !!characterId,
  });
}
