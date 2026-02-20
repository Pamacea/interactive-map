'use client';

import * as React from 'react';
import { Clock, FileText, User } from 'lucide-react';
import type { Version } from '@/features/versions/hooks/use-versions';

interface VersionDetailProps {
  version: Version;
  onClose?: () => void;
}

function formatDistanceToNow(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

export function VersionDetail({ version, onClose }: VersionDetailProps) {
  const snapshot = (version as Version & { snapshot?: { world?: { title?: string; description?: string } } }).snapshot;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-iron">
        <div>
          <h3 className="font-semibold text-bone font-display text-lg">
            {version.title || `Version ${version.version}`}
          </h3>
          <div className="flex items-center gap-2 mt-1 text-xs text-bone-dark/50">
            <span>v{version.version}</span>
            <span>-</span>
            <span>{formatDistanceToNow(new Date(version.createdAt))}</span>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-bone-dark/40 hover:text-bone transition-colors"
          >
            ×
          </button>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <User className="w-4 h-4 text-accent-gold" />
          <span className="text-bone-dark/60">Created by</span>
          <span className="text-bone">{version.user.name ?? 'Unknown'}</span>
        </div>

        {version.isAuto && (
          <div className="flex items-center gap-3 text-sm">
            <Clock className="w-4 h-4 text-bone-dark/40" />
            <span className="text-bone-dark/60">Auto-saved version</span>
          </div>
        )}

        {snapshot?.world?.title && (
          <div className="flex items-center gap-3 text-sm">
            <FileText className="w-4 h-4 text-accent-gold" />
            <span className="text-bone-dark/60">World name</span>
            <span className="text-bone">{snapshot.world.title}</span>
          </div>
        )}
      </div>

      {/* Changelog */}
      {version.changelog && (
        <div className="pt-3 border-t border-iron">
          <h4 className="text-sm font-medium text-bone-dark/80 mb-2">Changelog</h4>
          <p className="text-sm text-bone-dark/70 whitespace-pre-wrap">
            {version.changelog}
          </p>
        </div>
      )}
    </div>
  );
}
