import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "lucide-react";

export function getIconComponent(
  iconName: string
): LucideIcon {
  // @ts-ignore - Dynamic access to Lucide icons
  const IconComponent = LucideIcons[iconName];

  return IconComponent ?? LucideIcons.MapPin;
}
