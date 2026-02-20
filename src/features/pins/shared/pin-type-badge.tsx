/**
 * PinTypeBadge - Display pin type with icon and color
 *
 * A reusable badge component that shows a pin's type with appropriate
 * icon, color, and label. Useful for lists, headers, and quick references.
 */

import { memo } from "react";
import { cn } from "@/shared/utils";
import { PIN_TYPE_OPTIONS } from "./pin-constants";
import type { PinType } from "@/types/pin.type";
import {
  Building2,
  Home,
  MapPin,
  User,
  Mountain,
  ShoppingBag,
  Scroll,
  Gem,
  Circle,
  type LucideProps,
} from "lucide-react";

// Static icon map to avoid component creation during render
const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Building2,
  Home,
  MapPin,
  User,
  Mountain,
  ShoppingBag,
  Scroll,
  Gem,
  Circle,
};

// Icon wrapper component defined outside of render
interface StaticIconProps {
  name: string;
  className?: string;
}

const StaticIcon = memo(function StaticIcon({ name, className }: StaticIconProps) {
  const IconComponent = ICON_MAP[name] || MapPin;
  return <IconComponent className={className} />;
});

StaticIcon.displayName = "StaticIcon";

export interface PinTypeBadgeProps {
  /** The pin type to display */
  pinType: PinType;
  /** Size variant */
  size?: "sm" | "md" | "lg";
  /** Whether to show the label */
  showLabel?: boolean;
  /** Override color (otherwise uses pin type default) */
  color?: string;
  /** Custom className */
  className?: string;
  /** Click handler */
  onClick?: () => void;
  /** Show as outline instead of filled */
  variant?: "filled" | "outline" | "subtle";
}

/**
 * Size configurations
 */
const SIZE_CONFIGS = {
  sm: {
    container: "px-1.5 py-0.5 text-xs gap-1",
    icon: "w-3 h-3",
  },
  md: {
    container: "px-2 py-1 text-sm gap-1.5",
    icon: "w-3.5 h-3.5",
  },
  lg: {
    container: "px-3 py-1.5 text-sm gap-2",
    icon: "w-4 h-4",
  },
} as const;

/**
 * Get pin type configuration
 */
function getPinTypeConfig(pinType: PinType) {
  return (
    PIN_TYPE_OPTIONS.find((opt) => opt.value === pinType) || {
      value: "CUSTOM",
      label: "Custom",
      icon: "Circle",
    }
  );
}

/**
 * PinTypeBadge Component
 */
export const PinTypeBadge = memo(function PinTypeBadge({
  pinType,
  size = "md",
  showLabel = true,
  color,
  className,
  onClick,
  variant = "subtle",
}: PinTypeBadgeProps) {
  const config = getPinTypeConfig(pinType);

  const sizeConfig = SIZE_CONFIGS[size];
  const badgeColor = color || undefined;

  // Variant styles
  const variantStyles = {
    filled: cn(
      "text-white border-transparent",
      onClick && "cursor-pointer hover:opacity-80"
    ),
    outline: cn(
      "text-text-primary bg-transparent border-current",
      onClick && "cursor-pointer hover:bg-background-elevated"
    ),
    subtle: cn(
      "bg-background-elevated border-border-subtle text-text-secondary",
      onClick && "cursor-pointer hover:bg-background-elevated/80 hover:border-border-muted"
    ),
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border font-medium transition-colors",
        sizeConfig.container,
        variantStyles[variant],
        onClick && "cursor-pointer",
        className
      )}
      onClick={onClick}
      style={
        variant === "filled" && badgeColor
          ? { backgroundColor: badgeColor }
          : undefined
      }
      role={onClick ? "button" : undefined}
      aria-label={`${config.label} pin type`}
    >
      {/* Icon */}
      <StaticIcon name={config.icon} className={cn(sizeConfig.icon, "flex-shrink-0")} />

      {/* Label */}
      {showLabel && <span>{config.label}</span>}
    </div>
  );
});

PinTypeBadge.displayName = "PinTypeBadge";

/**
 * PinTypeIcon - Just the icon, no label
 */
export interface PinTypeIconProps {
  pinType: PinType;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  onClick?: () => void;
}

export const PinTypeIcon = memo(function PinTypeIcon({
  pinType,
  size = "md",
  color,
  className,
  onClick,
}: PinTypeIconProps) {
  return (
    <PinTypeBadge
      pinType={pinType}
      size={size}
      showLabel={false}
      color={color}
      className={className}
      onClick={onClick}
    />
  );
});

PinTypeIcon.displayName = "PinTypeIcon";

/**
 * PinTypeLabel - Text only, no icon
 */
export interface PinTypeLabelProps {
  pinType: PinType;
  className?: string;
}

export const PinTypeLabel = memo(function PinTypeLabel({
  pinType,
  className,
}: PinTypeLabelProps) {
  const config = getPinTypeConfig(pinType);

  return (
    <span className={cn("text-sm text-text-secondary", className)}>
      {config.label}
    </span>
  );
});

PinTypeLabel.displayName = "PinTypeLabel";
