'use client';

import * as React from 'react';
import { memo } from 'react';
import {
  MessageSquare,
  X,
  Reply,
  Check,
  Undo,
  Edit2,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { useEventCapture } from '@/shared/hooks/use-event-capture';
import type { CommentWithUser } from '@/actions/comments';
import { useCommentsStore } from '@/features/use-comments-store';
import { CommentForm } from './comment-form';
import { stopPropagation } from '@/shared/lib/event-manager';

// Simple utility to format time ago
function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
  };

  if (seconds >= intervals.year) {
    const years = Math.floor(seconds / intervals.year);
    return `${years}y ago`;
  }
  if (seconds >= intervals.month) {
    const months = Math.floor(seconds / intervals.month);
    return `${months}mo ago`;
  }
  if (seconds >= intervals.week) {
    const weeks = Math.floor(seconds / intervals.week);
    return `${weeks}w ago`;
  }
  if (seconds >= intervals.day) {
    const days = Math.floor(seconds / intervals.day);
    return `${days}d ago`;
  }
  if (seconds >= intervals.hour) {
    const hours = Math.floor(seconds / intervals.hour);
    return `${hours}h ago`;
  }
  if (seconds >= intervals.minute) {
    const minutes = Math.floor(seconds / intervals.minute);
    return `${minutes}m ago`;
  }
  return 'just now';
}

interface CommentPopupProps {
  comment: CommentWithUser;
  worldId: string;
  onClose: () => void;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onToggleResolved?: (id: string, resolved: boolean) => void;
}

export const CommentPopup = memo<CommentPopupProps>(function CommentPopup({
  comment,
  worldId,
  onClose,
  onUpdate,
  onDelete,
  onToggleResolved,
}) {
  const popupRef = React.useRef<HTMLDivElement>(null);
  const _replyingToId = useCommentsStore((s) => s.replyingToId);
  const editingId = useCommentsStore((s) => s.editingId);
  const setReplyingTo = useCommentsStore((s) => s.setReplyingTo);
  const setEditing = useCommentsStore((s) => s.setEditing);
  const setSelectedComment = useCommentsStore((s) => s.setSelectedComment);

  const isReplying = replyingToId === comment.id;
  const isEditing = editingId === comment.id;
  const canEdit = !comment.parentId; // Can only edit top-level comments

  // Capture events to prevent map interactions
  useEventCapture({
    scope: 'popup',
    onEscape: onClose,
  });

  const currentUser = { id: 'current-user-id' }; // Would come from auth context
  const isOwner = comment.user.id === currentUser.id;

  const handleReply = () => {
    setReplyingTo(comment.id);
  };

  const handleEdit = () => {
    if (canEdit) {
      setEditing(comment.id);
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete(comment.id);
    }
    onClose();
  };

  const handleToggleResolved = () => {
    if (onToggleResolved) {
      onToggleResolved(comment.id, !comment.isResolved);
    }
  };

  return (
    <div
      ref={popupRef}
      role="dialog"
      aria-modal="true"
      className={cn(
        'relative z-50 w-80 rounded-sm border-2 shadow-2xl',
        'font-display text-sm',
        'animate-in fade-in zoom-in-95 duration-200',
        comment.isResolved
          ? 'border-bone-dark/30 bg-obsidian/90 opacity-75'
          : 'border-accent-gold/50 bg-obsidian/95 backdrop-blur-md'
      )}
      onClick={stopPropagation}
      onMouseUp={stopPropagation}
    >
      {/* Ornate gold corners */}
      {!comment.isResolved && (
        <>
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-accent-gold/40 pointer-events-none" />
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-accent-gold/40 pointer-events-none" />
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-accent-gold/40 pointer-events-none" />
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-accent-gold/40 pointer-events-none" />
        </>
      )}

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-iron/50">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-accent-gold/80">
            <MessageSquare size={14} />
          </span>
          <h3 className="text-xs font-display font-semibold text-bone uppercase tracking-wide truncate">
            {comment.isResolved ? 'Resolved Comment' : 'Comment'}
          </h3>
        </div>
        <button
          onClick={onClose}
          type="button"
          className="p-1 text-bone-dark/60 hover:text-blood hover:bg-blood/10 rounded-sm transition-colors"
          aria-label="Close"
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-3">
        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center">
            {comment.user.name ? (
              <span className="text-xs font-medium text-bone">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            ) : null}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-bone truncate">
              {comment.user.name || 'Anonymous'}
            </p>
            <p className="text-[10px] text-bone-dark/60">
              {formatTimeAgo(new Date(comment.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Comment content */}
        {isEditing ? (
          <CommentForm
            worldId={worldId}
            parentId={comment.parentId || undefined}
            pinId={comment.pinId || undefined}
            latitude={comment.latitude || undefined}
            longitude={comment.longitude || undefined}
            initialContent={comment.content}
            editId={comment.id}
            onSubmit={(content) => {
              if (onUpdate) {
                onUpdate(comment.id, content);
              }
              setEditing(null);
            }}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div className="bg-slate-800/50 rounded-sm p-2.5 border border-iron/30">
            <p className="text-sm text-bone/90 whitespace-pre-wrap break-words">
              {comment.content}
            </p>
          </div>
        )}

        {/* Actions */}
        {!isEditing && (
          <div className="flex items-center justify-between pt-2 border-t border-iron/30">
            <div className="flex items-center gap-1">
              <button
                onClick={handleReply}
                type="button"
                className={cn(
                  'p-1.5 rounded-sm transition-all duration-200',
                  'text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10',
                  'flex items-center gap-1 text-xs'
                )}
              >
                <Reply size={12} />
                <span>Reply</span>
              </button>

              {canEdit && isOwner && (
                <button
                  onClick={handleEdit}
                  type="button"
                  className={cn(
                    'p-1.5 rounded-sm transition-all duration-200',
                    'text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10',
                    'flex items-center gap-1 text-xs'
                  )}
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>
              )}

              {(isOwner || canEdit) && (
                <button
                  onClick={handleToggleResolved}
                  type="button"
                  className={cn(
                    'p-1.5 rounded-sm transition-all duration-200',
                    comment.isResolved
                      ? 'text-bone-dark/60 hover:text-accent-gold hover:bg-accent-gold/10'
                      : 'text-status-success hover:text-status-success-dark hover:bg-status-success/10',
                    'flex items-center gap-1 text-xs'
                  )}
                  title={comment.isResolved ? 'Reopen' : 'Resolve'}
                >
                  {comment.isResolved ? (
                    <>
                      <Undo size={12} />
                      <span>Reopen</span>
                    </>
                  ) : (
                    <>
                      <Check size={12} />
                      <span>Resolve</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {isOwner && (
              <button
                onClick={handleDelete}
                type="button"
                className={cn(
                  'p-1.5 rounded-sm transition-all duration-200',
                  'text-bone-dark/60 hover:text-blood hover:bg-blood/10'
                )}
                title="Delete"
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
        )}

        {/* Replies */}
        {comment.replies.length > 0 && !isEditing && (
          <div className="pt-2 border-t border-iron/30">
            <button
              type="button"
              className={cn(
                'flex items-center gap-2 text-xs text-bone-dark/60 hover:text-bone transition-colors w-full'
              )}
            >
              <ChevronDown size={14} className="transition-transform" />
              <span>{comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
            </button>

            <div className="mt-2 space-y-2">
              {comment.replies.slice(0, 2).map((reply) => (
                <div key={reply.id} className="flex gap-2 p-2 bg-slate-800/30 rounded-sm">
                  <div className="w-5 h-5 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center">
                    <span className="text-[10px] font-medium text-bone">
                      {reply.user.name?.charAt(0).toUpperCase() || '?'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-bone truncate">
                        {reply.user.name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-bone-dark/60">
                        {formatTimeAgo(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-xs text-bone/80 mt-0.5 line-clamp-2">
                      {reply.content}
                    </p>
                  </div>
                </div>
              ))}
              {comment.replies.length > 2 && (
                <p className="text-xs text-bone-dark/60 text-center">
                  +{comment.replies.length - 2} more {comment.replies.length - 2 === 1 ? 'reply' : 'replies'}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Reply form */}
        {isReplying && !isEditing && (
          <div className="pt-2 border-t border-iron/30">
            <CommentForm
              worldId={worldId}
              parentId={comment.id}
              onCancel={() => setReplyingTo(null)}
              onSubmit={() => {
                setReplyingTo(null);
                setSelectedComment(null);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
});
