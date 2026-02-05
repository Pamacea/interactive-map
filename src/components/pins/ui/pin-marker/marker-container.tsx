import { memo } from "react";
import { MarkerIcon } from "./marker-icon";
import { MarkerSelectionRing } from "./marker-selection-ring";

interface MarkerContainerProps {
  /** Position X in pixels */
  x: number;
  /** Position Y in pixels */
  y: number;
  /** Z-index for rendering order */
  zIndex: number;
  /** Final size in pixels */
  size: number;
  /** Icon size in pixels */
  iconSize: number;
  /** Whether to use custom image or Lucide icon */
  isCustomImage: boolean;
  /** Icon name (Lucide or custom path) */
  iconName: string;
  /** Pin title for alt text */
  title: string;
  /** Background color */
  color: string;
  /** Opacity (0-1) */
  opacity: number;
  /** Box shadow CSS */
  boxShadow: string;
  /** Transform scale CSS */
  transformScale: string;
  /** Whether the pin is selected */
  isSelected: boolean;
  /** Whether the layer is locked */
  isLayerLocked: boolean;
  /** Whether the pin is being dragged */
  isDragging: boolean;
  /** Pin ID for drag detection */
  pinId?: string;
  /** Click handler */
  onClick: (e: React.MouseEvent) => void;
  /** Mouse down handler */
  onMouseDown: (e: React.MouseEvent) => void;
  /** Mouse enter handler */
  onMouseEnter: () => void;
  /** Mouse leave handler */
  onMouseLeave: () => void;
}

/**
 * MarkerContainer - Main marker container with icon and styling
 *
 * Renders the complete pin marker including:
 * - Selection ring (when selected)
 * - Main marker container with proper positioning
 * - Icon (custom image or Lucide)
 * - Interactive handlers (click, drag, hover)
 *
 * Memoized to prevent unnecessary re-renders of sub-components during pan/zoom.
 *
 * @example
 * ```tsx
 * <MarkerContainer
 *   x={position.x}
 *   y={position.y}
 *   zIndex={finalZIndex}
 *   size={finalSize}
 *   iconSize={iconSize}
 *   isCustomImage={isCustomImage}
 *   iconName={iconName}
 *   title={pin.title}
 *   color={pin.color}
 *   opacity={pin.opacity}
 *   boxShadow={boxShadow}
 *   transformScale={transformScale}
 *   isSelected={isPinSelected}
 *   isLayerLocked={isLayerLocked}
 *   isDragging={isDragging}
 *   onClick={handleClick}
 *   onMouseDown={handleMouseDown}
 *   onMouseEnter={handleMouseEnter}
 *   onMouseLeave={handleMouseLeave}
 * />
 * ```
 */
export const MarkerContainer = memo(function MarkerContainer({
  x,
  y,
  zIndex,
  size,
  iconSize,
  isCustomImage,
  iconName,
  title,
  color,
  opacity,
  boxShadow,
  transformScale,
  isSelected,
  isLayerLocked,
  isDragging,
  pinId,
  onClick,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: MarkerContainerProps) {
  const cursorClass = isDragging
    ? "cursor-grabbing"
    : isLayerLocked
      ? "cursor-not-allowed"
      : "cursor-pointer";

  // Visual feedback for locked state
  const lockedOpacity = isLayerLocked ? 0.5 : opacity;
  const lockedFilter = isLayerLocked ? "grayscale(100%)" : "none";

  return (
    <div
      className={`absolute ${cursorClass}`}
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: "translate(-50%, -50%)",
        zIndex,
      }}
      role="button"
      tabIndex={0}
      aria-label={`Pin: ${title || 'Untitled'}`}
      aria-describedby={isSelected ? 'pin-selected' : undefined}
      aria-pressed={isSelected}
      data-pin-id={pinId}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={(e) => {
        // Activate pin on Enter or Space
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(e as any);
        }
      }}
    >
      {/* Selection ring indicator */}
      <MarkerSelectionRing isSelected={isSelected} pinSize={size} />

      {/* Main marker */}
      <div
        className="flex items-center justify-center transition-all duration-150 overflow-hidden"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: isCustomImage ? "transparent" : color,
          borderRadius: "var(--radius-sm)",
          opacity: lockedOpacity,
          boxShadow,
          transform: transformScale,
          filter: lockedFilter,
        }}
        aria-hidden="true"
      >
        <MarkerIcon
          iconName={iconName}
          title={title}
          iconSize={iconSize}
          isCustomImage={isCustomImage}
        />
      </div>
    </div>
  );
});
