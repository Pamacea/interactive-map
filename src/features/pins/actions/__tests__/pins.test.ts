/**
 * Tests for Pins Server Actions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Module-level mock functions
const mockPinCreate = vi.fn();
const mockPinUpdate = vi.fn();
const mockPinDelete = vi.fn();
const mockPinDeleteMany = vi.fn();
const mockPinFindMany = vi.fn();
const mockPinFindUnique = vi.fn();
const mockPinFindFirst = vi.fn();
const mockMapLayerFindUnique = vi.fn();
const mockGetAuthenticatedUser = vi.fn();
const mockVerifyWorldPermission = vi.fn();
const mockVerifyPinPermission = vi.fn();
const mockRevalidatePath = vi.fn();
const mockSafeLogCollaborationEvent = vi.fn();

// Mock Prisma
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    pin: {
      create: () => mockPinCreate(),
      update: () => mockPinUpdate(),
      delete: () => mockPinDelete(),
      deleteMany: () => mockPinDeleteMany(),
      findMany: () => mockPinFindMany(),
      findUnique: () => mockPinFindUnique(),
      findFirst: () => mockPinFindFirst(),
    },
    mapLayer: {
      findUnique: () => mockMapLayerFindUnique(),
    },
  },
}));

// Mock server helpers
vi.mock("@/shared/lib/server-helpers", () => ({
  getAuthenticatedUser: () => mockGetAuthenticatedUser(),
  verifyWorldPermission: () => mockVerifyWorldPermission(),
  verifyPinPermission: () => mockVerifyPinPermission(),
}));

// Mock errors
vi.mock("@/shared/lib/errors", () => ({
  safeAsync: async (fn: any) => {
    const result = await fn();
    return { success: true, data: result };
  },
  ValidationError: class extends Error {},
}));

// Mock presence
vi.mock("@/features/presence", () => ({
  safeLogCollaborationEvent: () => mockSafeLogCollaborationEvent(),
}));

// Mock slug utilities
vi.mock("@/shared/lib/slug", () => ({
  generateSlug: (s: string) => s.toLowerCase().replace(/\s+/g, "-"),
  generateUniqueSlug: async (base: string, checker: any) => {
    let slug = base;
    let counter = 0;
    while (await checker(slug)) {
      slug = `${base}-${++counter}`;
    }
    return slug;
  },
}));

// Mock cache
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
}));

describe("Pins Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    mockGetAuthenticatedUser.mockResolvedValue({ id: "user-1", name: "Test User" });
    mockVerifyWorldPermission.mockResolvedValue(true);
    mockVerifyPinPermission.mockResolvedValue(true);
    mockMapLayerFindUnique.mockResolvedValue(null);
    mockPinFindFirst.mockResolvedValue(null); // No existing slug
  });

  describe("Pin Creation", () => {
    it("should create a pin with valid data", async () => {
      const mockPin = {
        id: "pin-1",
        title: "Test Pin",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
        slug: "test-pin",
        gameWorldId: "world-1",
        userId: "user-1",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinCreate.mockResolvedValue(mockPin);

      const { createPin } = await import("@/features/pins/actions");

      const result = await createPin({
        gameWorldId: "world-1",
        title: "Test Pin",
        description: "Test Description",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pinId).toBe("pin-1");
      }
    });

    it("should handle missing required fields", async () => {
      const { createPin } = await import("@/features/pins/actions");

      const result = await createPin({
        gameWorldId: "world-1",
        title: "",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
      });

      // Should fail validation
      expect(result.success).toBe(false);
    });
  });

  describe("Pin Update", () => {
    it("should update pin properties", async () => {
      const mockUpdated = {
        id: "pin-1",
        title: "Updated Title",
        slug: "updated-title",
        gameWorldId: "world-1",
        userId: "user-1",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinUpdate.mockResolvedValue(mockUpdated);
      mockPinFindUnique.mockResolvedValue(mockUpdated);

      const { updatePin } = await import("@/features/pins/actions");

      const result = await updatePin({
        pinId: "pin-1",
        title: "Updated Title",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Title");
      }
    });

    it("should handle non-existent pin", async () => {
      mockPinFindUnique.mockResolvedValue(null);

      const { updatePin } = await import("@/features/pins/actions");

      const result = await updatePin({
        pinId: "non-existent",
        title: "Updated Title",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Pin Deletion", () => {
    it("should delete a pin", async () => {
      const mockPin = {
        id: "pin-1",
        title: "Test Pin",
        gameWorldId: "world-1",
        userId: "user-1",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
        slug: "test-pin",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinFindUnique.mockResolvedValue(mockPin);
      mockPinDelete.mockResolvedValue(mockPin);

      const { deletePin } = await import("@/features/pins/actions");

      const result = await deletePin({ pinId: "pin-1" });

      expect(result.success).toBe(true);
    });

    it("should handle deletion of non-existent pin", async () => {
      mockPinFindUnique.mockResolvedValue(null);

      const { deletePin } = await import("@/features/pins/actions");

      const result = await deletePin({ pinId: "non-existent" });

      expect(result.success).toBe(false);
    });
  });

  describe("Pin Queries", () => {
    it("should fetch pins by world", async () => {
      const mockPins = [
        {
          id: "pin-1",
          title: "Pin 1",
          latitude: 45.5,
          longitude: -73.5,
          pinType: "CITY",
          gameWorldId: "world-1",
          isVisible: true,
          slug: "pin-1",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "pin-2",
          title: "Pin 2",
          latitude: 46.5,
          longitude: -74.5,
          pinType: "LANDMARK",
          gameWorldId: "world-1",
          isVisible: true,
          slug: "pin-2",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld({ worldId: "world-1" });

      expect(result).toHaveLength(2);
    });

    it("should fetch single pin by ID", async () => {
      const mockPin = {
        id: "pin-1",
        title: "Test Pin",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
        gameWorldId: "world-1",
        isVisible: true,
        slug: "test-pin",
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinFindUnique.mockResolvedValue(mockPin);

      const { getPinById } = await import("@/features/pins/actions");

      const result = await getPinById({ pinId: "pin-1" });

      expect(result).not.toBeNull();
      expect(result?.id).toBe("pin-1");
    });

    it("should return null for non-existent pin", async () => {
      mockPinFindUnique.mockResolvedValue(null);

      const { getPinById } = await import("@/features/pins/actions");

      const result = await getPinById({ pinId: "non-existent" });

      expect(result).toBeNull();
    });

    it("should filter pins by type", async () => {
      const mockPins = [
        {
          id: "pin-1",
          title: "City Pin",
          latitude: 45.5,
          longitude: -73.5,
          pinType: "CITY",
          gameWorldId: "world-1",
          isVisible: true,
          slug: "city-pin",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld({
        worldId: "world-1",
        pinTypes: ["CITY"],
      });

      expect(result).toHaveLength(1);
      expect(result[0].pinType).toBe("CITY");
    });

    it("should filter visible pins only", async () => {
      const mockPins = [
        {
          id: "pin-1",
          title: "Visible Pin",
          latitude: 45.5,
          longitude: -73.5,
          pinType: "CITY",
          gameWorldId: "world-1",
          isVisible: true,
          slug: "visible-pin",
          userId: "user-1",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld({
        worldId: "world-1",
        showVisibleOnly: true,
      });

      expect(mockPinFindMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            isVisible: true,
          }),
        })
      );
    });

    it("should delete multiple pins", async () => {
      mockPinDeleteMany.mockResolvedValue({ count: 3 });

      const { deleteMultiplePins } = await import("@/features/pins/actions");

      const result = await deleteMultiplePins({
        pinIds: ["pin-1", "pin-2", "pin-3"],
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.count).toBe(3);
      }
    });

    it("should reorder pins", async () => {
      const updates = [
        { pinId: "pin-1", order: 1 },
        { pinId: "pin-2", order: 0 },
      ];

      const mockPins = [
        { id: "pin-1", order: 1 },
        { id: "pin-2", order: 0 },
      ];
      mockPinUpdate.mockResolvedValueOnce(mockPins[0]).mockResolvedValueOnce(mockPins[1]);

      const { reorderPins } = await import("@/features/pins/actions");

      const result = await reorderPins({
        worldId: "world-1",
        updates,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPinFindMany.mockRejectedValue(new Error("Database error"));

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld({ worldId: "world-1" });

      expect(result).toEqual([]);
    });
  });

  describe("Validation", () => {
    it("should validate latitude range", async () => {
      const { CreatePinSchema } = await import("@/features/pins/logic/pin-schemas");

      // Valid CUID format
      const validCuid = "clk7x7y2z0000356h1234b6n";
      // Lazy import to avoid mock issues
      const { CreatePinSchema } = await import("@/features/pins/logic/pin-schemas");

      // Valid CUID format: clxxxxxxxxxxxxx (25 chars starting with 'cl')
      const validCuid = "clk7x7y2z0000356h1234b6n"; // Example valid CUID

      const valid = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
      });

      expect(valid.success).toBe(true);

      const invalid1 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 91,
        longitude: -73.5,
        pinType: "CITY",
      });

      expect(invalid1.success).toBe(false);

      const invalid2 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: -91,
        longitude: -73.5,
        pinType: "CITY",
      });

      expect(invalid2.success).toBe(false);
    });

    it("should validate longitude range", async () => {
      // Lazy import to avoid mock issues
      const { CreatePinSchema } = await import("@/features/pins/logic/pin-schemas");

      // Valid CUID format
      const validCuid = "clk7x7y2z0000356h1234b6n";

      const valid = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 45.5,
        longitude: -73.5,
        pinType: "CITY",
      });

      expect(valid.success).toBe(true);

      const invalid1 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 45.5,
        longitude: 181,
        pinType: "CITY",
      });

      expect(invalid1.success).toBe(false);

      const invalid2 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 45.5,
        longitude: -181,
        pinType: "CITY",
      });

      expect(invalid2.success).toBe(false);
    });
  });
});
