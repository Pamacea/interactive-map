'use client';

import { useCallback, useEffect, useState } from 'react';
import { usePresencePolling } from '@/hooks/use-presence-polling';
import { updatePresence } from '@/actions/presence';
import type { PresenceData } from '@/lib/presence';

interface UsePresenceOptions {
  worldId: string;
  userId: string;
  userName: string;
  userImage?: string | null;
  onUserJoined?: (userId: string, info: PresenceData) => void;
  onUserLeft?: (userId: string) => void;
  enabled?: boolean;
}

export function usePresence({
  worldId,
  userId,
  userName,
  userImage,
  onUserJoined,
  onUserLeft,
  enabled = true,
}: UsePresenceOptions) {
  const { sessionId, presenceUsers, updateMyPresence } = usePresencePolling({
    worldId,
    userId,
    userName,
    userImage,
    enabled,
    onUserJoined,
    onUserLeft,
  });

  const [myPresence, setMyPresence] = useState<Partial<PresenceData>>({
    userId,
    userName,
    userImage,
  });

  const updateMyCursor = useCallback(
    (cursorX: number, cursorY: number) => {
      setMyPresence(prev => ({ ...prev, cursorX, cursorY }));
      updateMyPresence({ cursorX, cursorY });
    },
    [updateMyPresence],
  );

  const updateMyViewport = useCallback(
    (viewport: PresenceData['viewport']) => {
      setMyPresence(prev => ({ ...prev, viewport }));
      updateMyPresence({ viewport: viewport as any });
    },
    [updateMyPresence],
  );

  const updateMySelection = useCallback(
    (selectedPinId: string | null) => {
      setMyPresence(prev => ({ ...prev, selectedPinId }));
      updateMyPresence({ selectedPinId });
    },
    [updateMyPresence],
  );

  return {
    isConnected: true,
    presenceUsers,
    myPresence,
    sessionId,
    updateMyCursor,
    updateMyViewport,
    updateMySelection,
  };
}
