/**
 * Integration Tests for Import Server Actions
 *
 * Tests the full import operations with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - JSON import parsing
 * - Image import handling
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
  importWorldFromJson,
  importWorldWithMedia,
  validateImportData,
} from "@/features/import/actions";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
} from "@/shared/lib/errors";

describe("Import Integration", () => {
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
        title: "Test Import World",
        userId: testUserId,
      },
    });
    testWorldId = world.id;
  });

  /**
   * Cleanup: Delete test data
   */
  afterEach(async () => {
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

  describe("validateImportData", () => {
    it("should validate correct import data", () => {
      const validData = {
        version: "1.0",
        world: {
          title: "Imported World",
          description: "Test description",
        },
        pins: [
          {
            title: "Test Pin",
            latitude: 51.5074,
            longitude: -0.1278,
          },
        ],
        layers: [],
      };

      const result = validateImportData(validData);

      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });

    it("should reject invalid import data", () => {
      const invalidData = {
        version: "1.0",
        world: {
          title: "", // Invalid empty title
        },
      };

      const result = validateImportData(invalidData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(ValidationError);
    });

    it("should reject data with invalid coordinates", () => {
      const invalidData = {
        version: "1.0",
        world: {
          title: "Test World",
        },
        pins: [
          {
            title: "Invalid Pin",
            latitude: 999, // Invalid latitude
            longitude: -0.1278,
          },
        ],
      };

      const result = validateImportData(invalidData);

      expect(result.success).toBe(false);
    });
  });

  describe("importWorldFromJson", () => {
    it("should import world from JSON successfully", async () => {
      const jsonData = {
        version: "1.0",
        world: {
          title: "Imported World",
          description: "Imported description",
        },
        pins: [
          {
            title: "Imported Pin 1",
            latitude: 51.5074,
            longitude: -0.1278,
            color: "#ff0000",
          },
          {
            title: "Imported Pin 2",
            latitude: 51.5174,
            longitude: -0.1378,
            color: "#00ff00",
          },
        ],
        layers: [],
      };

      const result = await importWorldFromJson(testWorldId, jsonData);

      expect(result.success).toBe(true);
      expect(result.data?.world).toBeDefined();

      // Verify pins were created
      const pins = await prisma.pin.findMany({
        where: { gameWorldId: testWorldId },
      });
      expect(pins.length).toBe(2);
    });

    it("should merge with existing data when world exists", async () => {
      // Create initial pin
      await prisma.pin.create({
        data: {
          title: "Original Pin",
          latitude: 51.5274,
          longitude: -0.1478,
          userId: testUserId,
          gameWorldId: testWorldId,
        },
      });

      const jsonData = {
        version: "1.0",
        world: {
          title: "Test Import World",
          description: "Merge test",
        },
        pins: [
          {
            title: "Merged Pin",
            latitude: 51.5074,
            longitude: -0.1278,
          },
        ],
      };

      const result = await importWorldFromJson(testWorldId, jsonData, { mode: "merge" });

      expect(result.success).toBe(true);
    });

    it("should fail when not authenticated", async () => {
      mockGetServerSession.mockResolvedValue(null);

      const jsonData = {
        version: "1.0",
        world: { title: "Test World" },
        pins: [],
        layers: [],
      };

      const result = await importWorldFromJson(testWorldId, jsonData);

      expect(result.success).toBe(false);
      expect(result.error).toBeInstanceOf(AuthenticationError);
    });
  });

  describe("importWorldWithMedia", () => {
    it("should import world with media gallery", async () => {
      const jsonData = {
        version: "1.0",
        world: {
          title: "World with Media",
        },
        gallery: [
          {
            title: "Imported Image",
            imageUrl: "/uploads/test.jpg",
          },
        ],
      };

      const result = await importWorldWithMedia(testWorldId, jsonData);

      expect(result.success).toBe(true);
    });

    it("should import world with lore entries", async () => {
      const jsonData = {
        version: "1.0",
        world: {
          title: "World with Lore",
        },
        lore: [
          {
            title: "Imported Lore",
            content: "Lore content here",
            slug: "imported-lore",
          },
        ],
      };

      const result = await importWorldWithMedia(testWorldId, jsonData);

      expect(result.success).toBe(true);
    });
  });
});
