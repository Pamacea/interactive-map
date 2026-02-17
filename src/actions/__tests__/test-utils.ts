/**
 * Integration Test Utilities
 *
 * Helper functions for setting up and tearing down integration tests
 * with proper database transaction rollback to avoid polluting test database
 */

import { prisma } from "@/lib/prisma";

/**
 * Creates a test user with a unique email
 */
export async function createTestUser(overrides?: Partial<{ name: string; email: string }>) {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);

  return prisma.user.create({
    data: {
      name: overrides?.name || `Test User ${timestamp}`,
      email: overrides?.email || `test-${timestamp}-${random}@example.com`,
    },
  });
}

/**
 * Creates a test world owned by the given user
 */
export async function createTestWorld(userId: string, overrides?: Partial<{ title: string; description: string; isPublic: boolean }>) {
  return prisma.gameWorld.create({
    data: {
      title: overrides?.title || `Test World ${Date.now()}`,
      description: overrides?.description || "Test world description",
      isPublic: overrides?.isPublic ?? false,
      userId,
      // Auto-create OWNER member
      members: {
        create: {
          userId,
          permission: "OWNER",
        },
      },
    },
  });
}

/**
 * Creates a test layer for a world
 */
export async function createTestLayer(worldId: string, overrides?: Partial<{ name: string; zIndex: number }>) {
  return prisma.mapLayer.create({
    data: {
      name: overrides?.name || `Test Layer ${Date.now()}`,
      gameWorldId: worldId,
      zIndex: overrides?.zIndex ?? 0,
      opacity: 1.0,
    },
  });
}

/**
 * Creates a test pin for a world
 */
export async function createTestPin(worldId: string, userId: string, overrides?: Partial<{
  title: string;
  pinType: string;
  latitude: number;
  longitude: number;
  layerId: string;
}>) {
  return prisma.pin.create({
    data: {
      title: overrides?.title || `Test Pin ${Date.now()}`,
      pinType: (overrides?.pinType as any) || "CUSTOM",
      latitude: overrides?.latitude ?? 0.5,
      longitude: overrides?.longitude ?? 0.5,
      gameWorldId: worldId,
      userId,
      layerId: overrides?.layerId,
    },
  });
}

/**
 * Creates a test lore entry for a world
 */
export async function createTestLore(worldId: string, userId: string, overrides?: Partial<{
  title: string;
  slug: string;
  category: string;
}>) {
  const timestamp = Date.now();

  return prisma.loreEntry.create({
    data: {
      title: overrides?.title || `Test Lore ${timestamp}`,
      content: "Test lore content",
      slug: overrides?.slug || `test-lore-${timestamp}`,
      category: (overrides?.category as any) || "GENERAL",
      gameWorldId: worldId,
      userId,
    },
  });
}

/**
 * Creates a test character for a world
 */
export async function createTestCharacter(worldId: string, userId: string, overrides?: Partial<{
  name: string;
  characterType: string;
}>) {
  return prisma.character.create({
    data: {
      name: overrides?.name || `Test Character ${Date.now()}`,
      characterType: (overrides?.characterType as any) || "NPC",
      gameWorldId: worldId,
      userId,
    },
  });
}

/**
 * Cleans up all test data for a given user
 * This should be called in afterEach to ensure clean test isolation
 */
export async function cleanupTestData(userId: string) {
  // Delete in order of dependencies to avoid foreign key errors

  // 1. Delete lore references
  const loreEntries = await prisma.loreEntry.findMany({
    where: { userId },
    select: { id: true },
  });
  const loreIds = loreEntries.map((l) => l.id);
  await prisma.loreReference.deleteMany({
    where: {
      OR: [
        { sourceLoreId: { in: loreIds } },
        { targetLoreId: { in: loreIds } },
      ],
    },
  });

  // 2. Delete lore-pin relations
  await prisma.lorePinRelation.deleteMany({
    where: { loreEntryId: { in: loreIds } },
  });

  // 3. Delete character relationships and pin links
  const characters = await prisma.character.findMany({
    where: { userId },
    select: { id: true },
  });
  const characterIds = characters.map((c) => c.id);
  await prisma.characterRelationship.deleteMany({
    where: {
      OR: [
        { sourceId: { in: characterIds } },
        { targetId: { in: characterIds } },
      ],
    },
  });
  await prisma.characterPinRelation.deleteMany({
    where: { characterId: { in: characterIds } },
  });

  // 4. Delete pins (includes gallery, comments via cascade)
  const pins = await prisma.pin.findMany({
    where: { userId },
    select: { id: true, gameWorldId: true },
  });

  // 5. Delete lore entries
  await prisma.loreEntry.deleteMany({
    where: { userId },
  });

  // 6. Delete pins
  await prisma.pin.deleteMany({
    where: { userId },
  });

  // 7. Delete characters
  await prisma.character.deleteMany({
    where: { userId },
  });

  // 8. Delete layers (needs world IDs)
  const worlds = await prisma.gameWorld.findMany({
    where: { userId },
    select: { id: true },
  });
  await prisma.mapLayer.deleteMany({
    where: { gameWorldId: { in: worlds.map((w) => w.id) } },
  });

  // 9. Delete world members
  await prisma.worldMember.deleteMany({
    where: { userId },
  });

  // 10. Delete worlds
  await prisma.gameWorld.deleteMany({
    where: { userId },
  });

  // 11. Finally delete the user
  await prisma.user.delete({
    where: { id: userId },
  });
}

/**
 * Creates a complete test environment with user, world, layer, pin, lore, and character
 * Returns all created entities for use in tests
 */
export async function createTestEnvironment() {
  const user = await createTestUser();
  const world = await createTestWorld(user.id);
  const layer = await createTestLayer(world.id);
  const pin = await createTestPin(world.id, user.id, { layerId: layer.id });
  const lore = await createTestLore(world.id, user.id);
  const character = await createTestCharacter(world.id, user.id);

  return {
    user,
    world,
    layer,
    pin,
    lore,
    character,
  };
}

/**
 * Mock session for NextAuth
 */
export function createMockSession(user: { id: string; name: string | null; email: string | null }) {
  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
  };
}

/**
 * Type for test result with success/error
 */
export type TestResult<T> =
  | { success: true; data: T }
  | { success: false; error: Error };

/**
 * Asserts that a result is successful and returns the data
 * Throws if the result is an error
 */
export function assertSuccess<T>(result: TestResult<T>): T {
  if (!result.success) {
    throw result.error;
  }
  return result.data;
}

/**
 * Asserts that a result is an error
 * Throws if the result is successful
 */
export function assertError<T>(result: TestResult<T>): Error {
  if (result.success) {
    throw new Error("Expected error but got success");
  }
  return result.error;
}
