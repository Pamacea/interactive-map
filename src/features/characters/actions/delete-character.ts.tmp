"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";

/**
 * Delete a character
 */
export async function deleteCharacter(id: string): Promise<Result<{ characterId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    const character = await verifyCharacterPermission(id, user.id);

    await prisma.character.delete({
      where: { id },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return { characterId: id };
  }, "deleteCharacter");
}
