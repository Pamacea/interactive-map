import * as React from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";

/**
 * Type-safe Lucide icon component map
 * This provides proper TypeScript types for accessing Lucide icons dynamically
 */
type LucideIconName = keyof typeof LucideIcons;

/**
 * Type guard to check if a string is a valid Lucide icon name
 */
export function isLucideIconName(iconName: string): iconName is LucideIconName {
  return iconName in LucideIcons;
}

/**
 * Get a Lucide icon component by name with type safety
 * Returns MapPin as fallback if icon not found
 *
 * @param iconName - The name of the Lucide icon
 * @returns The Lucide icon component or MapPin as fallback
 */
export function getLucideIcon(iconName: string): React.ComponentType<LucideProps> {
  if (isLucideIconName(iconName)) {
    const IconComponent = LucideIcons[iconName];

    // Verify it's a component (function with displayName)
    if (typeof IconComponent === "function" && IconComponent.displayName) {
      return IconComponent as React.ComponentType<LucideProps>;
    }
  }

  // Fallback to MapPin
  return LucideIcons.MapPin;
}

/**
 * Get all Lucide icon component names
 * Filters out non-component exports
 */
export function getLucideIconNames(): string[] {
  return Object.keys(LucideIcons).filter((key) => {
    const item = LucideIcons[key as LucideIconName];
    return (
      key !== "createLucideIcon" &&
      key !== "default" &&
      key !== "icons" &&
      typeof item === "function" &&
      "displayName" in item
    );
  });
}

/**
 * Type-safe icon component for dynamic Lucide icons
 */
export interface DynamicIconProps extends LucideProps {
  iconName: string;
}

/**
 * DynamicIcon component that renders a Lucide icon by name
 * Uses lazy loading with React.lazy to avoid "cannot create components during render" error
 */
export function DynamicIcon({ iconName, ...props }: DynamicIconProps) {
  // Use a stable reference to the icon component via lazy loading pattern
  const IconComponent = React.useMemo(() => {
    if (isLucideIconName(iconName)) {
      const component = LucideIcons[iconName];
      if (typeof component === "function" && component.displayName) {
        return component as React.ComponentType<LucideProps>;
      }
    }
    return LucideIcons.MapPin;
  }, [iconName]);

  // Render using createElement to satisfy static component requirement
  return React.createElement(IconComponent, props);
}

/**
 * Wrapper component for Lucide icons that suppresses hydration warnings.
 *
 * This prevents React hydration warnings caused by browser extensions (like Dark Reader)
 * that modify SVG attributes before React hydrates the page.
 *
 * Usage:
 *   <Icon icon={<ArrowLeft />} className="w-4 h-4" />
 *
 * Or use the icon component directly with the wrapper:
 *   <Icon icon={ArrowLeft} className="w-4 h-4" />
 */
export interface IconWrapperProps {
  icon: React.ReactNode | React.ComponentType<LucideProps>;
  className?: string;
  [key: string]: unknown;
}

export function Icon({ icon, className, ...props }: IconWrapperProps) {
  // If icon is a component (function), render it with props
  // If icon is already a ReactNode, render it directly
  const isComponent = typeof icon === "function";

  if (isComponent) {
    const IconComponent = icon as React.ComponentType<LucideProps>;
    return (
      <span suppressHydrationWarning className={className}>
        <IconComponent {...(props as LucideProps)} />
      </span>
    );
  }

  return (
    <span suppressHydrationWarning className={className}>
      {icon as React.ReactNode}
    </span>
  );
}
