'use client';

import * as React from 'react';
import { Send, X } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { createComment, updateComment } from '@/features/comments/actions';
import { useCommentsStore } from '@/features/use-comments-store';

interface CommentFormProps {
  worldId: string;
  parentId?: string;
  pinId?: string;
  latitude?: number;
  longitude?: number;
  initialContent?: string;
  editId?: string;
  onSubmit?: (content: string) => void;
  onCancel?: () => void;
}

export function CommentForm({
  worldId,
  parentId,
  pinId,
  latitude,
  longitude,
  initialContent = '',
  editId,
  onSubmit,
  onCancel,
}: CommentFormProps) {
  const [content, setContent] = React.useState(initialContent);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const maxLength = 5000;

  const _addComment = useCommentsStore((s) => s.addComment);
  const _updateCommentStore = useCommentsStore((s) => s.updateComment);

  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const trimmed = content.trim();
    if (!trimmed) {
      setError('Comment cannot be empty');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      if (editId) {
        const _result = await updateComment({
          commentId: editId,
          content: trimmed,
        });

        if (result.success && result.data) {
          updateCommentStore(editId, result.data.comment);
          onSubmit?.(trimmed);
        } else {
          setError(result.error?.message || 'Failed to update comment');
        }
      } else {
        const _result = await createComment({
          worldId,
          pinId,
          latitude,
          longitude,
          content: trimmed,
          parentId,
        });

        if (result.success && result.data) {
          addComment(result.data.comment);
          setContent('');
          onSubmit?.(trimmed);
        } else {
          setError(result.error?.message || 'Failed to create comment');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleSubmit(e);
    }
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
    }
  };

  const remaining = maxLength - content.length;
  const isNearLimit = remaining < 100;
  const isAtLimit = remaining <= 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={parentId ? 'Write a reply...' : 'Add a comment...'}
          disabled={isSubmitting}
          className={cn(
            'w-full px-3 py-2 min-h-[80px] max-h-[200px]',
            'bg-obsidian/60 rounded-sm border border-input',
            'text-bone placeholder:text-bone-dark/40',
            'focus:outline-none focus:ring-2 focus:ring-accent-gold/50 focus:border-accent-gold/50',
            'resize-none transition-shadow duration-200',
            isSubmitting && 'opacity-50'
          )}
          maxLength={maxLength}
        />

        {/* Character count */}
        <div className={cn(
          'absolute bottom-2 right-2 text-[10px] transition-colors',
          isAtLimit ? 'text-blood' : isNearLimit ? 'text-status-warning' : 'text-bone-dark/50'
        )}>
          {remaining}
        </div>
      </div>

      {error && (
        <p className="text-xs text-blood">{error}</p>
      )}

      <div className="flex items-center justify-between">
        <p className="text-[10px] text-bone-dark/50">
          Ctrl+Enter to send
        </p>

        <div className="flex items-center gap-2">
          {onCancel && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onCancel();
              }}
              disabled={isSubmitting}
              className={cn(
                'px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200',
                'text-bone-dark/60 hover:text-bone hover:bg-stone/20',
                'disabled:opacity-50 disabled:cursor-not-allowed'
              )}
            >
              <X size={14} className="mr-1" />
              Cancel
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting || !content.trim() || isAtLimit}
            className={cn(
              'px-3 py-1.5 rounded-sm text-xs font-medium transition-all duration-200',
              'bg-accent-gold text-obsidian',
              'hover:bg-accent-gold-light hover:shadow-glow-medium',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'flex items-center gap-1'
            )}
          >
            <Send size={12} />
            {editId ? 'Update' : 'Send'}
          </button>
        </div>
      </div>
    </form>
  );
}
