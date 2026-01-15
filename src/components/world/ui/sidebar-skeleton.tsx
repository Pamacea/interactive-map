/**
 * SidebarSkeleton - Loading state for sidebar component
 * Displays animated placeholder while sidebar content loads
 */
export function SidebarSkeleton() {
  return (
    <div className="w-80 border-r border-border-base bg-surface-elevated flex flex-col">
      {/* Header skeleton */}
      <div className="h-14 border-b border-border-base px-4 flex items-center justify-between">
        <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
        <div className="h-8 w-8 bg-slate-700 rounded animate-pulse" />
      </div>

      {/* Tabs skeleton */}
      <div className="h-12 border-b border-border-base px-2 flex items-center gap-2">
        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
        <div className="h-8 w-24 bg-slate-700 rounded animate-pulse" />
      </div>

      {/* Content skeleton */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Section skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-24 bg-slate-700 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-12 w-full bg-slate-700 rounded animate-pulse" />
            <div className="h-12 w-full bg-slate-700 rounded animate-pulse" />
            <div className="h-12 w-full bg-slate-700 rounded animate-pulse" />
          </div>
        </div>

        {/* Another section skeleton */}
        <div className="space-y-3">
          <div className="h-5 w-32 bg-slate-700 rounded animate-pulse" />
          <div className="space-y-2">
            <div className="h-16 w-full bg-slate-700 rounded animate-pulse" />
            <div className="h-16 w-full bg-slate-700 rounded animate-pulse" />
          </div>
        </div>
      </div>

      {/* Resize handle skeleton */}
      <div className="h-full w-1 bg-border-base hover:w-2 transition-all cursor-col-resize" />
    </div>
  );
}
