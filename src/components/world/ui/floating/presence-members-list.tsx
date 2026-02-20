'use client';

import { useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { MembersList } from '@/components/members';
import { PresenceIndicator } from '@/components/presence';
import { usePresence } from '@/components/presence/logic/use-presence';
import type { PresenceUsers } from '@/lib/presence';

interface PresenceMembersListProps {
  worldId: string;
  worldOwnerId: string;
  currentUserId: string;
}

/**
 * Wrapper around MembersList that adds real-time presence tracking
 */
export function PresenceMembersList({
  worldId,
  worldOwnerId,
  currentUserId,
}: PresenceMembersListProps) {
  const _session = useSession();
  const user = session?.user;

  // Only enable presence if authenticated
  const { presenceUsers } = usePresence({
    worldId,
    userId: currentUserId,
    userName: user?.name || 'Anonymous',
    userImage: user?.image,
    enabled: !!session?.user,
  });

  // Convert presence users to the format expected by PresenceIndicator
  const presenceData = useMemo(() => {
    const data: PresenceUsers = {};
    Object.entries(presenceUsers).forEach(([id, info]) => {
      data[id] = {
        userId: info.userId,
        userName: info.userName,
        userImage: info.userImage,
      };
    });
    return data;
  }, [presenceUsers]);

  return (
    <div className="space-y-4">
      {/* Real-time presence indicator */}
      <PresenceIndicator
        users={presenceData}
        currentUserId={currentUserId}
        maxVisible={4}
      />

      {/* Divider */}
      <div className="h-px bg-border-subtle" />

      {/* Regular members list */}
      <MembersList
        worldId={worldId}
        worldOwnerId={worldOwnerId}
        currentUserId={currentUserId}
      />
    </div>
  );
}
