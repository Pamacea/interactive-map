'use server';

import { prisma } from '@/shared/lib/prisma';
import { Prisma } from '@prisma/client';
import { safeAsync, type Result } from '@/shared/lib/errors';
import { getAuthenticatedUser, verifyWorldPermission } from '@/shared/lib/server-helpers';
import { safeLogCollaborationEvent } from '@/features/presence/actions';
import { revalidatePath } from 'next/cache';

export interface CreateVersionInput {
  worldId: string;
  title: string;
  changelog?: string;
  isAuto?: boolean;
}

export async function createVersion(
  input: CreateVersionInput
): Promise<Result<{ version: number; id: string }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(input.worldId, user.id, 'EDITOR');

    // Get current world state
    const world = await prisma.gameWorld.findUnique({
      where: { id: input.worldId },
      include: {
        pins: {
          orderBy: { createdAt: 'asc' },
        },
        layers: {
          orderBy: { zIndex: 'asc' },
        },
        loreEntries: {
          orderBy: { title: 'asc' },
        },
        characters: {
          orderBy: { order: 'asc' },
        },
      },
    });

    if (!world) {
      throw new Error('World not found');
    }

    // Get next version number
    const lastVersion = await prisma.mapVersion.findFirst({
      where: { worldId: input.worldId },
      orderBy: { version: 'desc' },
    });

    const nextVersion = (lastVersion?.version ?? 0) + 1;

    // Create version snapshot
    const version = await prisma.mapVersion.create({
      data: {
        worldId: input.worldId,
        version: nextVersion,
        title: input.title || `v${nextVersion}`,
        changelog: input.changelog,
        isAuto: input.isAuto ?? false,
        createdBy: user.id,
        snapshot: {
          world: {
            title: world.title,
            description: world.description,
            map: world.map,
            isPublic: world.isPublic,
          },
          pins: world.pins.map((p) => ({
            id: p.id,
            title: p.title,
            description: p.description,
            pinType: p.pinType,
            latitude: p.latitude,
            longitude: p.longitude,
            icon: p.icon,
            color: p.color,
            size: p.size,
            opacity: p.opacity,
            isVisible: p.isVisible,
            minZoom: p.minZoom,
            maxZoom: p.maxZoom,
            layerId: p.layerId,
            properties: p.properties,
          })),
          layers: world.layers.map((l) => ({
            id: l.id,
            name: l.name,
            description: l.description,
            imageUrl: l.description,
            offsetX: l.offsetX,
            offsetY: l.offsetY,
            scale: l.scale,
            opacity: l.opacity,
            zIndex: l.zIndex,
            isVisible: l.isVisible,
            isLocked: false, // Not stored in DB yet
            minZoom: l.minZoom,
            maxZoom: l.maxZoom,
          })),
          lore: world.loreEntries.map((le) => ({
            id: le.id,
            title: le.title,
            content: le.content,
            slug: le.slug,
            category: le.category,
            isVisible: le.isVisible,
          })),
          characters: world.characters.map((c) => ({
            id: c.id,
            name: c.name,
            shortName: c.shortName,
            characterType: c.characterType,
            role: c.role,
            portraitUrl: c.portraitUrl,
            isVisible: c.isVisible,
            order: c.order,
          })),
        } as Prisma.InputJsonValue,
      },
    });

    await safeLogCollaborationEvent({
      worldId: input.worldId,
      eventType: 'PIN_CREATED', // Reuse existing event type for now
      targetId: version.id,
      targetType: 'version',
      eventData: { version: nextVersion, title: input.title },
    });

    revalidatePath(`/world/${input.worldId}`);
    return { version: nextVersion, id: version.id };
  }, 'createVersion');
}

export async function getWorldVersions(
  worldId: string
): Promise<Result<Array<{ id: string; version: number; title: string; changelog: string | null; isAuto: boolean; createdAt: Date; user: { id: string; name: string | null; image: string | null } }>>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();
    await verifyWorldPermission(worldId, user.id, 'READER');

    const versions = await prisma.mapVersion.findMany({
      where: { worldId },
      include: {
        user: {
          select: { id: true, name: true, image: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });

    return versions;
  }, 'getWorldVersions');
}

export interface RestoreVersionInput {
  versionId: string;
}

export async function restoreVersion(
  input: RestoreVersionInput
): Promise<Result<{ restoredTo: number }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const version = await prisma.mapVersion.findUnique({
      where: { id: input.versionId },
      include: { world: true },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Only owner can restore
    if (version.world.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: version.worldId,
          userId: user.id,
          permission: 'OWNER',
        },
      });

      if (!member) {
        throw new Error('Only the world owner can restore versions');
      }
    }

    const snapshot = version.snapshot as Prisma.JsonValue;

    // Restore world metadata
    await prisma.gameWorld.update({
      where: { id: version.worldId },
      data: {
        title: snapshot.world?.title,
        description: snapshot.world?.description,
        isPublic: snapshot.world?.isPublic,
      },
    });

    // Delete existing pins and restore from snapshot
    await prisma.pin.deleteMany({ where: { gameWorldId: version.worldId } });
    if (snapshot.pins && Array.isArray(snapshot.pins)) {
      for (const pinData of snapshot.pins) {
        await prisma.pin.create({
          data: {
            ...pinData,
            worldId: version.worldId,
            gameWorldId: version.worldId,
            userId: user.id,
          },
        });
      }
    }

    // Delete and restore layers
    await prisma.mapLayer.deleteMany({ where: { gameWorldId: version.worldId } });
    if (snapshot.layers && Array.isArray(snapshot.layers)) {
      for (const layerData of snapshot.layers) {
        await prisma.mapLayer.create({
          data: {
            name: layerData.name,
            description: layerData.description,
            offsetX: layerData.offsetX ?? 0,
            offsetY: layerData.offsetY ?? 0,
            scale: layerData.scale ?? 1,
            opacity: layerData.opacity ?? 1,
            zIndex: layerData.zIndex ?? 0,
            isVisible: layerData.isVisible ?? true,
            minZoom: layerData.minZoom ?? 0,
            maxZoom: layerData.maxZoom ?? 200,
            gameWorldId: version.worldId,
          },
        });
      }
    }

    // Create a new version documenting the restoration
    await prisma.mapVersion.create({
      data: {
        worldId: version.worldId,
        version: version.version + 1000, // High number to indicate restore
        title: `Restored from v${version.version}`,
        changelog: `Restored world to version ${version.version} (${version.title})`,
        isAuto: false,
        createdBy: user.id,
        snapshot: version.snapshot,
      },
    });

    await safeLogCollaborationEvent({
      worldId: version.worldId,
      eventType: 'PIN_UPDATED', // Reuse existing event type
      targetId: version.id,
      targetType: 'version',
      eventData: { restoredFrom: version.version },
    });

    revalidatePath(`/world/${version.worldId}`);
    return { restoredTo: version.version };
  }, 'restoreVersion');
}

export interface DeleteVersionInput {
  versionId: string;
}

export async function deleteVersion(
  input: DeleteVersionInput
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const version = await prisma.mapVersion.findUnique({
      where: { id: input.versionId },
      include: { world: true },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Only owner can delete
    if (version.world.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: version.worldId,
          userId: user.id,
          permission: 'OWNER',
        },
      });

      if (!member) {
        throw new Error('Only the world owner can delete versions');
      }
    }

    await prisma.mapVersion.delete({
      where: { id: input.versionId },
    });

    await safeLogCollaborationEvent({
      worldId: version.worldId,
      eventType: 'PIN_DELETED', // Reuse existing event type
      targetId: version.id,
      targetType: 'version',
      eventData: { deleted: true },
    });

    revalidatePath(`/world/${version.worldId}`);
    return { success: true };
  }, 'deleteVersion');
}

export interface UpdateVersionInput {
  versionId: string;
  title?: string;
  changelog?: string;
}

export async function updateVersion(
  input: UpdateVersionInput
): Promise<Result<{ success: boolean }>> {
  return safeAsync(async () => {
    const user = await getAuthenticatedUser();

    const version = await prisma.mapVersion.findUnique({
      where: { id: input.versionId },
      include: { world: true },
    });

    if (!version) {
      throw new Error('Version not found');
    }

    // Only owner can update
    if (version.world.userId !== user.id) {
      const member = await prisma.worldMember.findFirst({
        where: {
          gameWorldId: version.worldId,
          userId: user.id,
          permission: 'OWNER',
        },
      });

      if (!member) {
        throw new Error('Only the world owner can update versions');
      }
    }

    await prisma.mapVersion.update({
      where: { id: input.versionId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.changelog !== undefined && { changelog: input.changelog }),
      },
    });

    revalidatePath(`/world/${version.worldId}`);
    return { success: true };
  }, 'updateVersion');
}
