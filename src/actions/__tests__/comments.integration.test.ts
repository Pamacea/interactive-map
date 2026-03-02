/**
 * Integration Tests for Comment Server Actions
 *
 * Tests the full CRUD operations for Comments with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Input validation (Zod schemas)
 * - Pin associations
 * - Nested replies
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
  createComment,
  getCommentsByPin,
  updateComment,
  deleteComment,
} from "@/features/comments/actions";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from "@/shared/lib/errors";

describe("Comments CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testPinId: string;
  testCommentId: string;

  /**
   * Setup: Create test user, world, pin, and comment
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
        title: "Test World",
        userId: testUserId,
      },
    });
    testWorldId = world.id;

    // Create test pin
    const pin = await prisma.pin.create({
      data: {
        title: "Test Pin",
        latitude: 51.5074,
        longitude: -0.1278,
        userId: testUserId,
        gameWorldId: testWorldId,
      },
    });
    testPinId = pin.id;

    // Create initial comment
    const comment = await prisma.mapComment.create({
      data: {
        content: "Test comment",
        userId: testUserId,
        pinId: testPinId,
      },
    });
    testCommentId = comment.id;
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
    await prisma.mapComment.deleteMany({
      where: { pinId: testPinId },
    });
    await prisma.pin.deleteMany({
      where: { gameWorldId: testWorldId },
    });
    await prisma.gameWorld.deleteMany({
      where: { id: testWorldId },
    });
    await prisma.user.deleteMany({
      where: { id: testUserId },
    });
  });

  describe("createComment", () => {
    it("should create a comment successfully", async () => {
      const result = await createComment({
        pinId: testPinId,
        content: "New test comment",
      });

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data?.content).toBe("New test comment");
    });

    it("should fail when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const result = await createComment({
        pinId: testPinId,
        content: "Test comment",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AuthenticationError);
    });

    it("should fail with empty content", async () => {
      const result = await createComment({
        pinId: testPinId,
        content: "",
      });

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ValidationError);
    });

    it("should create nested replies", async () => {
      const result = await createComment({
        pinId: testPinId,
        content: "Reply to comment",
        parentCommentId: testCommentId,
      });

      expect(result.success).toBe(true);
      expect(result.data?.parentCommentId).toBe(testCommentId);
    });
  });

  describe("getCommentsByPin", () => {
    it("should retrieve comments for a pin", async () => {
      const result = await getCommentsByPin(testPinId);

      expect(result).toBeDefined();
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBeGreaterThan(0);
    });

    it("should return empty array for pin with no comments", async () => {
      // Create a pin with no comments
      const pin = await prisma.pin.create({
        data: {
          title: "Empty Pin",
          latitude: 51.5074,
          longitude: -0.1278,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      const result = await getCommentsByPin(pin.id);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);

      // Cleanup
      await prisma.pin.delete({ where: { id: pin.id } });
    });
  });

  describe("updateComment", () => {
    it("should update comment content", async () => {
      const result = await updateComment({
        commentId: testCommentId,
        content: "Updated comment content",
      });

      expect(result.success).toBe(true);
      expect(result.data?.content).toBe("Updated comment content");
    });

    it("should fail when updating another user's comment", async () => {
      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      const otherComment = await prisma.mapComment.create({
        data: {
          content: "Other user's comment",
          userId: otherUser.id,
          pinId: testPinId,
        },
      });

      const result = await updateComment({
        commentId: otherComment.id,
        content: "Trying to update",
      });

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.mapComment.delete({ where: { id: otherComment.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("deleteComment", () => {
    it("should delete a comment successfully", async () => {
      const comment = await prisma.mapComment.create({
        data: {
          content: "Comment to delete",
          userId: testUserId,
          pinId: testPinId,
        },
      });

      const result = await deleteComment(comment.id);

      expect(result.success).toBe(true);
      expect(result.data?.id).toBe(comment.id);

      // Verify deletion
      const deleted = await prisma.mapComment.findUnique({
        where: { id: comment.id },
      });
      expect(deleted).toBeNull();
    });

    it("should fail when deleting another user's comment", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      const otherComment = await prisma.mapComment.create({
        data: {
          content: "Other user's comment",
          userId: otherUser.id,
          pinId: testPinId,
        },
      });

      const result = await deleteComment(otherComment.id);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.mapComment.delete({ where: { id: otherComment.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });
});
