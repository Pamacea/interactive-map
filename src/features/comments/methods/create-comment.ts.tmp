/**
"use server";
"use server";
 * Comments Methods - Create Comment
 *
 * Server Action wrapper with Zod validation
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";
import { safeLogCollaborationEvent } from "@/features/presence";
import { CollaborationEventType } from "@/shared/lib/presence";

// ============================================
// SCHEMAS
// ============================================

export const CreateCommentSchema = z.object({
  worldId: z.string().min(1, "World ID is required"),
  pinId: z.string().optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  content: z.string().min(1, "Content is required").max(5000, "Content too long (max 5000 chars)"),
  parentId: z.string().optional(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentSchema>;

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

/**
 * Create a new comment
 * @param input - Validated comment data
 * @returns Result with created comment or error
 */
export async function createComment(
  input: CreateCommentInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = CreateCommentSchema.parse(input);

    // Get authenticated user and verify permission
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(validated.worldId, user.id, "EDITOR");

    // Validate parent comment
    if (validated.parentId) {
      const parent = await prisma.mapComment.findUnique({
        where: { id: validated.parentId },
      });

      if (!parent || parent.worldId !== validated.worldId) {
        throw new Error("Invalid parent comment");
      }

      if (parent.parentId) {
        throw new Error("Cannot reply to a reply (max depth: 1)");
      }
    }

    // Validate coordinates if not attached to pin
    if (!validated.pinId && (validated.latitude === undefined || validated.longitude === undefined)) {
      throw new Error("Comments must be attached to a pin or have coordinates");
    }

    // Create comment
    const comment = await prisma.mapComment.create({
      data: {
        worldId: validated.worldId,
        pinId: validated.pinId,
        latitude: validated.latitude,
        longitude: validated.longitude,
        content: validated.content.trim(),
        parentId: validated.parentId,
        userId: user.id,
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
      worldId: validated.worldId,
      eventType: CollaborationEventType.COMMENT_CREATED,
      targetId: comment.id,
      targetType: "comment",
    });

    revalidatePath(`/world/${validated.worldId}`);

    return { comment };
  }, "createComment");
}
