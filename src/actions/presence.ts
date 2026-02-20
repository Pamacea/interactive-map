'use server';

import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import {
  safeAsync,
  type Result,
} from '@/lib/errors';
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from '@/lib/server-helpers';
import { CollaborationEventType } from '@/lib/presence';

const PRESENCE_TIMEOUT_MS = 30_000;
const MAX_EVENTS_LIMIT = 500;
const CURSOR_MIN = 0;
const CURSOR_MAX = 1;

/**
 * Safely log a collaboration event with error handling
 * Uses fire-and-forget pattern but logs errors for monitoring
 */
export async function safeLogCollaborationEvent(input: {
  worldId: string;
  eventType: CollaborationEventType;
  targetId?: string;
  targetType?: string;
  eventData?: unknown;
}): Promise<void> {
  try {
    const _result = await logCollaborationEvent(input);
    if (!result.success) {
      console.error('[Collaboration] Failed to log event:', {
        worldId: input.worldId,
        eventType: input.eventType,
        error: result.error?.message,
      });
    }
  } catch (error) {
    console.error('[Collaboration] Error logging event:', {
      worldId: input.worldId,
      eventType: input.eventType,
      error: error instanceof Error ? error.message : String(error),
    });
  }
}

function validateCursor(value?: number): number | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'number' || !Number.isFinite(value)) return undefined;
  return Math.max(CURSOR_MIN, Math.min(CURSOR_MAX, value));
}

export interface UpdatePresenceInput {
  worldId: string;
  sessionId: string;
  cursorX?: number;
  cursorY?: number;
  viewport?: {
    x: number;
    y: number;
    zoom: number;
    width: number;
    height: number;
  };
  selectedPinId?: string | null;
}

export async function updatePresence(
  input: UpdatePresenceInput,
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    const now = new Date();

    // Validate and sanitize cursor coordinates
    const cursorX = validateCursor(input.cursorX);
    const cursorY = validateCursor(input.cursorY);

    await prisma.userPresence.upsert({
      where: {
        userId_worldId_sessionId: {
          userId: user.id,
          worldId: input.worldId,
          sessionId: input.sessionId,
        },
      },
      create: {
        userId: user.id,
        worldId: input.worldId,
        sessionId: input.sessionId,
        isActive: true,
        lastSeen: now,
        cursorX,
        cursorY,
        viewport: input.viewport as Prisma.InputJsonValue,
        selectedPinId: input.selectedPinId,
      },
      update: {
        isActive: true,
        lastSeen: now,
        cursorX,
        cursorY,
        viewport: input.viewport as Prisma.InputJsonValue,
        selectedPinId: input.selectedPinId,
      },
    });

    return { success: true };
  });
}

export interface GetActiveUsersInput {
  worldId: string;
}

export async function getActiveUsers(
  input: GetActiveUsersInput,
): Promise<Result<Array<{ id: string; name: string | null; image: string | null; cursorX: number | null; cursorY: number | null }>>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    const timeout = new Date(Date.now() - PRESENCE_TIMEOUT_MS);

    const activePresences = await prisma.userPresence.findMany({
      where: {
        worldId: input.worldId,
        isActive: true,
        lastSeen: {
          gte: timeout,
        },
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return activePresences.map(p => ({
      id: p.user.id,
      name: p.user.name,
      image: p.user.image,
      cursorX: p.cursorX,
      cursorY: p.cursorY,
    }));
  });
}

export interface RemovePresenceInput {
  worldId: string;
  sessionId: string;
}

export async function removePresence(
  input: RemovePresenceInput,
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    // Only allow removing own presence
    const presence = await prisma.userPresence.findUnique({
      where: {
        userId_worldId_sessionId: {
          userId: user.id, // Enforce userId matches
          worldId: input.worldId,
          sessionId: input.sessionId,
        },
      },
    });

    if (presence) {
      await prisma.userPresence.update({
        where: { id: presence.id },
        data: {
          isActive: false,
        },
      });
    }

    return { success: true };
  });
}

/**
 * Cleanup inactive presences.
 * This should ONLY be called from a scheduled job (cron), not from user requests.
 * No auth check since it's meant for automated cleanup.
 */
export async function cleanupInactivePresences(): Promise<Result<{ count: number }>> {
  return safeAsync(async () => {
    const timeout = new Date(Date.now() - PRESENCE_TIMEOUT_MS);

    const _result = await prisma.userPresence.updateMany({
      where: {
        isActive: true,
        lastSeen: {
          lt: timeout,
        },
      },
      data: {
        isActive: false,
      },
    });

    return { count: result.count };
  });
}

export async function logCollaborationEvent(input: {
  worldId: string;
  eventType: CollaborationEventType;
  targetId?: string;
  targetType?: string;
  eventData?: unknown;
}): Promise<Result<{ eventId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    const event = await prisma.collaborationEvent.create({
      data: {
        worldId: input.worldId,
        userId: user.id,
        eventType: input.eventType,
        targetId: input.targetId,
        targetType: input.targetType,
        eventData: input.eventData as Prisma.InputJsonValue,
      },
    });

    return { eventId: event.id };
  });
}

export interface GetRecentEventsInput {
  worldId: string;
  limit?: number;
}

export async function getRecentEvents(
  input: GetRecentEventsInput,
): Promise<Result<Array<{ id: string; eventType: CollaborationEventType; userId: string; userName: string | null; targetId: string | null; timestamp: Date }>>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'READER');

    // Enforce max limit to prevent DoS
    const limit = Math.min(input.limit || 50, MAX_EVENTS_LIMIT);

    const events = await prisma.collaborationEvent.findMany({
      where: {
        worldId: input.worldId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
    });

    return events.map(e => ({
      id: e.id,
      eventType: e.eventType,
      userId: e.userId,
      userName: e.user.name,
      targetId: e.targetId,
      timestamp: e.timestamp,
    }));
  });
}
