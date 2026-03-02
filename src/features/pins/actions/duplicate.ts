"use server";

import { prisma } from "@/shared/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  safeAsync,
  ValidationError,
  type Result,
} from "@/shared/lib/errors";
import type { Pin } from "@prisma/client";
import {
  getAuthenticatedUser,
  verifyWorldPermission,
} from "@/shared/lib/server-helpers";

/**
 * Duplicate a pin with a slight position offset
 */
export async function duplicatePin(pinId: string): Promise<Result<Pin>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const originalPin = await prisma.pin.findUnique({
      where: { id: pinId },
      include: { pinData: true },
    });

    if (!originalPin) {
      throw new ValidationError("Pin not found");
    }

    await verifyWorldPermission(originalPin.gameWorldId, user.id);

    // Create a duplicate with slight offset and modified name
    const duplicated = await prisma.pin.create({
      data: {
        title: `${originalPin.title} (copy)`,
        description: originalPin.description,
        latitude: originalPin.latitude + 0.01, // Small offset
        longitude: originalPin.longitude + 0.01,
        icon: originalPin.icon,
        color: originalPin.color,
        size: originalPin.size,
        isVisible: originalPin.isVisible,
        properties: originalPin.properties,
        userId: user.id,
        gameWorldId: originalPin.gameWorldId,
        layerId: originalPin.layerId,
        pinType: originalPin.pinType,
        // Copy pinData if exists
        ...(originalPin.pinData && {
          pinData: {
            create: {
              shape: originalPin.pinData.shape,
              customIcon: originalPin.pinData.customIcon,
            },
          },
        }),
      },
    });

    revalidatePath(`/world/${originalPin.gameWorldId}`);

    return duplicated;
  }, "duplicatePin");
}
