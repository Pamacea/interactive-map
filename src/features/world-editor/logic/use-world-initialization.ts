import { useEffect, useMemo, useRef } from "react";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useFloatingPanelsStore } from "@/features/world-editor/store/use-floating-panels-store";
import { useLeftDock } from "../logic/use-left-dock";
import { useQuery } from "@tanstack/react-query";
import { getWorldById, getWorldWithData } from "@/features/worlds";
import { CACHE_TIMES } from "@/shared/lib/providers";
import type { OptimizedWorldLayer } from "@/types/world.type";
import type { OptimizedWorld } from "@/types/world.type";
import type { Layer } from "@/features/world-editor/store/map-store";

/**
 * Initializes map layers from world data into Zustand store
 * Transforms OptimizedWorldLayer (DB schema) to UILayer (store schema)
 * Memoized to prevent unnecessary recalculations
 */
export function useWorldInitialization(worldLayers: OptimizedWorldLayer[] | null) {
  const initializeLayers = useMapStore((state) => state.initializeLayers);

  // Track previous world ID to detect world changes
  const prevWorldIdRef = useRef<string | null>(null);
  const currentWorldId = useMapStore((state) => state.worldId);

  // Reset panel positions when world changes
  const resetFloatingPanels = useFloatingPanelsStore((state) => state.resetAll);
  const resetLeftDock = useLeftDock((state) => state.reset);

  useEffect(() => {
    // When world ID changes, reset panels and docks
    if (currentWorldId && currentWorldId !== prevWorldIdRef.current) {
      resetFloatingPanels();
      resetLeftDock();
      prevWorldIdRef.current = currentWorldId;
    }
  }, [currentWorldId, resetFloatingPanels, resetLeftDock]);

  // Memoize layer transformation to prevent recalculation on every render
  const uiLayers = useMemo(() => {
    if (!worldLayers || worldLayers.length === 0) {
      return [];
    }

    return worldLayers.map((layer): Layer => ({
      id: layer.id,
      name: layer.name,
      type: layer.type as Layer['type'],
      visible: layer.isVisible,
      locked: layer.locked,
      opacity: layer.opacity,
      zIndex: layer.zIndex,
      scale: layer.scale ?? 1.0,
      offsetX: layer.offsetX ?? 0,
      offsetY: layer.offsetY ?? 0,
      minZoom: layer.minZoom,
      maxZoom: layer.maxZoom,
      isBaseMap: layer.type === "BASE_MAP",
      contentCounts: { pins: 0, images: 0, regions: 0, total: 0 }, // Will be fetched separately
    }));
  }, [worldLayers]);

  useEffect(() => {
    // Initialize layers from server data
    initializeLayers(uiLayers);
  }, [uiLayers, initializeLayers]);
}

/**
 * Extended initialization that also sets worldId
 */
export function useWorldInitializationWithWorldId(worldId: string, worldLayers: OptimizedWorldLayer[] | null) {
  const _initializeLayers = useMapStore((state) => state.initializeLayers);
  const _setWorldId = useMapStore((state) => state.setWorldId);

  // Set world ID first
  useEffect(() => {
    _setWorldId(worldId);
  }, [worldId, _setWorldId]);

  // Then initialize layers
  useWorldInitialization(worldLayers);
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
