'use client';

import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { FloatingPanel } from '@/components/world/ui/floating/floating-panel';
import { CommentThread } from '@/components/comments/ui/comment-thread';
import { CommentForm } from '@/components/comments/ui/comment-form';
import { useQueryClient } from '@tanstack/react-query';
import { useComments } from '@/hooks/use-comments';
import { createComment, updateComment, deleteComment, toggleCommentResolved } from '@/actions/comments';
import { useCommentsStore } from '@/store/use-comments-store';

interface CommentsModuleProps {
  worldId: string;
  pinId?: string;
}

export function CommentsModule({ worldId, pinId }: CommentsModuleProps) {
  const { data: comments, isLoading, error } = useComments(worldId, pinId);
  const queryClient = useQueryClient();
  const addComment = useCommentsStore((s) => s.addComment);
  const updateCommentStore = useCommentsStore((s) => s.updateComment);
  const removeComment = useCommentsStore((s) => s.removeComment);

  const handleSubmit = async () => {
    queryClient.invalidateQueries({ queryKey: ['comments', worldId] });
  };

  const handleUpdate = async (id: string, content: string) => {
    const result = await updateComment({ commentId: id, content });
    if (result.success && result.data) {
      updateCommentStore(id, result.data.comment);
      await handleSubmit();
    }
  };

  const handleDelete = async (id: string) => {
    const result = await deleteComment({ commentId: id });
    if (result.success) {
      removeComment(id);
      await handleSubmit();
    }
  };

  const handleToggleResolved = async (id: string, resolved: boolean) => {
    const result = await toggleCommentResolved({ commentId: id, resolved });
    if (result.success && result.data) {
      updateCommentStore(id, result.data.comment);
      await handleSubmit();
    }
  };

  // Show error state only for non-auth errors
  const isError = error && !(error as any)?.message?.includes('Authentication');

  return (
    <FloatingPanel
      panelId="comments"
      title="Comments"
      icon={<MessageSquare className="w-4 h-4" />}
    >
      {isError ? (
        <div className="p-4 text-center">
          <p className="text-sm text-blood">Failed to load comments</p>
          <p className="text-xs text-bone-dark/60 mt-1">
            Please try refreshing the page
          </p>
        </div>
      ) : (
        <CommentsContent
          worldId={worldId}
          pinId={pinId}
          comments={comments || []}
          isLoading={isLoading}
          onSubmit={handleSubmit}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onToggleResolved={handleToggleResolved}
        />
      )}
    </FloatingPanel>
  );
}

function CommentsContent({
  worldId,
  pinId,
  comments,
  isLoading,
  onSubmit,
  onUpdate,
  onDelete,
  onToggleResolved,
}: {
  worldId: string;
  pinId?: string;
  comments: typeof comments;
  isLoading?: boolean;
  onSubmit?: () => void;
  onUpdate?: (id: string, content: string) => Promise<void>;
  onDelete?: (id: string) => Promise<void>;
  onToggleResolved?: (id: string, resolved: boolean) => Promise<void>;
}) {
  return (
    <div className="space-y-3">
      {/* New comment form */}
      <div className="px-3 pt-3">
        <CommentForm
          worldId={worldId}
          pinId={pinId}
          onSubmit={onSubmit}
        />
      </div>

      {/* Comments list */}
      <CommentThread
        comments={comments || []}
        worldId={worldId}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onToggleResolved={onToggleResolved}
      />

      {isLoading && !comments?.length && <CommentsSkeleton />}
    </div>
  );
}

function CommentsSkeleton() {
  return (
    <div className="space-y-3 p-3">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800/50 animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-slate-800/50 rounded-sm animate-pulse w-1/3" />
            <div className="h-16 bg-slate-800/30 rounded-sm animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
