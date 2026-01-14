/**
 * WorldSkeleton - Loading state for world detail page
 * Displays placeholders while world data is being fetched
 */
export function WorldSkeleton() {
  return (
    <div className="h-screen bg-background-base flex flex-col">
      {/* Navigation skeleton */}
      <div className="h-16 border-b border-border-base animate-pulse bg-slate-800" />

      {/* Main content skeleton */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar skeleton */}
        <div className="w-80 border-r border-border-base animate-pulse bg-slate-800" />

        {/* Map canvas skeleton */}
        <main className="flex-1 bg-slate-900 animate-pulse" />
      </div>
    </div>
  );
}
