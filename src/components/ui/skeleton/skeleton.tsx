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
        "animate-pulse bg-slate-700",
        {
          "rounded-md": variant === "default",
          "rounded-sm": variant === "text",
          "rounded-full": variant === "circular",
          "rounded-lg": variant === "rounded",
        },
        className
      )}
      {...props}
    />
  );
}
