"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath, revalidateTag } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";
import { existsSync } from "fs";
import {
  safeAsync,
  FileUploadError,
  type Result,
} from "@/shared/lib/errors";
import {
  getAuthenticatedUser,
} from "@/shared/lib/server-helpers";
import { createLogger } from "@/shared/lib/logger";

const logger = createLogger("worlds:create");

const CACHE_TAGS = {
  WORLDS: "worlds",
  PUBLIC_WORLDS: "public-worlds",
};

function revalidatePublicWorlds() {
  revalidatePath("/explore");
  revalidateTag(CACHE_TAGS.PUBLIC_WORLDS);
}

/**
 * Create a new world
 */
export async function createWorld(data: {
  title: string;
  description: string;
  isPublic: boolean;
  map?: File;
}): Promise<Result<{ worldId: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    let mapPath: string | undefined;

    if (data.map) {
      const bytes = await data.map.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const timestamp = Date.now();
      const _fileExtension = data.map.name.split(".").pop();
      const fileName = `${timestamp}-${data.map.name}`;
      const uploadsDir = path.join(process.cwd(), "public", "uploads");

      if (!existsSync(uploadsDir)) {
        await writeFile(path.join(uploadsDir, ".gitkeep"), "");
      }

      const filePath = path.join(uploadsDir, fileName);

      try {
        await writeFile(filePath, buffer);
        mapPath = `/uploads/${fileName}`;
      } catch (error) {
        logger.error("Failed to save map image:", error);
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
