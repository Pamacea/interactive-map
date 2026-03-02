/**
 * useRegionsInMap - Hook for managing regions in the map context
 *
 * Handles:
 * - Fetching regions for the current world
 * - Filtering regions by visible layers
 * - Handling region selection and drag
 * - Creating regions via Area tool
 *
 * Architecture follows ui/logic/methods pattern:
 * - ui/ stores: UI state only
 * - logic/ (this file): Hooks and business logic
 * - methods/: Server actions
 */

import { useEffect, useMemo, useCallback } from "react";
import {
  useRegions,
  useFetchRegionsByWorld,
  useCreateRegion,
  useSelectRegion,
  useClearRegionSelection,
  useSelectedRegionId,
  useStartRegionDrag,
  useEndRegionDrag,
  useSetHoverRegion,
  type Region,
  type RegionWithLayer,
  type RegionCoordinates,
} from "@/features/world-editor/store/regions";
import type { Layer } from "@/stores/map-store";

interface UseRegionsInMapOptions {
  worldId?: string;
  layers: Layer[];
  transform?: { scale: number; translateX: number; translateY: number };
}

interface _UseRegionsInMapReturn {
  regions: RegionWithLayer[];
  selectedRegionId: string | null;
  isDragging: boolean;
  selectRegion: (regionId: string | null) => void;
  clearSelection: () => void;
  handleRegionClick: (region: Region) => void;
  handleRegionMouseDown: (region: Region, e: React.MouseEvent) => void;
  handleRegionHover: (region: Region | null) => void;
  createRegionFromArea: (layerId: string, coords: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => Promise<void>;
}

export function useRegionsInMap({
  worldId,
  layers,
  transform,
}: UseRegionsInMapOptions) {
  // Get regions data
  const regions = useRegions();
  const fetchRegions = useFetchRegionsByWorld();
  const createRegion = useCreateRegion();

  // UI state
  const selectRegion = useSelectRegion();
  const clearSelection = useClearRegionSelection();
  const selectedRegionId = useSelectedRegionId();
  const startDrag = useStartRegionDrag();
  const endDrag = useEndRegionDrag();
  const setHoverRegion = useSetHoverRegion();

  // Drag state (simplified - in production would track drag position)
  const isDragging = false;

  // Fetch regions when world changes
  useEffect(() => {
    if (worldId) {
      fetchRegions(worldId);
    }
  }, [worldId, fetchRegions]);

  // Get current zoom percentage for filtering
  const zoomPercentage = (transform?.scale ?? 1) * 100;

  // Create a map of layer properties for quick lookup
  const layerMap = useMemo(() => {
    const map = new Map<
      string,
      { visible: boolean; opacity: number; scale: number; offsetX: number; offsetY: number; minZoom: number; maxZoom: number }
    >();
    for (const layer of layers) {
      map.set(layer.id, {
        visible: layer.visible,
        opacity: layer.opacity,
        scale: layer.scale,
        offsetX: layer.offsetX,
        offsetY: layer.offsetY,
        minZoom: layer.minZoom ?? 0,
        maxZoom: layer.maxZoom ?? 200,
      });
    }
    return map;
  }, [layers]);

  // Filter and augment regions with layer properties
  const augmentedRegions = useMemo((): RegionWithLayer[] => {
    return regions
      .filter((region) => {
        const layer = layerMap.get(region.layerId);
        if (!layer) return false;

        // Check layer visibility
        if (!layer.visible) return false;

        // Check zoom range
        if (zoomPercentage < layer.minZoom || zoomPercentage > layer.maxZoom) {
          return false;
        }

        return true;
      })
      .map((region) => {
        const layer = layerMap.get(region.layerId)!;
        return {
          ...region,
          layerVisible: layer.visible,
          layerOpacity: layer.opacity,
          layerScale: layer.scale,
          layerOffsetX: layer.offsetX,
          layerOffsetY: layer.offsetY,
        };
      });
  }, [regions, layerMap, zoomPercentage]);

  // Handle region click
  const handleRegionClick = useCallback(
    (region: Region) => {
      selectRegion(region.id);
    },
    [selectRegion]
  );

  // Handle region mouse down (start drag)
  const handleRegionMouseDown = useCallback(
    (region: Region, e: React.MouseEvent) => {
      startDrag(e.clientX, e.clientY);
      selectRegion(region.id);

      // Add document-level mouse up listener to end drag
      const handleMouseUp = () => {
        endDrag();
        document.removeEventListener("mouseup", handleMouseUp);
      };
      document.addEventListener("mouseup", handleMouseUp);
    },
    [startDrag, endDrag, selectRegion]
  );

  // Handle region hover
  const handleRegionHover = useCallback(
    (region: Region | null) => {
      setHoverRegion(region?.id ?? null);
    },
    [setHoverRegion]
  );

  // Create region from area tool selection
  const createRegionFromArea = useCallback(
    async (
      layerId: string,
      coords: { x: number; y: number; width: number; height: number }
    ) => {
      // If no layerId provided, use the first visible non-base layer
      const targetLayerId = layerId || (() => {
        const regionLayer = layers.find(l => l.visible && !l.isBaseMap);
        return regionLayer?.id;
      })();

      if (!targetLayerId) {
        console.warn("[useRegionsInMap] No valid layer for region creation");
        return;
      }

      const coordinates: RegionCoordinates = {
        x: coords.x,
        y: coords.y,
        width: coords.width,
        height: coords.height,
      };

      await createRegion(targetLayerId, {
        name: "New Region",
        type: "RECTANGLE",
        coordinates,
        color: "#3b82f6",
        opacity: 0.3,
        borderWidth: 2,
      });
    },
    [createRegion, layers]
  );

  return {
    regions: augmentedRegions,
    selectedRegionId,
    isDragging,
    selectRegion,
    clearSelection,
    handleRegionClick,
    handleRegionMouseDown,
    handleRegionHover,
    createRegionFromArea,
  };
}
