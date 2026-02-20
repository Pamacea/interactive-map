'use client';

import { memo } from 'react';
import type { PresenceData } from '@/shared/lib/presence';

interface PresenceIndicatorProps {
  users: Record<string, PresenceData>;
  currentUserId: string;
  maxVisible?: number;
}

export const PresenceIndicator = memo<PresenceIndicatorProps>(
  function PresenceIndicator({ users, currentUserId, maxVisible = 4 }) {
    const otherUsers = Object.values(users).filter(u => u.userId !== currentUserId);
    const visibleUsers = otherUsers.slice(0, maxVisible);
    const remainingCount = Math.max(0, otherUsers.length - maxVisible);

    if (otherUsers.length === 0) {
      return null;
    }

    return (
      <div className="flex items-center gap-1">
        <div className="flex -space-x-2">
          {visibleUsers.map(user => (
            <UserAvatar
              key={user.userId}
              name={user.userName}
              image={user.userImage}
            />
          ))}
        </div>
        {remainingCount > 0 && (
          <div className="flex items-center justify-center w-8 h-8 text-xs font-medium rounded-full bg-slate-800 text-slate-300 border border-border-subtle">
            +{remainingCount}
          </div>
        )}
        <div className="flex items-center gap-1.5 ml-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </span>
          <span className="text-xs text-slate-400">
            {otherUsers.length} {otherUsers.length === 1 ? 'viewer' : 'viewers'}
          </span>
        </div>
      </div>
    );
  },
);

interface UserAvatarProps {
  name: string;
  image?: string | null;
}

const UserAvatar = memo<UserAvatarProps>(function UserAvatar({ name, image }) {
  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className="relative flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-900 overflow-hidden"
      title={name}
    >
      {image ? (
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      ) : (
        <span className="text-xs font-medium text-slate-200">{initials}</span>
      )}
    </div>
  );
});
