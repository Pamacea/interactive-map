'use client';

import { useQuery } from '@tanstack/react-query';
import { getWorldComments, getCommentStats } from '@/features/comments/actions';
import type { CommentWithUser } from '@/features/comments/actions';

export function useComments(worldId: string, pinId?: string, enabled = true) {
  return useQuery<CommentWithUser[]>({
    queryKey: ['comments', worldId, pinId],
    queryFn: async () => {
      try {
        const _result = await getWorldComments({ worldId, pinId });
        if (!result.success) {
          // For auth errors, return empty array
          // This allows the UI to show "No comments" instead of crashing
          if (result.error?.code === 'AUTHENTICATION_ERROR') {
            return [];
          }
          throw new Error(result.error?.message || 'Failed to fetch comments');
        }
        return result.data.comments;
      } catch (error: unknown) {
        // Check for authentication error in the caught exception
        const err = error as { code?: string; message?: string };
        if (err.code === 'AUTHENTICATION_ERROR' ||
            err.message?.includes('Authentication') ||
            err.message?.includes('logged in')) {
          return [];
        }
        throw error;
      }
    },
    enabled: enabled && !!worldId,
    refetchInterval: 15000,
    retry: (failureCount, error) => {
      // Don't retry on authentication errors
      const errorMsg = error?.message || String(error);
      if (errorMsg.includes('Authentication') || errorMsg.includes('Unauthorized') || errorMsg.includes('logged in')) {
        return false;
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    staleTime: 10000, // Consider data fresh for 10 seconds
  });
}

export function useCommentStats(worldId: string, pinId?: string) {
  return useQuery({
    queryKey: ['comment-stats', worldId, pinId],
    queryFn: async () => {
      try {
        const _result = await getCommentStats({ worldId, pinId });
        if (!result.success) {
          if (result.error?.code === 'AUTHENTICATION_ERROR') {
            return { total: 0, unresolved: 0 };
          }
          throw new Error(result.error?.message || 'Failed to fetch comment stats');
        }
        return result.data;
      } catch (error: unknown) {
        const err = error as { code?: string; message?: string };
        if (err.code === 'AUTHENTICATION_ERROR' ||
            err.message?.includes('Authentication')) {
          return { total: 0, unresolved: 0 };
        }
        throw error;
      }
    },
    enabled: !!worldId,
    refetchInterval: 15000,
    staleTime: 10000,
  });
}
