"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import { safeAsync, ValidationError, type Result } from "@/shared/lib/errors";
import { getAuthenticatedUser, verifyCharacterPermission } from "@/shared/lib/server-helpers";
import type { Character } from "@prisma/client";

/**
 * Upload a character portrait
 */
export async function uploadCharacterPortrait(
  characterId: string,
  formData: FormData
): Promise<Result<{ portraitUrl: string; character: Character }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    const character = await verifyCharacterPermission(characterId, user.id);

    const file = formData.get("file") as File;

    if (!file) {
      throw new ValidationError("No file provided");
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      throw new ValidationError("Invalid file type. Please upload a JPEG, PNG, WebP, or GIF image.");
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new ValidationError("File size must be less than 5MB");
    }

    const { writeFile, mkdir } = await import("fs/promises");
    const path = await import("path");
    const uploadsDir = path.default.join(process.cwd(), "public", "uploads", "characters", "portraits");

    try {
      await mkdir(uploadsDir, { recursive: true });
    } catch {
      // Directory might already exist
    }

    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    const _ext = path.default.extname(file.name);
    const fileName = `${characterId}-${timestamp}-${randomId}${_ext}`;
    const filePath = path.default.join(uploadsDir, fileName);

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const portraitPath = `/uploads/characters/portraits/${fileName}`;

    const updatedCharacter = await prisma.character.update({
      where: { id: characterId },
      data: { portraitUrl: portraitPath },
    });

    revalidatePath(`/world/${character.gameWorldId}`);

    return {
      portraitUrl: portraitPath,
      character: updatedCharacter,
    };
  }, "uploadCharacterPortrait");
}
