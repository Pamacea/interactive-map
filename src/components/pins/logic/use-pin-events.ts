import { useState, useEffect, useCallback } from "react";
import { useSetHoverPin } from "@/stores/use-pins-store";
import { eventManager } from "@/lib/event-manager";

interface UsePinEventsParams {
  pinId: string;
  isDragging: boolean;
  isPinSelected: boolean;
}

interface UsePinEventsReturn {
  isHovered: boolean;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

/**
 * Custom hook to manage pin event interactions.
 * Handles hover state, event capture, and integration with the pins store.
 *
 * This hook encapsulates all event-related logic for a pin marker:
 * - Hover state management
 * - Event capture via eventManager (prevents deselection bugs)
 * - Integration with usePinsStore for hover/selection state
 *
 * @param params - Hook parameters
 * @param params.pinId - The ID of the pin
 * @param params.isDragging - Whether the pin is currently being dragged
 * @param params.isPinSelected - Whether the pin is currently selected
 *
 * @returns Event state and handlers
 */
export function usePinEvents({
  pinId,
  isDragging,
  isPinSelected,
}: UsePinEventsParams): UsePinEventsReturn {
  // Hover state for this specific pin
  const [isHovered, setIsHovered] = useState(false);

  // Store methods for hover and selection
  const setHoverPin = useSetHoverPin();

  /**
   * Capture events when pin is hovered or selected.
   * This prevents the deselection bug that occurs when clicking outside pins.
   * The eventManager ensures that map clicks don't interfere with pin interactions.
   */
  useEffect(() => {
    // Only capture events if not dragging (dragging has its own event handling)
    if (!isDragging && (isHovered || isPinSelected)) {
      const release = eventManager.capture("pin-marker");
      return () => release();
    }
  }, [isHovered, isPinSelected, isDragging]);

  /**
   * Handle mouse enter event.
   * Sets local hover state and updates the global hover pin in the store.
   */
  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
    setHoverPin(pinId);
  }, [pinId, setHoverPin]);

  /**
   * Handle mouse leave event.
   * Clears local hover state and removes the global hover pin from the store.
   */
  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setHoverPin(null);
  }, [setHoverPin]);

  return {
    isHovered,
    handleMouseEnter,
    handleMouseLeave,
  };
}
