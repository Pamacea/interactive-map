/**
 * useToolsManager - Unified tool event router
 *
 * This hook manages all tool interactions and routes events to the appropriate
 * tool handler based on the active tool mode.
 *
 * It integrates with:
 * - use-tool-mode for the legacy tool mode store
 * - use-tools-store for the new tools state
 * - Existing map interactions (useMapInteractions, useMapPan)
 *
 * Features:
 * - Routes mouse events to active tool
 * - Manages tool transitions
 * - Applies appropriate cursors
 * - Cleans up tool state on mode change
 * - Space+drag for temporary pan mode
 */

import { useEffect, useCallback, useRef, useState } from "react";
import {
  useToolMode,
  useIsMeasuring,
  useMeasurePoints,
  useAddMeasurePoint,
  useRemoveLastMeasurePoint,
  useClearMeasure,
  useFinishMeasure,
  useIsSelecting,
  useStartSelection,
  useUpdateSelection,
  useEndSelection,
  useClearToolSelection,
  useSetTemporaryMode,
  useRestorePreviousMode,
  useToolCursor,
  TOOL_CURSORS,
  useToolsStore,
} from "@/features/world-editor/store/tools";
import {
  useTogglePinSelection,
  useSetMultiplePinSelection,
} from "@/features/pins/store";
import type { PinWithLayer } from "../use-pins-filtering";
import type { RegionCoordinates } from "@/types/region.type";
import { inputManager, INPUT_PRIORITY } from "@/shared/lib/input-manager";

// ============== Options ==============

export interface UseToolsManagerOptions {
  containerRef: React.RefObject<HTMLDivElement | null>;
  imageDimensions: { width: number; height: number } | null;
  transform: { scale: number; translateX: number; translateY: number };
  visiblePins: PinWithLayer[];
  visibleRegions?: Array<{
    id: string;
    type: string;
    coordinates: RegionCoordinates;
    locked: boolean;
  }>;
  onCreateRegion?: (coords: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => void;
  onPinClick?: (pin: PinWithLayer) => void;
  onRegionClick?: (regionId: string) => void;
  onClearSelection?: () => void;
}

// ============== Event Handlers ==============

export interface ToolsManagerHandlers {
  // Mouse events
  handleMapClick: (e: React.MouseEvent) => void;
  handleMapMouseDown: (e: React.MouseEvent) => void;
  handleMapMouseMove: (e: React.MouseEvent) => void;
  handleMapMouseUp: (e: React.MouseEvent) => void;
  handleMapContextMenu: (e: React.MouseEvent) => void;

  // Keyboard events
  handleKeyDown: (e: KeyboardEvent) => void;
  handleKeyUp: (e: KeyboardEvent) => void;

  // Computed values
  cursor: string;
  isDragging: boolean;
}

// ============== Helper Functions ==============

function screenToMapCoordinates(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
  transform: { scale: number; translateX: number; translateY: number },
  imageDimensions: { width: number; height: number }
) {
  // Apply inverse transform
  const x = (clientX - containerRect.left - transform.translateX) / transform.scale;
  const y = (clientY - containerRect.top - transform.translateY) / transform.scale;

  // Convert to normalized coordinates (0-1)
  const lat = Math.max(0, Math.min(1, y / imageDimensions.height));
  const lng = Math.max(0, Math.min(1, x / imageDimensions.width));

  return { x, y, lat, lng };
}

function isPointInRegion(
  point: { x: number; y: number },
  region: { type: string; coordinates: RegionCoordinates }
): boolean {
  const coords = region.coordinates;

  switch (region.type) {
    case "RECTANGLE": {
      const x = coords.x ?? 0;
      const y = coords.y ?? 0;
      const width = coords.width ?? 0;
      const height = coords.height ?? 0;

      return (
        point.x >= x &&
        point.x <= x + width &&
        point.y >= y &&
        point.y <= y + height
      );
    }

    case "CIRCLE": {
      const centerX = coords.centerX ?? 0;
      const centerY = coords.centerY ?? 0;
      const radius = coords.radius ?? 0;

      const dx = point.x - centerX;
      const dy = point.y - centerY;
      return Math.sqrt(dx * dx + dy * dy) <= radius;
    }

    case "POLYGON": {
      const points = coords.points ?? [];
      if (points.length < 3) return false;

      // Ray casting algorithm for point in polygon
      let inside = false;
      for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        const xi = points[i].x;
        const yi = points[i].y;
        const xj = points[j].x;
        const yj = points[j].y;

        const intersect =
          yi > point.y !== yj > point.y &&
          point.x < ((xj - xi) * (point.y - yi)) / (yj - yi) + xi;

        if (intersect) inside = !inside;
      }

      return inside;
    }

    default:
      return false;
  }
}

// ============== Hook ==============

export function useToolsManager(options: UseToolsManagerOptions): ToolsManagerHandlers {
  const {
    containerRef,
    imageDimensions,
    transform,
    visiblePins,
    visibleRegions,
    onCreateRegion,
    onPinClick,
    onRegionClick,
    onClearSelection,
  } = options;

  // Tool state from store
  const toolMode = useToolMode();

  // Tool-specific state
  const isMeasuring = useIsMeasuring();
  const measurePoints = useMeasurePoints();
  const addMeasurePoint = useAddMeasurePoint();
  const removeLastMeasurePoint = useRemoveLastMeasurePoint();
  const clearMeasure = useClearMeasure();
  const finishMeasure = useFinishMeasure();

  const isSelecting = useIsSelecting();
  const startSelection = useStartSelection();
  const updateSelection = useUpdateSelection();
  const endSelection = useEndSelection();
  const clearToolSelection = useClearToolSelection();

  // Temporary mode (for space+drag)
  const setTemporaryMode = useSetTemporaryMode();
  const restorePreviousMode = useRestorePreviousMode();

  // Cursor management
  const baseCursor = useToolCursor();

  // Drag state - use state for values needed during render
  const [isDragging, setIsDragging] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);

  // Refs for values only needed in event handlers
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const justFinishedDragRef = useRef(false);

  // Register area tool with input manager to prevent map panning during selection
  useEffect(() => {
    // Only register when tool mode is "area"
    if (toolMode !== "area") return;

    const cleanup = inputManager.register({
      element: "map-canvas",
      priority: INPUT_PRIORITY.PIN_MARKER, // Higher priority than map-canvas pan
      handlers: {
        mouse: {
          down: (e: MouseEvent) => {
            // Only left click
            if (e.button !== 0) return false;

            // Check if we're clicking on interactive elements
            const target = e.target;
            if (
              target instanceof HTMLElement &&
              (target.closest("button") ||
                target.closest("a") ||
                target.closest('[role="button"]') ||
                target.closest("input") ||
                target.closest("textarea"))
            ) {
              return false;
            }

            // Start selection - capture the event to prevent map panning
            if (containerRef.current && imageDimensions) {
              const rect = containerRef.current.getBoundingClientRect();
              const coords = screenToMapCoordinates(
                e.clientX,
                e.clientY,
                rect,
                transform,
                imageDimensions
              );
              startSelection(coords.x, coords.y);
              return true; // Capture event to prevent map pan
            }

            return false;
          },
          move: (e: MouseEvent) => {
            // Update selection if we're selecting
            if (isSelecting && containerRef.current && imageDimensions) {
              const rect = containerRef.current.getBoundingClientRect();
              const coords = screenToMapCoordinates(
                e.clientX,
                e.clientY,
                rect,
                transform,
                imageDimensions
              );
              updateSelection(coords.x, coords.y);
              return true; // Capture event to prevent map pan
            }

            return false;
          },
          up: (_e: MouseEvent) => {
            // End selection if we were selecting
            if (isSelecting) {
              const selectionRect = useToolsStore.getState().selectionRect;
              endSelection();

              if (selectionRect && imageDimensions) {
                const startX = Math.min(selectionRect.startX, selectionRect.endX);
                const startY = Math.min(selectionRect.startY, selectionRect.endY);
                const width = Math.abs(selectionRect.endX - selectionRect.startX);
                const height = Math.abs(selectionRect.endY - selectionRect.startY);

                // Only create region if it has meaningful size (> 10px)
                if (width > 10 && height > 10) {
                  onCreateRegion?.({ x: startX, y: startY, width, height });
                }
              }

              clearToolSelection();
              return true; // Capture event
            }

            return false;
          },
        },
      },
      enabled: () => toolMode === "area",
    });

    return cleanup;
  }, [
    toolMode,
    containerRef,
    imageDimensions,
    transform,
    isSelecting,
    startSelection,
    updateSelection,
    endSelection,
    onCreateRegion,
    clearToolSelection,
  ]);

  // ==================== SELECT TOOL ====================

  // Multi-selection hooks
  const togglePinSelection = useTogglePinSelection();
  const setMultiplePinSelection = useSetMultiplePinSelection();

  const handleSelectClick = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !imageDimensions) return;

      const rect = containerRef.current.getBoundingClientRect();
      const coords = screenToMapCoordinates(e.clientX, e.clientY, rect, transform, imageDimensions);

      // Check if clicking on a pin (prioritize pins over regions)
      const clickedPin = visiblePins.find((pin) => {
        const pinX = pin.longitude * imageDimensions.width;
        const pinY = pin.latitude * imageDimensions.height;
        const dx = coords.x - pinX;
        const dy = coords.y - pinY;
        return Math.sqrt(dx * dx + dy * dy) < 15; // 15px hit radius
      });

      if (clickedPin) {
        if (e.shiftKey) {
          // Toggle selection - add to or remove from selectedPinIds
          togglePinSelection(clickedPin.id);
        } else {
          // Single selection - replace selection
          onPinClick?.(clickedPin);
          setMultiplePinSelection([clickedPin.id]);
        }
        return;
      }

      // Check if clicking on a region
      if (visibleRegions && visibleRegions.length > 0) {
        // Check regions in reverse order (topmost first)
        const clickedRegion = [...visibleRegions].reverse().find((region) => {
          if (region.locked) return false;
          return isPointInRegion(coords, region);
        });

        if (clickedRegion) {
          onRegionClick?.(clickedRegion.id);
          return;
        }
      }

      // Clicking on empty space clears selection (only when not holding shift)
      if (!e.shiftKey) {
        onClearSelection?.();
        clearToolSelection();
        setMultiplePinSelection([]);
      }
    },
    [containerRef, imageDimensions, transform, visiblePins, visibleRegions, onPinClick, onRegionClick, onClearSelection, clearToolSelection, togglePinSelection, setMultiplePinSelection]
  );

  // ==================== MEASURE TOOL ====================

  const handleMeasureClick = useCallback(
    (e: React.MouseEvent) => {
      if (!containerRef.current || !imageDimensions) return;

      const rect = containerRef.current.getBoundingClientRect();
      const coords = screenToMapCoordinates(e.clientX, e.clientY, rect, transform, imageDimensions);

      addMeasurePoint(coords);
    },
    [containerRef, imageDimensions, transform, addMeasurePoint]
  );

  // ==================== UNIFIED HANDLERS ====================
  // Note: Area tool is now handled by input manager registration above
  // to properly capture events and prevent map panning during selection

  const handleMapClick = useCallback(
    (e: React.MouseEvent) => {
      // Ignore if we just finished dragging
      if (justFinishedDragRef.current) {
        justFinishedDragRef.current = false;
        return;
      }

      switch (toolMode) {
        case "select":
          handleSelectClick(e);
          break;
        case "measure":
          handleMeasureClick(e);
          break;
        case "area":
          // Area tool uses drag, not click
          break;
        case "pan":
          // Pan is handled by mouse down/move
          break;
      }
    },
    [
      toolMode,
      handleSelectClick,
      handleMeasureClick,
    ]
  );

  const handleMapMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only left click
      if (e.button !== 0) return;

      dragStartRef.current = { x: e.clientX, y: e.clientY };
      setIsDragging(false);

      // Area tool is now handled by input manager registration above
      // No need to handle it here
    },
    []
  );

  const handleMapMouseMove = useCallback(
    (e: React.MouseEvent) => {
      // Track if we're dragging
      if (dragStartRef.current) {
        const dx = e.clientX - dragStartRef.current.x;
        const dy = e.clientY - dragStartRef.current.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > 5) {
          setIsDragging(true);
        }
      }

      // Area tool is now handled by input manager registration above
      // No need to handle it here
    },
    []
  );

  const handleMapMouseUp = useCallback(
    (_e: React.MouseEvent) => {
      dragStartRef.current = null;

      // Mark that we just finished dragging (for click handler)
      if (isDragging) {
        justFinishedDragRef.current = true;
      }
      setIsDragging(false);

      // Area tool is now handled by input manager registration above
      // No need to handle it here
    },
    [isDragging]
  );

  const handleMapContextMenu = useCallback((e: React.MouseEvent) => {
    // Right-click cancels current measurement
    if (toolMode === "measure" && isMeasuring) {
      e.preventDefault();
      clearMeasure();
    }
  }, [toolMode, isMeasuring, clearMeasure]);

  // ==================== KEYBOARD HANDLERS ====================

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore if typing
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return;
    }

    // Space key for temporary pan mode
    if (e.code === "Space" && !isSpacePressed) {
      e.preventDefault();
      setIsSpacePressed(true);
      if (toolMode !== "pan") {
        setTemporaryMode("pan");
      }
    }

    // Escape to cancel
    if (e.key === "Escape") {
      if (isMeasuring) {
        clearMeasure();
      }
      if (isSelecting) {
        clearToolSelection();
      }
    }

    // Backspace to remove last measure point
    if ((e.key === "Backspace" || e.key === "Delete") && isMeasuring && measurePoints.length > 0) {
      e.preventDefault();
      removeLastMeasurePoint();
    }

    // Enter to finish measurement
    if (e.key === "Enter" && isMeasuring && measurePoints.length >= 2) {
      e.preventDefault();
      finishMeasure();
    }
  }, [toolMode, isMeasuring, isSelecting, isSpacePressed, measurePoints.length, setTemporaryMode, clearMeasure, clearToolSelection, removeLastMeasurePoint, finishMeasure]);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    if (e.code === "Space") {
      setIsSpacePressed(false);
      restorePreviousMode();
    }
  }, [restorePreviousMode]);

  // ==================== CURSOR ====================

  const cursor = isSpacePressed ? TOOL_CURSORS.pan : baseCursor;

  // ==================== CLEANUP ====================

  // Clean up tool state when mode changes
  useEffect(() => {
    // When leaving measure tool, clear measurements
    if (toolMode !== "measure" && isMeasuring) {
      clearMeasure();
    }

    // When leaving area tool, clear selection rectangle
    if (toolMode !== "area" && isSelecting) {
      clearToolSelection();
    }
  }, [toolMode, isMeasuring, isSelecting, clearMeasure, clearToolSelection]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Clean up any pending state
      if (isMeasuring) {
        clearMeasure();
      }
      if (isSelecting) {
        clearToolSelection();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on unmount

  return {
    handleMapClick,
    handleMapMouseDown,
    handleMapMouseMove,
    handleMapMouseUp,
    handleMapContextMenu,
    handleKeyDown,
    handleKeyUp,
    cursor,
    isDragging,
  };
}
