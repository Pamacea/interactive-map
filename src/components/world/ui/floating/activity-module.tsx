'use client';

import { Suspense } from 'react';
import { Clock } from 'lucide-react';
import { FloatingPanel } from './floating-panel';
import { ActivityFeed } from './activity-feed';
import { useActivityEvents } from '@/hooks/use-activity-events';

interface ActivityModuleProps {
  worldId: string;
}

export function ActivityModule({ worldId }: ActivityModuleProps) {
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
  const { data: events, isLoading } = useActivityEvents(worldId);

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
