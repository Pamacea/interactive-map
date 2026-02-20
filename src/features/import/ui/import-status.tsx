'use client';

import * as React from 'react';
import { FileText, CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { ImportJob } from '@/shared/hooks/use-import';

interface ImportStatusItemProps {
  job: ImportJob;
}

function ImportStatusItem({ job }: ImportStatusItemProps) {
  const statusConfig = {
    PENDING: {
      icon: <Clock className="w-4 h-4 text-bone-dark/40" />,
      label: 'Pending',
      className: 'text-bone-dark/50',
    },
    PROCESSING: {
      icon: <Loader2 className="w-4 h-4 animate-spin text-accent-gold" />,
      label: 'Processing',
      className: 'text-accent-gold',
    },
    COMPLETED: {
      icon: <CheckCircle className="w-4 h-4 text-green-400" />,
      label: 'Completed',
      className: 'text-green-400',
    },
    FAILED: {
      icon: <XCircle className="w-4 h-4 text-blood" />,
      label: 'Failed',
      className: 'text-blood',
    },
    CANCELLED: {
      icon: <XCircle className="w-4 h-4 text-bone-dark/40" />,
      label: 'Cancelled',
      className: 'text-bone-dark/40',
    },
  };

  const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.PENDING;

  return (
    <div className="rounded-sm border border-iron bg-obsidian/40 p-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {config.icon}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-bone truncate">
              {job.filename || job.sourceType}
            </p>
            <p className="text-xs text-bone-dark/50">
              {new Date(job.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {job.status === 'COMPLETED' && job.processed && (
          <div className="text-right text-xs text-bone-dark/60 ml-2">
            {job.processed.pins > 0 && <div>{job.processed.pins} pins</div>}
            {job.processed.layers > 0 && <div>{job.processed.layers} layers</div>}
          </div>
        )}
      </div>

      {job.status === 'FAILED' && job.error && (
        <p className="mt-2 text-xs text-blood">{job.error}</p>
      )}

      {job.progress > 0 && job.progress < 100 && (
        <div className="mt-2">
          <div className="h-1 rounded-full bg-obsidian overflow-hidden">
            <div
              className="h-full bg-accent-gold transition-all duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

interface ImportStatusProps {
  jobs: ImportJob[];
  isLoading?: boolean;
}

export function ImportStatus({ jobs, isLoading }: ImportStatusProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-bone-dark/70">Recent Imports</h3>

      {isLoading ? (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="w-5 h-5 animate-spin text-accent-gold" />
        </div>
      ) : !jobs || jobs.length === 0 ? (
        <div className="text-center py-8">
          <FileText className="w-8 h-8 text-bone-dark/30 mx-auto mb-2" />
          <p className="text-sm text-bone-dark/50">No imports yet</p>
          <p className="text-xs text-bone-dark/40 mt-1">
            Import data from other tools
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <ImportStatusItem key={job.id} job={job} />
          ))}
        </div>
      )}
    </div>
  );
}
