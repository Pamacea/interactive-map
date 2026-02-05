'use client';

import * as React from 'react';
import { memo } from 'react';
import {
  MessageSquare,
  Reply,
  Check,
  Undo,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCommentsStore } from '@/store/use-comments-store';
import { CommentForm } from './comment-form';
import { stopPropagation } from '@/lib/event-manager';
import type { CommentWithUser } from '@/actions/comments';

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

interface CommentThreadProps {
  comments: CommentWithUser[];
  worldId: string;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onToggleResolved?: (id: string, resolved: boolean) => void;
}

export const CommentThread = memo<CommentThreadProps>(function CommentThread({
  comments,
  worldId,
  onUpdate,
  onDelete,
  onToggleResolved,
}) {
  const showResolved = useCommentsStore((s) => s.showResolved);
  const toggleShowResolved = useCommentsStore((s) => s.toggleShowResolved);

  const visibleComments = showResolved
    ? comments
    : comments.filter((c) => !c.isResolved);

  if (visibleComments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-slate-800/50 flex items-center justify-center mb-4">
          <MessageSquare size={24} className="text-bone-dark/40" />
        </div>
        <p className="text-sm text-bone-dark/60">No comments yet</p>
        <p className="text-xs text-bone-dark/40 mt-1">
          Add a comment to start the discussion
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Filter toggle */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-iron/30">
        <span className="text-xs text-bone-dark/60">
          {visibleComments.length} {visibleComments.length === 1 ? 'comment' : 'comments'}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleShowResolved();
          }}
          type="button"
          className={cn(
            'text-xs flex items-center gap-1 transition-colors',
            showResolved
              ? 'text-accent-gold'
              : 'text-bone-dark/60 hover:text-bone'
          )}
        >
          {showResolved ? (
            <>
              <Check size={12} />
              Showing All
            </>
          ) : (
            <>
              <Undo size={12} />
              Show Resolved
            </>
          )}
        </button>
      </div>

      {visibleComments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          worldId={worldId}
          onUpdate={onUpdate}
          onDelete={onDelete}
          onToggleResolved={onToggleResolved}
        />
      ))}
    </div>
  );
});

interface CommentItemProps {
  comment: CommentWithUser;
  worldId: string;
  onUpdate?: (id: string, content: string) => void;
  onDelete?: (id: string) => void;
  onToggleResolved?: (id: string, resolved: boolean) => void;
}

const CommentItem = memo<CommentItemProps>(function CommentItem({
  comment,
  worldId,
  onUpdate,
  onDelete,
  onToggleResolved,
}) {
  const [showReplies, setShowReplies] = React.useState(false);
  const [isEditing, setIsEditing] = React.useState(false);
  const [isReplying, setIsReplying] = React.useState(false);

  const replyingToId = useCommentsStore((s) => s.replyingToId);
  const setReplyingTo = useCommentsStore((s) => s.setReplyingTo);
  const setEditing = useCommentsStore((s) => s.setEditing);
  const addComment = useCommentsStore((s) => s.addComment);
  const updateCommentStore = useCommentsStore((s) => s.updateComment);

  const currentUser = { id: 'current-user-id' };
  const isOwner = comment.user.id === currentUser.id;
  const canEdit = !comment.parentId;
  const hasReplies = comment.replies.length > 0;

  const handleReply = () => {
    setIsReplying(true);
    setReplyingTo(comment.id);
  };

  const handleEdit = () => {
    setIsEditing(true);
    if (canEdit) {
      setEditing(comment.id);
    }
  };

  const handleSubmitEdit = async (content: string) => {
    if (onUpdate) {
      await onUpdate(comment.id, content);
    }
    setIsEditing(false);
  };

  const handleSubmitReply = async () => {
    setIsReplying(false);
    setShowReplies(true);
  };

  const handleToggleResolved = async () => {
    if (onToggleResolved) {
      await onToggleResolved(comment.id, !comment.isResolved);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      await onDelete(comment.id);
    }
  };

  return (
    <div
      className={cn(
        'py-3 px-3 border-b border-iron/30 last:border-b-0',
        'hover:bg-stone/20 transition-colors duration-150',
        comment.isResolved && 'opacity-60'
      )}
    >
      {/* Main comment */}
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-slate-700 border border-iron flex items-center justify-center">
            {comment.user.name ? (
              <span className="text-xs font-medium text-bone">
                {comment.user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <MessageSquare size={14} className="text-bone-dark/40" />
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-medium text-bone truncate">
              {comment.user.name || 'Anonymous'}
            </span>
            <span className="text-xs text-bone-dark/50">
              {formatTimeAgo(new Date(comment.createdAt), { addSuffix: true })}
            </span>
            {comment.isResolved && (
              <span className="flex items-center gap-1 text-[10px] text-status-success bg-status-success/10 px-1.5 py-0.5 rounded-sm">
                <Check size={10} />
                Resolved
              </span>
            )}
          </div>

          {/* Comment text or edit form */}
          {isEditing ? (
            <CommentForm
              worldId={worldId}
              parentId={comment.parentId || undefined}
              pinId={comment.pinId || undefined}
              latitude={comment.latitude || undefined}
              longitude={comment.longitude || undefined}
              initialContent={comment.content}
              editId={comment.id}
              onSubmit={handleSubmitEdit}
              onCancel={() => {
                setIsEditing(false);
                setEditing(null);
              }}
            />
          ) : (
            <div className={cn(
              'bg-slate-800/50 rounded-sm p-2.5 border border-iron/30',
              comment.isResolved && 'border-status-success/30'
            )}>
              <p className="text-sm text-bone/90 whitespace-pre-wrap break-words">
                {comment.content}
              </p>
            </div>
          )}

          {/* Actions */}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-2">
              <button
                onClick={handleReply}
                type="button"
                className={cn(
                  'flex items-center gap-1 text-xs text-bone-dark/60 hover:text-accent-gold',
                  'transition-colors duration-150'
                )}
              >
                <Reply size={12} />
                Reply
              </button>

              {canEdit && isOwner && (
                <button
                  onClick={handleEdit}
                  type="button"
                  className={cn(
                    'flex items-center gap-1 text-xs text-bone-dark/60 hover:text-accent-gold',
                    'transition-colors duration-150'
                  )}
                >
                  <Edit2 size={12} />
                  Edit
                </button>
              )}

              {canEdit && (
                <button
                  onClick={handleToggleResolved}
                  type="button"
                  className={cn(
                    'flex items-center gap-1 text-xs transition-colors duration-150',
                    comment.isResolved
                      ? 'text-bone-dark/60 hover:text-bone'
                      : 'text-status-success hover:text-status-success-dark'
                  )}
                >
                  {comment.isResolved ? (
                    <>
                      <Undo size={12} />
                      Reopen
                    </>
                  ) : (
                    <>
                      <Check size={12} />
                      Resolve
                    </>
                  )}
                </button>
              )}

              {isOwner && (
                <button
                  onClick={handleDelete}
                  type="button"
                  className={cn(
                    'flex items-center gap-1 text-xs text-bone-dark/60 hover:text-blood',
                    'transition-colors duration-150'
                  )}
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              )}

              {hasReplies && (
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  type="button"
                  className={cn(
                    'flex items-center gap-1 text-xs text-bone-dark/60 hover:text-bone ml-auto',
                    'transition-colors duration-150'
                  )}
                >
                  {showReplies ? (
                    <>
                      <ChevronUp size={12} />
                      Hide
                    </>
                  ) : (
                    <>
                      <ChevronDown size={12} />
                      {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                    </>
                  )}
                </button>
              )}
            </div>
          )}

          {/* Replies */}
          {hasReplies && showReplies && !isEditing && (
            <div className="mt-3 space-y-2 pl-3 border-l-2 border-iron/30">
              {comment.replies.map((reply) => (
                <div key={reply.id} className="flex gap-2">
                  <div className="flex-shrink-0">
                    <div className="w-6 h-6 rounded-full bg-slate-700 border border-iron flex items-center justify-center">
                      <span className="text-[10px] font-medium text-bone">
                        {reply.user.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-bone truncate">
                        {reply.user.name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-bone-dark/50">
                        {formatTimeAgo(new Date(reply.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                    <div className="bg-slate-800/30 rounded-sm p-2 border border-iron/20">
                      <p className="text-xs text-bone/80 whitespace-pre-wrap break-words">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Reply form */}
          {isReplying && !isEditing && (
            <div className="mt-3">
              <CommentForm
                worldId={worldId}
                parentId={comment.id}
                onCancel={() => {
                  setIsReplying(false);
                  setReplyingTo(null);
                }}
                onSubmit={handleSubmitReply}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
