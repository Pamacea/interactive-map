/**
 * Loading States Components
 *
 * Provides skeleton screens, spinners, and progress indicators
 * for the world map interface. All components use GPU-accelerated
 * animations for smooth 60fps performance.
 *
 * Uses Tailwind's animate-pulse for skeleton loading animation.
 */

import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";
import { animationClasses } from "./animations";

// ============== Skeleton Components ==============

/**
 * Skeleton placeholder for panel content
 * Displays a pulsing placeholder while content is loading
 */
export function PanelSkeleton({
  className,
  showHeader = true,
  showContent = true,
  lines = 3,
}: {
  className?: string;
  showHeader?: boolean;
  showContent?: boolean;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-3", animationClasses.pulse, className)}>
      {showHeader && (
        <>
          <div className="h-5 bg-muted rounded w-1/3" />
          <div className="h-px bg-border-subtle" />
        </>
      )}
      {showContent && (
        <>
          <div className="h-4 bg-muted rounded w-3/4" />
          <div className="h-4 bg-muted rounded w-1/2" />
          <div className="h-20 bg-muted rounded" />
          {lines > 3 && <div className="h-4 bg-muted rounded w-2/3" />}
          {lines > 4 && <div className="h-4 bg-muted rounded w-1/3" />}
        </>
      )}
    </div>
  );
}

/**
 * Skeleton for list items (layers, pins, etc.)
 */
export function ListItemSkeleton({
  className,
  count = 3,
}: {
  className?: string;
  count?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 animate-pulse">
          <div className="h-10 w-10 bg-muted rounded-sm flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-3 bg-muted rounded w-1/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * Skeleton for card components (gallery items, character cards)
 */
export function CardSkeleton({
  className,
  aspectRatio = "square",
}: {
  className?: string;
  aspectRatio?: "square" | "portrait" | "landscape";
}) {
  const aspectClass = {
    square: "aspect-square",
    portrait: "aspect-[3/4]",
    landscape: "aspect-video",
  }[aspectRatio];

  return (
    <div className={cn("space-y-3", className)}>
      <div className={cn("bg-muted rounded-sm", aspectClass, animationClasses.pulse)} />
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
      </div>
    </div>
  );
}

/**
 * Skeleton for map content
 */
export function MapSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-obsidian",
        animationClasses.fadeIn,
        className
      )}
    >
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin mx-auto text-accent-gold" />
        <p className="text-bone-dark">Loading map...</p>
      </div>
    </div>
  );
}

// ============== Spinner Components ==============

export type SpinnerSize = "xs" | "sm" | "md" | "lg" | "xl";

const spinnerSizes: Record<SpinnerSize, string> = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-12 w-12",
};

/**
 * Loading spinner with customizable size
 * Uses Lucide's Loader2 icon with spin animation
 */
export function LoadingSpinner({
  size = "md",
  className,
  variant = "default",
}: {
  size?: SpinnerSize;
  className?: string;
  variant?: "default" | "gold" | "subtle";
}) {
  const variantColors = {
    default: "text-current",
    gold: "text-accent-gold",
    subtle: "text-text-muted",
  };

  return (
    <Loader2
      className={cn(
        "animate-spin",
        spinnerSizes[size],
        variantColors[variant],
        className
      )}
      aria-label="Loading"
    />
  );
}

/**
 * Inline loading indicator for buttons
 * Combines text with spinner
 */
export function InlineLoader({
  text = "Loading...",
  className,
}: {
  text?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <LoadingSpinner size="sm" />
      <span>{text}</span>
    </span>
  );
}

/**
 * Full-page loading overlay
 * Covers the entire viewport with centered spinner
 */
export function FullPageLoader({
  message = "Loading...",
  className,
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background-overlay/80 backdrop-blur-sm",
        animationClasses.fadeIn,
        className
      )}
    >
      <div className="text-center space-y-4">
        <LoadingSpinner size="xl" variant="gold" />
        <p className="text-text-primary">{message}</p>
      </div>
    </div>
  );
}

/**
 * Centered loading indicator for containers
 */
export function CenteredLoader({
  message,
  size = "lg",
  className,
}: {
  message?: string;
  size?: SpinnerSize;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12", className)}>
      <LoadingSpinner size={size} variant="gold" className="mb-4" />
      {message && <p className="text-text-muted">{message}</p>}
    </div>
  );
}

// ============== Progress Components ==============

/**
 * Progress bar for upload/download operations
 * Smooth animated transition for progress updates
 */
export function ProgressBar({
  progress,
  className,
  variant = "default",
  showLabel = false,
  label,
}: {
  progress: number; // 0-100
  className?: string;
  variant?: "default" | "gold" | "success" | "error";
  showLabel?: boolean;
  label?: string;
}) {
  const variantColors = {
    default: "bg-primary",
    gold: "bg-accent-gold",
    success: "bg-status-success",
    error: "bg-status-error",
  };

  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className={cn("space-y-1", className)}>
      {(showLabel || label) && (
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">{label || "Progress"}</span>
          <span className="text-text-muted">{Math.round(clampedProgress)}%</span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full transition-all duration-300 ease-out",
            variantColors[variant]
          )}
          style={{ width: `${clampedProgress}%` }}
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
}

/**
 * Upload progress with file info and status
 */
export function UploadProgress({
  fileName,
  progress,
  status = "uploading",
  className,
}: {
  fileName: string;
  progress: number; // 0-100
  status?: "uploading" | "processing" | "complete" | "error";
  className?: string;
}) {
  const statusColors = {
    uploading: "text-accent-gold",
    processing: "text-status-info",
    complete: "text-status-success",
    error: "text-status-error",
  };

  const statusIcons = {
    uploading: <Upload className="h-4 w-4 animate-pulse" />,
    processing: <LoadingSpinner size="sm" />,
    complete: <span className="text-status-success">✓</span>,
    error: <span className="text-status-error">✕</span>,
  };

  return (
    <div className={cn("space-y-2 p-3 bg-background-card rounded-sm border border-border-subtle", className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-primary truncate flex-1 mr-2">{fileName}</span>
        <span className={cn("flex items-center gap-1 text-sm", statusColors[status])}>
          {statusIcons[status]}
          <span className="capitalize">{status}</span>
        </span>
      </div>
      <ProgressBar progress={progress} variant="gold" />
    </div>
  );
}

/**
 * Indeterminate progress bar for unknown duration
 */
export function IndeterminateProgress({ className }: { className?: string }) {
  return (
    <div className={cn("h-2 bg-muted rounded-full overflow-hidden", className)}>
      <div className="h-full bg-accent-gold animate-[shimmer_1.5s_infinite]" />
    </div>
  );
}

// ============== Status Indicators ==============

/**
 * Small dot indicator for loading state
 */
export function LoadingDot({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "gold" | "success";
}) {
  const variantColors = {
    default: "bg-primary",
    gold: "bg-accent-gold",
    success: "bg-status-success",
  };

  return (
    <div
      className={cn(
        "h-2 w-2 rounded-full animate-pulse",
        variantColors[variant],
        className
      )}
      aria-label="Loading"
    />
  );
}

/**
 * Skeleton for pin markers on the map
 */
export function PinMarkerSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "animate-pulse bg-muted rounded-sm",
        "w-8 h-8 flex items-center justify-center",
        className
      )}
    >
      <div className="h-4 w-4 bg-muted-foreground/20 rounded-full" />
    </div>
  );
}

/**
 * Skeleton for layer thumbnails
 */
export function LayerThumbnailSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "aspect-square bg-muted rounded-sm animate-pulse",
        "flex items-center justify-center",
        className
      )}
    >
      <LoadingSpinner size="sm" variant="subtle" />
    </div>
  );
}
