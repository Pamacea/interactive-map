import { memo } from "react";
import * as LucideIcons from "lucide-react";
import { isLucideIconName } from "@/shared/lib/icon-utils";

interface MarkerIconProps {
  /** Icon name (Lucide icon or custom image path) */
  iconName: string;
  /** Pin title for alt text */
  title: string;
  /** Calculated icon size in pixels */
  iconSize: number;
  /** Whether this is a custom uploaded image */
  isCustomImage: boolean;
  /** Icon color (for text/emoji icons) */
  color?: string;
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
 * Displays either a custom uploaded image, an emoji, or a Lucide icon component.
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
 *   color={pin.color}
 * />
 * ```
 */
export const MarkerIcon = memo(function MarkerIcon({ iconName, title, iconSize, isCustomImage, color }: MarkerIconProps) {
  // Extract actual icon name if using lucide: prefix format
  const actualIconName = iconName.startsWith("lucide:")
    ? iconName.replace("lucide:", "")
    : iconName;

  // Check if icon is an emoji (simple heuristic: single character or starts with specific emoji ranges)
  const isEmoji = /^[\p{Emoji}\p{Emoji_Component}\p{Emoji_Modifier_Base}\p{Emoji_Modifier}\p{Emoji_Presentation}]+$/u.test(actualIconName);

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

  // Render emoji or text icon with color
  if (isEmoji) {
    return (
      <span
        style={{
          fontSize: `${iconSize * 0.7}px`,
          color: color,
          filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
        }}
      >
        {actualIconName}
      </span>
    );
  }

  // Check if it's a Lucide icon (either with prefix or validated name)
  const isLucide = iconName.startsWith("lucide:") || isLucideIconName(actualIconName);

  // Render Lucide icon using wrapper component
  if (isLucide) {
    return <LucideIconWrapper iconName={actualIconName} width={iconSize} height={iconSize} style={{ color: color || "white", opacity: 0.9 }} />;
  }

  // Fallback: render as text if nothing matched
  return (
    <span
      style={{
        fontSize: `${iconSize * 0.5}px`,
        color: color || "white",
        filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
      }}
    >
      {actualIconName}
    </span>
  );
});
