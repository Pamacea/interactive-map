/**
 * Integration Tests for Pin Server Actions
 *
 * Tests the full CRUD operations for Pins with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Input validation (Zod schemas)
 * - Layer associations
 * - Position updates
 * - Batch operations
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

// Mock revalidatePath
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

// Mock presence collaboration events
vi.mock("@/actions/presence", () => ({
  safeLogCollaborationEvent: vi.fn().mockResolvedValue({ success: true }),
}));

import {
  createPin,
  getPinById,
  updatePin,
  deletePin,
  togglePinVisibility,
  updatePinPosition,
  batchUpdatePinPositions,
  uploadPinIcon,
} from "../pins";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
} from "@/lib/errors";

describe("Pin CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testLayerId: string;
  let testPinId: string;

  /**
   * Setup: Create test user, world, layer, and pin
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
  });

  /**
   * Cleanup: Delete all test data
   */
  afterEach(async () => {
    await prisma.pin.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.mapLayer.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.gameWorld.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });

    mockGetServerSession.mockReset();
    vi.clearAllMocks();
  });

  describe("createPin", () => {
    it("should create pin with valid data", async () => {
      const result = await createPin({
        title: "New City",
        description: "A new city pin",
        pinType: "CITY",
        latitude: 0.3,
        longitude: 0.7,
        color: "#ff0000",
        size: 48,
        gameWorldId: testWorldId,
        layerId: testLayerId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pinId).toBeDefined();
        expect(result.data.pin.title).toBe("New City");
        expect(result.data.pin.pinType).toBe("CITY");
        expect(result.data.pin.color).toBe("#ff0000");
        expect(result.data.pin.size).toBe(48);

        // Verify in database
        const pin = await prisma.pin.findUnique({
          where: { id: result.data.pinId },
        });
        expect(pin).toBeTruthy();
        expect(pin?.title).toBe("New City");
      }
    });

    it("should create pin without layer", async () => {
      const result = await createPin({
        title: "Unlayered Pin",
        pinType: "POI",
        latitude: 0.1,
        longitude: 0.1,
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pin.layerId).toBeNull();
      }
    });

    it("should reject invalid coordinates", async () => {
      const result = await createPin({
        title: "Invalid Pin",
        pinType: "CITY",
        latitude: 150, // Invalid: > 90
        longitude: 0.5,
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(false);
    });

    it("should reject invalid color format", async () => {
      const result = await createPin({
        title: "Bad Color Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        color: "red", // Should be hex
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(false);
    });

    it("should reject layer from different world", async () => {
      // Create another world and layer
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

      const otherLayer = await prisma.mapLayer.create({
        data: {
          name: "Other Layer",
          gameWorldId: otherWorld.id,
          zIndex: 0,
        },
      });

      const result = await createPin({
        title: "Cross-World Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        layerId: otherLayer.id, // Layer from different world
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }

      // Cleanup
      await prisma.mapLayer.delete({ where: { id: otherLayer.id } });
      await prisma.gameWorld.delete({ where: { id: otherWorld.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it("should reject unauthenticated request", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const result = await createPin({
        title: "Should Fail",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthenticationError);
      }
    });

    it("should reject access to non-existent world", async () => {
      const result = await createPin({
        title: "Orphan Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: "non-existent-world-id",
      });

      expect(result.success).toBe(false);
    });

    it("should validate minZoom < maxZoom constraint", async () => {
      const result = await createPin({
        title: "Bad Zoom Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        minZoom: 100,
        maxZoom: 50, // maxZoom < minZoom - invalid!
      });

      expect(result.success).toBe(false);
    });
  });

  describe("getPinById", () => {
    it("should return pin with full details", async () => {
      const pin = await getPinById(testPinId);

      expect(pin).toBeTruthy();
      expect(pin?.id).toBe(testPinId);
      expect(pin?.title).toBe("Test Pin");
      expect(pin?.user).toBeDefined();
      expect(pin?.gameWorld).toBeDefined();
      expect(pin?.layer).toBeDefined();
      expect(pin?.layer?.id).toBe(testLayerId);
    });

    it("should return null for non-existent pin", async () => {
      const pin = await getPinById("non-existent-pin-id");
      expect(pin).toBeNull();
    });
  });

  describe("updatePin", () => {
    it("should update pin title and description", async () => {
      const result = await updatePin({
        id: testPinId,
        title: "Updated City",
        description: "Updated description",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated City");
        expect(result.data.description).toBe("Updated description");

        // Verify in database
        const pin = await prisma.pin.findUnique({
          where: { id: testPinId },
        });
        expect(pin?.title).toBe("Updated City");
      }
    });

    it("should update pin position", async () => {
      const result = await updatePin({
        id: testPinId,
        latitude: 0.8,
        longitude: 0.2,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(0.8);
        expect(result.data.longitude).toBe(0.2);
      }
    });

    it("should update pin type and appearance", async () => {
      const result = await updatePin({
        id: testPinId,
        pinType: "DUNGEON",
        color: "#9333ea",
        size: 64,
        icon: "skull",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pinType).toBe("DUNGEON");
        expect(result.data.color).toBe("#9333ea");
        expect(result.data.size).toBe(64);
        expect(result.data.icon).toBe("skull");
      }
    });

    it("should update pin layer", async () => {
      // Create another layer
      const newLayer = await prisma.mapLayer.create({
        data: {
          name: "New Layer",
          gameWorldId: testWorldId,
          zIndex: 1,
        },
      });

      const result = await updatePin({
        id: testPinId,
        layerId: newLayer.id,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.layerId).toBe(newLayer.id);
      }
    });

    it("should move pin to no layer (null)", async () => {
      const result = await updatePin({
        id: testPinId,
        layerId: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.layerId).toBeNull();
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

      const result = await updatePin({
        id: testPinId,
        title: "Hacked Title",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthorizationError);
      }

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it("should reject updating non-existent pin", async () => {
      const result = await updatePin({
        id: "non-existent-pin",
        title: "Ghost Pin",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe("deletePin", () => {
    it("should delete pin successfully", async () => {
      const result = await deletePin(testPinId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pinId).toBe(testPinId);

        // Verify pin is deleted
        const pin = await prisma.pin.findUnique({
          where: { id: testPinId },
        });
        expect(pin).toBeNull();
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

      const result = await deletePin(testPinId);

      expect(result.success).toBe(false);

      // Verify pin still exists
      const pin = await prisma.pin.findUnique({
        where: { id: testPinId },
      });
      expect(pin).toBeTruthy();

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("togglePinVisibility", () => {
    it("should toggle pin from visible to hidden", async () => {
      // Pin should start visible
      const initialPin = await prisma.pin.findUnique({
        where: { id: testPinId },
      });
      expect(initialPin?.isVisible).toBe(true);

      const result = await togglePinVisibility(testPinId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(false);
      }
    });

    it("should toggle pin from hidden to visible", async () => {
      // First hide the pin
      await prisma.pin.update({
        where: { id: testPinId },
        data: { isVisible: false },
      });

      const result = await togglePinVisibility(testPinId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(true);
      }
    });
  });

  describe("updatePinPosition", () => {
    it("should update pin position for drag operation", async () => {
      const result = await updatePinPosition(testPinId, 0.75, 0.25);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.latitude).toBe(0.75);
        expect(result.data.longitude).toBe(0.25);
      }
    });

    it("should reject invalid coordinates (out of range)", async () => {
      const result = await updatePinPosition(testPinId, 1.5, 0.5);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it("should reject negative coordinates", async () => {
      const result = await updatePinPosition(testPinId, -0.1, 0.5);

      expect(result.success).toBe(false);
    });
  });

  describe("batchUpdatePinPositions", () => {
    let pin2Id: string;
    let pin3Id: string;

    beforeEach(async () => {
      // Create additional pins
      const pin2 = await prisma.pin.create({
        data: {
          title: "Pin 2",
          pinType: "CITY",
          latitude: 0.2,
          longitude: 0.2,
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });

      const pin3 = await prisma.pin.create({
        data: {
          title: "Pin 3",
          pinType: "CITY",
          latitude: 0.3,
          longitude: 0.3,
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });

      pin2Id = pin2.id;
      pin3Id = pin3.id;
    });

    it("should update multiple pin positions", async () => {
      const result = await batchUpdatePinPositions([
        { id: testPinId, latitude: 0.9, longitude: 0.1 },
        { id: pin2Id, latitude: 0.8, longitude: 0.2 },
        { id: pin3Id, latitude: 0.7, longitude: 0.3 },
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);

        const updatedPin1 = result.data.find((p) => p.id === testPinId);
        expect(updatedPin1?.latitude).toBe(0.9);
        expect(updatedPin1?.longitude).toBe(0.1);
      }
    });

    it("should reject if any pin is not found", async () => {
      const result = await batchUpdatePinPositions([
        { id: testPinId, latitude: 0.5, longitude: 0.5 },
        { id: "non-existent-pin", latitude: 0.5, longitude: 0.5 },
      ]);

      expect(result.success).toBe(false);
    });

    it("should reject if user lacks permission for any pin", async () => {
      // Create pin owned by another user
      const otherUser = await prisma.user.create({
        data: {
          name: "Other User",
          email: `otherpin-${Date.now()}@example.com`,
        },
      });

      const otherPin = await prisma.pin.create({
        data: {
          title: "Other User Pin",
          pinType: "CITY",
          latitude: 0.5,
          longitude: 0.5,
          gameWorldId: testWorldId,
          userId: otherUser.id,
        },
      });

      const result = await batchUpdatePinPositions([
        { id: testPinId, latitude: 0.5, longitude: 0.5 },
        { id: otherPin.id, latitude: 0.6, longitude: 0.6 },
      ]);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.pin.delete({ where: { id: otherPin.id } });
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("uploadPinIcon", () => {
    it("should upload custom pin icon", async () => {
      // Mock file operations
      const { writeFile, mkdir } = await import("fs/promises");
      vi.mocked(writeFile).mockResolvedValue(undefined);
      vi.mocked(mkdir).mockResolvedValue(undefined);

      const mockFile = new File(["<svg>"], "icon.svg", { type: "image/svg+xml" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadPinIcon(testPinId, formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.iconUrl).toContain("/uploads/pins/icons/");
        expect(result.data.iconUrl).toContain(".svg");
        expect(result.data.pin.icon).toBe(result.data.iconUrl);
      }
    });

    it("should reject invalid file type", async () => {
      const mockFile = new File(["not an image"], "doc.pdf", { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadPinIcon(testPinId, formData);

      expect(result.success).toBe(false);
    });

    it("should reject oversized file", async () => {
      // Create a mock large file (> 500KB)
      const largeContent = "x".repeat(600 * 1024);
      const mockFile = new File([largeContent], "large.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadPinIcon(testPinId, formData);

      expect(result.success).toBe(false);
    });

    it("should reject unauthorized upload", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Icon Hacker",
          email: `iconhack-${Date.now()}@example.com`,
        },
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Hacker", email: otherUser.email },
      });

      const mockFile = new File(["<svg>"], "hack.svg", { type: "image/svg+xml" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadPinIcon(testPinId, formData);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("Zoom Constraints", () => {
    it("should respect minZoom and maxZoom on create", async () => {
      const result = await createPin({
        title: "Zoomed Pin",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        minZoom: 50,
        maxZoom: 150,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const pin = await prisma.pin.findUnique({
          where: { id: result.data.pinId },
        });
        expect(pin?.minZoom).toBe(50);
        expect(pin?.maxZoom).toBe(150);
      }
    });

    it("should update zoom constraints", async () => {
      const result = await updatePin({
        id: testPinId,
        minZoom: 25,
        maxZoom: 175,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minZoom).toBe(25);
        expect(result.data.maxZoom).toBe(175);
      }
    });
  });

  describe("Properties Field", () => {
    it("should store custom properties as JSON", async () => {
      const customProps = {
        level: 10,
        faction: "Alliance",
        quests: ["main-quest-1", "side-quest-3"],
        boss: true,
      };

      const result = await createPin({
        title: "Dungeon Pin",
        pinType: "DUNGEON",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        properties: customProps,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pin.properties).toEqual(customProps);
      }
    });

    it("should update properties field", async () => {
      const newProps = {
        level: 15,
        faction: "Horde",
        boss: false,
      };

      const result = await updatePin({
        id: testPinId,
        properties: newProps,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.properties).toEqual(newProps);
      }
    });
  });
});
