'use client';

import { memo } from 'react';

interface CursorFlagProps {
  name: string;
  color: string;
  image?: string | null;
}

export const CursorFlag = memo<CursorFlagProps>(function CursorFlag({
  name,
  color,
  image,
}) {
  return (
    <div
      className="absolute left-5 top-4 px-2 py-0.5 rounded shadow-lg text-xs font-medium text-white whitespace-nowrap"
      style={{
        backgroundColor: color,
        borderRadius: '4px',
      }}
    >
      {image ? (
        <div className="flex items-center gap-1.5">
          <img
            src={image}
            alt={name}
            className="w-4 h-4 rounded-full"
            referrerPolicy="no-referrer"
          />
          <span>{name}</span>
        </div>
      ) : (
        <span>{name}</span>
      )}
    </div>
  );
});
