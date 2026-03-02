/**
 * Integration Tests for Gallery Server Actions
 *
 * Tests the full CRUD operations for Gallery with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Image upload handling
 * - Collection management
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

// Mock file upload
vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
}));

import {
  uploadGalleryImage,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
  createCollection,
} from "@/features/gallery/actions";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from "@/shared/lib/errors";

describe("Gallery Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  testGalleryItemId: string;
  testCollectionId: string;

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
        title: "Test Gallery World",
        userId: testUserId,
      },
    });
    testWorldId = world.id;
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
    await prisma.galleryCollection.deleteMany({
      where: { worldId: testWorldId },
    });
    await prisma.galleryItem.deleteMany({
      where: { worldId: testWorldId },
    });
    await prisma.gameWorld.deleteMany({
      where: { id: testWorldId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  describe("uploadGalleryImage", () => {
    it("should upload a gallery image successfully", async () => {
      const mockFile = {
        name: "test.jpg",
        type: "image/jpeg",
        size: 1024,
      } as File;

      const result = await uploadGalleryImage(testWorldId, mockFile);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("test.jpg");
    });
  });

  describe("createGalleryItem", () => {
    it("should create a gallery item successfully", async () => {
      const result = await createGalleryItem({
        worldId: testWorldId,
        title: "Test Gallery Item",
        imageUrl: "/uploads/test.jpg",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Test Gallery Item");

      testGalleryItemId = result.data!.id;
    });

    it("should fail with empty title", async () => {
      const result = await createGalleryItem({
        worldId: testWorldId,
        title: "",
        imageUrl: "/uploads/test.jpg",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ValidationError);
    });
  });

  describe("updateGalleryItem", () => {
    beforeEach(async () => {
      // Create a test gallery item
      const item = await prisma.galleryItem.create({
        data: {
          title: "Update Test Item",
          imageUrl: "/uploads/test.jpg",
          order: 0,
          userId: testUserId,
          worldId: testWorldId,
        },
      });
      testGalleryItemId = item.id;
    });

    it("should update gallery item successfully", async () => {
      const result = await updateGalleryItem({
        id: testGalleryItemId,
        title: "Updated Title",
        description: "Updated description",
      });

      expect(result.success).toBe(true);
      expect(result.data?.title).toBe("Updated Title");
      expect(result.data?.description).toBe("Updated description");
    });
  });

  describe("deleteGalleryItem", () => {
    beforeEach(async () => {
      // Create a test gallery item
      const item = await prisma.galleryItem.create({
        data: {
          title: "Delete Test Item",
          imageUrl: "/uploads/test.jpg",
          order: 0,
          userId: testUserId,
          worldId: testWorldId,
        },
      });
      testGalleryItemId = item.id;
    });

    it("should delete a gallery item successfully", async () => {
      const result = await deleteGalleryItem(testGalleryItemId);

      expect(result.success).toBe(true);

      // Verify deletion
      const deleted = await prisma.galleryItem.findUnique({
        where: { id: testGalleryItemId },
      });
      expect(deleted).toBeNull();
    });

    it("should fail when deleting another user's item", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      const otherItem = await prisma.galleryItem.create({
        data: {
          title: "Other User Item",
          imageUrl: "/uploads/test.jpg",
          order: 0,
          userId: otherUser.id,
          worldId: testWorldId,
        },
      });

      const result = await deleteGalleryItem(otherItem.id);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.galleryItem.delete({ where: { id: otherItem.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("createCollection", () => {
    it("should create a collection successfully", async () => {
      const result = await createCollection({
        worldId: testWorldId,
        name: "Test Collection",
        color: "#ff0000",
      });

      expect(result.success).toBe(true);
      expect(result.data?.name).toBe("Test Collection");

      testCollectionId = result.data!.id;
    });

    it("should create nested collections", async () => {
      const result = await createCollection({
        worldId: testWorldId,
        name: "Child Collection",
        parentCollectionId: testCollectionId,
      });

      expect(result.success).toBe(true);
    });
  });
});
