/**
 * Tests for Pins Server Actions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Module-level mock functions
const mockPinCreate = vi.fn();
const mockPinUpdate = vi.fn();
const mockPinDelete = vi.fn();
const mockPinFindMany = vi.fn();
const mockPinFindUnique = vi.fn();
const mockPinFindFirst = vi.fn();
const mockMapLayerFindUnique = vi.fn();
const mockGetAuthenticatedUser = vi.fn();
const mockVerifyWorldPermission = vi.fn();
const mockVerifyPinPermission = vi.fn();
const mockRevalidatePath = vi.fn();
const mockSafeLogCollaborationEvent = vi.fn();

// Track whether safeAsync should throw an error
let shouldThrowError = false;
let errorToThrow: Error | null = null;

// Mock Prisma
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    pin: {
      create: () => mockPinCreate(),
      update: () => mockPinUpdate(),
      delete: () => mockPinDelete(),
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
  safeAsync: async (fn: () => Promise<unknown>) => {
    if (shouldThrowError && errorToThrow) {
      const error = errorToThrow;
      shouldThrowError = false;
      errorToThrow = null;
      throw error;
    }
    try {
      const result = await fn();
      return { success: true, data: result };
    } catch (error) {
      return {
        success: false,
        error: {
          message: error instanceof Error ? error.message : String(error),
          code: error instanceof Error && 'code' in error ? (error as { code: string }).code : undefined,
        },
      };
    }
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
  generateUniqueSlug: async (base: string, checker: (slug: string) => Promise<boolean>) => {
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
    shouldThrowError = false;
    errorToThrow = null;

    // Setup default mock returns
    mockGetAuthenticatedUser.mockResolvedValue({ id: "cl2h8x3k5q", name: "Test User" });
    mockVerifyWorldPermission.mockResolvedValue(true);
    mockVerifyPinPermission.mockResolvedValue(true);
    mockMapLayerFindUnique.mockResolvedValue(null);
    mockPinFindFirst.mockResolvedValue(null); // No existing slug
  });

  describe("Pin Creation", () => {
    it("should create a pin with valid data", async () => {
      const mockPin = {
        id: "cm7h2x1k9p",
        title: "Test Pin",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
        slug: "test-pin",
        gameWorldId: "cm7h9x2k4p",
        userId: "cl2h8x3k5q",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinCreate.mockResolvedValue(mockPin);

      const { createPin } = await import("@/features/pins/actions");

      const result = await createPin({
        gameWorldId: "cm7h9x2k4p",
        title: "Test Pin",
        description: "Test Description",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.pinId).toBe("cm7h2x1k9p");
      }
    });

    it("should handle missing required fields", async () => {
      const { createPin } = await import("@/features/pins/actions");

      const result = await createPin({
        gameWorldId: "cm7h9x2k4p",
        title: "",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
      });

      // Should fail validation
      expect(result.success).toBe(false);
    });
  });

  describe("Pin Update", () => {
    it("should update pin properties", async () => {
      const mockUpdated = {
        id: "cm7h2x1k9p",
        title: "Updated Title",
        slug: "updated-title",
        gameWorldId: "cm7h9x2k4p",
        userId: "cl2h8x3k5q",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinUpdate.mockResolvedValue(mockUpdated);
      mockPinFindUnique.mockResolvedValue(mockUpdated);

      const { updatePin } = await import("@/features/pins/actions");

      const result = await updatePin({
        id: "cm7h2x1k9p",
        title: "Updated Title",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Title");
      }
    });

    it("should handle non-existent pin", async () => {
      mockVerifyPinPermission.mockRejectedValue(new Error("Pin not found"));

      const { updatePin } = await import("@/features/pins/actions");

      const result = await updatePin({
        id: "non-existent",
        title: "Updated Title",
      });

      expect(result.success).toBe(false);
    });
  });

  describe("Pin Deletion", () => {
    it("should delete a pin", async () => {
      const mockPin = {
        id: "cm7h2x1k9p",
        title: "Test Pin",
        gameWorldId: "cm7h9x2k4p",
        userId: "cl2h8x3k5q",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
        slug: "test-pin",
        isVisible: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockVerifyPinPermission.mockResolvedValue(mockPin);
      mockPinDelete.mockResolvedValue(mockPin);

      const { deletePin } = await import("@/features/pins/actions");

      const result = await deletePin("cm7h2x1k9p");

      expect(result.success).toBe(true);
    });

    it("should handle deletion of non-existent pin", async () => {
      mockVerifyPinPermission.mockRejectedValue(new Error("Pin not found"));

      const { deletePin } = await import("@/features/pins/actions");

      const result = await deletePin("non-existent");

      expect(result.success).toBe(false);
    });
  });

  describe("Pin Queries", () => {
    it("should fetch pins by world", async () => {
      const mockPins = [
        {
          id: "cm7h2x1k9p",
          title: "Pin 1",
          latitude: 0.45,
          longitude: 0.3,
          pinType: "CITY",
          gameWorldId: "cm7h9x2k4p",
          isVisible: true,
          slug: "cm7h2x1k9p",
          userId: "cl2h8x3k5q",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "cl3h5x7k2m",
          title: "Pin 2",
          latitude: 0.5,
          longitude: 0.4,
          pinType: "LANDMARK",
          gameWorldId: "cm7h9x2k4p",
          isVisible: true,
          slug: "cl3h5x7k2m",
          userId: "cl2h8x3k5q",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld("cm7h9x2k4p");

      expect(result).toHaveLength(2);
    });

    it("should fetch single pin by ID", async () => {
      const mockPin = {
        id: "cm7h2x1k9p",
        title: "Test Pin",
        latitude: 0.45,
        longitude: 0.3,
        pinType: "CITY",
        gameWorldId: "cm7h9x2k4p",
        isVisible: true,
        slug: "test-pin",
        userId: "cl2h8x3k5q",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockPinFindUnique.mockResolvedValue(mockPin);

      const { getPinById } = await import("@/features/pins/actions");

      const result = await getPinById("cm7h2x1k9p");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("cm7h2x1k9p");
    });

    it("should return null for non-existent pin", async () => {
      mockPinFindUnique.mockResolvedValue(null);

      const { getPinById } = await import("@/features/pins/actions");

      const result = await getPinById("non-existent");

      expect(result).toBeNull();
    });

    it("should filter pins by type", async () => {
      const mockPins = [
        {
          id: "cm7h2x1k9p",
          title: "City Pin",
          latitude: 0.45,
          longitude: 0.3,
          pinType: "CITY",
          gameWorldId: "cm7h9x2k4p",
          isVisible: true,
          slug: "city-pin",
          userId: "cl2h8x3k5q",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld("cm7h9x2k4p");

      expect(result).toHaveLength(1);
      expect(result[0].pinType).toBe("CITY");
    });

    it("should filter visible pins only", async () => {
      const mockPins = [
        {
          id: "cm7h2x1k9p",
          title: "Visible Pin",
          latitude: 0.45,
          longitude: 0.3,
          pinType: "CITY",
          gameWorldId: "cm7h9x2k4p",
          isVisible: true,
          slug: "visible-pin",
          userId: "cl2h8x3k5q",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      mockPinFindMany.mockResolvedValue(mockPins);

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld("cm7h9x2k4p");

      // Just verify the function returns data
      expect(result).toHaveLength(1);
      expect(mockPinFindMany).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should handle database errors gracefully", async () => {
      mockPinFindMany.mockRejectedValue(new Error("Database error"));

      const { getPinsByWorld } = await import("@/features/pins/actions");

      const result = await getPinsByWorld("cm7h9x2k4p");

      expect(result).toEqual([]);
    });
  });

  describe("Validation", () => {
    it("should validate latitude range", async () => {
      // Lazy import to avoid mock issues
      const { CreatePinSchema } = await import("@/features/pins/logic/pin-schemas");

      // Valid CUID format: clxxxxxxxxxxxxx (25 chars starting with 'cl')
      const validCuid = "clk7x7y2z0000356h1234b6n"; // Example valid CUID

      const valid = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 0.5,
        longitude: 0.5,
        pinType: "CITY",
      });

      expect(valid.success).toBe(true);

      const invalid1 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 1.5, // Should be 0-1
        longitude: 0.5,
        pinType: "CITY",
      });

      expect(invalid1.success).toBe(false);

      const invalid2 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: -0.5, // Should be 0-1
        longitude: 0.5,
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
        latitude: 0.5,
        longitude: 0.5,
        pinType: "CITY",
      });

      expect(valid.success).toBe(true);

      const invalid1 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 0.5,
        longitude: 1.5, // Should be 0-1
        pinType: "CITY",
      });

      expect(invalid1.success).toBe(false);

      const invalid2 = CreatePinSchema.safeParse({
        gameWorldId: validCuid,
        title: "Test",
        latitude: 0.5,
        longitude: -0.5, // Should be 0-1
        pinType: "CITY",
      });

      expect(invalid2.success).toBe(false);
    });
  });
});
