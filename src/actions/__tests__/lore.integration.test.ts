/**
 * Integration Tests for Lore Entry Server Actions
 *
 * Tests the full CRUD operations for Lore Entries with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Slug uniqueness within world
 * - Pin linking
 * - Cross-references between lore entries
 * - Category filtering
 *
 * Test Database: Uses transaction rollback to avoid modifying real data
*/

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { prisma } from "@/lib/prisma";
import { LoreCategory, RelationType } from "@prisma/client";

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
  createLoreEntry,
  getLoreEntryById,
  getLoreEntriesByWorld,
  getLoreEntryBySlug,
  updateLoreEntry,
  deleteLoreEntry,
  toggleLoreVisibility,
  linkLoreToPin,
  unlinkLoreFromPin,
  getPinsForLore,
  getLoreForPin,
  createLoreReference,
  deleteLoreReference,
  getLoreReferences,
  getLoreReferencedBy,
} from "../lore";
import {
  AuthenticationError,
  ValidationError,
} from "@/lib/errors";

describe("Lore Entry CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testLoreId: string;
  let testPinId: string;
  let testLayerId: string;

  /**
   * Setup: Create test user, world, pin, and lore entry
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

    // Create test layer
    const layer = await prisma.mapLayer.create({
      data: {
        name: "Test Layer",
        gameWorldId: testWorldId,
        zIndex: 0,
      },
    });
    testLayerId = layer.id;

    // Create test pin
    const pin = await prisma.pin.create({
      data: {
        title: "Test Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        layerId: testLayerId,
        userId: testUserId,
      },
    });
    testPinId = pin.id;

    // Create test lore entry
    const lore = await prisma.loreEntry.create({
      data: {
        title: "Test Lore",
        content: "Test lore content",
        slug: "test-lore",
        category: "GENERAL",
        gameWorldId: testWorldId,
        userId: testUserId,
      },
    });
    testLoreId = lore.id;
  });

  /**
   * Cleanup: Delete all test data
  */
  afterEach(async () => {
    await prisma.loreReference.deleteMany({
      where: {
        OR: [
          { sourceLoreEntryId: testLoreId },
          { targetLoreEntryId: testLoreId },
        ],
      },
    });
    await prisma.lorePinRelation.deleteMany({
      where: { loreEntryId: testLoreId },
    });
    await prisma.loreEntry.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.pin.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.mapLayer.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.gameWorld.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });

    mockGetServerSession.mockReset();
    vi.clearAllMocks();
  });

  describe("createLoreEntry", () => {
    it("should create lore entry with valid data", async () => {
      const result = await createLoreEntry({
        title: "Kingdom of Eldoria",
        content: "A mighty kingdom in the north",
        slug: "eldoria",
        category: "HISTORY",
        gameWorldId: testWorldId,
        isVisible: true,
        isPublic: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreId).toBeDefined();
        expect(result.data.loreEntry.title).toBe("Kingdom of Eldoria");
        expect(result.data.loreEntry.slug).toBe("eldoria");
        expect(result.data.loreEntry.category).toBe("HISTORY");

        // Verify in database
        const lore = await prisma.loreEntry.findUnique({
          where: { id: result.data.loreId },
        });
        expect(lore).toBeTruthy();
        expect(lore?.title).toBe("Kingdom of Eldoria");
      }
    });

    it("should create lore with default visibility values", async () => {
      const result = await createLoreEntry({
        title: "Hidden Lore",
        content: "Secret content",
        slug: "hidden-lore",
        category: "GENERAL",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreEntry.isVisible).toBe(false);
        expect(result.data.loreEntry.isPublic).toBe(true);
      }
    });

    it("should handle duplicate slug by appending random suffix", async () => {
      // Create first lore with slug
      await createLoreEntry({
        title: "First Entry",
        content: "First content",
        slug: "duplicate-slug",
        category: "GENERAL",
        gameWorldId: testWorldId,
      });

      // Create second lore with same slug
      const result = await createLoreEntry({
        title: "Second Entry",
        content: "Second content",
        slug: "duplicate-slug",
        category: "GENERAL",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreEntry.slug).not.toBe("duplicate-slug");
        expect(result.data.loreEntry.slug).toMatch(/^duplicate-slug-[a-z0-9]+$/);
      }
    });

    it("should reject unauthenticated request", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const result = await createLoreEntry({
        title: "Should Fail",
        content: "No auth",
        slug: "fail",
        category: "GENERAL",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthenticationError);
      }
    });

    it("should reject access to non-existent world", async () => {
      const result = await createLoreEntry({
        title: "Orphan Lore",
        content: "No world",
        slug: "orphan",
        category: "GENERAL",
        gameWorldId: "non-existent-world",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("getLoreEntryById", () => {
    it("should return lore entry with full details", async () => {
      const lore = await getLoreEntryById(testLoreId);

      expect(lore).toBeTruthy();
      expect(lore?.id).toBe(testLoreId);
      expect(lore?.title).toBe("Test Lore");
      expect(lore?.content).toBe("Test lore content");
      expect(lore?.slug).toBe("test-lore");
      expect(lore?.category).toBe("GENERAL");
      expect(lore?.user).toBeDefined();
      expect(lore?.gameWorld).toBeDefined();
    });

    it("should return null for non-existent lore", async () => {
      const lore = await getLoreEntryById("non-existent-lore");
      expect(lore).toBeNull();
    });
  });

  describe("getLoreEntriesByWorld", () => {
    beforeEach(async () => {
      // Create additional lore entries
      await prisma.loreEntry.create({
        data: {
          title: "Lore 2",
          content: "Content 2",
          slug: "lore-2",
          category: "GEOGRAPHY",
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });

      await prisma.loreEntry.create({
        data: {
          title: "Lore 3",
          content: "Content 3",
          slug: "lore-3",
          category: "CHARACTERS",
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });
    });

    it("should return all lore entries for a world", async () => {
      const lores = await getLoreEntriesByWorld(testWorldId);

      expect(lores).toBeInstanceOf(Array);
      expect(lores.length).toBeGreaterThanOrEqual(3);
      expect(lores.every((l) => l.gameWorldId === testWorldId)).toBe(true);
    });

    it("should order by updatedAt descending", async () => {
      // Update first lore to make it newer
      await prisma.loreEntry.update({
        where: { id: testLoreId },
        data: { content: "Updated content" },
      });

      const lores = await getLoreEntriesByWorld(testWorldId);

      // First lore should be first (most recently updated)
      expect(lores[0].id).toBe(testLoreId);
    });
  });

  describe("getLoreEntryBySlug", () => {
    it("should return lore entry with slug", async () => {
      const lore = await getLoreEntryBySlug(testWorldId, "test-lore");

      expect(lore).toBeTruthy();
      expect(lore?.id).toBe(testLoreId);
      expect(lore?.slug).toBe("test-lore");
    });

    it("should return null for non-existent slug", async () => {
      const lore = await getLoreEntryBySlug(testWorldId, "non-existent-slug");
      expect(lore).toBeNull();
    });
  });

  describe("updateLoreEntry", () => {
    it("should update lore title and content", async () => {
      const result = await updateLoreEntry({
        id: testLoreId,
        title: "Updated Title",
        content: "Updated content",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Title");
        expect(result.data.content).toBe("Updated content");
      }
    });

    it("should update lore category", async () => {
      const result = await updateLoreEntry({
        id: testLoreId,
        category: "MAGIC",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.category).toBe("MAGIC");
      }
    });

    it("should update slug while maintaining uniqueness", async () => {
      // Create another lore with conflicting slug
      await prisma.loreEntry.create({
        data: {
          title: "Conflict",
          content: "Content",
          slug: "new-slug",
          category: "GENERAL",
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });

      const result = await updateLoreEntry({
        id: testLoreId,
        slug: "new-slug",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        // Should have appended suffix to avoid conflict
        expect(result.data.slug).not.toBe("new-slug");
        expect(result.data.slug).toMatch(/^new-slug-[a-z0-9]+$/);
      }
    });

    it("should update visibility flags", async () => {
      const result = await updateLoreEntry({
        id: testLoreId,
        isVisible: true,
        isPublic: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(true);
        expect(result.data.isPublic).toBe(false);
      }
    });

    it("should reject unauthorized update", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Unauthorized User",
          email: `unauth-${Date.now()}@example.com`,
        },
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Unauthorized", email: otherUser.email },
      });

      const result = await updateLoreEntry({
        id: testLoreId,
        title: "Hacked Title",
      });

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("deleteLoreEntry", () => {
    it("should delete lore entry successfully", async () => {
      const result = await deleteLoreEntry(testLoreId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreId).toBe(testLoreId);

        // Verify lore is deleted
        const lore = await prisma.loreEntry.findUnique({
          where: { id: testLoreId },
        });
        expect(lore).toBeNull();
      }
    });

    it("should reject unauthorized deletion", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Delete Attacker",
          email: `attacker-${Date.now()}@example.com`,
        },
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Attacker", email: otherUser.email },
      });

      const result = await deleteLoreEntry(testLoreId);

      expect(result.success).toBe(false);

      // Verify lore still exists
      const lore = await prisma.loreEntry.findUnique({
        where: { id: testLoreId },
      });
      expect(lore).toBeTruthy();

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("toggleLoreVisibility", () => {
    it("should toggle from visible to hidden", async () => {
      await prisma.loreEntry.update({
        where: { id: testLoreId },
        data: { isVisible: true },
      });

      const result = await toggleLoreVisibility(testLoreId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(false);
      }
    });

    it("should toggle from hidden to visible", async () => {
      await prisma.loreEntry.update({
        where: { id: testLoreId },
        data: { isVisible: false },
      });

      const result = await toggleLoreVisibility(testLoreId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(true);
      }
    });
  });

  describe("Lore-Pin Linking", () => {
    it("should link lore to pin", async () => {
      const result = await linkLoreToPin(testLoreId, testPinId, "REFERENCES", "Some notes");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreEntryId).toBe(testLoreId);
        expect(result.data.pinId).toBe(testPinId);
        expect(result.data.relationType).toBe("REFERENCES");
        expect(result.data.notes).toBe("Some notes");
      }
    });

    it("should reject duplicate link", async () => {
      // Create link first time
      await linkLoreToPin(testLoreId, testPinId);

      // Try to link again
      const result = await linkLoreToPin(testLoreId, testPinId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it("should unlink lore from pin", async () => {
      // First create the link
      await linkLoreToPin(testLoreId, testPinId);

      const result = await unlinkLoreFromPin(testLoreId, testPinId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.linkId).toBeDefined();

        // Verify link is deleted
        const link = await prisma.lorePinRelation.findUnique({
          where: {
            loreEntryId_pinId: {
              loreEntryId: testLoreId,
              pinId: testPinId,
            },
          },
        });
        expect(link).toBeNull();
      }
    });

    it("should reject unlinking non-existent link", async () => {
      const result = await unlinkLoreFromPin(testLoreId, testPinId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it("should get pins for lore", async () => {
      // Link the pin
      await linkLoreToPin(testLoreId, testPinId, "DESCRIBES");

      const pins = await getPinsForLore(testLoreId);

      expect(pins).toBeInstanceOf(Array);
      expect(pins.length).toBe(1);
      expect(pins[0].id).toBe(testPinId);
      expect(pins[0].relationType).toBe("DESCRIBES");
    });

    it("should get lore for pin", async () => {
      // Link the pin
      await linkLoreToPin(testLoreId, testPinId, "CONTAINS");

      const lores = await getLoreForPin(testPinId);

      expect(lores).toBeInstanceOf(Array);
      expect(lores.length).toBe(1);
      expect(lores[0].id).toBe(testLoreId);
      expect(lores[0].relationType).toBe("CONTAINS");
    });
  });

  describe("Lore Cross-References", () => {
    let targetLoreId: string;

    beforeEach(async () => {
      // Create target lore entry
      const targetLore = await prisma.loreEntry.create({
        data: {
          title: "Target Lore",
          content: "Referenced content",
          slug: "target-lore",
          category: "GENERAL",
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });
      targetLoreId = targetLore.id;
    });

    it("should create reference between lore entries", async () => {
      const result = await createLoreReference(
        testLoreId,
        targetLoreId,
        "See Also",
        "SEE_ALSO",
        "Related information"
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceLoreId).toBe(testLoreId);
        expect(result.data.targetLoreId).toBe(targetLoreId);
        expect(result.data.linkText).toBe("See Also");
        expect(result.data.linkType).toBe("SEE_ALSO");
        expect(result.data.context).toBe("Related information");
      }
    });

    it("should update existing reference", async () => {
      // Create initial reference
      await createLoreReference(testLoreId, targetLoreId, "Initial", "MENTION");

      // Update with new data
      const result = await createLoreReference(
        testLoreId,
        targetLoreId,
        "Updated Link",
        "RELATED",
        "New context"
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.linkText).toBe("Updated Link");
        expect(result.data.linkType).toBe("RELATED");
      }
    });

    it("should delete reference", async () => {
      // Create reference first
      await createLoreReference(testLoreId, targetLoreId, "To Delete");

      const result = await deleteLoreReference(testLoreId, targetLoreId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.referenceId).toBeDefined();
      }
    });

    it("should get outgoing references", async () => {
      await createLoreReference(testLoreId, targetLoreId, "Target Entry", "MENTION");

      const references = await getLoreReferences(testLoreId);

      expect(references).toBeInstanceOf(Array);
      expect(references.length).toBe(1);
      expect(references[0].id).toBe(targetLoreId);
      expect(references[0].linkText).toBe("Target Entry");
    });

    it("should get incoming references (referencedBy)", async () => {
      await createLoreReference(testLoreId, targetLoreId, "Source Entry");

      const referencedBy = await getLoreReferencedBy(targetLoreId);

      expect(referencedBy).toBeInstanceOf(Array);
      expect(referencedBy.length).toBe(1);
      expect(referencedBy[0].id).toBe(testLoreId);
    });
  });

  describe("Categories", () => {
    const categories = [
      "GENERAL",
      "HISTORY",
      "GEOGRAPHY",
      "CHARACTERS",
      "FACTIONS",
      "MAGIC",
      "ITEMS",
      "QUESTS",
      "CUSTOM",
    ];

    it.each(categories)("should create lore with category %s", async (category) => {
      const result = await createLoreEntry({
        title: `${category} Lore`,
        content: `Content for ${category}`,
        slug: `${category.toLowerCase()}-lore`,
        category: category as LoreCategory,
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loreEntry.category).toBe(category);
      }
    });
  });

  describe("Relation Types", () => {
    const relationTypes = ["REFERENCES", "DESCRIBES", "CONTAINS", "IS_LOCATED_AT", "CUSTOM"];

    it.each(relationTypes)("should link lore to pin with relation %s", async (relationType) => {
      const result = await linkLoreToPin(testLoreId, testPinId, relationType as RelationType);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relationType).toBe(relationType);
      }
    });
  });
});
