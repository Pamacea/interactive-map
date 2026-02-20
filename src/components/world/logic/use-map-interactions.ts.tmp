import { useCallback, useEffect, useState } from "react";
import type { Pin } from "@prisma/client";
import { PinType } from "@/types/pin.type";
import { inputManager, INPUT_PRIORITY, useKeyboard } from "@/lib/input-manager";
import { mouseToMapCoordinates } from "@/components/pins/logic/use-pin-screen-coordinates";

export interface ContextMenuState {
  position: { x: number; y: number };
  coordinates: { lat: number; lng: number };
}

export interface UseMapInteractionsOptions {
  worldId?: string;
  selectedPin?: Pin | null;
  isCreatingPin?: boolean;
  transform: { scale: number; translateX: number; translateY: number };
  imageDimensions: { width: number; height: number };
  containerRef: React.RefObject<HTMLDivElement | null>;
  onCreatePin?: (data: {
    gameWorldId: string;
    title: string;
    pinType: (typeof PinType)[keyof typeof PinType];
    latitude: number;
    longitude: number;
    layerId?: string;
    isVisible: boolean;
  }) => void;
  onCloseContextMenu?: () => void;
  onStopCreating?: () => void;
  onClearSelection?: () => void;
}

export function useMapInteractions(options: UseMapInteractionsOptions) {
  const {
    worldId,
    selectedPin,
    isCreatingPin,
    transform,
    imageDimensions,
    containerRef,
    onCreatePin,
    onCloseContextMenu,
    onStopCreating,
    onClearSelection,
  } = options;

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);

  // Register click handler with input manager
  useEffect(() => {
    const cleanup = inputManager.register({
      element: "map-canvas",
      priority: INPUT_PRIORITY.MAP_CANVAS,
      handlers: {
        mouse: {
          click: (e: MouseEvent) => {
            // Don't handle click if event was captured by another element
            if (inputManager.isCaptured()) return true;

            // Close context menu on left click
            if (contextMenu) {
              setContextMenu(null);
              onCloseContextMenu?.();
              return false;
            }

            // Deselect pin when clicking on empty space (left button only)
            if (e.button === 0 && selectedPin) {
              onClearSelection?.();
            }

            return false;
          },
          contextMenu: (e: MouseEvent) => {
            // Don't handle if captured by another element
            if (inputManager.isCaptured()) return true;

            e.preventDefault();
            e.stopPropagation();

            const rect = containerRef.current?.getBoundingClientRect();
            if (!rect) return true;

            // Check if we have valid image dimensions
            if (!imageDimensions || imageDimensions.width <= 0 || imageDimensions.height <= 0) {
              setContextMenu({
                position: { x: e.clientX, y: e.clientY },
                coordinates: { lat: 0.5, lng: 0.5 },
              });
              return false;
            }

            // Use shared coordinate calculation
            const coords = mouseToMapCoordinates(
              e.clientX,
              e.clientY,
              rect,
              transform,
              imageDimensions
            );

            setContextMenu({
              position: { x: e.clientX, y: e.clientY },
              coordinates: coords ? { lat: coords.lat, lng: coords.lng } : { lat: 0.5, lng: 0.5 },
            });

            return false;
          },
        },
        keyboard: {}, // Empty keyboard handlers - keyboard handled by useKeyboard hook
      },
      enabled: () => true,
    });

    return cleanup;
  }, [contextMenu, selectedPin, onClearSelection, onCloseContextMenu, containerRef, imageDimensions, transform]);

  // Legacy handlers for backward compatibility
  const handleClick = useCallback((e: React.MouseEvent) => {
    // Handled by input manager
    if (inputManager.isCaptured()) return;
    if (contextMenu) {
      setContextMenu(null);
      onCloseContextMenu?.();
      return;
    }
    if (e.button === 0 && selectedPin) {
      onClearSelection?.();
    }
  }, [contextMenu, selectedPin, onClearSelection, onCloseContextMenu]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    // Handled by input manager
    if (inputManager.isCaptured()) return;
    e.preventDefault();
    e.stopPropagation();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    if (!imageDimensions || imageDimensions.width <= 0 || imageDimensions.height <= 0) {
      setContextMenu({
        position: { x: e.clientX, y: e.clientY },
        coordinates: { lat: 0.5, lng: 0.5 },
      });
      return;
    }

    const coords = mouseToMapCoordinates(
      e.clientX,
      e.clientY,
      rect,
      transform,
      imageDimensions
    );

    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      coordinates: coords ? { lat: coords.lat, lng: coords.lng } : { lat: 0.5, lng: 0.5 },
    });
  }, [containerRef, imageDimensions, transform]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleSelectPinType = useCallback((pinType: string, lat: number, lng: number) => {
    if (!worldId) {
      return;
    }

    closeContextMenu();

    onCreatePin?.({
      gameWorldId: worldId,
      title: `New ${pinType}`,
      pinType: pinType as (typeof PinType)[keyof typeof PinType],
      latitude: lat,
      longitude: lng,
      layerId: undefined,
      isVisible: true,
    });
  }, [worldId, closeContextMenu, onCreatePin]);

  // Handle Escape key to cancel pin placement or close context menu
  useKeyboard({
    onEscape: (_e) => {
      if (contextMenu) {
        setContextMenu(null);
        return false;
      }
      if (isCreatingPin) {
        onStopCreating?.();
        return false;
      }
      return true;
    },
    scope: "map-canvas",
  });

  return {
    contextMenu,
    closeContextMenu,
    handleClick,
    handleContextMenu,
    handleSelectPinType,
  };
}
