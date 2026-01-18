import { Skeleton } from "./skeleton";

interface SkeletonPinProps {
  showIcon?: boolean;
  showTitle?: boolean;
  showDescription?: boolean;
  className?: string;
}

/**
 * Pin skeleton for loading pin markers
 * Displays animated placeholder while pin content loads
 */
export function SkeletonPin({
  showIcon = true,
  showTitle = true,
  showDescription = false,
  className = "",
}: SkeletonPinProps) {
  return (
    <div className={`bg-background-card border border-border-subtle rounded-lg p-3 ${className}`}>
      {showIcon && (
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="rounded" className="w-6 h-6" />
          <Skeleton variant="text" className="h-4 w-20" />
        </div>
      )}

      {showTitle && (
        <Skeleton variant="text" className="h-5 w-3/4 mb-1" />
      )}

      {showDescription && (
        <Skeleton variant="text" className="h-4 w-full" />
      )}
    </div>
  );
}
