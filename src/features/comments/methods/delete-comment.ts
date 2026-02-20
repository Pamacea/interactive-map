/**
"use server";
"use server";
 * Comments Methods - Delete Comment
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

export const DeleteCommentSchema = z.object({
  commentId: z.string().min(1, "Comment ID is required"),
});

export type DeleteCommentInput = z.infer<typeof DeleteCommentSchema>;

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Delete a comment
 * @param input - Validated delete data
 * @returns Result with success status or error
 */
export async function deleteComment(
  input: DeleteCommentInput,
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = DeleteCommentSchema.parse(input);

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

    // Only author or world owner can delete
    if (comment.userId !== user.id && comment.world.userId !== user.id) {
      throw new Error("You can only delete your own comments");
    }

    // Delete comment
    await prisma.mapComment.delete({
      where: { id: validated.commentId },
    });

    // Log to activity feed
    await safeLogCollaborationEvent({
      worldId: comment.worldId,
      eventType: CollaborationEventType.COMMENT_DELETED,
      targetId: comment.id,
      targetType: "comment",
    });

    revalidatePath(`/world/${comment.worldId}`);

    return { success: true };
  }, "deleteComment");
}
