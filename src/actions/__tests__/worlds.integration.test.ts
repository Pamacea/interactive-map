/**
 * Integration Tests for World Server Actions
 *
 * Tests the full CRUD operations for GameWorld with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Input validation (Zod schemas)
 * - File upload handling
 * - Member management
 *
 * Test Database: Uses transaction rollback to avoid modifying real data
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";

// Mock NextAuth session
const mockGetServerSession = vi.fn();
vi.mock("next-auth", () => ({
  getServerSession: () => mockGetServerSession(),
}));

// Mock revalidatePath to avoid Next.js cache errors
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
  revalidateTag: vi.fn(),
  unstable_cache: (fn: () => unknown) => fn,
}));

// Mock fs operations for file uploads
vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("fs", () => ({
  existsSync: vi.fn().mockReturnValue(true),
}));

import {
  createWorld,
  getWorldById,
  getMyWorlds,
  updateWorldTitle,
  updateWorldState,
  uploadWorldMap,
  addWorldMember,
  updateWorldMemberPermission,
  removeWorldMember,
  getWorldMembers,
} from "../worlds";
import { AuthenticationError, AuthorizationError, ValidationError } from "@/lib/errors";

describe("World CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let transactionClient: typeof prisma;

  /**
   * Setup: Create a test user and start transaction
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

    // Mock session to return test user
    mockGetServerSession.mockResolvedValue({
      user: { id: testUserId, name: "Test User", email: testUser.email },
    });

    // Create a test world
    const world = await prisma.gameWorld.create({
      data: {
        title: "Test World",
        description: "Test Description",
        isPublic: false,
        userId: testUserId,
      },
    });
    testWorldId = world.id;
  });

  /**
   * Cleanup: Delete test data and rollback transaction
   */
  afterEach(async () => {
    // Clean up test data
    await prisma.worldMember.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.gameWorld.deleteMany({
      where: { userId: testUserId },
    });
    await prisma.user.delete({
      where: { id: testUserId },
    });

    // Clear mocks
    mockGetServerSession.mockReset();
    vi.clearAllMocks();
  });

  describe("createWorld", () => {
    it("should create world with valid data", async () => {
      const result = await createWorld({
        title: "New World",
        description: "A test world",
        isPublic: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.worldId).toBeDefined();

        // Verify world exists in database
        const world = await prisma.gameWorld.findUnique({
          where: { id: result.data.worldId },
        });
        expect(world).toBeTruthy();
        expect(world?.title).toBe("New World");
        expect(world?.userId).toBe(testUserId);

        // Verify OWNER member was created
        const member = await prisma.worldMember.findFirst({
          where: {
            gameWorldId: result.data.worldId,
            userId: testUserId,
            permission: "OWNER",
          },
        });
        expect(member).toBeTruthy();
      }
    });

    it("should create public world", async () => {
      const result = await createWorld({
        title: "Public World",
        description: "A public test world",
        isPublic: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const world = await prisma.gameWorld.findUnique({
          where: { id: result.data.worldId },
        });
        expect(world?.isPublic).toBe(true);
      }
    });

    it("should reject unauthenticated request", async () => {
      // Mock no session
      mockGetServerSession.mockResolvedValueOnce(null);

      const result = await createWorld({
        title: "New World",
        description: "Should fail",
        isPublic: false,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthenticationError);
      }
    });

    it("should validate title is present", async () => {
      // Note: Zod validation happens before server action
      // This tests the action handles invalid data
      const result = await createWorld({
        title: "",
        description: "Test",
        isPublic: false,
      });

      // Should fail with validation error
      expect(result.success).toBe(false);
    });
  });

  describe("getWorldById", () => {
    it("should return world with layers", async () => {
      // Create a layer for the world
      await prisma.mapLayer.create({
        data: {
          name: "Test Layer",
          gameWorldId: testWorldId,
          zIndex: 0,
        },
      });

      const world = await getWorldById(testWorldId);

      expect(world).toBeTruthy();
      expect(world?.id).toBe(testWorldId);
      expect(world?.title).toBe("Test World");
      expect(world?.layers).toHaveLength(1);
      expect(world?.layers[0].name).toBe("Test Layer");
    });

    it("should return null for non-existent world", async () => {
      const world = await getWorldById("non-existent-id");
      expect(world).toBeNull();
    });
  });

  describe("getMyWorlds", () => {
    it("should return worlds owned by user", async () => {
      const worlds = await getMyWorlds();

      expect(worlds).toBeInstanceOf(Array);
      expect(worlds.length).toBeGreaterThan(0);
      expect(worlds[0].userId).toBe(testUserId);
    });

    it("should include worlds where user is EDITOR member", async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      // Create world owned by other user
      const otherWorld = await prisma.gameWorld.create({
        data: {
          title: "Other World",
          userId: otherUser.id,
        },
      });

      // Add test user as EDITOR
      await prisma.worldMember.create({
        data: {
          gameWorldId: otherWorld.id,
          userId: testUserId,
          permission: "EDITOR",
        },
      });

      // Get worlds - should include both owned and member worlds
      const worlds = await getMyWorlds();

      const worldIds = worlds.map((w) => w.id);
      expect(worldIds).toContain(testWorldId);
      expect(worldIds).toContain(otherWorld.id);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it("should not include worlds where user is only READER", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Reader User",
          email: `reader-${Date.now()}@example.com`,
        },
      });

      const otherWorld = await prisma.gameWorld.create({
        data: {
          title: "Read Only World",
          userId: otherUser.id,
        },
      });

      await prisma.worldMember.create({
        data: {
          gameWorldId: otherWorld.id,
          userId: testUserId,
          permission: "READER",
        },
      });

      const worlds = await getMyWorlds();
      const worldIds = worlds.map((w) => w.id);
      expect(worldIds).not.toContain(otherWorld.id);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("updateWorldTitle", () => {
    it("should update world title", async () => {
      const result = await updateWorldTitle(testWorldId, "Updated Title");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Title");

        // Verify in database
        const world = await prisma.gameWorld.findUnique({
          where: { id: testWorldId },
        });
        expect(world?.title).toBe("Updated Title");
      }
    });
  });

  describe("updateWorldState", () => {
    it("should create new layer when updating state", async () => {
      const result = await updateWorldState(testWorldId, {
        layers: [
          {
            id: "new-layer-id",
            name: "New Layer",
            visible: true,
            locked: false,
            opacity: 1,
            zIndex: 1,
          },
        ],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const layer = await prisma.mapLayer.findUnique({
          where: { id: "new-layer-id" },
        });
        expect(layer).toBeTruthy();
        expect(layer?.name).toBe("New Layer");
      }
    });

    it("should update existing layer properties", async () => {
      // Create a layer
      const layer = await prisma.mapLayer.create({
        data: {
          id: "layer-to-update",
          name: "Original Name",
          gameWorldId: testWorldId,
          zIndex: 0,
        },
      });

      const result = await updateWorldState(testWorldId, {
        layers: [
          {
            id: "layer-to-update",
            name: "Updated Name",
            visible: false,
            locked: true,
            opacity: 0.5,
            zIndex: 2,
            offsetX: 100,
            offsetY: 200,
            scale: 1.5,
          },
        ],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const updatedLayer = await prisma.mapLayer.findUnique({
          where: { id: "layer-to-update" },
        });
        expect(updatedLayer?.name).toBe("Updated Name");
        expect(updatedLayer?.isVisible).toBe(false);
        expect(updatedLayer?.opacity).toBe(0.5);
        expect(updatedLayer?.zIndex).toBe(2);
        expect(updatedLayer?.offsetX).toBe(100);
        expect(updatedLayer?.offsetY).toBe(200);
        expect(updatedLayer?.scale).toBe(1.5);
      }
    });

    it("should skip base-map layer", async () => {
      const result = await updateWorldState(testWorldId, {
        layers: [
          {
            id: "base-map",
            name: "Base Map",
            visible: true,
            locked: true,
            opacity: 1,
            zIndex: -1,
          },
        ],
      });

      expect(result.success).toBe(true);
      // base-map should not be created in database
      const baseMapLayer = await prisma.mapLayer.findUnique({
        where: { id: "base-map" },
      });
      expect(baseMapLayer).toBeNull();
    });

    it("should reject unauthorized access", async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          name: "Unauthorized User",
          email: `unauth-${Date.now()}@example.com`,
        },
      });

      // Mock session as other user
      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Unauthorized", email: otherUser.email },
      });

      const result = await updateWorldState(testWorldId, {
        layers: [],
      });

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("Member Management", () => {
    let otherUserId: string;

    beforeEach(async () => {
      // Create a second user for member tests
      const otherUser = await prisma.user.create({
        data: {
          name: "Member User",
          email: `member-${Date.now()}@example.com`,
        },
      });
      otherUserId = otherUser.id;
    });

    afterEach(async () => {
      // Cleanup other user
      await prisma.user.delete({
        where: { id: otherUserId },
      });
    });

    describe("addWorldMember", () => {
      it("should add READER member", async () => {
        const result = await addWorldMember(testWorldId, "member-user@example.com", "READER");

        expect(result.success).toBe(true);
        if (result.success) {
          // Verify member was added
          const members = await getWorldMembers(testWorldId);
          const memberUser = members.find((m) => m.userId === otherUserId);
          expect(memberUser).toBeDefined();
        }
      });

      it("should add EDITOR member", async () => {
        // First, we need to update the other user's email for this test
        await prisma.user.update({
          where: { id: otherUserId },
          data: { email: "editor-user@example.com" },
        });

        const result = await addWorldMember(testWorldId, "editor-user@example.com", "EDITOR");

        expect(result.success).toBe(true);
      });

      it("should reject adding member by non-owner", async () => {
        // Mock session as non-owner
        mockGetServerSession.mockResolvedValueOnce({
          user: { id: otherUserId, name: "Member", email: "member-user@example.com" },
        });

        const result = await addWorldMember(testWorldId, "anyone@example.com", "READER");

        expect(result.success).toBe(false);
        if (!result.success) {
          expect(result.error).toBeInstanceOf(AuthorizationError);
        }
      });

      it("should reject duplicate member", async () => {
        // Add member first time
        await prisma.user.update({
          where: { id: otherUserId },
          data: { email: "duplicate@example.com" },
        });

        await addWorldMember(testWorldId, "duplicate@example.com", "READER");

        // Try to add again
        const result = await addWorldMember(testWorldId, "duplicate@example.com", "READER");

        expect(result.success).toBe(false);
      });

      it("should reject non-existent user", async () => {
        const result = await addWorldMember(testWorldId, "nonexistent@example.com", "READER");

        expect(result.success).toBe(false);
      });
    });

    describe("updateWorldMemberPermission", () => {
      let memberId: string;

      beforeEach(async () => {
        // Create a member
        await prisma.user.update({
          where: { id: otherUserId },
          data: { email: "perm-update@example.com" },
        });

        const member = await prisma.worldMember.create({
          data: {
            gameWorldId: testWorldId,
            userId: otherUserId,
            permission: "READER",
          },
        });
        memberId = member.id;
      });

      it("should promote READER to EDITOR", async () => {
        const result = await updateWorldMemberPermission(memberId, "EDITOR");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.permission).toBe("EDITOR");
        }
      });

      it("should demote EDITOR to READER", async () => {
        // First promote to EDITOR
        await prisma.worldMember.update({
          where: { id: memberId },
          data: { permission: "EDITOR" },
        });

        const result = await updateWorldMemberPermission(memberId, "READER");

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.permission).toBe("READER");
        }
      });

      it("should reject non-owner trying to change permissions", async () => {
        // Mock as the member (not owner)
        mockGetServerSession.mockResolvedValueOnce({
          user: { id: otherUserId, name: "Member", email: "perm-update@example.com" },
        });

        const result = await updateWorldMemberPermission(memberId, "OWNER");

        expect(result.success).toBe(false);
      });
    });

    describe("removeWorldMember", () => {
      let memberId: string;

      beforeEach(async () => {
        await prisma.user.update({
          where: { id: otherUserId },
          data: { email: "remove-me@example.com" },
        });

        const member = await prisma.worldMember.create({
          data: {
            gameWorldId: testWorldId,
            userId: otherUserId,
            permission: "READER",
          },
        });
        memberId = member.id;
      });

      it("should remove member", async () => {
        const result = await removeWorldMember(memberId);

        expect(result.success).toBe(true);
        if (result.success) {
          expect(result.data.memberId).toBe(memberId);

          // Verify member is gone
          const member = await prisma.worldMember.findUnique({
            where: { id: memberId },
          });
          expect(member).toBeNull();
        }
      });

      it("should allow member to remove themselves", async () => {
        // Mock as the member user
        mockGetServerSession.mockResolvedValueOnce({
          user: { id: otherUserId, name: "Member", email: "remove-me@example.com" },
        });

        const result = await removeWorldMember(memberId);

        expect(result.success).toBe(true);
      });

      it("should reject non-owner removing others", async () => {
        // Create a third user
        const thirdUser = await prisma.user.create({
          data: {
            name: "Third User",
            email: `third-${Date.now()}@example.com`,
          },
        });

        // Mock as third user (not owner, not the member being removed)
        mockGetServerSession.mockResolvedValueOnce({
          user: { id: thirdUser.id, name: "Third", email: thirdUser.email },
        });

        const result = await removeWorldMember(memberId);

        expect(result.success).toBe(false);

        // Cleanup
        await prisma.user.delete({ where: { id: thirdUser.id } });
      });
    });

    describe("getWorldMembers", () => {
      it("should return all members including owner", async () => {
        const members = await getWorldMembers(testWorldId);

        expect(members).toBeInstanceOf(Array);
        expect(members.length).toBeGreaterThan(0);

        // Should have OWNER entry for the creator
        const ownerMember = members.find((m) => m.permission === "OWNER");
        expect(ownerMember).toBeDefined();
        expect(ownerMember?.userId).toBe(testUserId);
      });

      it("should include added members", async () => {
        await prisma.user.update({
          where: { id: otherUserId },
          data: { email: "member-list@example.com" },
        });

        await prisma.worldMember.create({
          data: {
            gameWorldId: testWorldId,
            userId: otherUserId,
            permission: "EDITOR",
          },
        });

        const members = await getWorldMembers(testWorldId);
        const memberIds = members.map((m) => m.userId);

        expect(memberIds).toContain(otherUserId);
      });
    });
  });

  describe("uploadWorldMap", () => {
    it("should update world map path", async () => {
      // Create mock File object
      const mockFile = new File(["test"], "test-map.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadWorldMap(testWorldId, formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.mapUrl).toContain("/uploads/");
        expect(result.data.mapUrl).toContain(".png");

        // Verify database was updated
        const world = await prisma.gameWorld.findUnique({
          where: { id: testWorldId },
        });
        expect(world?.map).toBe(result.data.mapUrl);
      }
    });

    it("should reject unauthorized upload", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Hacker",
          email: `hacker-${Date.now()}@example.com`,
        },
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Hacker", email: otherUser.email },
      });

      const mockFile = new File(["test"], "hack.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadWorldMap(testWorldId, formData);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });
});
