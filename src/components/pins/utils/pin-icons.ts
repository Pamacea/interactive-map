import * as LucideIcons from "lucide-react";
import type { LucideIcon } from "@/constants/pin-types";

export function getIconComponent(iconName: string): LucideIcon {
  // @ts-ignore - Dynamic access to Lucide icons
  const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons];

  // @ts-ignore - MapPin exists in lucide-react
  return IconComponent ?? (LucideIcons.MapPin as LucideIcon);
}
