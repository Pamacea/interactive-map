'use client';

import { memo } from 'react';
import { formatEventMessage, getEventIcon, formatEventTime, type ActivityEvent } from '@/hooks/use-activity-events';
import { cn } from '@/lib/utils';

interface ActivityFeedProps {
  events: ActivityEvent[];
  isLoading?: boolean;
}

export const ActivityFeed = memo<ActivityFeedProps>(function ActivityFeed({ events, isLoading }) {
  if (isLoading) {
    return <ActivityFeedSkeleton />;
  }

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <span className="text-2xl opacity-50">📋</span>
        </div>
        <p className="text-sm text-slate-400">No recent activity</p>
        <p className="text-xs text-slate-500 mt-1">Changes will appear here</p>
      </div>
    );
  }

  return (
    <div className="space-y-0">
      {events.map((event, index) => (
        <ActivityItem
          key={event.id}
          event={event}
          isLast={index === events.length - 1}
        />
      ))}
    </div>
  );
});

interface ActivityItemProps {
  event: ActivityEvent;
  isLast?: boolean;
}

const ActivityItem = memo<ActivityItemProps>(function ActivityItem({ event, isLast }) {
  const icon = getEventIcon(event.eventType);
  const message = formatEventMessage(event);
  const time = formatEventTime(event.timestamp);

  return (
    <div className={cn(
      'flex items-start gap-3 py-3 px-2',
      !isLast && 'border-b border-border-subtle'
    )}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-slate-800/50 flex items-center justify-center text-sm">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-slate-200 truncate">{message}</p>
        <p className="text-xs text-slate-500 mt-0.5">{time}</p>
      </div>
    </div>
  );
});

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
