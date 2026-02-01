import { cn } from "@/lib/utils";

interface SkeletonSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Spinner skeleton for loading states
 * Displays animated spinner while content loads
 * Use sparingly - prefer skeleton screens for better UX
 */
export function SkeletonSpinner({
  size = "md",
  className = "",
}: SkeletonSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-3",
    lg: "w-12 h-12 border-4",
  };

  return (
    <div
      className={cn(
        "border-border-base border-t-accent-gold rounded-sm animate-spin",
        sizeClasses[size],
        className
      )}
    />
  );
}
