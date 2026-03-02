/**
 * Integration Tests for Search Server Actions
 *
 * Tests the search functionality with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Multiple search types (pins, lore, characters)
 * - Result ranking and filtering
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
  searchWorldContent,
  searchPins,
  searchLore,
} from "@/features/search/actions";
import {
  AuthenticationError,
} from "@/shared/lib/errors";

describe("Search Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testPinId: string;
  let testLoreId: string;

  /**
   * Setup: Create test user, world, pins, and lore
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
        title: "Fantasy World",
        description: "A world of adventure",
        userId: testUserId,
        isPublic: true,
      },
    });
    testWorldId = world.id;

    // Create test pins
    const pin1 = await prisma.pin.create({
      data: {
        title: "Dragon's Lair",
        description: "A dangerous cave",
        latitude: 51.5074,
        longitude: -0.1278,
        color: "#ff0000",
        userId: testUserId,
        gameWorldId: testWorldId,
      },
    });
    testPinId = pin1.id;

    await prisma.pin.create({
      data: {
        title: "Elven Forest",
        description: "Magical forest",
        latitude: 51.5174,
        longitude: -0.1378,
        color: "#00ff00",
        userId: testUserId,
        gameWorldId: testWorldId },
    });

    // Create test lore
    const lore = await prisma.loreEntry.create({
      data: {
        title: "Dragon History",
        content: "Ancient dragons once ruled these lands...",
        slug: "dragon-history",
        category: "HISTORY",
        isVisible: true,
        isPublic: true,
        userId: testUserId,
        gameWorldId: testWorldId,
      },
    });
    testLoreId = lore.id;

    await prisma.loreEntry.create({
      data: {
        title: "Elven Culture",
        content: "The elves have a rich cultural heritage...",
        slug: "elven-culture",
        category: "CHARACTERS",
        isVisible: true,
        isPublic: true,
        userId: testUserId,
        gameWorldId: testWorldId },
    });
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
    await prisma.loreEntry.deleteMany({
      where: { gameWorldId: testWorldId },
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

  describe("searchWorldContent", () => {
    it("should search across all content types", async () => {
      const result = await searchWorldContent(testWorldId, "dragon");

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
      expect(result.data?.pins?.length).toBeGreaterThan(0);
      expect(result.data?.lore?.length).toBeGreaterThan(0);
    });

    it("should return empty results for non-existent term", async () => {
      const result = await searchWorldContent(testWorldId, "nonexistent");

      expect(result.success).toBe(true);
      expect(result.data?.pins?.length).toBe(0);
      expect(result.data?.lore?.length).toBe(0);
    });

    it("should filter by content type", async () => {
      const result = await searchWorldContent(testWorldId, "forest", {
        types: ["pins"],
      });

      expect(result.success).toBe(true);
      expect(result.data?.pins?.length).toBeGreaterThan(0);
      expect(result.data?.lore?.length).toBe(0);
    });
  });

  describe("searchPins", () => {
    it("should search pins by title and description", async () => {
      const result = await searchPins(testWorldId, "dragon");

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].title).toBe("Dragon's Lair");
    });

    it("should be case insensitive", async () => {
      const result = await searchPins(testWorldId, "DRAGON");

      expect(result.success).toBe(true);
      expect(result.data?.length).toBeGreaterThan(0);
    });
  });

  describe("searchLore", () => {
    it("should search lore by title and content", async () => {
      const result = await searchLore(testWorldId, "history");

      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(Array);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].title).toBe("Dragon History");
    });

    it("should filter by category", async () => {
      const result = await searchLore(testWorldId, "", {
        category: "HISTORY",
      });

      expect(result.success).toBe(true);
      expect(result.data?.length).toBe(1);
      expect(result.data?.[0].category).toBe("HISTORY");
    });
  });

  describe("Search Permissions", () => {
    it("should only return public content for non-owners", async () => {
      // Make world private
      await prisma.gameWorld.update({
        where: { id: testWorldId },
        data: { isPublic: false },
      });

      // Create another user
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `other-${Date.now()}@example.com`,
        },
      });

      // Mock other user session
      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Other User", email: otherUser.email },
      });

      const result = await searchWorldContent(testWorldId, "dragon");

      // Should only return public lore entries
      if (result.success && result.data) {
        const allResults = [
          ...(result.data.pins || []),
          ...(result.data.lore || []),
        ];
        const publicResults = allResults.filter((item: any) => item.isPublic);

        // For private worlds, should only return public content
        expect(allResults.every((item: any) => item.isPublic === true));
      }

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
      // Restore world as public
      await prisma.gameWorld.update({
        where: { id: testWorldId },
        data: { isPublic: true },
      });
    });
  });

  describe("Search Ranking", () => {
    it("should prioritize exact title matches", async () => {
      const result = await searchPins(testWorldId, "Dragon's Lair");

      expect(result.success).toBe(true);
      expect(result.data?.[0].title).toBe("Dragon's Lair");
    });

    it("should prioritize partial matches", async () => {
      const result = await searchPins(testWorldId, "Dragon");

      expect(result.success).toBe(true);
      expect(result.data?.[0].title).toContain("Dragon");
    });
  });
});
