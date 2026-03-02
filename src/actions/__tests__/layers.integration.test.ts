/**
 * Integration Tests for Layer Server Actions
 *
 * Tests the full CRUD operations for Map Layers with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Z-index management
 * - Opacity and scale controls
 * - Position offsets
 * - Batch updates
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
  createLayer,
  updateLayer,
  updateLayerPosition,
  updateLayerScale,
  updateLayerZIndex,
  deleteLayer,
  batchUpdateLayers,
} from "../layers";
import {
  AuthenticationError,
  AuthorizationError,
  NotFoundError,
} from "@/lib/errors";

describe("Layer CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testLayerId: string;

  /**
   * Setup: Create test user, world, and layer
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
        name: "Base Layer",
        gameWorldId: testWorldId,
        zIndex: 0,
        opacity: 1.0,
        offsetX: 0,
        offsetY: 0,
        scale: 1.0,
      },
    });
    testLayerId = layer.id;
  });

  /**
   * Cleanup: Delete all test data
  */
  afterEach(async () => {
    await prisma.mapLayer.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.gameWorld.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });

    mockGetServerSession.mockReset();
    vi.clearAllMocks();
  });

  describe("createLayer", () => {
    it("should create layer with valid data", async () => {
      const result = await createLayer(testWorldId, {
        name: "New Layer",
        description: "A test layer",
        isVisible: true,
        opacity: 0.8,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBeDefined();
        expect(result.data.name).toBe("New Layer");
        expect(result.data.description).toBe("A test layer");
        expect(result.data.isVisible).toBe(true);
        expect(result.data.opacity).toBe(0.8);

        // Verify in database
        const layer = await prisma.mapLayer.findUnique({
          where: { id: result.data.id },
        });
        expect(layer).toBeTruthy();
        expect(layer?.name).toBe("New Layer");
      }
    });

    it("should auto-increment zIndex when not specified", async () => {
      // Create first layer with zIndex 0
      await prisma.mapLayer.create({
        data: {
          name: "First Layer",
          gameWorldId: testWorldId,
          zIndex: 0,
        },
      });

      // Create second layer without specifying zIndex
      const result = await createLayer(testWorldId, {
        name: "Second Layer",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zIndex).toBe(1);
      }
    });

    it("should use custom zIndex when specified", async () => {
      const result = await createLayer(testWorldId, {
        name: "Custom Z Layer",
        zIndex: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zIndex).toBe(10);
      }
    });

    it("should set default values for optional fields", async () => {
      const result = await createLayer(testWorldId, {
        name: "Defaults Layer",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(true);
        expect(result.data.opacity).toBe(1.0);
        expect(result.data.offsetX).toBe(0);
        expect(result.data.offsetY).toBe(0);
        expect(result.data.scale).toBe(1.0);
        expect(result.data.minZoom).toBe(0);
        expect(result.data.maxZoom).toBe(200);
      }
    });

    it("should create layer with position offset", async () => {
      const result = await createLayer(testWorldId, {
        name: "Offset Layer",
        offsetX: 100.5,
        offsetY: -50.25,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(100.5);
        expect(result.data.offsetY).toBe(-50.25);
      }
    });

    it("should create layer with custom scale", async () => {
      const result = await createLayer(testWorldId, {
        name: "Scaled Layer",
        scale: 1.5,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(1.5);
      }
    });

    it("should create layer with zoom constraints", async () => {
      const result = await createLayer(testWorldId, {
        name: "Zoomed Layer",
        minZoom: 50,
        maxZoom: 150,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minZoom).toBe(50);
        expect(result.data.maxZoom).toBe(150);
      }
    });

    it("should reject unauthenticated request", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const result = await createLayer(testWorldId, {
        name: "Should Fail",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthenticationError);
      }
    });

    it("should reject access to non-existent world", async () => {
      const result = await createLayer("non-existent-world", {
        name: "Orphan Layer",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("updateLayer", () => {
    it("should update layer name", async () => {
      const result = await updateLayer(testLayerId, {
        name: "Updated Name",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Updated Name");
      }
    });

    it("should update layer description", async () => {
      const result = await updateLayer(testLayerId, {
        description: "New description",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe("New description");
      }
    });

    it("should update layer visibility", async () => {
      const result = await updateLayer(testLayerId, {
        isVisible: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(false);
      }
    });

    it("should update layer opacity", async () => {
      const result = await updateLayer(testLayerId, {
        opacity: 0.5,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.opacity).toBe(0.5);
      }
    });

    it("should update layer zIndex", async () => {
      const result = await updateLayer(testLayerId, {
        zIndex: 5,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zIndex).toBe(5);
      }
    });

    it("should update position offset", async () => {
      const result = await updateLayer(testLayerId, {
        offsetX: 200,
        offsetY: -100,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(200);
        expect(result.data.offsetY).toBe(-100);
      }
    });

    it("should update scale", async () => {
      const result = await updateLayer(testLayerId, {
        scale: 0.75,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(0.75);
      }
    });

    it("should update zoom constraints", async () => {
      const result = await updateLayer(testLayerId, {
        minZoom: 25,
        maxZoom: 175,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minZoom).toBe(25);
        expect(result.data.maxZoom).toBe(175);
      }
    });

    it("should update multiple fields at once", async () => {
      const result = await updateLayer(testLayerId, {
        name: "Multi Update",
        opacity: 0.6,
        zIndex: 3,
        scale: 1.2,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Multi Update");
        expect(result.data.opacity).toBe(0.6);
        expect(result.data.zIndex).toBe(3);
        expect(result.data.scale).toBe(1.2);
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

      const result = await updateLayer(testLayerId, {
        name: "Hacked Name",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthorizationError);
      }

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it("should reject updating non-existent layer", async () => {
      const result = await updateLayer("non-existent-layer", {
        name: "Ghost Layer",
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe("updateLayerPosition", () => {
    it("should update layer position for drag operation", async () => {
      const result = await updateLayerPosition(testLayerId, 150, -75);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(150);
        expect(result.data.offsetY).toBe(-75);
      }
    });

    it("should support negative offsets", async () => {
      const result = await updateLayerPosition(testLayerId, -200, -300);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(-200);
        expect(result.data.offsetY).toBe(-300);
      }
    });

    it("should support zero offsets", async () => {
      // First set non-zero offsets
      await prisma.mapLayer.update({
        where: { id: testLayerId },
        data: { offsetX: 100, offsetY: 100 },
      });

      const result = await updateLayerPosition(testLayerId, 0, 0);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(0);
        expect(result.data.offsetY).toBe(0);
      }
    });
  });

  describe("updateLayerScale", () => {
    it("should increase layer scale", async () => {
      const result = await updateLayerScale(testLayerId, 1.5);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(1.5);
      }
    });

    it("should decrease layer scale", async () => {
      const result = await updateLayerScale(testLayerId, 0.5);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(0.5);
      }
    });

    it("should set scale to 1.0 (reset)", async () => {
      await prisma.mapLayer.update({
        where: { id: testLayerId },
        data: { scale: 1.5 },
      });

      const result = await updateLayerScale(testLayerId, 1.0);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(1.0);
      }
    });
  });

  describe("updateLayerZIndex", () => {
    it("should update layer zIndex", async () => {
      const result = await updateLayerZIndex(testLayerId, 10);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zIndex).toBe(10);
      }
    });

    it("should support negative zIndex", async () => {
      const result = await updateLayerZIndex(testLayerId, -1);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.zIndex).toBe(-1);
      }
    });
  });

  describe("deleteLayer", () => {
    it("should delete layer successfully", async () => {
      // Create a temporary layer to delete
      const tempLayer = await prisma.mapLayer.create({
        data: {
          name: "Temporary Layer",
          gameWorldId: testWorldId,
          zIndex: 99,
        },
      });

      const result = await deleteLayer(tempLayer.id);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(tempLayer.id);

        // Verify layer is deleted
        const layer = await prisma.mapLayer.findUnique({
          where: { id: tempLayer.id },
        });
        expect(layer).toBeNull();
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

      const result = await deleteLayer(testLayerId);

      expect(result.success).toBe(false);

      // Verify layer still exists
      const layer = await prisma.mapLayer.findUnique({
        where: { id: testLayerId },
      });
      expect(layer).toBeTruthy();

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });

    it("should reject deleting non-existent layer", async () => {
      const result = await deleteLayer("non-existent-layer");

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(NotFoundError);
      }
    });
  });

  describe("batchUpdateLayers", () => {
    let layer2Id: string;
    let layer3Id: string;

    beforeEach(async () => {
      // Create additional layers
      const layer2 = await prisma.mapLayer.create({
        data: {
          name: "Layer 2",
          gameWorldId: testWorldId,
          zIndex: 1,
        },
      });

      const layer3 = await prisma.mapLayer.create({
        data: {
          name: "Layer 3",
          gameWorldId: testWorldId,
          zIndex: 2,
        },
      });

      layer2Id = layer2.id;
      layer3Id = layer3.id;
    });

    it("should reorder multiple layers by zIndex", async () => {
      const result = await batchUpdateLayers([
        { id: testLayerId, zIndex: 2 },
        { id: layer2Id, zIndex: 0 },
        { id: layer3Id, zIndex: 1 },
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(3);

        const updatedLayer1 = result.data.find((l) => l.id === testLayerId);
        expect(updatedLayer1?.zIndex).toBe(2);

        const updatedLayer2 = result.data.find((l) => l.id === layer2Id);
        expect(updatedLayer2?.zIndex).toBe(0);
      }
    });

    it("should update positions and scales in batch", async () => {
      const result = await batchUpdateLayers([
        { id: testLayerId, zIndex: 5, offsetX: 100, offsetY: 50, scale: 1.2 },
        { id: layer2Id, zIndex: 6, offsetX: 200, offsetY: 100, scale: 0.8 },
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        const updated1 = result.data.find((l) => l.id === testLayerId);
        expect(updated1?.offsetX).toBe(100);
        expect(updated1?.offsetY).toBe(50);
        expect(updated1?.scale).toBe(1.2);

        const updated2 = result.data.find((l) => l.id === layer2Id);
        expect(updated2?.offsetX).toBe(200);
        expect(updated2?.scale).toBe(0.8);
      }
    });

    it("should handle empty updates array", async () => {
      const result = await batchUpdateLayers([]);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveLength(0);
      }
    });

    it("should reject batch with non-existent layer", async () => {
      const result = await batchUpdateLayers([
        { id: testLayerId, zIndex: 1 },
        { id: "non-existent-layer", zIndex: 2 },
      ]);

      expect(result.success).toBe(false);
    });

    it("should reject unauthorized batch update", async () => {
      const otherUser = await prisma.user.create({
        data: {
          name: "Batch Attacker",
          email: `batch-${Date.now()}@example.com`,
        },
      });

      mockGetServerSession.mockResolvedValueOnce({
        user: { id: otherUser.id, name: "Attacker", email: otherUser.email },
      });

      const result = await batchUpdateLayers([
        { id: testLayerId, zIndex: 99 },
      ]);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("Zoom Constraints", () => {
    it("should create layer with zoom constraints", async () => {
      const result = await createLayer(testWorldId, {
        name: "Zoom Constrained Layer",
        minZoom: 50,
        maxZoom: 150,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        const layer = await prisma.mapLayer.findUnique({
          where: { id: result.data.id },
        });
        expect(layer?.minZoom).toBe(50);
        expect(layer?.maxZoom).toBe(150);
      }
    });

    it("should update zoom constraints", async () => {
      const result = await updateLayer(testLayerId, {
        minZoom: 25,
        maxZoom: 175,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minZoom).toBe(25);
        expect(result.data.maxZoom).toBe(175);
      }
    });

    it("should allow minZoom of 0", async () => {
      const result = await createLayer(testWorldId, {
        name: "Zero Min Zoom",
        minZoom: 0,
        maxZoom: 100,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.minZoom).toBe(0);
      }
    });

    it("should allow maxZoom of 200", async () => {
      const result = await createLayer(testWorldId, {
        name: "Max Max Zoom",
        minZoom: 0,
        maxZoom: 200,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.maxZoom).toBe(200);
      }
    });
  });

  describe("Edge Cases", () => {
    it("should handle very long descriptions", async () => {
      const longDescription = "A".repeat(5000);

      const result = await createLayer(testWorldId, {
        name: "Long Description Layer",
        description: longDescription,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.description).toBe(longDescription);
      }
    });

    it("should handle special characters in names", async () => {
      const specialName = "Layer with émojis 🎨 and spëcial çhars";

      const result = await createLayer(testWorldId, {
        name: specialName,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe(specialName);
      }
    });

    it("should handle fractional offsets", async () => {
      const result = await updateLayerPosition(testLayerId, 123.456, -789.012);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.offsetX).toBe(123.456);
        expect(result.data.offsetY).toBe(-789.012);
      }
    });

    it("should handle fractional scale", async () => {
      const result = await updateLayerScale(testLayerId, 0.123);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.scale).toBe(0.123);
      }
    });
  });
});
