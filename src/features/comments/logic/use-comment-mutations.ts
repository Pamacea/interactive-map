/**
 * Comments Logic - Use Comment Mutations Hook
 *
 * Custom hook for comment mutations with optimistic updates
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createComment } from "../methods/create-comment";
import { updateComment, toggleCommentResolved } from "../methods/update-comment";
import { deleteComment } from "../methods/delete-comment";
import type {
  CreateCommentInput,
  UpdateCommentInput,
  ToggleCommentResolvedInput,
} from "../methods";

// ============================================
// MUTATION HOOKS
// ============================================

interface UseCreateCommentOptions {
  onSuccess?: (data: any) => void;
  onError?: (error: Error) => void;
}

/**
 * Create a new comment
 * @param options - Mutation callbacks
 * @returns Mutation object
 */
export function useCreateComment(options?: UseCreateCommentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      const result = await createComment(input);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to create comment");
      }

      return result.data;
    },
    onSuccess: (data, variables) => {
      // Invalidate comments query for this world
      queryClient.invalidateQueries({
        queryKey: ["comments", variables.worldId],
      });

      // Invalidate comment stats
      queryClient.invalidateQueries({
        queryKey: ["comment-stats", variables.worldId],
      });

      options?.onSuccess?.(data);
    },
    onError: options?.onError,
  });
}

interface UseUpdateCommentOptions {
  worldId: string;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Update an existing comment
 * @param options - Mutation callbacks with worldId
 * @returns Mutation object
 */
export function useUpdateComment(options: UseUpdateCommentOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateCommentInput) => {
      const result = await updateComment(input);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to update comment");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate comments query
      queryClient.invalidateQueries({
        queryKey: ["comments", options.worldId],
      });

      options?.onSuccess?.();
    },
    onError: options?.onError,
  });
}

/**
 * Toggle comment resolved status
 * @param worldId - World ID for invalidation
 * @returns Mutation object
 */
export function useToggleCommentResolved(worldId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: ToggleCommentResolvedInput) => {
      const result = await toggleCommentResolved(input);

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to toggle resolved status");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate comments query
      queryClient.invalidateQueries({
        queryKey: ["comments", worldId],
      });
    },
  });
}

/**
 * Delete a comment
 * @param worldId - World ID for invalidation
 * @returns Mutation object
 */
export function useDeleteComment(worldId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (commentId: string) => {
      const result = await deleteComment({ commentId });

      if (!result.success) {
        throw new Error(result.error?.message || "Failed to delete comment");
      }

      return result.data;
    },
    onSuccess: () => {
      // Invalidate comments query
      queryClient.invalidateQueries({
        queryKey: ["comments", worldId],
      });

      // Invalidate comment stats
      queryClient.invalidateQueries({
        queryKey: ["comment-stats", worldId],
      });
    },
  });
}
