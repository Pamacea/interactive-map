/**
"use server";
"use server";
 * Comments Methods - Get Comments
 *
 * Typed wrapper for getWorldComments Server Action with Zod validation
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const GetWorldCommentsSchema = z.object({
  worldId: z.string().min(1, "World ID is required"),
  pinId: z.string().optional(),
  includeResolved: z.boolean().optional(),
  limit: z.number().int().min(1).max(100).optional(),
});

export type GetWorldCommentsInput = z.infer<typeof GetWorldCommentsSchema>;

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

const MAX_COMMENTS_LIMIT = 100;

/**
 * Get comments for a world
 * @param input - Query parameters with validation
 * @returns Result with comments array or error
 */
export async function getWorldComments(
  input: GetWorldCommentsInput,
): Promise<Result<{ comments: CommentWithUser[] }>> {
  return safeAsync(async () => {
    // Validate input
    const validated = GetWorldCommentsSchema.parse(input);

    // Get authenticated user and verify permission
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(validated.worldId, user.id, "READER");

    // Enforce limit
    const limit = Math.min(validated.limit || 50, MAX_COMMENTS_LIMIT);

    // Fetch comments from database
    const comments = await prisma.mapComment.findMany({
      where: {
        worldId: validated.worldId,
        pinId: validated.pinId,
        isResolved: validated.includeResolved ? undefined : false,
        parentId: null, // Only top-level comments
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
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    });

    return { comments };
  }, "getWorldComments");
}

/**
 * Get comment statistics for a world
 * @param worldId - World ID
 * @param pinId - Optional pin ID filter
 * @returns Result with total and unresolved counts
 */
export async function getCommentStats(
  worldId: string,
  pinId?: string,
): Promise<Result<{ total: number; unresolved: number }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(worldId, user.id, "READER");

    const [total, unresolved] = await Promise.all([
      prisma.mapComment.count({
        where: {
          worldId,
          pinId,
          parentId: null, // Only count top-level comments
        },
      }),
      prisma.mapComment.count({
        where: {
          worldId,
          pinId,
          parentId: null,
          isResolved: false,
        },
      }),
    ]);

    return { total, unresolved };
  }, "getCommentStats");
}
