'use client';

import * as React from 'react';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Version } from '@/hooks/use-versions';

interface VersionListProps {
  versions: Version[];
  selectedId?: string | null;
  onSelect?: (version: Version) => void;
  onRestore?: (versionId: string) => void;
  onDelete?: (versionId: string) => void;
  canModify?: boolean;
}

export function VersionList({
  versions,
  selectedId,
  onSelect,
  onRestore,
  onDelete,
  canModify = false,
}: VersionListProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Clock className="w-12 h-12 text-bone-dark/40 mb-3" />
        <p className="text-bone-dark/60">No versions saved yet</p>
        <p className="mt-2 text-xs text-bone-dark/40">
          Create a version to save your world state
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {versions.map((version) => (
        <div
          key={version.id}
          className={cn(
            'group relative rounded-sm border p-3 transition-all',
            selectedId === version.id
              ? 'border-accent-gold bg-accent-gold/10'
              : 'border-iron bg-obsidian/40 hover:border-accent-gold/50'
          )}
        >
          <div className="flex items-start gap-3">
            {/* Version Number Badge */}
            <div className="flex-shrink-0">
              <div
                className={cn(
                  'flex h-10 w-10 items-center justify-center rounded-sm text-sm font-semibold font-display',
                  version.isAuto
                    ? 'bg-obsidian text-bone-dark/60'
                    : 'bg-gradient-to-br from-accent-gold to-accent-gold-dark text-obsidian'
                )}
              >
                v{version.version}
              </div>
            </div>

            {/* Content */}
            <button
              onClick={() => onSelect?.(version)}
              className="flex-1 text-left"
            >
              <div className="flex items-center gap-2">
                <h4 className="font-semibold text-bone">
                  {version.title || `Version ${version.version}`}
                </h4>
                {version.isAuto && (
                  <span className="rounded-sm bg-obsidian px-1.5 py-0.5 text-xs text-bone-dark/50 border border-iron">
                    Auto
                  </span>
                )}
              </div>

              {version.changelog && (
                <p className="mt-1 line-clamp-2 text-sm text-bone-dark/60">
                  {version.changelog}
                </p>
              )}

              <div className="mt-2 flex items-center gap-3 text-xs text-bone-dark/40">
                <div className="flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-obsidian border border-iron flex items-center justify-center">
                    <span className="text-[10px] font-semibold text-accent-gold">
                      {version.user.name?.[0] || '?'}
                    </span>
                  </div>
                  <span>{version.user.name ?? 'Unknown'}</span>
                </div>
                <span>-</span>
                <span>{new Intl.RelativeTimeFormat('en', { numeric: 'auto' }).format(new Date(version.createdAt), Date.now())}</span>
              </div>
            </button>

            {/* Actions */}
            {canModify && (
              <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRestore?.(version.id);
                  }}
                  className="rounded-sm p-1.5 text-accent-gold hover:bg-accent-gold/10 transition-colors"
                  title="Restore this version"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete?.(version.id);
                  }}
                  className="rounded-sm p-1.5 text-bone-dark/40 hover:text-blood hover:bg-blood/10 transition-colors"
                  title="Delete version"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
