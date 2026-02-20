'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { PresenceData, PresenceUsers } from '@/shared/lib/presence';
import { updatePresence, removePresence } from '@/features/presence/actions';

interface UsePresencePollingOptions {
  worldId: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  enabled?: boolean;
  onUserJoined?: (userId: string, info: PresenceData) => void;
  onUserLeft?: (userId: string) => void;
}

const PRESENCE_QUERY_KEY = 'presence';

/**
 * Polling-based presence hook using TanStack Query
 * Replaces WebSocket/Pusher with simple HTTP polling
 */
export function usePresencePolling({
  worldId,
  userId,
  userName,
  userImage,
  enabled = true,
  onUserJoined,
  onUserLeft,
}: UsePresencePollingOptions) {
  const queryClient = useQueryClient();
  const [sessionId] = useState(() =>
    typeof crypto !== 'undefined' && crypto.randomUUID
      ? `session-${crypto.randomUUID()}`
      : `session-${Date.now()}-${Math.random().toString(36).slice(2, 10)}-${Date.now().toString(36)}`
  );
  const previousUsersRef = useRef<PresenceUsers>({});
  const heartbeatIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const isMountedRef = useRef(true);

  // Fetch active users from server
  const { data: activeUsers = [], isLoading, error } = useQuery({
    queryKey: [PRESENCE_QUERY_KEY, worldId],
    queryFn: () => fetchPresence(worldId),
    enabled: enabled && !!worldId,
    refetchInterval: 5000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Update my presence mutation
  const updateMyPresenceMutation = useMutation({
    mutationFn: (data: Omit<PresenceData, 'userId' | 'userName' | 'userImage'>) =>
      updatePresence({
        worldId,
        sessionId,
        ...data,
      }),
    onError: (err) => {
      console.warn('Presence update failed:', err);
    },
  });

  // Detect user join/leave events
  useEffect(() => {
    if (!activeUsers.length) return;

    const currentUsers: PresenceUsers = {};
    activeUsers.forEach(user => {
      currentUsers[user.id] = {
        userId: user.id,
        userName: user.name || 'Anonymous',
        userImage: user.image,
        cursorX: user.cursorX,
        cursorY: user.cursorY,
      };
    });

    // Check for new users (joined)
    Object.entries(currentUsers).forEach(([id, info]) => {
      if (!previousUsersRef.current[id] && id !== userId) {
        onUserJoined?.(id, info);
      }
    });

    // Check for removed users (left)
    Object.entries(previousUsersRef.current).forEach(([id]) => {
      if (!currentUsers[id] && id !== userId) {
        onUserLeft?.(id);
      }
    });

    previousUsersRef.current = currentUsers;
  }, [activeUsers, userId, onUserJoined, onUserLeft]);

  // Heartbeat to keep presence alive
  useEffect(() => {
    if (!enabled) return;

    isMountedRef.current = true;

    const sendHeartbeat = async () => {
      if (!isMountedRef.current) return;
      updateMyPresenceMutation.mutate({});
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Set up interval
    heartbeatIntervalRef.current = setInterval(sendHeartbeat, 30000);

    return () => {
      isMountedRef.current = false;
      if (heartbeatIntervalRef.current) {
        clearInterval(heartbeatIntervalRef.current);
        heartbeatIntervalRef.current = null;
      }
      // Remove presence on unmount (fire and forget with retries)
      removePresence({ worldId, sessionId }).catch(() => {
        // Silent fail - cleanup will happen via timeout
      });
    };
  }, [enabled, worldId, sessionId, updateMyPresenceMutation]);

  // Convert active users array to presence users object
  const presenceUsers: PresenceUsers = {};
  activeUsers.forEach(user => {
    presenceUsers[user.id] = {
      userId: user.id,
      userName: user.name || 'Anonymous',
      userImage: user.image,
      cursorX: user.cursorX,
      cursorY: user.cursorY,
    };
  });

  return {
    isLoading,
    error,
    isConnected: true,
    presenceUsers,
    sessionId,
    updateMyPresence: updateMyPresenceMutation.mutate,
  };
}

async function fetchPresence(worldId: string) {
  const response = await fetch(`/api/presence/${worldId}`);
  if (!response.ok) {
    throw new Error('Failed to fetch presence');
  }
  return response.json() as Promise<Array<{
    id: string;
    name: string | null;
    image: string | null;
    cursorX: number | null;
    cursorY: number | null;
  }>>;
}
