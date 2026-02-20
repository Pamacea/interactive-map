"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { usePresence } from "@/features/presence/logic/use-presence";
import { PresenceIndicator } from "@/features/presence";

interface PresenceMembersListProps {
  worldId: string;
  worldOwnerId: string;
  currentUserId: string;
}

export function PresenceMembersList({
  worldId,
  _worldOwnerId,
  _currentUserId,
}: PresenceMembersListProps) {
  const _session = useSession();
  const presenceUsers = usePresence(worldId);

  const members = useMemo(() => {
    if (!presenceUsers) return [];
    return Object.entries(presenceUsers).map(([userId, data]) => ({
      userId,
      name: data.name || "Anonymous",
      avatar: data.avatar,
      cursor: data.cursor,
    }));
  }, [presenceUsers]);

  if (members.length === 0) return null;

  return (
    <div className="flex flex-col gap-2">
      {members.map((member) => (
        <div
          key={member.userId}
          className="flex items-center gap-2 p-2 bg-background-elevated rounded"
        >
          <PresenceIndicator
            userId={member.userId}
            worldId={worldId}
            showAvatar
          />
          <span className="text-sm text-text-primary">{member.name}</span>
        </div>
      ))}
    </div>
  );
}
