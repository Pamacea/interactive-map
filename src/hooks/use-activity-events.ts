'use client';

import { useQuery } from '@tanstack/react-query';
import { CollaborationEventType } from '@/lib/presence';
import { getRecentEvents } from '@/actions/presence';

export interface ActivityEvent {
  id: string;
  eventType: CollaborationEventType;
  userId: string;
  userName: string | null;
  targetId: string | null;
  timestamp: Date;
}

export function useActivityEvents(worldId: string, enabled = true) {
  return useQuery<ActivityEvent[]>({
    queryKey: ['activity-events', worldId],
    queryFn: async () => {
      const result = await getRecentEvents({ worldId, limit: 50 });
      if (!result.success) {
        throw new Error(result.error?.message || 'Failed to fetch activity events');
      }
      return result.data.map((event) => ({
        ...event,
        timestamp: new Date(event.timestamp),
      }));
    },
    enabled: enabled && !!worldId,
    refetchInterval: 15000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
}

export function formatEventMessage(event: ActivityEvent): string {
  const userName = event.userName || 'Someone';

  switch (event.eventType) {
    case CollaborationEventType.PIN_CREATED:
      return `${userName} created a pin`;
    case CollaborationEventType.PIN_UPDATED:
      return `${userName} updated a pin`;
    case CollaborationEventType.PIN_DELETED:
      return `${userName} deleted a pin`;
    case CollaborationEventType.PIN_MOVED:
      return `${userName} moved a pin`;
    case CollaborationEventType.LAYER_CREATED:
      return `${userName} created a layer`;
    case CollaborationEventType.LAYER_UPDATED:
      return `${userName} updated a layer`;
    case CollaborationEventType.LAYER_DELETED:
      return `${userName} deleted a layer`;
    case CollaborationEventType.LAYER_VISIBILITY_CHANGED:
      return `${userName} changed layer visibility`;
    case CollaborationEventType.USER_JOINED:
      return `${userName} joined the world`;
    case CollaborationEventType.USER_LEFT:
      return `${userName} left the world`;
    case CollaborationEventType.SELECTION_CHANGED:
      return `${userName} selected something`;
    default:
      return `${userName} performed an action`;
  }
}

export function getEventIcon(eventType: CollaborationEventType): string {
  switch (eventType) {
    case CollaborationEventType.PIN_CREATED:
    case CollaborationEventType.PIN_UPDATED:
    case CollaborationEventType.PIN_DELETED:
    case CollaborationEventType.PIN_MOVED:
      return '📍';
    case CollaborationEventType.LAYER_CREATED:
    case CollaborationEventType.LAYER_UPDATED:
    case CollaborationEventType.LAYER_DELETED:
    case CollaborationEventType.LAYER_VISIBILITY_CHANGED:
      return '📑';
    case CollaborationEventType.USER_JOINED:
    case CollaborationEventType.USER_LEFT:
      return '👤';
    case CollaborationEventType.SELECTION_CHANGED:
      return '🎯';
    default:
      return '•';
  }
}

export function formatEventTime(timestamp: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - timestamp.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 30) return 'just now';
  if (diffSecs < 60) return `${diffSecs}s ago`;
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return timestamp.toLocaleDateString();
}
