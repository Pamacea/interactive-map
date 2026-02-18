import { memo } from "react";
import { MarkerIcon } from "./marker-icon";
import type { IconShape } from "@prisma/client";

// Shape definitions with CSS clip-path
const ICON_SHAPES: Record<IconShape, string> = {
  CIRCLE: "circle(50%)",
  SQUARE: "inset(0%)",
  TRIANGLE: "polygon(50% 0%, 0% 100%, 100% 100%)",
  STAR: "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
  HEXAGON: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
  DIAMOND: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
  CUSTOM: "none",
};

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
  /** Icon shape (circle, square, triangle, star, hexagon, diamond, custom) */
  iconShape?: IconShape | null;
  /** Custom icon URL (uploaded image) */
  customIcon?: string | null;
  /** Custom icon background URL (uploaded image) */
  iconBackground?: string | null;
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
  iconShape,
  customIcon,
  iconBackground,
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

  // Get clip path for shape
  const shape = iconShape ?? "CIRCLE";
  const clipPath = ICON_SHAPES[shape] ?? ICON_SHAPES.CIRCLE;

  // Determine if we should use custom uploaded icon
  const hasCustomIcon = customIcon && customIcon.trim() !== "";

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
      {/* Main marker */}
      {hasCustomIcon ? (
        // Custom uploaded icon
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={customIcon}
          alt={title || 'Pin'}
          className="transition-all duration-150"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            objectFit: "contain",
            opacity: lockedOpacity,
            boxShadow,
            transform: transformScale,
            filter: lockedFilter,
          }}
          aria-hidden="true"
        />
      ) : (
        // Standard marker with shape and icon
        <div
          className="flex items-center justify-center transition-all duration-150 overflow-hidden relative"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            backgroundColor: iconBackground ? "transparent" : color,
            clipPath: clipPath === "none" ? undefined : clipPath,
            opacity: lockedOpacity,
            boxShadow,
            transform: transformScale,
            filter: lockedFilter,
          }}
          aria-hidden="true"
        >
          {/* Custom background image if provided - fully covers the color background */}
          {iconBackground && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={iconBackground}
              alt="Background"
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                clipPath: clipPath === "none" ? undefined : clipPath,
                zIndex: 0,
              }}
            />
          )}
          <MarkerIcon
            iconName={iconName}
            title={title}
            iconSize={iconSize}
            isCustomImage={isCustomImage}
            color="white"
          />
        </div>
      )}
    </div>
  );
});
