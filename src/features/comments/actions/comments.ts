'use server';

import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import {
  safeAsync,
  type Result,
} from '@/shared/lib/errors';
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from '@/shared/lib/server-helpers';
import { safeLogCollaborationEvent } from '@/features/presence/actions';
import { CollaborationEventType } from '@/shared/lib/presence';

const MAX_COMMENTS_LIMIT = 100;
const MAX_CONTENT_LENGTH = 5000;

export interface CreateCommentInput {
  worldId: string;
  pinId?: string;
  latitude?: number;
  longitude?: number;
  content: string;
  parentId?: string;
}

export async function createComment(
  input: CreateCommentInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'EDITOR');

    // Validate content
    if (!input.content?.trim()) {
      throw new Error('Comment content is required');
    }
    if (input.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Comment content exceeds maximum length of ${MAX_CONTENT_LENGTH}`);
    }

    // Validate parent comment
    if (input.parentId) {
      const parent = await prisma.mapComment.findUnique({
        where: { id: input.parentId },
      });
      if (!parent || parent.worldId !== input.worldId) {
        throw new Error('Invalid parent comment');
      }
      if (parent.parentId) {
        throw new Error('Cannot reply to a reply (max depth: 1)');
      }
    }

    // Validate coordinates if not attached to pin
    if (!input.pinId && (input.latitude === undefined || input.longitude === undefined)) {
      throw new Error('Comments must be attached to a pin or have coordinates');
    }

    const comment = await prisma.mapComment.create({
      data: {
        worldId: input.worldId,
        pinId: input.pinId,
        latitude: input.latitude,
        longitude: input.longitude,
        content: input.content.trim(),
        parentId: input.parentId,
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
      worldId: input.worldId,
      eventType: input.parentId
        ? CollaborationEventType.COMMENT_CREATED
        : CollaborationEventType.COMMENT_CREATED,
      targetId: comment.id,
      targetType: 'comment',
    });

    revalidatePath(`/world/${input.worldId}`);

    return { comment };
  });
}

export interface GetWorldCommentsInput {
  worldId: string;
  pinId?: string;
  includeResolved?: boolean;
  limit?: number;
}

export async function getWorldComments(
  input: GetWorldCommentsInput,
): Promise<Result<{ comments: CommentWithUser[] }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    const limit = Math.min(input.limit || 50, MAX_COMMENTS_LIMIT);

    const comments = await prisma.mapComment.findMany({
      where: {
        worldId: input.worldId,
        pinId: input.pinId,
        isResolved: input.includeResolved ? undefined : false,
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
            createdAt: 'asc',
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });

    return { comments };
  });
}

export interface UpdateCommentInput {
  commentId: string;
  content: string;
}

export async function updateComment(
  input: UpdateCommentInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get comment and verify ownership
    const existing = await prisma.mapComment.findUnique({
      where: { id: input.commentId },
      include: {
        world: true,
      },
    });

    if (!existing) {
      throw new Error('Comment not found');
    }

    // Only author or world owner can edit
    if (existing.userId !== user.id && existing.world.userId !== user.id) {
      throw new Error('You can only edit your own comments');
    }

    // Validate content
    if (!input.content?.trim()) {
      throw new Error('Comment content is required');
    }
    if (input.content.length > MAX_CONTENT_LENGTH) {
      throw new Error(`Comment content exceeds maximum length of ${MAX_CONTENT_LENGTH}`);
    }

    const comment = await prisma.mapComment.update({
      where: { id: input.commentId },
      data: {
        content: input.content.trim(),
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
      targetType: 'comment',
    });

    revalidatePath(`/world/${existing.worldId}`);

    return { comment };
  });
}

export interface DeleteCommentInput {
  commentId: string;
}

export async function deleteComment(
  input: DeleteCommentInput,
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get comment with world
    const comment = await prisma.mapComment.findUnique({
      where: { id: input.commentId },
      include: {
        world: true,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Only author or world owner can delete
    if (comment.userId !== user.id && comment.world.userId !== user.id) {
      throw new Error('You can only delete your own comments');
    }

    await prisma.mapComment.delete({
      where: { id: input.commentId },
    });

    // Log to activity feed
    await safeLogCollaborationEvent({
      worldId: comment.worldId,
      eventType: CollaborationEventType.COMMENT_DELETED,
      targetId: comment.id,
      targetType: 'comment',
    });

    revalidatePath(`/world/${comment.worldId}`);

    return { success: true };
  });
}

export interface ToggleCommentResolvedInput {
  commentId: string;
  resolved: boolean;
}

export async function toggleCommentResolved(
  input: ToggleCommentResolvedInput,
): Promise<Result<{ comment: CommentWithUser }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get comment with world
    const comment = await prisma.mapComment.findUnique({
      where: { id: input.commentId },
      include: {
        world: true,
      },
    });

    if (!comment) {
      throw new Error('Comment not found');
    }

    // Verify editor permission
    await verifyWorldPermission(comment.worldId, user.id, 'EDITOR');

    const updated = await prisma.mapComment.update({
      where: { id: input.commentId },
      data: {
        isResolved: input.resolved,
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
      eventType: input.resolved
        ? CollaborationEventType.COMMENT_RESOLVED
        : CollaborationEventType.COMMENT_REOPENED,
      targetId: comment.id,
      targetType: 'comment',
    });

    revalidatePath(`/world/${comment.worldId}`);

    return { comment: updated };
  });
}

export interface GetCommentStatsInput {
  worldId: string;
  pinId?: string;
}

export async function getCommentStats(
  input: GetCommentStatsInput,
): Promise<Result<{ total: number; unresolved: number }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    const [total, unresolved] = await Promise.all([
      prisma.mapComment.count({
        where: {
          worldId: input.worldId,
          pinId: input.pinId,
          parentId: null, // Only count top-level comments
        },
      }),
      prisma.mapComment.count({
        where: {
          worldId: input.worldId,
          pinId: input.pinId,
          parentId: null,
          isResolved: false,
        },
      }),
    ]);

    return { total, unresolved };
  });
}

// Type exports
export type CommentWithUser = Prisma.MapCommentGetPayload<{
  include: {
    user: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    replies: {
      include: {
        user: {
          select: {
            id: true;
            name: true;
            image: true;
          };
        };
      };
    };
  };
}>;
