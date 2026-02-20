"use client";

import { useEffect } from "react";
import { useLoreStore } from "@/features/lore/store/use-lore-store";
import { getLoreEntriesByWorld } from "@/features/lore/actions/lore";
import type { LoreEntry } from "@/types/lore.type";

interface UseLoreListOptions {
  worldId: string;
  initialData?: LoreEntry[];
  enabled?: boolean;
}

/**
 * Hook to fetch and manage lore entries for a world
 * Follows the pattern used for pins with server state management
 */
export function useLoreList({
  worldId,
  initialData = [],
  enabled = true,
}: UseLoreListOptions) {
  const setLoreEntries = useLoreStore((state) => state.setLoreEntries);
  const setLoading = useLoreStore((state) => state.setLoading);
  const setError = useLoreStore((state) => state.setError);
  const isLoading = useLoreStore((state) => state.isLoading);
  const error = useLoreStore((state) => state.error);
  const loreEntries = useLoreStore((state) => state.loreEntries);

  // Fetch lore entries from server
  const fetchLoreEntries = async () => {
    if (!enabled || !worldId) return;

    setLoading(true);
    setError(null);

    try {
      const _data = await getLoreEntriesByWorld(worldId);
      setLoreEntries(data);
    } catch (err) {
      console.error("Failed to fetch lore entries:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch lore entries");
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (initialData.length > 0) {
      // Use initial data if provided (server-side rendering)
      setLoreEntries(initialData);
    } else if (enabled && worldId) {
      fetchLoreEntries();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [worldId, enabled]);

  return {
    loreEntries,
    isLoading,
    error,
    refetch: fetchLoreEntries,
  };
}
