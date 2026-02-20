/**
"use server";
 * Comments Methods - Update Comment
 *
 * Server Action wrapper with validation
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser } from "@/shared/lib/server-helpers";
import { safeLogCollaborationEvent } from "@/features/presence";
import { CollaborationEventType } from "@/shared/lib/presence";

// ============================================
// SCHEMAS
// ============================================

export const UpdateCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
  content: z.string().min(1, "Content is required").max(5000, "Content too long (max 5000 chars)"),
});

export type UpdateCommentInput = z.infer<typeof UpdateCommentSchema>;

export const ToggleCommentResolvedSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
  resolved: z.boolean(),
});

export type ToggleCommentResolvedInput = z.infer<typeof ToggleCommentResolvedSchema>;

// ============================================
// TYPES
// ============================================

export type CommentWithUser = {
  id: string;
  content: string;
  latitude: number | null;
  longitude: number | null;
  isResolved: boolean;
  parentId: string | null;
  pinId: string | null;
  worldId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string | null;
    image: string | null;
  };
  replies: CommentWithUser[];
};

// ============================================
// SERVER ACTIONS
// ============================================

const MAX_CONTENT_LENGTH = 5000;

/**
 * Update an existing comment
 * @param input - Validated update data
 * @returns Result with updated comment or error
 */
export async function updateComment(
  input: UpdateCommentInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = UpdateCommentSchema.parse(input);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Get comment and verify ownership
    const existing = await prisma.mapComment.findUnique({
      where: { id: validated.commentId },
      include: {
        world: true,
      },
    });

    if (!existing) {
      throw new Error("Comment not found");
    }

    // Only author or world owner can edit
    if (existing.userId !== user.id && existing.world.userId !== user.id) {
      throw new Error("You can only edit your own comments");
    }

    // Validate content length
    if (validated.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Comment content exceeds maximum length of ${MAX_CONTENT_LENGTH}`);
    }

    // Update comment
    const comment = await prisma.mapComment.update({
      where: { id: validated.commentId },
      data: {
        content: validated.content.trim(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Log to activity feed
    await safeLogCollaborationEvent({
      worldId: existing.worldId,
      eventType: CollaborationEventType.COMMENT_UPDATED,
      targetId: comment.id,
      targetType: "comment",
    });

    revalidatePath(`/world/${existing.worldId}`);

    return { comment };
  }, "updateComment");
}

/**
 * Toggle comment resolved status
 * @param input - Validated toggle data
 * @returns Result with updated comment or error
 */
export async function toggleCommentResolved(
  input: ToggleCommentResolvedInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = ToggleCommentResolvedSchema.parse(input);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Get comment with world
    const comment = await prisma.mapComment.findUnique({
      where: { id: validated.commentId },
      include: {
        world: true,
      },
    });

    if (!comment) {
      throw new Error("Comment not found");
    }

    // Verify editor permission
    const { verifyWorldPermission } = await import("@/lib/server-helpers");
    await verifyWorldPermission(comment.worldId, user.id, "EDITOR");

    // Update resolved status
    const updated = await prisma.mapComment.update({
      where: { id: validated.commentId },
      data: {
        isResolved: validated.resolved,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // Log to activity feed
    await safeLogCollaborationEvent({
      worldId: comment.worldId,
      eventType: validated.resolved
        ? CollaborationEventType.COMMENT_RESOLVED
        : CollaborationEventType.COMMENT_REOPENED,
      targetId: comment.id,
      targetType: "comment",
    });

    revalidatePath(`/world/${comment.worldId}`);

    return { comment: updated };
  }, "toggleCommentResolved");
}
