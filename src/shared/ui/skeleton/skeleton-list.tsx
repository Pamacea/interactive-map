import { Skeleton } from "./skeleton";
import { cn } from "@/shared/utils";

interface SkeletonListProps {
  items?: number;
  showAvatar?: boolean;
  className?: string;
}

/**
 * List skeleton for loading lists (pins, worlds, etc.)
 * Displays animated placeholder items while list content loads
 */
export function SkeletonList({
  items = 5,
  showAvatar = true,
  className = "",
}: SkeletonListProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3 border border-border-subtle rounded-sm">
          {showAvatar && (
            <Skeleton variant="circular" className="w-10 h-10 flex-shrink-0" />
          )}
          <div className="flex-1 space-y-2">
            <Skeleton variant="text" className="h-4 w-3/4" />
            <Skeleton variant="text" className="h-3 w-1/2" />
          </div>
          <Skeleton variant="rounded" className="w-8 h-8 flex-shrink-0" />
        </div>
      ))}
    </div>
  );
}
