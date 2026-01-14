import { useCallback, useEffect, useRef, useState } from "react";
import type { Pin } from "@prisma/client";
import { PinTypeEnum } from "@/types/pin.type";

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
    pinType: PinTypeEnum;
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
    // Close context menu on left click
    if (contextMenu) {
      setContextMenu(null);
      onCloseContextMenu?.();
      return;
    }

    // Deselect pin when clicking on empty space (left button only)
    if (e.button === 0 && selectedPin) {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Check if click is not on a pin marker
      // (Pin markers have their own click handlers)
      onClearSelection?.();
    }
  }, [contextMenu, selectedPin, containerRef, onCloseContextMenu, onClearSelection]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    // Get screen coordinates
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Guard against division by zero
    if (transform.scale <= 0) return;

    // Convert to map coordinates (0-1 range)
    const adjustedX = (x - transform.translateX) / transform.scale;
    const adjustedY = (y - transform.translateY) / transform.scale;

    const lng = adjustedX / imageDimensions.width;
    const lat = adjustedY / imageDimensions.height;

    if (!isMountedRef.current) return;

    setContextMenu({
      position: { x: e.clientX, y: e.clientY },
      coordinates: { lat, lng },
    });
  }, [containerRef, transform, imageDimensions]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(null);
  }, []);

  const handleSelectPinType = useCallback((pinType: string, lat: number, lng: number) => {
    if (!worldId) {
      console.error("[handleSelectPinType] No worldId provided");
      return;
    }

    // Close context menu
    closeContextMenu();

    // Create pin immediately with default values
    onCreatePin?.({
      gameWorldId: worldId,
      title: `New ${pinType}`,
      pinType: pinType as PinTypeEnum,
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
