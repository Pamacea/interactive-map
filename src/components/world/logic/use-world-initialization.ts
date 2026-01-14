import { useEffect, useMemo } from "react";
import { useMapStore } from "@/stores/map-store";
import { useQuery } from "@tanstack/react-query";
import { getWorldById, getWorldWithData } from "@/actions/worlds";
import { CACHE_TIMES } from "@/components/providers/query-provider";
import type { OptimizedWorldLayer } from "@/types/world.type";
import type { OptimizedWorld } from "@/types/world.type";

/**
 * Initializes map layers from world data into Zustand store
 * Transforms OptimizedWorldLayer (DB schema) to UILayer (store schema)
 * Memoized to prevent unnecessary recalculations
 */
export function useWorldInitialization(worldLayers: OptimizedWorldLayer[] | null) {
  const setLayers = useMapStore((state) => state.setLayers);

  // Memoize layer transformation to prevent recalculation on every render
  const uiLayers = useMemo(() => {
    if (!worldLayers || worldLayers.length === 0) {
      return [];
    }

    return worldLayers.map((layer) => ({
      id: layer.id,
      name: layer.name,
      visible: layer.isVisible,
      locked: false,
      opacity: layer.opacity,
      zIndex: layer.zIndex,
      scale: 1.0,
      offsetX: 0,
      offsetY: 0,
    }));
  }, [worldLayers]);

  useEffect(() => {
    if (uiLayers.length > 0) {
      setLayers(uiLayers);
    }
  }, [uiLayers, setLayers]);
}

/**
 * Fetches world data using TanStack Query for non-blocking Client Component rendering
 * Provides cached world data with configurable stale time
 */
export function useWorld(worldId: string) {
  return useQuery<OptimizedWorld | null>({
    queryKey: ["world", worldId],
    queryFn: () => getWorldById(worldId),
    // World metadata rarely changes - use longer cache time
    staleTime: CACHE_TIMES.WORLD, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}

/**
 * Fetches world with all related data (layers + pins) in a single query
 * Optimized to eliminate multiple fetch requests and reduce load time
 * Use this for initial world load to get all data in ONE request
 * @param worldId - World ID to fetch
 * @returns World with pins data
 */
export function useWorldWithData(worldId: string) {
  return useQuery({
    queryKey: ["world-complete", worldId],
    queryFn: () => getWorldWithData(worldId),
    // Complete world data - cache for 1 minute
    staleTime: CACHE_TIMES.WORLD, // 5 minutes
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    retry: 1,
  });
}
