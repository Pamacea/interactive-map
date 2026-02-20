import { memo } from "react";

interface MarkerSelectionRingProps {
  /** Whether this pin is currently selected */
  isSelected: boolean;
  /** Size of the pin marker (used to calculate ring size) */
  pinSize: number;
}

/**
 * MarkerSelectionRing - Animated selection indicator
 *
 * Displays a pulsing ring around selected pins to provide visual feedback.
 * Only rendered when the pin is selected.
 *
 * Memoized to prevent unnecessary re-renders when parent props change.
 *
 * @example
 * ```tsx
 * <MarkerSelectionRing
 *   isSelected={isPinSelected}
 *   pinSize={finalSize}
 * />
 * ```
 */
export const MarkerSelectionRing = memo(function MarkerSelectionRing({ isSelected, pinSize }: MarkerSelectionRingProps) {
  if (!isSelected) {
    return null;
  }

  return (
    <div
      className="absolute inset-0 rounded-sm animate-pulse"
      style={{
        width: `${pinSize + 8}px`,
        height: `${pinSize + 8}px`,
        border: "2px solid rgba(59, 130, 246, 0.8)",
        transform: "translate(-50%, -50%)",
        left: "50%",
        top: "50%",
      }}
    />
  );
});
