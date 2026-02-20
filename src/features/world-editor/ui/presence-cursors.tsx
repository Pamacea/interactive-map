'use client';

import { memo } from 'react';
import { UserCursor } from '@/components/presence/ui/user-cursor';
import { usePresence } from '@/components/presence/logic/use-presence';
import { useSession } from 'next-auth/react';

interface PresenceCursorsProps {
  worldId: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

/**
 * Renders other users' cursors on the map
 */
export const PresenceCursors = memo<PresenceCursorsProps>(function PresenceCursors({ worldId, containerRef }) {
  const _session = useSession();
  const user = session?.user;

  const { presenceUsers } = usePresence({
    worldId,
    userId: user?.id || '',
    userName: user?.name || 'Anonymous',
    userImage: user?.image,
    enabled: !!session?.user && !!worldId,
  });

  // Don't render if no container or no other users
  if (!containerRef.current || Object.keys(presenceUsers).length === 0) {
    return null;
  }

  const container = containerRef.current;

  return (
    <>
      {Object.entries(presenceUsers).map(([userId, data]) => {
        // Skip if no cursor position or it's the current user
        if (data.cursorX === undefined || data.cursorY === undefined || userId === user?.id) {
          return null;
        }

        return (
          <UserCursor
            key={userId}
            userId={userId}
            data={data}
            mapContainer={container}
          />
        );
      })}
    </>
  );
});
