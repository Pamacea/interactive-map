import { useCallback, useEffect, useRef, useState } from "react";
import type { Pin } from "@prisma/client";
import { PinType } from "@/types/pin.type";
import { eventManager } from "@/lib/event-manager";
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
  onSelectPin?: (pinId: string | null) => void;
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
    onSelectPin,
    onClearSelection,
  } = options;

  const [contextMenu, setContextMenu] = useState<ContextMenuState | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Don't handle click if event was captured by another element
    if (eventManager.isCaptured()) {
      return;
    }

    // Close context menu on left click
    if (contextMenu) {
      setContextMenu(null);
      onCloseContextMenu?.();
      return;
    }

    // Deselect pin when clicking on empty space (left button only)
    if (e.button === 0 && selectedPin) {
      // Check if click is not on a pin marker
      // (Pin markers have their own click handlers)
      onClearSelection?.();
    }
  }, [contextMenu, selectedPin, onClearSelection, onCloseContextMenu]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }

    // Use shared coordinate calculation
    const coords = mouseToMapCoordinates(
      e.clientX,
      e.clientY,
      rect,
      transform,
      imageDimensions
    );

    if (!coords || !isMountedRef.current) {
      return;
    }

    // Only prevent default if we can show the context menu
    e.preventDefault();

    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      coordinates: { lat: coords.lat, lng: coords.lng },
    });
  }, [containerRef, transform, imageDimensions]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleSelectPinType = useCallback((pinType: string, lat: number, lng: number) => {
    if (!worldId) {
      return;
    }

    // Close context menu
    closeContextMenu();

    // Create pin immediately with default values
    onCreatePin?.({
      gameWorldId: worldId,
      title: `New ${pinType}`,
      pinType: pinType as (typeof PinType)[keyof typeof PinType],
      latitude: lat,
      longitude: lng,
      layerId: undefined, // Will be set by the selected layer from store
      isVisible: true,
    });
  }, [worldId, closeContextMenu, onCreatePin]);

  // Handle Escape key to cancel pin placement or close context menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isMountedRef.current) return;

      if (e.key === "Escape") {
        if (contextMenu) {
          setContextMenu(null);
        } else if (isCreatingPin) {
          onStopCreating?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isCreatingPin, onStopCreating, contextMenu]);

  return {
    contextMenu,
    closeContextMenu,
    handleClick,
    handleContextMenu,
    handleSelectPinType,
  };
}
