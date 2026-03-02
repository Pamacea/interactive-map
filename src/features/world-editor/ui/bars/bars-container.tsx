/**
 * Bars Container - Integrates Bottom Bar and Mini-map with viewport state
 *
 * This component connects the bottom bar and mini-map to the map's viewport state.
 * It should be rendered in the WorldClient component.
 */

import { useCallback, useState, useEffect } from "react";
import { BottomBar } from "./bottom-bar";
import { MiniMap } from "./mini-map";
import { useHistoryStore } from "@/features/world-editor/store/history-store";
import { useMapStore } from "@/features/world-editor/store/map-store";
import { useToast } from "@/shared/hooks/use-toast";
import type { ScaleOption } from "./scale-selector";

export interface BarsContainerProps {
  mapImage?: string | null;
  worldId?: string;
  onHelpToggle?: () => void;
}

export function BarsContainer({ mapImage, _worldId, onHelpToggle }: BarsContainerProps) {
  // Map store for zoom
  const mapZoom = useMapStore((state) => state.zoom);
  const setMapZoom = useMapStore((state) => state.setZoom);

  // History store for undo/redo
  const canUndo = useHistoryStore((state) => state.past.length > 0);
  const canRedo = useHistoryStore((state) => state.future.length > 0);
  const undo = useHistoryStore((state) => state.undo);
  const redo = useHistoryStore((state) => state.redo);
  const { showToast } = useToast();

  // Local state for scale option
  const [scaleOption, setScaleOption] = useState<ScaleOption>("1:100");

  // Sync scale option with zoom level
  useEffect(() => {
    if (mapZoom >= 3.0) setScaleOption("1:1");
    else if (mapZoom >= 1.5) setScaleOption("1:10");
    else if (mapZoom >= 0.75) setScaleOption("1:100");
    else if (mapZoom >= 0.35) setScaleOption("1:1000");
    else setScaleOption("1:10000");
  }, [mapZoom]);

  // Handle zoom change from bottom bar
  const handleZoomChange = useCallback(
    (zoom: number) => {
      setMapZoom(zoom);
    },
    [setMapZoom]
  );

  // Handle scale change from selector
  const handleScaleChange = useCallback(
    (scale: ScaleOption) => {
      setScaleOption(scale);
      const scaleToZoom: Record<ScaleOption, number> = {
        "1:1": 4.0,
        "1:10": 2.0,
        "1:100": 1.0,
        "1:1000": 0.5,
        "1:10000": 0.25,
      };
      setMapZoom(scaleToZoom[scale]);
    },
    [setMapZoom]
  );

  // Handle undo
  const handleUndo = useCallback(async () => {
    const entry = undo();
    if (entry) {
      // The actual undo logic is executed by the entry.undo() function
      // Just show feedback to the user
      showToast("Action undone", "success");
    }
  }, [undo, showToast]);

  // Handle redo
  const handleRedo = useCallback(async () => {
    const entry = redo();
    if (entry) {
      // The actual redo logic is executed by the entry.redo() function
      // Just show feedback to the user
      showToast("Action redone", "success");
    }
  }, [redo, showToast]);

  // Transform state for mini-map (sync with map pan)
  const [transform, setTransform] = useState({
    scale: mapZoom,
    translateX: 0,
    translateY: 0,
  });

  // Update transform scale when zoom changes
  useEffect(() => {
    setTransform((prev) => ({ ...prev, scale: mapZoom }));
  }, [mapZoom]);

  // Listen to map pan events from window (custom event)
  useEffect(() => {
    const handleMapPan = (e: Event) => {
      const customEvent = e as CustomEvent<{ translateX: number; translateY: number }>;
      setTransform((prev) => ({
        ...prev,
        translateX: customEvent.detail.translateX,
        translateY: customEvent.detail.translateY,
      }));
    };

    window.addEventListener("map-pan", handleMapPan);
    return () => {
      window.removeEventListener("map-pan", handleMapPan);
    };
  }, []);

  const handleTransformChange = useCallback((newTransform: typeof transform) => {
    setTransform(newTransform);
    // Dispatch event for map canvas to handle
    window.dispatchEvent(
      new CustomEvent("minimap-pan", {
        detail: {
          translateX: newTransform.translateX,
          translateY: newTransform.translateY,
        },
      })
    );
  }, []);

  return (
    <>
      {/* Mini-map - positioned bottom-left above bottom bar */}
      <MiniMap
        mapImage={mapImage}
        transform={transform}
        onTransformChange={handleTransformChange}
      />

      {/* Bottom bar - fixed at bottom */}
      <BottomBar
        zoom={mapZoom}
        onZoomChange={handleZoomChange}
        scaleOption={scaleOption}
        onScaleChange={handleScaleChange}
        onHelpToggle={onHelpToggle}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />
    </>
  );
}
