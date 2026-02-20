import { cn } from "@/lib/utils";

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "text" | "circular" | "rounded";
}

/**
 * Base skeleton component with animation
 * Provides consistent loading placeholder across the app
 */
export function Skeleton({
  className,
  variant = "default",
  ...props
}: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse bg-background-skeleton",
        {
          "rounded-sm": variant === "default",
          "rounded-sm": variant === "text",
          "rounded-sm": variant === "circular",
          "rounded-sm": variant === "rounded",
        },
        className
      )}
      {...props}
    />
  );
}
