import { Skeleton } from "./skeleton";
import { cn } from "@/shared/utils";

interface SkeletonTextProps {
  lines?: number;
  className?: string;
  lineClassName?: string;
}

/**
 * Text skeleton for loading text content
 * Displays animated placeholder lines while text loads
 */
export function SkeletonText({
  lines = 3,
  className = "",
  lineClassName = "",
}: SkeletonTextProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            "h-4",
            i === lines - 1 ? "w-2/3" : "w-full",
            lineClassName
          )}
        />
      ))}
    </div>
  );
}
