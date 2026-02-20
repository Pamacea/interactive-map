"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";
import type { WorldInvite, MemberPermission } from "@prisma/client";

type WorldInviteWithRelations = WorldInvite & {
  world?: { title: string };
  invitedBy?: { name: string | null; email: string | null; image?: string | null };
  acceptedBy?: { name: string | null; image?: string | null };
};

/**
 * Generate a unique invite token
 */
function generateInviteToken(): string {
  return `${crypto.randomUUID().replace(/-/g, "")}${Date.now().toString(36)}`;
}

/**
 * Calculate expiration date
 */
function getExpirationDate(expiresIn: number = 7): Date {
  const now = new Date();
  now.setDate(now.getDate() + expiresIn);
  return now;
}

// ============================================
// INVITE MANAGEMENT
// ============================================

/**
 * Create an email invite for a world
 * @param worldId - World ID
 * @param email - Email address to invite
 * @param permission - Permission level (READER, EDITOR, OWNER)
 * @param expiresIn - Days until expiration (default: 7)
 * @param message - Optional personal message
 * @returns Result with created invite or error
 */
export async function createInvite(
  worldId: string,
  email: string,
  permission: MemberPermission = "READER",
  expiresIn: number = 7,
  message?: string
): Promise<Result<WorldInviteWithRelations>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify user has permission to invite (must be OWNER or EDITOR)
    const world = await verifyWorldPermission(worldId, user.id);

    // Check if user is OWNER or EDITOR
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: worldId,
        userId: user.id,
        permission: { in: ["OWNER", "EDITOR"] },
      },
    });

    if (world.userId !== user.id && !member) {
      throw new ValidationError("Only owners and editors can send invites");
    }

    // Check if email is already a member
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Check if already a member
      const existingMember = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: worldId,
          userId: existingUser.id,
        },
      });

      if (existingMember) {
        throw new ValidationError("This user is already a member of this world");
      }
    }

    // Create invite
    const invite = await prisma.worldInvite.create({
      data: {
        token: generateInviteToken(),
        email: email.toLowerCase(),
        worldId,
        invitedByUserId: user.id,
        permission,
        expiresAt: getExpirationDate(expiresIn),
        message,
      },
      include: {
        world: {
          select: {
            title: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    revalidatePath(`/world/${worldId}`);

    return invite;
  }, "createInvite");
}

/**
 * Create a shareable link for a world
 * @param worldId - World ID
 * @param permission - Permission level for link users
 * @param expiresIn - Days until expiration (default: 30)
 * @returns Result with created invite or error
 */
export async function createShareLink(
  worldId: string,
  permission: MemberPermission = "READER",
  expiresIn: number = 30
): Promise<Result<WorldInviteWithRelations>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify user has permission
    const world = await verifyWorldPermission(worldId, user.id);

    // Check if user is OWNER or EDITOR
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: worldId,
        userId: user.id,
        permission: { in: ["OWNER", "EDITOR"] },
      },
    });

    if (world.userId !== user.id && !member) {
      throw new ValidationError("Only owners and editors can create share links");
    }

    // Create invite without email (anyone with link can join)
    const invite = await prisma.worldInvite.create({
      data: {
        token: generateInviteToken(),
        worldId,
        invitedByUserId: user.id,
        permission,
        expiresAt: getExpirationDate(expiresIn),
      },
      include: {
        world: {
          select: {
            title: true,
          },
        },
      },
    });

    revalidatePath(`/world/${worldId}`);

    return invite;
  }, "createShareLink");
}

/**
 * Accept an invite by token
 * @param token - Invite token
 * @returns Result with world ID or error
 */
export async function acceptInvite(token: string): Promise<Result<{ worldId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Find invite
    const invite = await prisma.worldInvite.findUnique({
      where: { token },
      include: {
        world: true,
      },
    });

    if (!invite) {
      throw new ValidationError("Invalid invite token");
    }

    // Check if invite is expired
    if (invite.expiresAt < new Date()) {
      await prisma.worldInvite.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      throw new ValidationError("This invite has expired");
    }

    // Check if invite was revoked
    if (invite.status === "REVOKED") {
      throw new ValidationError("This invite has been revoked");
    }

    // For email-specific invites, verify email matches
    if (invite.email && invite.email !== user.email) {
      throw new ValidationError("This invite was sent to a different email address");
    }

    // Check if user is already a member
    const existingMember = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: invite.worldId,
        userId: user.id,
      },
    });

    if (existingMember) {
      // Update invite status
      await prisma.worldInvite.update({
        where: { id: invite.id },
        data: {
          status: "ACCEPTED",
          acceptedByUserId: user.id,
        },
      });

      return { worldId: invite.worldId };
    }

    // Add user as member
    await prisma.worldMember.create({
      data: {
        gameWorldId: invite.worldId,
        userId: user.id,
        permission: invite.permission,
      },
    });

    // Update invite status
    await prisma.worldInvite.update({
      where: { id: invite.id },
      data: {
        status: "ACCEPTED",
        acceptedByUserId: user.id,
      },
    });

    revalidatePath(`/world/${invite.worldId}`);
    revalidatePath("/worlds");

    return { worldId: invite.worldId };
  }, "acceptInvite");
}

/**
 * Decline an invite
 * @param token - Invite token
 * @returns Result with declined invite ID or error
 */
export async function declineInvite(token: string): Promise<Result<{ inviteId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const invite = await prisma.worldInvite.findUnique({
      where: { token },
    });

    if (!invite) {
      throw new ValidationError("Invalid invite token");
    }

    if (invite.email && invite.email !== user.email) {
      throw new ValidationError("This invite was sent to a different email address");
    }

    await prisma.worldInvite.update({
      where: { id: invite.id },
      data: { status: "DECLINED" },
    });

    return { inviteId: invite.id };
  }, "declineInvite");
}

/**
 * Get pending invites for a world
 * @param worldId - World ID
 * @returns Array of pending invites
 */
export async function getPendingInvites(worldId: string) {
  try {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(worldId, user.id);

    const invites = await prisma.worldInvite.findMany({
      where: {
        worldId,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
      include: {
        invitedBy: {
          select: {
            name: true,
            image: true,
          },
        },
        acceptedBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invites;
  } catch (error) {
    console.error("[getPendingInvites] Failed to fetch invites:", error);
    return [];
  }
}

/**
 * Revoke an invite
 * @param inviteId - Invite ID
 * @returns Result with revoked invite ID or error
 */
export async function revokeInvite(inviteId: string): Promise<Result<{ inviteId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const invite = await prisma.worldInvite.findUnique({
      where: { id: inviteId },
    });

    if (!invite) {
      throw new ValidationError("Invite not found");
    }

    // Verify user has permission
    const world = await verifyWorldPermission(invite.worldId, user.id);

    // Only OWNER or EDITOR can revoke
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: invite.worldId,
        userId: user.id,
        permission: { in: ["OWNER", "EDITOR"] },
      },
    });

    if (world.userId !== user.id && !member) {
      throw new ValidationError("Only owners and editors can revoke invites");
    }

    await prisma.worldInvite.update({
      where: { id: inviteId },
      data: { status: "REVOKED" },
    });

    revalidatePath(`/world/${invite.worldId}`);

    return { inviteId };
  }, "revokeInvite");
}

/**
 * Resend an invite (generates new token with new expiration)
 * @param inviteId - Original invite ID
 * @returns Result with new invite or error
 */
export async function resendInvite(inviteId: string): Promise<Result<WorldInviteWithRelations>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const originalInvite = await prisma.worldInvite.findUnique({
      where: { id: inviteId },
      include: {
        world: true,
      },
    });

    if (!originalInvite) {
      throw new ValidationError("Invite not found");
    }

    // Verify permission
    const world = await verifyWorldPermission(originalInvite.worldId, user.id);

    // Only OWNER or EDITOR can resend
    const member = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: originalInvite.worldId,
        userId: user.id,
        permission: { in: ["OWNER", "EDITOR"] },
      },
    });

    if (world.userId !== user.id && !member) {
      throw new ValidationError("Only owners and editors can resend invites");
    }

    // Create new invite with same details
    const newInvite = await prisma.worldInvite.create({
      data: {
        token: generateInviteToken(),
        email: originalInvite.email,
        worldId: originalInvite.worldId,
        invitedByUserId: user.id,
        permission: originalInvite.permission,
        expiresAt: getExpirationDate(7),
        message: originalInvite.message ?? undefined,
      },
      include: {
        world: {
          select: {
            title: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Revoke old invite
    await prisma.worldInvite.update({
      where: { id: inviteId },
      data: { status: "REVOKED" },
    });

    revalidatePath(`/world/${originalInvite.worldId}`);

    return newInvite;
  }, "resendInvite");
}

/**
 * Get invite by token (for public invite page)
 * @param token - Invite token
 * @returns Invite details or null
 */
export async function getInviteByToken(token: string) {
  try {
    const invite = await prisma.worldInvite.findUnique({
      where: { token },
      include: {
        world: {
          select: {
            id: true,
            title: true,
            description: true,
            map: true,
          },
        },
        invitedBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
    });

    if (!invite || invite.status !== "PENDING") {
      return null;
    }

    if (invite.expiresAt < new Date()) {
      await prisma.worldInvite.update({
        where: { id: invite.id },
        data: { status: "EXPIRED" },
      });
      return null;
    }

    return invite;
  } catch (error) {
    console.error("[getInviteByToken] Failed to fetch invite:", error);
    return null;
  }
}

/**
 * Get all invites for the current user
 * @returns Array of invites for the current user
 */
export async function getInvitesForUser() {
  try {
    const user = await getAuthenticatedUser();

    const invites = await prisma.worldInvite.findMany({
      where: {
        email: user.email,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
      include: {
        world: {
          select: {
            id: true,
            title: true,
            description: true,
            map: true,
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        invitedBy: {
          select: {
            name: true,
            image: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return invites;
  } catch (error) {
    console.error("[getInvitesForUser] Failed to fetch user invites:", error);
    return [];
  }
}
