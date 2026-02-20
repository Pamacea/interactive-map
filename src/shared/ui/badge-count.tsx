/**
 * BadgeCount - Small count badge for layer items
 * @module ui/badge-count
 */

import { cn } from "@/shared/utils";
import { MapPin, Image, Square } from "lucide-react";

export type BadgeType = "pins" | "images" | "regions";

interface BadgeCountProps {
  type: BadgeType;
  count: number;
  className?: string;
}

const BADGE_CONFIG: Record<
  BadgeType,
  { bg: string; text: string; icon: React.ReactNode }
> = {
  pins: {
    bg: "bg-amber-500/20",
    text: "text-amber-400",
    icon: <MapPin className="w-2 h-2" />,
  },
  images: {
    bg: "bg-emerald-500/20",
    text: "text-emerald-400",
    // eslint-disable-next-line jsx-a11y/alt-text
    icon: <Image className="w-2 h-2" aria-hidden="true" />,
  },
  regions: {
    bg: "bg-purple-500/20",
    text: "text-purple-400",
    icon: <Square className="w-2 h-2" />,
  },
};

/**
 * BadgeCount - Display a count badge for layer content
 *
 * Shows a small badge with icon and count for items in a layer.
 * Only renders when count > 0.
 */
export function BadgeCount({ type, count, className }: BadgeCountProps) {
  if (count === 0) return null;

  const config = BADGE_CONFIG[type];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded font-mono",
        config.bg,
        config.text,
        className
      )}
      title={`${count} ${type}`}
    >
      {config.icon}
      {count}
    </span>
  );
}

/**
 * BadgeCounts - Container for multiple count badges
 */
interface BadgeCountsProps {
  pins?: number;
  images?: number;
  regions?: number;
  className?: string;
}

export function BadgeCounts({
  pins = 0,
  images = 0,
  regions = 0,
  className,
}: BadgeCountsProps) {
  const total = pins + images + regions;
  if (total === 0) return null;

  return (
    <div className={cn("flex items-center gap-1", className)}>
      {pins > 0 && <BadgeCount type="pins" count={pins} />}
      {images > 0 && <BadgeCount type="images" count={images} />}
      {regions > 0 && <BadgeCount type="regions" count={regions} />}
    </div>
  );
}
