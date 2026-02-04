import * as LucideIcons from "lucide-react";
import type { Pin } from "@prisma/client";
import { getPinTypeOptions } from "@/constants/pin-types";
import { isLucideIconName } from "@/lib/icon-utils";

interface SectionHeaderProps {
  pinType: Pin["pinType"];
}

interface IconWrapperProps {
  iconName: string;
  className?: string;
}

/**
 * Wrapper component to render Lucide icons
 * Declared outside render to satisfy react-hooks/static-components rule
 */
function IconWrapper({ iconName, className }: IconWrapperProps) {
  if (!isLucideIconName(iconName)) {
    return <LucideIcons.MapPin className={className} />;
  }

  const IconComponent = LucideIcons[iconName] as React.ComponentType<{ className?: string }>;
  return <IconComponent className={className} />;
}

export function SectionHeader({ pinType }: SectionHeaderProps) {
  const pinTypeOptions = getPinTypeOptions();
  const icon = pinTypeOptions.find((opt) => opt.value === pinType)?.icon || "MapPin";

  return (
    <div className="relative flex items-center gap-2 px-3 py-2.5 bg-stone/50 border-t border-accent-gold/50 border-b-iron/50">
      <IconWrapper iconName={icon} className="w-4 h-4 text-accent-gold" />
      <span className="text-xs font-display font-semibold text-accent-gold uppercase tracking-widest">
        Pin Properties
      </span>
      <div className="ml-auto flex items-center gap-1">
        <span className="text-accent-gold/30 text-xs">ᛟ</span>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-gold/30 to-transparent" />
    </div>
  );
}
