/**
 * Tests for Worlds Server Actions
 */

import { describe, it, expect, beforeEach, vi } from "vitest";

// Module-level mock functions that we can control
const mockGameWorldCreate = vi.fn();
const mockGameWorldUpdate = vi.fn();
const mockGameWorldDelete = vi.fn();
const mockGameWorldFindMany = vi.fn();
const mockGameWorldFindUnique = vi.fn();
const mockGameWorldFindFirst = vi.fn();
const mockWorldMemberCreate = vi.fn();
const mockWorldMemberFindMany = vi.fn();
const mockWorldMemberFindUnique = vi.fn();
const mockWorldMemberUpdate = vi.fn();
const mockWorldMemberDelete = vi.fn();
const mockGetAuthenticatedUser = vi.fn();
const mockVerifyWorldPermission = vi.fn();
const mockRevalidatePath = vi.fn();

// Mock Prisma
vi.mock("@/shared/lib/prisma", () => ({
  prisma: {
    gameWorld: {
      create: () => mockGameWorldCreate(),
      update: () => mockGameWorldUpdate(),
      delete: () => mockGameWorldDelete(),
      findMany: () => mockGameWorldFindMany(),
      findUnique: () => mockGameWorldFindUnique(),
      findFirst: () => mockGameWorldFindFirst(),
    },
    worldMember: {
      create: () => mockWorldMemberCreate(),
      findMany: () => mockWorldMemberFindMany(),
      findUnique: () => mockWorldMemberFindUnique(),
      update: () => mockWorldMemberUpdate(),
      delete: () => mockWorldMemberDelete(),
    },
    mapLayer: {
      findUnique: vi.fn(),
      update: vi.fn(),
      create: vi.fn(),
    },
  },
}));

// Mock server helpers
vi.mock("@/shared/lib/server-helpers", () => ({
  getAuthenticatedUser: () => mockGetAuthenticatedUser(),
  verifyWorldPermission: () => mockVerifyWorldPermission(),
}));

// Mock errors
vi.mock("@/shared/lib/errors", () => ({
  safeAsync: async (fn: () => Promise<unknown>, _errorMessage: string) => {
    try {
      const _result = await fn();
      // Simulate Result<T> wrapper - return as success
      return { success: true, data: result };
    } catch (error) {
      // Return error result when function throws
      return { success: false, error: error instanceof Error ? error.message : String(error) };
    }
  },
  ValidationError: class ValidationError extends Error {
    constructor(message: string) {
      super(message);
      this.name = "ValidationError";
    }
  },
}));

// Mock cache
vi.mock("next/cache", () => ({
  revalidatePath: (path: string) => mockRevalidatePath(path),
  revalidateTag: (_tag: string) => Promise.resolve(),
  unstable_cache: (fn: () => Promise<unknown>) => fn,
}));

describe("Worlds Server Actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock returns
    mockGetAuthenticatedUser.mockResolvedValue({ id: "user-1", name: "Test User" });
    mockVerifyWorldPermission.mockResolvedValue(true);
  });

  describe("World Creation", () => {
    it("should create a world with valid data", async () => {
      const mockWorld = {
        id: "world-1",
        title: "Test World",
        description: "Test Description",
        userId: "user-1",
      };
      mockGameWorldCreate.mockResolvedValue(mockWorld);

      const { createWorld } = await import("@/features/worlds/actions");

      const _result = await createWorld({
        title: "Test World",
        description: "Test Description",
        isPublic: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.worldId).toBe("world-1");
      }
    });

    it("should create world with default values", async () => {
      const mockWorld = {
        id: "world-1",
        title: "New World",
        description: "",
        userId: "user-1",
      };
      mockGameWorldCreate.mockResolvedValue(mockWorld);

      const { createWorld } = await import("@/features/worlds/actions");

      const _result = await createWorld({ title: "New World", description: "", isPublic: false });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.worldId).toBe("world-1");
      }
    });
  });

  describe("World Queries", () => {
    it("should get user's worlds", async () => {
      const mockWorlds = [
        { id: "world-1", title: "World 1", userId: "user-1", user: { name: "Test User" } },
        { id: "world-2", title: "World 2", userId: "user-1", user: { name: "Test User" } },
      ];
      mockGameWorldFindMany.mockResolvedValue(mockWorlds);

      const { getMyWorlds } = await import("@/features/worlds/actions");

      const _result = await getMyWorlds();

      expect(result).toEqual(mockWorlds);
    });

    it("should get world by ID", async () => {
      const mockWorld = {
        id: "world-1",
        title: "World",
        map: null,
        isPublished: true,
        isPublic: true,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { name: "Test User", image: null },
        layers: [],
      };
      mockGameWorldFindUnique.mockResolvedValue(mockWorld);

      const { getWorldById } = await import("@/features/worlds/actions");

      const _result = await getWorldById("world-1");

      expect(result).not.toBeNull();
      expect(result?.id).toBe("world-1");
    });

    it("should return null for non-existent world", async () => {
      mockGameWorldFindUnique.mockResolvedValue(null);

      const { getWorldById } = await import("@/features/worlds/actions");

      const _result = await getWorldById("non-existent");

      expect(result).toBeNull();
    });
  });

  describe("World Updates", () => {
    it("should update world title", async () => {
      const mockUpdated = {
        id: "world-1",
        title: "Updated Title",
        description: "Test",
        map: null,
        isPublic: true,
        isPublished: true,
        userId: "user-1",
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      mockGameWorldUpdate.mockResolvedValue(mockUpdated);

      const { updateWorldTitle } = await import("@/features/worlds/actions");

      const _result = await updateWorldTitle("world-1", "Updated Title");

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.title).toBe("Updated Title");
      }
    });

    it("should update world state", async () => {
      const mockUpdated = {
        id: "world-1",
        title: "World",
        isPublic: true,
      };
      mockGameWorldUpdate.mockResolvedValue(mockUpdated);
      mockGameWorldFindUnique.mockResolvedValue(mockUpdated);

      const { updateWorldState } = await import("@/features/worlds/actions");

      const _result = await updateWorldState("world-1", {
        isPublic: true,
      });

      expect(result.success).toBe(true);
    });
  });

  describe("Error Handling", () => {
    it("should handle duplicate world titles", async () => {
      mockGameWorldCreate.mockRejectedValue(
        new Error("World with this title already exists")
      );

      const { createWorld } = await import("@/features/worlds/actions");

      const _result = await createWorld({ title: "Duplicate", description: "Test", isPublic: false });

      expect(result.success).toBe(false);
    });

    it("should handle unauthorized access", async () => {
      mockGetAuthenticatedUser.mockResolvedValue(null);

      const { getMyWorlds } = await import("@/features/worlds/actions");

      const _result = await getMyWorlds();

      // Should return empty array on error
      expect(result).toEqual([]);
    });
  });
});
