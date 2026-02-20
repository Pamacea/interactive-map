import { SkeletonCard } from "./skeleton-card";
import { cn } from "@/shared/utils";

interface SkeletonGridProps {
  items?: number;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  className?: string;
}

/**
 * Grid skeleton for loading card grids (worlds, gallery, etc.)
 * Displays animated placeholder cards while grid content loads
 */
export function SkeletonGrid({
  items = 6,
  columns = { sm: 1, md: 2, lg: 3 },
  className = "",
}: SkeletonGridProps) {
  const gridClasses = cn(
    "grid gap-4",
    columns.sm && `grid-cols-${columns.sm}`,
    columns.md && `md:grid-cols-${columns.md}`,
    columns.lg && `lg:grid-cols-${columns.lg}`,
    columns.xl && `xl:grid-cols-${columns.xl}`,
    className
  );

  return (
    <div className={gridClasses}>
      {Array.from({ length: items }).map((_, i) => (
        <SkeletonCard key={i} showAvatar showTitle showDescription lines={2} />
      ))}
    </div>
  );
}
