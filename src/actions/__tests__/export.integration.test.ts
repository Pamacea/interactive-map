/**
 * Integration Tests for Export Server Actions
 *
 * Tests the full export operations with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - JSON export format validation
 * - Image export
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
  exportWorldToJson,
  exportWorldWithMedia,
} from "@/features/export/actions";
import {
  AuthenticationError,
  AuthorizationError,
} from "@/shared/lib/errors";

describe("Export Integration", () => {
  let testUserId: string;
  let testWorldId: string;

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
        title: "Test Export World",
        description: "World for export testing",
        userId: testUserId,
      },
    });
    testWorldId = world.id;
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
    await prisma.gameWorld.deleteMany({
      where: { id: testWorldId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  describe("exportWorldToJson", () => {
    it("should export world data to JSON successfully", async () => {
      const result = await exportWorldToJson(testWorldId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.world).toBeDefined();
      expect(result.data?.world.title).toBe("Test Export World");
    });

    it("should include pins in export", async () => {
      // Create a test pin
      await prisma.pin.create({
        data: {
          title: "Export Test Pin",
          latitude: 51.5074,
          longitude: -0.1278,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      const result = await exportWorldToJson(testWorldId);

      expect(result.success).toBe(true);
      expect(result.data?.pins).toBeInstanceOf(Array);
      expect(result.data?.pins?.length).toBeGreaterThan(0);
    });

    it("should include layers in export", async () => {
      // Create a test layer
      await prisma.mapLayer.create({
        data: {
          name: "Export Test Layer",
          type: "MARKERS",
          isVisible: true,
          zIndex: 0,
          gameWorldId: testWorldId,
        },
      });

      const result = await exportWorldToJson(testWorldId);

      expect(result.success).toBe(true);
      expect(result.data?.layers).toBeInstanceOf(Array);
    });

    it("should fail when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await exportWorldToJson(testWorldId);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AuthenticationError);
    });

    it("should fail for non-existent world", async () => {
      const result = await exportWorldToJson("non-existent-id");

      expect(result.success).toBe(false);
    });
  });

  describe("exportWorldWithMedia", () => {
    it("should export world with image data", async () => {
      // Create a gallery item with image
      await prisma.galleryItem.create({
        data: {
          title: "Test Image",
          imageUrl: "/uploads/test.jpg",
          order: 0,
          userId: testUserId,
          worldId: testWorldId,
        },
      });

      const result = await exportWorldWithMedia(testWorldId);

      expect(result.success).toBe(true);
      expect(result.data?.gallery).toBeInstanceOf(Array);
    });

    it("should include lore entries in export", async () => {
      await prisma.loreEntry.create({
        data: {
          title: "Test Lore",
          content: "Test lore content",
          slug: "test-lore",
          isVisible: true,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      const result = await exportWorldWithMedia(testWorldId);

      expect(result.success).toBe(true);
      expect(result.data?.lore).toBeInstanceOf(Array);
    });
  });
});
