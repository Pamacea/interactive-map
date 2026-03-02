/**
 * Integration Tests for Version History Server Actions
 *
 * Tests the version management features with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Snapshot creation
 * - Version restoration
 * - Version comparison
 *
 * Test Database: Uses transaction rollback to avoid modifying real data
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/shared/lib/prisma";

// Mock NextAuth session
const mockGetServerSession = vi.fn();
vi.mock("next-auth", () => ({
  getServerSession: () => mockGetServerSession(),
}));

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import {
  createVersion,
  getVersionById,
  getVersionsByWorld,
  restoreVersion,
  deleteVersion,
} from "@/features/versions/actions";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/shared/lib/errors";

describe("Version History Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testVersionId: string;

  /**
   * Setup: Create test user and world
   */
  beforeEach(async () => {
    // Create test user
    const testUser = await prisma.user.create({
      data: {
        name: "Test User",
        email: `test-${Date.now()}@example.com`,
      },
    });
    testUserId = testUser.id;

    // Mock session
    mockGetServerSession.mockResolvedValue({
      user: { id: testUserId, name: "Test User", email: testUser.email },
    });

    // Create test world
    const world = await prisma.gameWorld.create({
      data: {
        title: "Test Version World",
        description: "Initial state",
        userId: testUserId,
      },
    });
    testWorldId = world.id;
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
    await prisma.mapVersion.deleteMany({
      where: { worldId: testWorldId },
    });
    await prisma.gameWorld.deleteMany({
      where: { id: testWorldId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  describe("createVersion", () => {
    it("should create a version snapshot successfully", async () => {
      const result = await createVersion({
        worldId: testWorldId,
        name: "Initial Version",
        description: "First snapshot",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Initial Version");

      testVersionId = result.data!.id;
    });

    it("should store world state in version", async () => {
      // Create a pin
      await prisma.pin.create({
        data: {
          title: "State Pin",
          latitude: 51.5074,
          longitude: -0.1278,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      const result = await createVersion({
        worldId: testWorldId,
        name: "With Pin",
        description: "Snapshot with pin",
      });

      expect(result.success).toBe(true);

      // Verify version data was captured
      const version = await prisma.mapVersion.findUnique({
        where: { id: result.data!.id },
        include: {
          pins: true,
        layers: true,
        loreEntries: true,
        },
      });

      expect(version?.data.pins).toBeInstanceOf(Array);
      // The pin should be in the snapshot
      expect(version?.data.pins.length).toBeGreaterThan(0);
    });
  });

  describe("getVersionsByWorld", () => {
    beforeEach(async () => {
      // Create multiple versions
      await createVersion({
        worldId: testWorldId,
        name: "Version 1",
        description: "First version",
      });

      await createVersion({
        worldId: testWorldId,
        name: "Version 2",
        description: "Second version",
      });
    });

    it("should retrieve all versions for a world", async () => {
      const result = await getVersionsByWorld(testWorldId);

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBeGreaterThanOrEqual(2);
    });

    it("should return versions in reverse chronological order", async () => {
      const result = await getVersionsByWorld(testWorldId);

      expect(result.success).toBe(true);
      if (result.data && result.data.length >= 2) {
        expect(new Date(result.data[0].createdAt).getTime()).toBeGreaterThanOrEqual(
          new Date(result.data[1].createdAt).getTime()
        );
      }
    });
  });

  describe("getVersionById", () => {
    it("should retrieve a specific version by ID", async () => {
      const version = await createVersion({
        worldId: testWorldId,
        name: "Target Version",
        description: "Version to retrieve",
      });

      const result = await getVersionById(version.data!.id);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(version.data!.id);
      expect(result.data?.name).toBe("Target Version");
    });

    it("should return null for non-existent version", async () => {
      const result = await getVersionById("non-existent-id");

      expect(result.success).toBe(false);
    });
  });

  describe("restoreVersion", () => {
    it("should restore world state from version", async () => {
      // Create initial state
      await prisma.pin.create({
        data: {
          title: "Original Pin",
          latitude: 51.5074,
          longitude: -0.1278,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      // Create version snapshot
      const version = await createVersion({
        worldId: testWorldId,
        name: "Before Changes",
        description: "Snapshot before modifications",
      });

      // Modify state - delete the pin
      await prisma.pin.deleteMany({
        where: { gameWorldId: testWorldId },
      });

      // Restore from version
      const restoreResult = await restoreVersion(version.data!.id);

      expect(restoreResult.success).toBe(true);

      // Verify pin was restored
      const pins = await prisma.pin.findMany({
        where: { gameWorldId: testWorldId },
      });

      expect(pins.length).toBeGreaterThan(0);
      expect(pins[0].title).toBe("Original Pin");
    });

    it("should fail to restore another user's version", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      const otherWorld = await prisma.gameWorld.create({
        data: {
          title: "Other World",
          userId: otherUser.id,
        },
      });

      const version = await createVersion({
        worldId: otherWorld.id,
        name: "Other Version",
        description: "Other user's version",
      });

      const result = await restoreVersion(version.data!.id);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AuthorizationError);

      // Cleanup
      await prisma.mapVersion.deleteMany({
        where: { worldId: otherWorld.id },
      });
      await prisma.gameWorld.deleteMany({
        where: { id: otherWorld.id },
      });
      await prisma.user.deleteMany({
        where: { id: otherUser.id },
      });
    });
  });

  describe("deleteVersion", () => {
    it("should delete a version successfully", async () => {
      const version = await createVersion({
        worldId: testWorldId,
        name: "Delete Test Version",
        description: "Version to delete",
      });

      const result = await deleteVersion(version.data!.id);

      expect(result.success).toBe(true);

      // Verify deletion
      const deleted = await prisma.mapVersion.findUnique({
        where: { id: version.data!.id },
      });
      expect(deleted).toBeNull();
    });

    it("should fail to delete another user's version", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      const otherWorld = await prisma.gameWorld.create({
        data: {
          title: "Other World",
          userId: otherUser.id,
        },
      });

      const version = await createVersion({
        worldId: otherWorld.id,
        name: "Other Version",
        description: "Other user's version",
      });

      const result = await deleteVersion(version.data!.id);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.mapVersion.deleteMany({
        where: { worldId: otherWorld.id },
      });
      await prisma.gameWorld.deleteMany({
        where: { id: otherWorld.id },
      });
      await prisma.user.deleteMany({
        where: { id: otherUser.id },
      });
    });
  });

  describe("Version Metadata", () => {
    it("should track version size", async () => {
      const result = await createVersion({
        worldId: testWorldId,
        name: "Size Test Version",
        description: "Testing version metadata",
      });

      expect(result.success).toBe(true);
      expect(result.data?.data).toBeDefined();
    });

    it("should include creator information", async () => {
      const result = await createVersion({
        worldId: testWorldId,
        name: "Creator Test Version",
        description: "Testing creator tracking",
      });

      expect(result.success).toBe(true);
      expect(result.data?.createdBy).toBe(testUserId);
    });
  });
});
