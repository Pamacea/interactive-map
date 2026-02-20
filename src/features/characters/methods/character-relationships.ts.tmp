/**
"use server";
 * Character Methods - Character Relationships
 *
 * Server Action wrappers for character-to-character relationships
 */

import { z } from "zod";
import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";

// ============================================
// SCHEMAS
// ============================================

export const CreateCharacterRelationshipSchema = z.object({
  sourceId: z.string().min(1, "Source character ID is required"),
  targetId: z.string().min(1, "Target character ID is required"),
  relationshipType: z.string().min(1, "Relationship type is required"),
  description: z.string().max(1000).optional(),
  strength: z.number().int().min(0).max(100).optional(),
  isVisible: z.boolean().optional(),
});

export type CreateCharacterRelationshipInput = z.infer<typeof CreateCharacterRelationshipSchema>;

export const UpdateCharacterRelationshipSchema = z.object({
  sourceId: z.string().min(1, "Source character ID is required"),
  targetId: z.string().min(1, "Target character ID is required"),
  relationshipType: z.string().optional(),
  description: z.string().max(1000).optional(),
  strength: z.number().int().min(0).max(100).optional(),
  isVisible: z.boolean().optional(),
});

export type UpdateCharacterRelationshipInput = z.infer<typeof UpdateCharacterRelationshipSchema>;

// ============================================
// TYPES
// ============================================

export type CharacterRelationshipWithInclude = {
  id: string;
  sourceId: string;
  targetId: string;
  relationshipType: string;
  description: string | null;
  strength: number | null;
  isVisible: boolean;
  source: {
    id: string;
    name: string;
    shortName: string | null;
    portraitUrl: string | null;
    characterType: string;
  };
  target: {
    id: string;
    name: string;
    shortName: string | null;
    portraitUrl: string | null;
    characterType: string;
  };
};

// ============================================
// SERVER ACTIONS
// ============================================

/**
 * Create a relationship between two characters
 * @param data - Validated relationship data
 * @returns Result with created relationship or error
 */
export async function createCharacterRelationship(
  data: CreateCharacterRelationshipInput,
): Promise<Result<CharacterRelationshipWithInclude>> {
  return safeAsync(async () => {
    // Validate input
    const validated = CreateCharacterRelationshipSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permissions for both characters
    const sourceCharacter = await verifyCharacterPermission(validated.sourceId, user.id);
    await verifyCharacterPermission(validated.targetId, user.id);

    // Verify same world
    if (sourceCharacter.gameWorldId) {
      const targetCharacter = await prisma.character.findUnique({
        where: { id: validated.targetId },
      });

      if (targetCharacter?.gameWorldId !== sourceCharacter.gameWorldId) {
        throw new ValidationError("Characters must belong to the same world");
      }
    }

    // Check if relationship already exists
    const existing = await prisma.characterRelationship.findUnique({
      where: {
        sourceId_targetId: {
          sourceId: validated.sourceId,
          targetId: validated.targetId,
        },
      },
    });

    if (existing) {
      // Update existing relationship
      const updated = await prisma.characterRelationship.update({
        where: { id: existing.id },
        data: {
          relationshipType: validated.relationshipType,
          description: validated.description,
          strength: validated.strength,
          isVisible: validated.isVisible,
        },
        include: {
          source: true,
          target: true,
        },
      });

      revalidatePath(`/world/${sourceCharacter.gameWorldId}`);

      return updated as CharacterRelationshipWithInclude;
    }

    // Create new relationship
    const relationship = await prisma.characterRelationship.create({
      data: {
        sourceId: validated.sourceId,
        targetId: validated.targetId,
        relationshipType: validated.relationshipType,
        description: validated.description,
        strength: validated.strength,
        isVisible: validated.isVisible,
      },
      include: {
        source: true,
        target: true,
      },
    });

    revalidatePath(`/world/${sourceCharacter.gameWorldId}`);

    return relationship as CharacterRelationshipWithInclude;
  }, "createCharacterRelationship");
}

/**
 * Update a character relationship
 * @param data - Validated update data
 * @returns Result with updated relationship or error
 */
export async function updateCharacterRelationship(
  data: UpdateCharacterRelationshipInput,
): Promise<Result<CharacterRelationshipWithInclude>> {
  return safeAsync(async () => {
    // Validate input
    const validated = UpdateCharacterRelationshipSchema.parse(data);

    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Find relationship
    const relationship = await prisma.characterRelationship.findUnique({
      where: {
        sourceId_targetId: {
          sourceId: validated.sourceId,
          targetId: validated.targetId,
        },
      },
    });

    if (!relationship) {
      throw new ValidationError("Relationship not found");
    }

    // Verify permission
    await verifyCharacterPermission(validated.sourceId, user.id);

    // Build update data
    const updateData: Partial<CharacterRelationshipWithInclude> = {};
    if (validated.relationshipType !== undefined) updateData.relationshipType = validated.relationshipType;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.strength !== undefined) updateData.strength = validated.strength;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;

    // Update relationship
    const updated = await prisma.characterRelationship.update({
      where: {
        sourceId_targetId: {
          sourceId: validated.sourceId,
          targetId: validated.targetId,
        },
      },
      data: updateData,
      include: {
        source: true,
        target: true,
      },
    });

    // Get world ID for revalidation
    const character = await prisma.character.findUnique({
      where: { id: validated.sourceId },
    });

    if (character) {
      revalidatePath(`/world/${character.gameWorldId}`);
    }

    return updated as CharacterRelationshipWithInclude;
  }, "updateCharacterRelationship");
}

/**
 * Delete a character relationship
 * @param sourceId - Source character ID
 * @param targetId - Target character ID
 * @returns Result with deleted relationship ID or error
 */
export async function deleteCharacterRelationship(
  sourceId: string,
  targetId: string,
): Promise<Result<{ relationshipId: string }>> {
  return safeAsync(async () => {
    // Get authenticated user
    const user = await getAuthenticatedUser();

    // Verify permission
    const character = await verifyCharacterPermission(sourceId, user.id);

    // Delete relationship
    await prisma.characterRelationship.delete({
      where: {
        sourceId_targetId: { sourceId, targetId },
      },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return { relationshipId: `${sourceId}-${targetId}` };
  }, "deleteCharacterRelationship");
}

/**
 * Get all relationships for a character
 * @param characterId - Character ID
 * @returns Object with asSource and asTarget arrays
 */
export async function getCharacterRelationships(characterId: string) {
  try {
    const [asSource, asTarget] = await Promise.all([
      prisma.characterRelationship.findMany({
        where: { sourceId: characterId },
        include: {
          target: {
            select: {
              id: true,
              name: true,
              shortName: true,
              portraitUrl: true,
              characterType: true,
            },
          },
        },
        orderBy: { strength: "desc" },
      }),
      prisma.characterRelationship.findMany({
        where: { targetId: characterId },
        include: {
          source: {
            select: {
              id: true,
              name: true,
              shortName: true,
              portraitUrl: true,
              characterType: true,
            },
          },
        },
        orderBy: { strength: "desc" },
      }),
    ]);

    return {
      asSource,
      asTarget,
    };
  } catch (error) {
    console.error("[getCharacterRelationships] Failed to fetch relationships:", error);
    return { asSource: [], asTarget: [] };
  }
}
