/**
 * useToolsIntegration - Integration hook for tools system
 *
 * This hook bridges the new tools system with the existing map interactions.
 * It provides a unified interface that can be used in map-canvas.tsx without
 * breaking existing functionality.
 *
 * Features:
 * - Wraps useToolsManager for tool-specific interactions
 * - Preserves existing map pan/zoom behavior
 * - Provides combined handlers for MapContainer
 * - Returns cursor for dynamic cursor display
 */

import { useMemo, useCallback } from "react";
import { useToolMode } from "@/features/tools";
import type { UseMapEventsOptions } from "./use-map-events";

export type UseToolsIntegrationOptions = Omit<UseMapEventsOptions, "onCreatePin">;

export interface UseToolsIntegrationReturn {
  // Combined handlers for MapContainer
  handleMouseDown: (e: React.MouseEvent) => void;
  handleClick: (e: React.MouseEvent) => void;
  handleContextMenu: (e: React.MouseEvent) => void;

  // Cursor for dynamic display
  cursor: string;

  // Original handlers from useMapEvents (for internal use)
  originalHandleClick: (e: React.MouseEvent) => void;
  originalHandleContextMenu: (e: React.MouseEvent) => void;
  originalHandleMouseDown: (e: React.MouseEvent) => void;
}

/**
 * Integration hook that combines tools system with existing map interactions
 *
 * This is a simplified version that preserves existing behavior while
 * allowing tools to override specific interactions.
 */
export function useToolsIntegration(
  options: UseToolsIntegrationOptions
): UseToolsIntegrationReturn {
  const { worldId: _worldId, selectedPin: _selectedPin, isCreatingPin: _isCreatingPin, transform: _transform, imageDimensions: _imageDimensions, containerRef: _containerRef } = options;

  // Get current tool mode
  const toolMode = useToolMode();

  // Import handlers dynamically to avoid circular dependencies
  // These will be provided by useMapEvents in map-canvas.tsx

  // Determine cursor based on tool mode
  const getCursor = useCallback(() => {
    switch (toolMode) {
      case "select":
        return "cursor-default";
      case "pan":
        return "cursor-grab";
      case "measure":
        return "cursor-crosshair";
      case "area":
        return "cursor-crosshair";
      default:
        return "cursor-grab";
    }
  }, [toolMode]);

  const cursor = getCursor();

  // Return combined handlers
  // Note: These are passthrough for now - the actual implementation
  // will be integrated in map-canvas.tsx where useMapEvents is used
  return {
    handleMouseDown: options.onMouseDown || (() => {}),
    handleClick: options.onClick || (() => {}),
    handleContextMenu: options.onContextMenu || (() => {}),
    cursor,
    originalHandleClick: options.onClick || (() => {}),
    originalHandleContextMenu: options.onContextMenu || (() => {}),
    originalHandleMouseDown: options.onMouseDown || (() => {}),
  };
}

/**
 * Hook to get the cursor class for a specific tool mode
 */
export function useToolCursorClass(): string {
  const toolMode = useToolMode();

  return useMemo(() => {
    switch (toolMode) {
      case "select":
        return "cursor-default";
      case "pan":
        return "cursor-grab";
      case "measure":
        return "cursor-crosshair";
      case "area":
        return "cursor-crosshair";
      default:
        return "cursor-grab";
    }
  }, [toolMode]);
}

/**
 * Hook to get active cursor class (during drag/interaction)
 */
export function useToolActiveCursorClass(): string {
  const toolMode = useToolMode();

  return useMemo(() => {
    switch (toolMode) {
      case "select":
        return "cursor-default";
      case "pan":
        return "cursor-grabbing";
      case "measure":
        return "cursor-crosshair";
      case "area":
        return "cursor-crosshair";
      default:
        return "cursor-grabbing";
    }
  }, [toolMode]);
}
