import { memo } from "react";
import * as LucideIcons from "lucide-react";
import { isLucideIconName } from "@/lib/icon-utils";

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

interface LucideIconWrapperProps {
  iconName: string;
  width: number;
  height: number;
  style: React.CSSProperties;
}

/**
 * Wrapper component to render Lucide icons
 * Declared outside render to satisfy react-hooks/static-components rule
 */
function LucideIconWrapper({ iconName, width, height, style }: LucideIconWrapperProps) {
  if (!isLucideIconName(iconName)) {
    return <LucideIcons.MapPin width={width} height={height} style={style} />;
  }

  const IconComponent = LucideIcons[iconName] as React.ComponentType<{
    width?: number;
    height?: number;
    style?: React.CSSProperties;
  }>;

  return <IconComponent width={width} height={height} style={style} />;
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

  // Render Lucide icon using wrapper component
  return <LucideIconWrapper iconName={iconName} width={iconSize} height={iconSize} style={{ color: "white", opacity: 0.9 }} />;
});
