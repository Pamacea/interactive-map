import { memo } from "react";

interface PinSelectionRingProps {
  size: number;
  isSelected: boolean;
}

/**
 * Animated selection ring for selected pins.
 * Renders a pulsing blue ring around the pin to indicate selection state.
 *
 * @param size - Base size of the pin (ring will be size + 8px)
 * @param isSelected - Whether the pin is currently selected
 * @returns null if not selected (early exit for performance)
 */
export function PinSelectionRing({ size, isSelected }: PinSelectionRingProps) {
  // Early return if not selected - avoids unnecessary DOM nodes
  if (!isSelected) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 rounded-sm animate-pulse"
      style={{
        width: `${size + 8}px`,
        height: `${size + 8}px`,
        border: "2px solid rgba(59, 130, 246, 0.8)",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%",
      }}
    />
  );
}

// Memoize to prevent unnecessary re-renders when props haven't changed
export const MemoizedPinSelectionRing = memo(PinSelectionRing, (prevProps, nextProps) => {
  return prevProps.size === nextProps.size && prevProps.isSelected === nextProps.isSelected;
});

MemoizedPinSelectionRing.displayName = "MemoizedPinSelectionRing";
