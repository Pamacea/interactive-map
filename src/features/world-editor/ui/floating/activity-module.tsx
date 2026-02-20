'use client';

import { Suspense, useEffect, useState } from 'react';
import { Clock } from 'lucide-react';
import { FloatingPanel } from './floating-panel';
import { ActivityFeed } from './activity-feed';
import { useActivityEvents } from '@/shared/hooks/use-activity-events';
import { usePanelState } from '@/features/world-editor/store/use-floating-panels-store';

interface ActivityModuleProps {
  worldId: string;
}

/**
 * ActivityModule - Floating panel for activity feed
 *
 * Features:
 * - Lazy loading (only fetches when visible)
 * - Polling for real-time updates
 * - Suspense boundary
 */
export function ActivityModule({ worldId }: ActivityModuleProps) {
  const { isVisible } = usePanelState("activity");

  // Only render content when visible to save resources
  if (!isVisible) {
    return (
      <FloatingPanel
        panelId="activity"
        title="Activity"
        icon={<Clock className="w-4 h-4" />}
      >
        {/* Content will load when panel opens */}
      </FloatingPanel>
    );
  }

  return (
    <FloatingPanel
      panelId="activity"
      title="Activity"
      icon={<Clock className="w-4 h-4" />}
    >
      <Suspense fallback={<ActivityFeedSkeleton />}>
        <ActivityFeedContent worldId={worldId} />
      </Suspense>
    </FloatingPanel>
  );
}

function ActivityFeedContent({ worldId }: { worldId: string }) {
  // Enable polling only when panel is visible
  const { data: events, isLoading } = useActivityEvents(worldId, {
    pollingInterval: 30000, // 30 seconds
    enabled: true,
  });

  return <ActivityFeed events={events || []} isLoading={isLoading} />;
}

function ActivityFeedSkeleton() {
  return (
    <div className="space-y-0">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-start gap-3 py-3 px-2">
          <div className="w-8 h-8 rounded-full bg-slate-800/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800/50 rounded-sm animate-pulse w-3/4" />
            <div className="h-3 bg-slate-800/30 rounded-sm animate-pulse w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}
