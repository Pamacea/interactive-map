"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";

/**
 * Create an invite for a world
 */
export async function createInvite(
  worldId: string,
  email: string | null,
  permission: "READER" | "EDITOR" | "OWNER",
  expiresInDays: number = 7
): Promise<Result<{ inviteToken: string; inviteLink: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id, "OWNER");

    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    const inviteToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await prisma.worldInvite.create({
      data: {
        worldId: worldId,
        email,
        permission,
        token: inviteToken,
        expiresAt,
        invitedByUserId: user.id,
      },
    });

    const inviteLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/world/${worldId}/invite/${inviteToken}`;

    revalidatePath(`/world/${worldId}`);

    return { inviteToken, inviteLink };
  }, "createInvite");
}

/**
 * Create a shareable link for a world
 */
export async function createShareLink(
  worldId: string,
  permission: "READER" | "EDITOR" | "OWNER" = "READER",
  expiresInDays: number = 30
): Promise<Result<{ shareLink: string; token: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(worldId, user.id, "OWNER");

    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    const shareToken = Math.random().toString(36).substring(2, 12);

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    await prisma.worldInvite.create({
      data: {
        worldId: worldId,
        email: null,
        permission,
        token: shareToken,
        expiresAt,
        invitedByUserId: user.id,
      },
    });

    const shareLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/world/${worldId}/invite/${shareToken}`;

    revalidatePath(`/world/${worldId}`);

    return { shareLink, token: shareToken };
  }, "createShareLink");
}

/**
 * Revoke a pending invite
 */
export async function revokeInvite(
  inviteId: string
): Promise<Result<{ inviteId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const invite = await prisma.worldInvite.findUnique({
      where: { id: inviteId },
      include: { world: true },
    });

    if (!invite) {
      throw new ValidationError("Invite not found");
    }

    await verifyWorldPermission(invite.worldId, user.id, "OWNER");

    await prisma.worldInvite.delete({
      where: { id: inviteId },
    });

    revalidatePath(`/world/${invite.worldId}`);

    return { inviteId };
  }, "revokeInvite");
}
