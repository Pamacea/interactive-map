"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { GameWorld } from "@prisma/client";
import {
  getAuthenticatedUser,
} from "@/shared/lib/server-helpers";

/**
 * Add a member to a world
 */
export async function addWorldMember(
  worldId: string,
  email: string,
  permission: "READER" | "EDITOR" | "OWNER"
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
      include: { members: true },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    const requesterMember = world.members.find(
      (m) => m.userId === user.id && m.permission === "OWNER"
    );

    if (!requesterMember && world.userId !== user.id) {
      throw new ValidationError("Only world owners can add members");
    }

    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      throw new ValidationError("User not found. They must have an account first.");
    }

    const existingMember = world.members.find(
      (m) => m.userId === userToAdd.id
    );

    if (existingMember) {
      throw new ValidationError("User is already a member of this world");
    }

    if (permission === "OWNER" && world.userId !== user.id) {
      throw new ValidationError("Only the world creator can add other owners");
    }

    const member = await prisma.worldMember.create({
      data: {
        gameWorldId: worldId,
        userId: userToAdd.id,
        permission,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/world/${worldId}`);

    return member;
  }, "addWorldMember");
}

/**
 * Update a member's permission
 */
export async function updateWorldMemberPermission(
  memberId: string,
  permission: "READER" | "EDITOR" | "OWNER"
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const memberToUpdate = await prisma.worldMember.findUnique({
      where: { id: memberId },
      include: {
        world: {
          include: { members: true },
        },
      },
    });

    if (!memberToUpdate) {
      throw new ValidationError("Member not found");
    }

    const requesterMember = memberToUpdate.world.members.find(
      (m) => m.userId === user.id && m.permission === "OWNER"
    );

    if (!requesterMember && memberToUpdate.world.userId !== user.id) {
      throw new ValidationError("Only world owners can update permissions");
    }

    if (permission === "OWNER" && memberToUpdate.world.userId !== user.id) {
      throw new ValidationError("Only the world creator can promote to owner");
    }

    if (memberToUpdate.userId === memberToUpdate.world.userId && permission !== "OWNER") {
      throw new ValidationError("Cannot change the world creator's permission");
    }

    const updatedMember = await prisma.worldMember.update({
      where: { id: memberId },
      data: { permission },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    revalidatePath(`/world/${memberToUpdate.worldId}`);

    return updatedMember;
  }, "updateWorldMemberPermission");
}

/**
 * Remove a member from a world
 */
export async function removeWorldMember(
  memberId: string
): Promise<Result<{ memberId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const memberToRemove = await prisma.worldMember.findUnique({
      where: { id: memberId },
      include: { world: true },
    });

    if (!memberToRemove) {
      throw new ValidationError("Member not found");
    }

    const requesterIsOwner = memberToRemove.world.userId === user.id;
    const requesterIsMemberOwner = await prisma.worldMember.findFirst({
      where: {
        gameWorldId: memberToRemove.worldId,
        userId: user.id,
        permission: "OWNER",
      },
    });

    const isRemovingSelf = memberToRemove.userId === user.id;

    if (!requesterIsOwner && !requesterIsMemberOwner && !isRemovingSelf) {
      throw new ValidationError("Only world owners can remove members");
    }

    if (memberToRemove.userId === memberToRemove.world.userId) {
      throw new ValidationError("Cannot remove the world creator");
    }

    await prisma.worldMember.delete({
      where: { id: memberId },
    });

    revalidatePath(`/world/${memberToRemove.worldId}`);

    return { memberId };
  }, "removeWorldMember");
}
