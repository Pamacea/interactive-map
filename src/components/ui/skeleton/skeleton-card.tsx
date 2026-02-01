import { Skeleton } from "./skeleton";
import { cn } from "@/lib/utils";

interface SkeletonCardProps {
  showAvatar?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  lines?: number;
  className?: string;
}

/**
 * Card skeleton for loading cards (world cards, gallery items, etc.)
 * Displays placeholders while card content loads
 */
export function SkeletonCard({
  showAvatar = false,
  showTitle = true,
  showDescription = true,
  lines = 3,
  className = "",
}: SkeletonCardProps) {
  return (
    <div className={`bg-background-card border border-border-subtle rounded-sm p-4 ${className}`}>
      {showAvatar && (
        <div className="flex items-center gap-3 mb-3">
          <Skeleton variant="circular" className="w-10 h-10" />
          <Skeleton variant="text" className="h-4 w-24" />
        </div>
      )}

      {showTitle && (
        <Skeleton variant="text" className="h-6 w-3/4 mb-2" />
      )}

      {showDescription && (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              className={cn(
                "h-4",
                i === lines - 1 ? "w-2/3" : "w-full"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
