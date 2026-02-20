"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  CreateCharacterRelationshipSchema,
  UpdateCharacterRelationshipSchema,
  type CreateCharacterRelationshipInput,
  type UpdateCharacterRelationshipInput,
} from "@/features/characters/logic/character-schemas";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";
import type { CharacterRelationship, Character } from "@prisma/client";

type CharacterRelationshipWithInclude = CharacterRelationship & {
  source: Character;
  target: Character;
};

/**
 * Create a relationship between two characters
 */
export async function createCharacterRelationship(
  data: CreateCharacterRelationshipInput
): Promise<Result<CharacterRelationshipWithInclude>> {
  return safeAsync(async () => {
    const validated = CreateCharacterRelationshipSchema.parse(data);
    const user = await getAuthenticatedUser();

    const sourceCharacter = await verifyCharacterPermission(validated.sourceId, user.id);
    await verifyCharacterPermission(validated.targetId, user.id);

    if (sourceCharacter.gameWorldId) {
      const targetCharacter = await prisma.character.findUnique({
        where: { id: validated.targetId },
      });

      if (targetCharacter?.gameWorldId !== sourceCharacter.gameWorldId) {
        throw new ValidationError("Characters must belong to the same world");
      }
    }

    const existing = await prisma.characterRelationship.findUnique({
      where: {
        sourceId_targetId: {
          sourceId: validated.sourceId,
          targetId: validated.targetId,
        },
      },
    });

    if (existing) {
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

      return updated;
    }

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

    return relationship;
  }, "createCharacterRelationship");
}

/**
 * Update a character relationship
 */
export async function updateCharacterRelationship(
  data: UpdateCharacterRelationshipInput
): Promise<Result<CharacterRelationship>> {
  return safeAsync(async () => {
    const validated = UpdateCharacterRelationshipSchema.parse(data);
    const user = await getAuthenticatedUser();

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

    await verifyCharacterPermission(validated.sourceId, user.id);

    const updateData: Partial<CharacterRelationship> = {};
    if (validated.relationshipType !== undefined) updateData.relationshipType = validated.relationshipType;
    if (validated.description !== undefined) updateData.description = validated.description;
    if (validated.strength !== undefined) updateData.strength = validated.strength;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;

    const updated = await prisma.characterRelationship.update({
      where: {
        sourceId_targetId: {
          sourceId: validated.sourceId,
          targetId: validated.targetId,
        },
      },
      data: updateData,
    });

    const character = await prisma.character.findUnique({
      where: { id: validated.sourceId },
    });

    if (character) {
      revalidatePath(`/world/${character.gameWorldId}`);
    }

    return updated;
  }, "updateCharacterRelationship");
}

/**
 * Delete a character relationship
 */
export async function deleteCharacterRelationship(
  sourceId: string,
  targetId: string
): Promise<Result<{ relationshipId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    const character = await verifyCharacterPermission(sourceId, user.id);

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
  } catch {
    return { asSource: [], asTarget: [] };
  }
}
