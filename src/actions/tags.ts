"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/lib/errors";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
  verifyPinPermission,
} from "@/lib/server-helpers";
import type { ReferenceType, IconShape } from "@prisma/client";

// ============================================
// SCHEMAS
// ============================================

const CreateTagSchema = z.object({
  name: z.string().min(1).max(50),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
  gameWorldId: z.string(),
});

const UpdateTagSchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(50).optional(),
  color: z.string().optional(),
  icon: z.string().optional(),
  description: z.string().optional(),
});

const AddTagRelationSchema = z.object({
  pinId: z.string(),
  tagId: z.string().optional(),
  referenceType: z.nativeEnum({
    PIN_TO_PIN: "PIN_TO_PIN",
    PIN_TO_IMAGE: "PIN_TO_IMAGE",
    PIN_TO_CHARACTER: "PIN_TO_CHARACTER",
    PIN_TO_REGION: "PIN_TO_REGION",
    PIN_TO_LORE: "PIN_TO_LORE",
    CUSTOM: "CUSTOM",
  } as const),
  targetId: z.string().optional(),
  targetTitle: z.string().optional(),
  notes: z.string().optional(),
  order: z.number().optional(),
});

const UpdateTagRelationSchema = z.object({
  id: z.string(),
  notes: z.string().optional(),
  order: z.number().optional(),
});

// ============================================
// TAG ACTIONS
// ============================================

/**
 * Create a new tag in a world
 * @param data - Tag creation data
 * @returns Result with created tag or error
 */
export async function createTag(data: z.infer<typeof CreateTagSchema>): Promise<Result<{ tag: { id: string; name: string; color: string | null; icon: string | null; description: string | null } }>> {
  return safeAsync(async () => {
    const validated = CreateTagSchema.parse(data);

    const user = await getAuthenticatedUser();
    await verifyWorldPermission(validated.gameWorldId, user.id);

    // Normalize tag name (add # prefix if not present)
    const tagName = validated.name.startsWith("#")
      ? validated.name
      : `#${validated.name}`;

    // Check if tag already exists in this world
    const existing = await prisma.tag.findUnique({
      where: {
        gameWorldId_name: {
          gameWorldId: validated.gameWorldId,
          name: tagName,
        },
      },
    });

    if (existing) {
      throw new ValidationError(`Tag "${tagName}" already exists in this world`);
    }

    const tag = await prisma.tag.create({
      data: {
        name: tagName,
        color: validated.color,
        icon: validated.icon,
        description: validated.description,
        gameWorldId: validated.gameWorldId,
      },
    });

    return { tag };
  }, "createTag");
}

/**
 * Get all tags for a world
 * @param gameWorldId - World ID
 * @returns Array of tags
 */
export async function getTagsByWorld(gameWorldId: string) {
  try {
    const tags = await prisma.tag.findMany({
      where: { gameWorldId },
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: { pinRelations: true },
        },
      },
    });

    return tags;
  } catch (error) {
    console.error("[getTagsByWorld] Failed to fetch tags:", error);
    return [];
  }
}

/**
 * Update a tag
 * @param data - Tag update data
 * @returns Result with updated tag or error
 */
export async function updateTag(data: z.infer<typeof UpdateTagSchema>): Promise<Result<{ tag }>> {
  return safeAsync(async () => {
    const validated = UpdateTagSchema.parse(data);

    const user = await getAuthenticatedUser();

    // Get tag and verify world access
    const tag = await prisma.tag.findUnique({
      where: { id: validated.id },
    });

    if (!tag) {
      throw new ValidationError("Tag not found");
    }

    await verifyWorldPermission(tag.gameWorldId, user.id);

    // Build update data
    const updateData: Partial<{ name: string; color: string; icon: string; description: string }> = {};
    if (validated.name !== undefined) {
      updateData.name = validated.name.startsWith("#")
        ? validated.name
        : `#${validated.name}`;
    }
    if (validated.color !== undefined) updateData.color = validated.color;
    if (validated.icon !== undefined) updateData.icon = validated.icon;
    if (validated.description !== undefined) updateData.description = validated.description;

    const updated = await prisma.tag.update({
      where: { id: validated.id },
      data: updateData,
    });

    return { tag: updated };
  }, "updateTag");
}

/**
 * Delete a tag
 * @param tagId - Tag ID to delete
 * @returns Result with deleted tag ID or error
 */
export async function deleteTag(tagId: string): Promise<Result<{ tagId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get tag and verify world access
    const tag = await prisma.tag.findUnique({
      where: { id: tagId },
    });

    if (!tag) {
      throw new ValidationError("Tag not found");
    }

    await verifyWorldPermission(tag.gameWorldId, user.id);

    await prisma.tag.delete({
      where: { id: tagId },
    });

    return { tagId };
  }, "deleteTag");
}

// ============================================
// TAG RELATION ACTIONS
// ============================================

/**
 * Add a tag/relation to a pin
 * @param data - Tag relation data
 * @returns Result with created relation or error
 */
export async function addTagRelation(data: z.infer<typeof AddTagRelationSchema>): Promise<Result<{ relation }>> {
  return safeAsync(async () => {
    const validated = AddTagRelationSchema.parse(data);

    const user = await getAuthenticatedUser();
    const pin = await verifyPinPermission(validated.pinId, user.id);

    // Create the relation
    const relation = await prisma.pinTagRelation.create({
      data: {
        pinId: validated.pinId,
        tagId: validated.tagId,
        referenceType: validated.referenceType,
        targetId: validated.targetId,
        targetTitle: validated.targetTitle,
        notes: validated.notes,
        order: validated.order ?? 0,
      },
    });

    // Log collaboration event
    const { safeLogCollaborationEvent } = await import("@/actions/presence");
    const { CollaborationEventType } = await import("@/lib/presence");
    await safeLogCollaborationEvent({
      worldId: pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: validated.pinId,
      targetType: "pin",
      eventData: { field: "tagRelation", action: "added" },
    });

    return { relation };
  }, "addTagRelation");
}

/**
 * Update a tag relation
 * @param data - Tag relation update data
 * @returns Result with updated relation or error
 */
export async function updateTagRelation(data: z.infer<typeof UpdateTagRelationSchema>): Promise<Result<{ relation }>> {
  return safeAsync(async () => {
    const validated = UpdateTagRelationSchema.parse(data);

    const user = await getAuthenticatedUser();

    // Get relation and verify pin access
    const relation = await prisma.pinTagRelation.findUnique({
      where: { id: validated.id },
      include: { pin: true },
    });

    if (!relation) {
      throw new ValidationError("Relation not found");
    }

    await verifyPinPermission(relation.pinId, user.id);

    // Update relation
    const updated = await prisma.pinTagRelation.update({
      where: { id: validated.id },
      data: {
        notes: validated.notes,
        order: validated.order,
      },
    });

    return { relation: updated };
  }, "updateTagRelation");
}

/**
 * Remove a tag relation from a pin
 * @param relationId - Relation ID to remove
 * @returns Result with removed relation ID or error
 */
export async function removeTagRelation(relationId: string): Promise<Result<{ relationId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Get relation and verify pin access
    const relation = await prisma.pinTagRelation.findUnique({
      where: { id: relationId },
      include: { pin: true },
    });

    if (!relation) {
      throw new ValidationError("Relation not found");
    }

    await verifyPinPermission(relation.pinId, user.id);

    await prisma.pinTagRelation.delete({
      where: { id: relationId },
    });

    // Log collaboration event
    const { safeLogCollaborationEvent } = await import("@/actions/presence");
    const { CollaborationEventType } = await import("@/lib/presence");
    await safeLogCollaborationEvent({
      worldId: relation.pin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: relation.pinId,
      targetType: "pin",
      eventData: { field: "tagRelation", action: "removed" },
    });

    return { relationId };
  }, "removeTagRelation");
}

/**
 * Get all tag relations for a pin
 * @param pinId - Pin ID
 * @returns Array of tag relations with tag data
 */
export async function getPinTagRelations(pinId: string) {
  try {
    const relations = await prisma.pinTagRelation.findMany({
      where: { pinId },
      include: {
        tag: true,
      },
      orderBy: { order: "asc" },
    });

    return relations;
  } catch (error) {
    console.error("[getPinTagRelations] Failed to fetch relations:", error);
    return [];
  }
}

/**
 * Batch update tag relation order
 * @param updates - Array of { id, order }
 * @returns Result with updated relations or error
 */
export async function batchUpdateTagRelationOrder(
  updates: Array<{ id: string; order: number }>
): Promise<Result<{ count: number }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    // Verify permissions for all pins
    const relations = await prisma.pinTagRelation.findMany({
      where: {
        id: { in: updates.map((u) => u.id) },
      },
      include: { pin: true },
    });

    const uniquePinIds = [...new Set(relations.map((r) => r.pinId))];
    for (const pinId of uniquePinIds) {
      await verifyPinPermission(pinId, user.id);
    }

    // Update all orders
    await Promise.all(
      updates.map((update) =>
        prisma.pinTagRelation.update({
          where: { id: update.id },
          data: { order: update.order },
        })
      )
    );

    return { count: updates.length };
  }, "batchUpdateTagRelationOrder");
}

/**
 * Create a quick reference from one pin to another
 * @param sourcePinId - Source pin ID
 * @param targetPinId - Target pin ID (the pin being referenced)
 * @param notes - Optional notes about the reference
 * @returns Result with created relation or error
 */
export async function linkPinToPin(
  sourcePinId: string,
  targetPinId: string,
  notes?: string
): Promise<Result<{ relation }>> {
  return safeAsync(async () => {
    if (sourcePinId === targetPinId) {
      throw new ValidationError("Cannot link a pin to itself");
    }

    const user = await getAuthenticatedUser();
    const sourcePin = await verifyPinPermission(sourcePinId, user.id);

    // Get target pin for title
    const targetPin = await prisma.pin.findUnique({
      where: { id: targetPinId },
    });

    if (!targetPin) {
      throw new ValidationError("Target pin not found");
    }

    // Check if relation already exists
    const existing = await prisma.pinTagRelation.findFirst({
      where: {
        pinId: sourcePinId,
        targetId: targetPinId,
        referenceType: "PIN_TO_PIN",
      },
    });

    if (existing) {
      throw new ValidationError("This reference already exists");
    }

    const relation = await prisma.pinTagRelation.create({
      data: {
        pinId: sourcePinId,
        referenceType: "PIN_TO_PIN",
        targetId: targetPinId,
        targetTitle: targetPin.title,
        notes,
        order: 0,
      },
    });

    // Log collaboration event
    const { safeLogCollaborationEvent } = await import("@/actions/presence");
    const { CollaborationEventType } = await import("@/lib/presence");
    await safeLogCollaborationEvent({
      worldId: sourcePin.gameWorldId,
      eventType: CollaborationEventType.PIN_UPDATED,
      targetId: sourcePinId,
      targetType: "pin",
      eventData: { field: "pinReference", targetPinId },
    });

    return { relation };
  }, "linkPinToPin");
}
