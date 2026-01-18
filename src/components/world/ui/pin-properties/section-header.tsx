import { getLucideIcon } from "@/lib/icon-utils";
import type { Pin } from "@prisma/client";
import { getPinTypeOptions } from "@/constants/pin-types";

interface SectionHeaderProps {
  pinType: Pin["pinType"];
}

export function SectionHeader({ pinType }: SectionHeaderProps) {
  const pinTypeOptions = getPinTypeOptions();

  const getPinIcon = (iconName: string) => {
    return getLucideIcon(iconName);
  };

  const CurrentPinTypeIcon = getPinIcon(
    pinTypeOptions.find((opt) => opt.value === pinType)?.icon || "MapPin"
  );

  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-sm bg-background-elevated border border-accent-gold/30">
      <CurrentPinTypeIcon className="w-4 h-4 text-accent-gold" />
      <span className="text-xs font-display font-medium text-accent-gold uppercase tracking-wider">
        Pin Properties
      </span>
    </div>
  );
}
