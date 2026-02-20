"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { CreateCharacterSchema, type CreateCharacterInput } from "@/features/characters/logic/character-schemas";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyWorldPermission } from "@/shared/lib/server-helpers";
import type { Character } from "@prisma/client";

/**
 * Create a new character in a world
 */
export async function createCharacter(
  data: CreateCharacterInput
): Promise<Result<{ characterId: string; character: Character }>> {
  return safeAsync(async () => {
    const validated = CreateCharacterSchema.parse(data);
    const user = await getAuthenticatedUser();

    await verifyWorldPermission(validated.gameWorldId, user.id);

    const maxOrder = await prisma.character.findFirst({
      where: { gameWorldId: validated.gameWorldId },
      select: { order: true },
      orderBy: { order: "desc" },
    });

    const character = await prisma.character.create({
      data: {
        name: validated.name,
        shortName: validated.shortName,
        characterType: validated.characterType,
        role: validated.role,
        portraitUrl: validated.portraitUrl,
        age: validated.age,
        gender: validated.gender,
        species: validated.species,
        height: validated.height,
        build: validated.build,
        level: validated.level,
        class: validated.class,
        faction: validated.faction,
        stats: validated.stats,
        skills: validated.skills,
        equipment: validated.equipment,
        personality: validated.personality,
        background: validated.background,
        goals: validated.goals,
        fears: validated.fears,
        dialogue: validated.dialogue,
        quests: validated.quests,
        shopInventory: validated.shopInventory,
        isVisible: validated.isVisible ?? true,
        isPublic: validated.isPublic ?? true,
        order: (maxOrder?.order ?? -1) + 1,
        userId: user.id,
        gameWorldId: validated.gameWorldId,
      },
    });

    revalidatePath(`/world/${validated.gameWorldId}`);

    return { characterId: character.id, character };
  }, "createCharacter");
}
