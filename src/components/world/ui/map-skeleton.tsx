import { Skeleton, SkeletonSpinner } from "@/components/ui/skeleton";

/**
 * MapSkeleton - Loading state for map canvas component
 * Displays animated placeholder while map content loads
 */
export function MapSkeleton() {
  return (
    <div className="flex-1 relative bg-surface-base flex items-center justify-center">
      {/* Background grid pattern */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,currentColor_1px,transparent_1px),linear-gradient(to_bottom,currentColor_1px,transparent_1px)] bg-[length:40px_40px]" />

      {/* Central loading indicator */}
      <div className="relative z-10 flex flex-col items-center gap-4">
        {/* Spinner */}
        <SkeletonSpinner size="lg" />

        {/* Loading text */}
        <Skeleton className="h-5 w-48" />

        {/* Subtext */}
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Zoom controls placeholder */}
      <div className="absolute bottom-6 right-6 flex flex-col gap-2">
        <Skeleton variant="rounded" className="w-10 h-10" />
        <Skeleton variant="rounded" className="w-10 h-10" />
        <Skeleton variant="rounded" className="w-10 h-10" />
      </div>

      {/* Layers indicator placeholder */}
      <div className="absolute top-6 left-6">
        <Skeleton variant="rounded" className="h-8 w-32" />
      </div>
    </div>
  );
}
