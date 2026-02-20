"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { UpdateCharacterSchema, type UpdateCharacterInput } from "@/features/characters/logic/character-schemas";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";
import type { Character } from "@prisma/client";

/**
 * Update an existing character
 */
export async function updateCharacter(
  data: UpdateCharacterInput
): Promise<Result<Character>> {
  return safeAsync(async () => {
    const validated = UpdateCharacterSchema.parse(data);
    const user = await getAuthenticatedUser();

    const existingCharacter = await verifyCharacterPermission(validated.id, user.id);

    const updateData: Partial<Character> = {};
    if (validated.name !== undefined) updateData.name = validated.name;
    if (validated.shortName !== undefined) updateData.shortName = validated.shortName;
    if (validated.characterType !== undefined) updateData.characterType = validated.characterType;
    if (validated.role !== undefined) updateData.role = validated.role;
    if (validated.portraitUrl !== undefined) updateData.portraitUrl = validated.portraitUrl;
    if (validated.age !== undefined) updateData.age = validated.age;
    if (validated.gender !== undefined) updateData.gender = validated.gender;
    if (validated.species !== undefined) updateData.species = validated.species;
    if (validated.height !== undefined) updateData.height = validated.height;
    if (validated.build !== undefined) updateData.build = validated.build;
    if (validated.level !== undefined) updateData.level = validated.level;
    if (validated.class !== undefined) updateData.class = validated.class;
    if (validated.faction !== undefined) updateData.faction = validated.faction;
    if (validated.stats !== undefined) updateData.stats = validated.stats;
    if (validated.skills !== undefined) updateData.skills = validated.skills;
    if (validated.equipment !== undefined) updateData.equipment = validated.equipment;
    if (validated.personality !== undefined) updateData.personality = validated.personality;
    if (validated.background !== undefined) updateData.background = validated.background;
    if (validated.goals !== undefined) updateData.goals = validated.goals;
    if (validated.fears !== undefined) updateData.fears = validated.fears;
    if (validated.dialogue !== undefined) updateData.dialogue = validated.dialogue;
    if (validated.quests !== undefined) updateData.quests = validated.quests;
    if (validated.shopInventory !== undefined) updateData.shopInventory = validated.shopInventory;
    if (validated.isVisible !== undefined) updateData.isVisible = validated.isVisible;
    if (validated.isPublic !== undefined) updateData.isPublic = validated.isPublic;
    if (validated.order !== undefined) updateData.order = validated.order;

    const character = await prisma.character.update({
      where: { id: validated.id },
      data: updateData,
    });

    revalidatePath(`/world/${existingCharacter.gameWorldId}`);

    return character;
  }, "updateCharacter");
}

/**
 * Toggle character visibility
 */
export async function toggleCharacterVisibility(id: string): Promise<Result<Character>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    const character = await verifyCharacterPermission(id, user.id);

    const updated = await prisma.character.update({
      where: { id },
      data: { isVisible: !character.isVisible },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return updated;
  }, "toggleCharacterVisibility");
}

/**
 * Batch update character orders
 */
export async function reorderCharacters(
  gameWorldId: string,
  updates: Array<{ id: string; order: number }>
): Promise<Result<Character[]>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(gameWorldId, user.id);

    const characters = await Promise.all(
      updates.map(({ id }) =>
        prisma.character.findUnique({
          where: { id },
          select: { id: true, gameWorldId: true },
        })
      )
    );

    for (const character of characters) {
      if (!character) {
        throw new ValidationError("One or more characters not found");
      }
      if (character.gameWorldId !== gameWorldId) {
        throw new ValidationError("All characters must belong to the same world");
      }
    }

    const updatedCharacters = await Promise.all(
      updates.map(({ id, order }) =>
        prisma.character.update({
          where: { id },
          data: { order },
        })
      )
    );

    return updatedCharacters;
  }, "reorderCharacters");
}
