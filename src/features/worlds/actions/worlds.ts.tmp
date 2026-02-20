"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath, unstable_cache, revalidateTag } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import type { OptimizedWorld } from "@/types/world.type";
import {
  safeAsync,
  ValidationError,
  FileUploadError,
  type Result,
} from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";
import type { GameWorld } from "@prisma/client";

// Cache tags for revalidation
const CACHE_TAGS = {
  WORLDS: "worlds",
  PUBLIC_WORLDS: "public-worlds",
};

/**
 * Revalidate public worlds cache
 */
function revalidatePublicWorlds() {
  revalidatePath("/explore");
  revalidateTag(CACHE_TAGS.PUBLIC_WORLDS);
}

/**
 * Create a new world
 * @param data - World creation data
 * @returns Result with created world ID or error
 */
export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}): Promise<Result<{ worldId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    let mapPath: string | undefined;

    // Handle map image upload
    if (data.map) {
      const bytes = await data.map.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Generate unique filename with world ID prefix
      const timestamp = Date.now();
      const _fileExtension = data.map.name.split(".").pop();
      const fileName = `${timestamp}-${data.map.name}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      // Ensure uploads directory exists
      if (!existsSync(uploadsDir)) {
        await writeFile(path.join(uploadsDir, ".gitkeep"), "");
      }

      const filePath = path.join(uploadsDir, fileName);

      try {
        await writeFile(filePath, buffer);
        mapPath = `/uploads/${fileName}`;
      } catch {
        throw new FileUploadError("Failed to save map image");
      }
    }

    const world = await prisma.gameWorld.create({
      data: {
        title: data.title,
        description: data.description,
        isPublic: data.isPublic,
        userId: user.id,
        isPublished: true,
        map: mapPath,
        // Automatically create OWNER member record for the creator
        members: {
          create: {
            userId: user.id,
            permission: "OWNER",
          },
        },
      },
    });

    revalidatePublicWorlds();
    revalidatePath("/worlds");

    return { worldId: world.id };
  }, "createWorld");
}

/**
 * Get world by ID
 * @param id - World ID
 * @returns World or null
 */
export async function getWorldById(id: string): Promise<OptimizedWorld | null> {
  try {
    const world = await prisma.gameWorld.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        map: true,
        isPublished: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        layers: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            isVisible: true,
            locked: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
            minZoom: true,
            maxZoom: true,
          },
          orderBy: { zIndex: "asc" },
        },
      },
    });

    if (!world) {
      return null;
    }

    return world as OptimizedWorld;
  } catch (error) {
    console.error("[getWorldById] Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get world with all related data in a single query (pins included)
 * Optimized to fetch world + layers + pins in ONE database call
 * @param id - World ID
 * @returns World with pins, or null if not found
 */
export async function getWorldWithData(id: string) {
  try {
    const world = await prisma.gameWorld.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        description: true,
        map: true,
        isPublished: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        layers: {
          select: {
            id: true,
            name: true,
            description: true,
            type: true,
            isVisible: true,
            locked: true,
            opacity: true,
            zIndex: true,
            offsetX: true,
            offsetY: true,
            scale: true,
            minZoom: true,
            maxZoom: true,
          },
          orderBy: { zIndex: "asc" },
        },
        pins: {
          where: { isVisible: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!world) {
      return null;
    }

    return world;
  } catch (error) {
    console.error("[getWorldWithData] Failed to fetch world:", error);
    return null;
  }
}

/**
 * Get all public worlds with optimized query and caching
 * @param options - Pagination and sorting options
 * @returns Array of public worlds
 */
export async function getAllWorlds(options?: {
  limit?: number;
  offset?: number;
  orderBy?: "createdAt" | "updatedAt";
}) {
  // Validate and clamp pagination parameters to prevent abuse
  const limit = Math.min(Math.max(options?.limit ?? 24, 1), 100);
  const offset = Math.max(options?.offset ?? 0, 0);
  const orderBy = options?.orderBy ?? "createdAt";

  // Use unstable_cache for 300-second caching (reduced server load)
  const getCachedWorlds = unstable_cache(
    async () => {
      const worlds = await prisma.gameWorld.findMany({
        where: {
          isPublic: true,
        },
        select: {
          id: true,
          title: true,
          description: true,
          map: true,
          isPublic: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          // Use _count instead of subqueries - much faster, no in-memory transformation
          _count: {
            select: {
              pins: true,
              loreEntries: true,
            },
          },
        },
        orderBy: {
          [orderBy]: "desc",
        },
        take: limit,
        skip: offset,
      });

      return worlds;
    },
    [CACHE_TAGS.PUBLIC_WORLDS, `${limit}-${offset}-${orderBy}`],
    {
      revalidate: 300,
      tags: [CACHE_TAGS.PUBLIC_WORLDS],
    }
  );

  try {
    return await getCachedWorlds();
  } catch (error) {
    console.error("[getAllWorlds] Failed to fetch worlds:", error);
    return [];
  }
}

/**
 * Get worlds for authenticated user
 * @returns Array of user's worlds
 */
export async function getMyWorlds() {
  try {
    // CRITICAL FIX: Use authenticated user, not random first user!
    const user = await getAuthenticatedUser();

    const worlds = await prisma.gameWorld.findMany({
      where: {
        OR: [
          { userId: user.id },
          {
            members: {
              some: {
                userId: user.id,
                permission: {
                  in: ["EDITOR", "OWNER"],
                },
              },
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            pins: true,
            loreEntries: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return worlds;
  } catch (error) {
    console.error("[getMyWorlds] Failed to fetch user worlds:", error);
    return [];
  }
}

/**
 * Update world title
 * @param id - World ID
 * @param title - New title
 * @returns Result with updated world or error
 */
export async function updateWorldTitle(id: string, title: string): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const world = await prisma.gameWorld.update({
      where: { id },
      data: { title },
    });

    // Note: Only revalidate if needed for SSR. Client-side cache handles updates.
    revalidatePath("/world/[id]");

    return world;
  }, "updateWorldTitle");
}

/**
 * Update world state (layers, map properties, etc.) for autosave
 * @param worldId - World ID to update
 * @param state - World state object containing layers and other properties
 * @returns Result with updated world or error
 */
export async function updateWorldState(
  worldId: string,
  state: {
    layers?: Array<{
      id: string;
      name: string;
      visible: boolean;
      locked: boolean;
      opacity: number;
      zIndex: number;
      offsetX?: number;
      offsetY?: number;
      scale?: number;
    }>;
    grid?: boolean;
    snap?: boolean;
    scale?: string;
    pinCount?: number;
  }
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world exists and user has permission
    await verifyWorldPermission(worldId, user.id);

    // Update layers if provided
    if (state.layers) {
      // Process each layer: create or update
      for (const layer of state.layers) {
        // Skip base map layer - it's a virtual layer that doesn't exist in DB
        if (layer.id === "base-map") {
          continue;
        }

        // Check if layer exists
        const existingLayer = await prisma.mapLayer.findUnique({
          where: { id: layer.id },
        });

        if (existingLayer) {
          // Update existing layer with all fields including position and scale
          await prisma.mapLayer.update({
            where: { id: layer.id },
            data: {
              name: layer.name,
              isVisible: layer.visible,
              opacity: layer.opacity,
              zIndex: layer.zIndex,
              offsetX: layer.offsetX ?? 0,
              offsetY: layer.offsetY ?? 0,
              scale: layer.scale ?? 1.0,
            },
          });
        } else {
          // Create new layer (shouldn't happen in normal flow, but handle it)
          await prisma.mapLayer.create({
            data: {
              id: layer.id,
              name: layer.name,
              isVisible: layer.visible,
              opacity: layer.opacity,
              zIndex: layer.zIndex,
              offsetX: layer.offsetX ?? 0,
              offsetY: layer.offsetY ?? 0,
              scale: layer.scale ?? 1.0,
              gameWorldId: worldId,
            },
          });
        }
      }
    }

    // Note: grid, snap, scale are UI-only state stored in Zustand
    // Note: pinCount is used to trigger autosave but not saved to DB

    // Return updated world with layers
    const updatedWorld = await prisma.gameWorld.findUnique({
      where: { id: worldId },
      include: {
        layers: {
          orderBy: { zIndex: "asc" },
        },
      },
    });

    // Note: No revalidatePath needed - Zustand store manages client-side layer state

    return updatedWorld;
  }, "updateWorldState");
}

/**
 * Upload a new map image for a world
 * @param worldId - World ID to update
 * @param formData - FormData containing the file upload
 * @returns Result with success status and new map URL or error
 */
export async function uploadWorldMap(
  worldId: string,
  formData: FormData
): Promise<Result<{ mapUrl: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify world exists and user has permission
    await verifyWorldPermission(worldId, user.id);

    // Get file from formData
    const file = formData.get("file") as File;

    if (!file) {
      throw new FileUploadError("No file provided");
    }

    // Validate file type
    const validTypes = ["image/webp", "image/png", "image/jpeg", "image/jpg"];
    if (!validTypes.includes(file.type)) {
      throw new FileUploadError("Invalid file type. Please upload a WebP, PNG, or JPEG image.");
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      throw new FileUploadError("File size must be less than 10MB");
    }

    // Save file
    const timestamp = Date.now();
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const fileName = `${timestamp}-${sanitizedFileName}`;
    const uploadsDir = path.join(process.cwd(), "public", "uploads");

    // Ensure uploads directory exists
    if (!existsSync(uploadsDir)) {
      await writeFile(path.join(uploadsDir, ".gitkeep"), "");
    }

    const filePath = path.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const mapPath = `/uploads/${fileName}`;

    // Update database with new map path
    await prisma.gameWorld.update({
      where: { id: worldId },
      data: { map: mapPath },
    });

    // Revalidate the world page to refresh server component
    revalidatePath(`/world/${worldId}`);

    return {
      mapUrl: mapPath,
    };
  }, "uploadWorldMap");
}

/**
 * Get all members of a world
 * @param worldId - World ID
 * @returns Array of world members with user details
 */
export async function getWorldMembers(worldId: string) {
  try {
    const members = await prisma.worldMember.findMany({
      where: { gameWorldId: worldId },
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
      orderBy: { createdAt: "asc" },
    });

    return members;
  } catch (error) {
    console.error("[getWorldMembers] Failed to fetch world members:", error);
    return [];
  }
}

/**
 * Add a member to a world
 * @param worldId - World ID
 * @param email - Email of the user to add
 * @param permission - Permission level (READER, EDITOR, OWNER)
 * @returns Result with created member or error
 */
export async function addWorldMember(
  worldId: string,
  email: string,
  permission: "READER" | "EDITOR" | "OWNER"
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify the requester has OWNER permission
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
      include: { members: true },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    // Check if requester is an owner
    const requesterMember = world.members.find(
      (m) => m.userId === user.id && m.permission === "OWNER"
    );

    if (!requesterMember && world.userId !== user.id) {
      throw new ValidationError("Only world owners can add members");
    }

    // Find the user to add by email
    const userToAdd = await prisma.user.findUnique({
      where: { email },
    });

    if (!userToAdd) {
      throw new ValidationError("User not found. They must have an account first.");
    }

    // Check if user is already a member
    const existingMember = world.members.find(
      (m) => m.userId === userToAdd.id
    );

    if (existingMember) {
      throw new ValidationError("User is already a member of this world");
    }

    // Can't add another owner if requester is not the original creator
    if (permission === "OWNER" && world.userId !== user.id) {
      throw new ValidationError("Only the world creator can add other owners");
    }

    // Add the member
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
 * @param memberId - World member ID
 * @param permission - New permission level
 * @returns Result with updated member or error
 */
export async function updateWorldMemberPermission(
  memberId: string,
  permission: "READER" | "EDITOR" | "OWNER"
): Promise<Result<GameWorld>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get the member to update
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

    // Check if requester is an owner
    const requesterMember = memberToUpdate.world.members.find(
      (m) => m.userId === user.id && m.permission === "OWNER"
    );

    if (!requesterMember && memberToUpdate.world.userId !== user.id) {
      throw new ValidationError("Only world owners can update permissions");
    }

    // Can't promote to owner unless you're the original creator
    if (permission === "OWNER" && memberToUpdate.world.userId !== user.id) {
      throw new ValidationError("Only the world creator can promote to owner");
    }

    // Can't demote the original creator
    if (memberToUpdate.userId === memberToUpdate.world.userId && permission !== "OWNER") {
      throw new ValidationError("Cannot change the world creator's permission");
    }

    // Update the member
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
 * @param memberId - World member ID
 * @returns Result with success status or error
 */
export async function removeWorldMember(
  memberId: string
): Promise<Result<{ memberId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get the member to remove
    const memberToRemove = await prisma.worldMember.findUnique({
      where: { id: memberId },
      include: { world: true },
    });

    if (!memberToRemove) {
      throw new ValidationError("Member not found");
    }

    // Check if requester is an owner or is removing themselves
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

    // Can't remove the world creator
    if (memberToRemove.userId === memberToRemove.world.userId) {
      throw new ValidationError("Cannot remove the world creator");
    }

    // Delete the member
    await prisma.worldMember.delete({
      where: { id: memberId },
    });

    revalidatePath(`/world/${memberToRemove.worldId}`);

    return { memberId };
  }, "removeWorldMember");
}

/**
 * Create an invite for a world
 * @param worldId - World ID
 * @param email - Email to invite (optional)
 * @param permission - Permission level for invitee
 * @param expiresInDays - Days until invite expires (default 7)
 * @returns Result with invite token or error
 */
export async function createInvite(
  worldId: string,
  email: string | null,
  permission: "READER" | "EDITOR" | "OWNER",
  expiresInDays: number = 7
): Promise<Result<{ inviteToken: string; inviteLink: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify user is an owner of this world
    await verifyWorldPermission(worldId, user.id, "OWNER");

    // Check if world exists
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    // Generate invite token
    const inviteToken = Math.random().toString(36).substring(2, 10).toUpperCase();

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create invite record
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
 * @param worldId - World ID
 * @param permission - Permission level for the link
 * @param expiresInDays - Days until link expires (default 30)
 * @returns Result with share link or error
 */
export async function createShareLink(
  worldId: string,
  permission: "READER" | "EDITOR" | "OWNER" = "READER",
  expiresInDays: number = 30
): Promise<Result<{ shareLink: string; token: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify user is an owner of this world
    await verifyWorldPermission(worldId, user.id, "OWNER");

    // Check if world exists
    const world = await prisma.gameWorld.findUnique({
      where: { id: worldId },
    });

    if (!world) {
      throw new ValidationError("World not found");
    }

    // Generate share token
    const shareToken = Math.random().toString(36).substring(2, 12);

    // Calculate expiration date
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiresInDays);

    // Create share link record (using WorldInvite with null email)
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
 * Get pending invites for a world
 * @param worldId - World ID
 * @returns Result with list of pending invites or error
 */
export async function getPendingInvites(
  worldId: string
): Promise<Result<Array<{ id: string; email: string | null; permission: string; token: string; expiresAt: Date }>>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify user is an owner of this world
    await verifyWorldPermission(worldId, user.id, "OWNER");

    const invites = await prisma.worldInvite.findMany({
      where: {
        worldId: worldId,
        status: "PENDING",
        expiresAt: { gte: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    return invites.map((invite) => ({
      id: invite.id,
      email: invite.email,
      permission: invite.permission,
      token: invite.token,
      expiresAt: invite.expiresAt,
    }));
  }, "getPendingInvites");
}

/**
 * Revoke a pending invite
 * @param inviteId - Invite ID to revoke
 * @returns Result with success status or error
 */
export async function revokeInvite(
  inviteId: string
): Promise<Result<{ inviteId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get the invite
    const invite = await prisma.worldInvite.findUnique({
      where: { id: inviteId },
      include: { world: true },
    });

    if (!invite) {
      throw new ValidationError("Invite not found");
    }

    // Verify user is an owner of this world
    await verifyWorldPermission(invite.worldId, user.id, "OWNER");

    // Delete the invite
    await prisma.worldInvite.delete({
      where: { id: inviteId },
    });

    revalidatePath(`/world/${invite.worldId}`);

    return { inviteId };
  }, "revokeInvite");
}
