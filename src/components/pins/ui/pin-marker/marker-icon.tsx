import { memo } from "react";
import * as LucideIcons from "lucide-react";

interface MarkerIconProps {
  /** Icon name (Lucide icon or custom image path) */
  iconName: string;
  /** Pin title for alt text */
  title: string;
  /** Calculated icon size in pixels */
  iconSize: number;
  /** Whether this is a custom uploaded image */
  isCustomImage: boolean;
}

/**
 * MarkerIcon - Renders pin icon (Lucide or custom image)
 *
 * Displays either a custom uploaded image or a Lucide icon component.
 * Handles icon scaling and styling.
 *
 * Memoized to prevent unnecessary re-renders when parent props change.
 *
 * @example
 * ```tsx
 * <MarkerIcon
 *   iconName={pin.icon || pinConfig.icon}
 *   title={pin.title}
 *   iconSize={16 * transform.scale}
 *   isCustomImage={iconName?.startsWith("/")}
 * />
 * ```
 */
export const MarkerIcon = memo(function MarkerIcon({ iconName, title, iconSize, isCustomImage }: MarkerIconProps) {
  if (isCustomImage) {
    return (
      <img
        src={iconName}
        alt={title}
        className="w-full h-full object-contain"
        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))" }}
      />
    );
  }

  // Get Lucide icon component for non-custom icons
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.MapPin;

  return (
    <IconComponent
      width={iconSize}
      height={iconSize}
      style={{ color: "white", opacity: 0.9 }}
    />
  );
});
