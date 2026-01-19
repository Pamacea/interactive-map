/**
 * WorldSkeleton - Loading state for world detail page
 * Displays placeholders while world data is being fetched
 */
export function WorldSkeleton() {
  return (
    <div className="h-screen bg-background-base flex flex-col">
      {/* Navigation skeleton */}
      <div className="h-16 border-b border-border-default animate-pulse bg-background-elevated" />

      {/* Main content skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-80 border-r border-border-default animate-pulse bg-background-elevated" />

        {/* Map canvas skeleton */}
        <main className="flex-1 bg-background-base animate-pulse" />
      </div>
    </div>
  );
}
