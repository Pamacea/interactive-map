/**
 * Characters Feature Test Suite
 *
 * Tests for character CRUD operations, permissions, and validations
 */

import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  createCharacter,
  getCharacterById,
  getCharactersByWorld,
  getCharactersFiltered,
  updateCharacter,
  toggleCharacterVisibility,
  reorderCharacters,
  deleteCharacter,
  type CreateCharacterInput,
  type UpdateCharacterInput,
} from "../methods";
import { CreateCharacterSchema, UpdateCharacterSchema } from "../methods/create-character";

// ============================================
// MOCKS
// ============================================

// Mock the prisma module at the top level before importing
const mockPrisma = {
  character: {
    create: vi.fn(),
    findFirst: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  user: {
    findUnique: vi.fn(),
  },
  worldMember: {
    findFirst: vi.fn(),
  },
  gameWorld: {
    findUnique: vi.fn(),
  },
};

vi.mock("@/shared/lib/prisma", () => ({
  prisma: mockPrisma,
}));

vi.mock("@/shared/lib/server-helpers", () => ({
  getAuthenticatedUser: vi.fn(),
  verifyWorldPermission: vi.fn(),
  verifyCharacterPermission: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const _mockAuth = {
  getAuthenticatedUser: vi.fn(),
  verifyWorldPermission: vi.fn(),
  verifyCharacterPermission: vi.fn(),
};

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

import { revalidatePath } from "next/cache";
import { getAuthenticatedUser, verifyWorldPermission, verifyCharacterPermission } from "@/shared/lib/server-helpers";
import type { MockedFunction } from "vitest";

// ============================================
// TEST DATA
// ============================================

const mockUser = {
  id: "user-1",
  name: "Test User",
  email: "test@example.com",
  image: null,
};

const mockWorld = {
  id: "world-1",
  title: "Test World",
  description: "A test world",
  userId: "user-1",
  isPublic: true,
  isPublished: true,
};

const mockCharacter = {
  id: "char-1",
  name: "Gandalf",
  shortName: "Gandalf",
  characterType: "COMPANION",
  role: "MENTOR",
  portraitUrl: null,
  age: 1000,
  gender: "Male",
  species: "Wizard",
  height: "6'2\"",
  build: "Slender",
  level: 50,
  class: "Wizard",
  faction: "The Fellowship",
  personality: "Wise and mysterious",
  background: "An ancient wizard guiding the heroes",
  goals: "Defeat the Dark Lord",
  fears: "Failure",
  isVisible: true,
  isPublic: true,
  order: 0,
  userId: "user-1",
  gameWorldId: "world-1",
  createdAt: new Date(),
  updatedAt: new Date(),
  user: mockUser,
  gameWorld: mockWorld,
};

// ============================================
// SETUP
// ============================================

beforeEach(() => {
  vi.clearAllMocks();

  // Setup default mock returns
  (getAuthenticatedUser as MockedFunction<typeof getAuthenticatedUser>).mockResolvedValue(mockUser);
  (verifyWorldPermission as MockedFunction<typeof verifyWorldPermission>).mockResolvedValue(mockWorld);
  (verifyCharacterPermission as MockedFunction<typeof verifyCharacterPermission>).mockResolvedValue(mockCharacter);
  mockPrisma.character.create.mockResolvedValue(mockCharacter);
  mockPrisma.character.findUnique.mockResolvedValue(mockCharacter);
  mockPrisma.character.findMany.mockResolvedValue([mockCharacter]);
  mockPrisma.character.findFirst.mockResolvedValue(null);
  mockPrisma.character.update.mockResolvedValue(mockCharacter);
  (revalidatePath as MockedFunction<typeof revalidatePath>).mockImplementation(() => {});
});

// ============================================
// SCHEMA VALIDATION TESTS
// ============================================

describe("Characters - Schema Validation", () => {
  describe("CreateCharacterSchema", () => {
    it("should validate valid character data", () => {
      const validData: CreateCharacterInput = {
        name: "Gandalf",
        characterType: "COMPANION",
        role: "MENTOR",
        gameWorldId: "world-1",
      };

      const _result = CreateCharacterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require name field", () => {
      const invalidData = {
        characterType: "COMPANION",
        role: "MENTOR",
        gameWorldId: "world-1",
      };

      const _result = CreateCharacterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should require gameWorldId", () => {
      const invalidData = {
        name: "Gandalf",
        characterType: "COMPANION",
        role: "MENTOR",
      };

      const _result = CreateCharacterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should validate characterType enum", () => {
      const validTypes = ["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "COMPANION", "BOSS", "CUSTOM"];

      validTypes.forEach((type) => {
        const _data = {
          name: "Test",
          characterType: type,
          role: "SUPPORTING",
          gameWorldId: "world-1",
        };
        const _result = CreateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should validate role enum", () => {
      const validRoles = ["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "BACKGROUND", "MENTOR", "ALLY", "NEUTRAL", "HOSTILE", "CUSTOM"];

      validRoles.forEach((role) => {
        const _data = {
          name: "Test",
          characterType: "NPC",
          role: role,
          gameWorldId: "world-1",
        };
        const _result = CreateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should validate name max length", () => {
      const invalidData = {
        name: "a".repeat(201),
        characterType: "NPC",
        role: "SUPPORTING",
        gameWorldId: "world-1",
      };

      const _result = CreateCharacterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should accept valid portraitUrl", () => {
      const _data = {
        name: "Test",
        characterType: "NPC" as const,
        role: "SUPPORTING" as const,
        portraitUrl: "https://example.com/image.jpg",
        gameWorldId: "world-1",
      };

      const _result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept empty string for portraitUrl", () => {
      const _data = {
        name: "Test",
        characterType: "NPC" as const,
        role: "SUPPORTING" as const,
        portraitUrl: "",
        gameWorldId: "world-1",
      };

      const _result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should validate age range", () => {
      const validData = {
        name: "Test",
        characterType: "NPC" as const,
        role: "SUPPORTING" as const,
        age: 25,
        gameWorldId: "world-1",
      };

      expect(CreateCharacterSchema.safeParse(validData).success).toBe(true);

      const invalidData1 = { ...validData, age: -1 };
      expect(CreateCharacterSchema.safeParse(invalidData1).success).toBe(false);

      const invalidData2 = { ...validData, age: 10001 };
      expect(CreateCharacterSchema.safeParse(invalidData2).success).toBe(false);
    });
  });

  describe("UpdateCharacterSchema", () => {
    it("should validate partial updates", () => {
      const validData: UpdateCharacterInput = {
        id: "char-1",
        name: "Updated Name",
      };

      const _result = UpdateCharacterSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("should require character ID", () => {
      const invalidData = {
        name: "Updated Name",
      };

      const _result = UpdateCharacterSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });

    it("should allow updating subset of fields", () => {
      const partialUpdates: UpdateCharacterInput[] = [
        { id: "char-1", name: "New Name" },
        { id: "char-1", age: 30 },
        { id: "char-1", isVisible: false },
        { id: "char-1", level: 10, class: "Warrior" },
      ];

      partialUpdates.forEach((data) => {
        const _result = UpdateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });
});

// ============================================
// CHARACTER RELATIONS TESTS
// ============================================

describe("Characters - Relations", () => {
  it("should fetch character with user and world relations", async () => {
    const characterWithRelations = {
      ...mockCharacter,
      user: mockUser,
      gameWorld: mockWorld,
    };

    mockPrisma.character.findUnique.mockResolvedValue(characterWithRelations);

    const _result = await getCharacterById("char-1");

    expect(result).not.toBeNull();
    expect(result?.user).toBeDefined();
    expect(result?.gameWorld).toBeDefined();
    expect(result?.user.id).toBe("user-1");
    expect(result?.gameWorld.id).toBe("world-1");
  });

  it("should return null for non-existent character", async () => {
    mockPrisma.character.findUnique.mockResolvedValue(null);

    const _result = await getCharacterById("non-existent");

    expect(result).toBeNull();
  });

  it("should handle database errors gracefully", async () => {
    mockPrisma.character.findUnique.mockRejectedValue(new Error("Database error"));

    const _result = await getCharacterById("char-1");

    expect(result).toBeNull();
  });
});

// ============================================
// CHARACTER FILTERING TESTS
// ============================================

describe("Characters - Filtering", () => {
  it("should filter by character types", async () => {
    const mockCharacters = [
      { ...mockCharacter, characterType: "PLAYER" },
      { ...mockCharacter, id: "char-2", characterType: "NPC" },
    ];
    mockPrisma.character.findMany.mockResolvedValue(mockCharacters);

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
      characterTypes: ["PLAYER"],
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by roles", async () => {
    const mockCharacters = [
      { ...mockCharacter, role: "MENTOR" },
      { ...mockCharacter, id: "char-2", role: "ANTAGONIST" },
    ];
    mockPrisma.character.findMany.mockResolvedValue(mockCharacters);

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
      roles: ["MENTOR"],
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by factions", async () => {
    const mockCharacters = [
      { ...mockCharacter, faction: "The Fellowship" },
      { ...mockCharacter, id: "char-2", faction: "The Empire" },
    ];
    mockPrisma.character.findMany.mockResolvedValue(mockCharacters);

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
      factions: ["The Fellowship"],
    });

    expect(result).toHaveLength(2);
  });

  it("should search by term", async () => {
    const mockCharacters = [
      { ...mockCharacter, name: "Gandalf" },
      { ...mockCharacter, id: "char-2", name: "Aragorn" },
    ];
    mockPrisma.character.findMany.mockResolvedValue(mockCharacters);

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
      searchTerm: "Gandalf",
    });

    expect(result).toHaveLength(2);
  });

  it("should filter by visibility", async () => {
    const mockCharacters = [
      { ...mockCharacter, isVisible: true },
      { ...mockCharacter, id: "char-2", isVisible: false },
    ];
    mockPrisma.character.findMany.mockResolvedValue([mockCharacters[0]]);

    await getCharactersFiltered({
      gameWorldId: "world-1",
      showVisibleOnly: true,
    });

    expect(mockPrisma.character.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          isVisible: true,
        }),
      })
    );
  });

  it("should handle empty filters", async () => {
    mockPrisma.character.findMany.mockResolvedValue([mockCharacter]);

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
    });

    expect(result).toHaveLength(1);
  });

  it("should handle database errors in filtering", async () => {
    mockPrisma.character.findMany.mockRejectedValue(new Error("Database error"));

    const _result = await getCharactersFiltered({
      gameWorldId: "world-1",
    });

    expect(result).toEqual([]);
  });
});

// ============================================
// CHARACTER ORDERING TESTS
// ============================================

describe("Characters - Ordering", () => {
  it("should order characters by order field then name", async () => {
    const mockCharacters = [
      { ...mockCharacter, order: 0, name: "Aragorn" },
      { ...mockCharacter, id: "char-2", order: 0, name: "Gandalf" },
      { ...mockCharacter, id: "char-3", order: 1, name: "Frodo" },
    ];
    mockPrisma.character.findMany.mockResolvedValue(mockCharacters);

    await getCharactersByWorld("world-1");

    expect(mockPrisma.character.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        orderBy: [{ order: "asc" }, { name: "asc" }],
      })
    );
  });

  it("should assign order based on max existing order", async () => {
    const maxOrderChar = { order: 5 };
    mockPrisma.character.findFirst.mockResolvedValue(maxOrderChar);

    await createCharacter({
      name: "New Character",
      characterType: "NPC",
      role: "SUPPORTING",
      gameWorldId: "world-1",
    });

    expect(mockPrisma.character.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          order: 6,
        }),
      })
    );
  });

  it("should start order at 0 for first character", async () => {
    mockPrisma.character.findFirst.mockResolvedValue(null);

    await createCharacter({
      name: "First Character",
      characterType: "NPC",
      role: "SUPPORTING",
      gameWorldId: "world-1",
    });

    expect(mockPrisma.character.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          order: 0,
        }),
      })
    );
  });
});

// ============================================
// CHARACTER BATCH OPERATIONS TESTS
// ============================================

describe("Characters - Batch Operations", () => {
  it("should reorder multiple characters", async () => {
    const updates = [
      { id: "char-1", order: 1 },
      { id: "char-2", order: 0 },
    ];

    const updatedChars = [
      { ...mockCharacter, id: "char-1", order: 1 },
      { ...mockCharacter, id: "char-2", order: 0 },
    ];
    mockPrisma.character.update.mockResolvedValue(updatedChars[0]);
    mockPrisma.character.findUnique.mockResolvedValue(mockCharacter);

    await reorderCharacters("world-1", updates);

    expect(mockPrisma.character.update).toHaveBeenCalledTimes(2);
  });

  it("should verify all characters belong to same world during reorder", async () => {
    const updates = [
      { id: "char-1", order: 0 },
      { id: "char-2", order: 1 },
    ];

    mockPrisma.character.findUnique
      .mockResolvedValueOnce({ ...mockCharacter, gameWorldId: "world-1" })
      .mockResolvedValueOnce({ ...mockCharacter, id: "char-2", gameWorldId: "world-2" });

    const _result = await reorderCharacters("world-1", updates);

    expect(result.success).toBe(false);
    expect(result.success === false && result.error?.code).toBe("VALIDATION_ERROR");
  });

  it("should verify world permission before reorder", async () => {
    const updates = [{ id: "char-1", order: 0 }];
    (verifyWorldPermission as MockedFunction<typeof verifyWorldPermission>).mockRejectedValue(new Error("No permission"));

    const _result = await reorderCharacters("world-1", updates);

    expect(result.success).toBe(false);
  });
});

// ============================================
// CHARACTER VISIBILITY TESTS
// ============================================

describe("Characters - Visibility", () => {
  it("should toggle character visibility", async () => {
    const updatedChar = { ...mockCharacter, isVisible: false };
    mockPrisma.character.update.mockResolvedValue(updatedChar);

    const _result = await toggleCharacterVisibility("char-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.isVisible).toBe(false);
    }
  });

  it("should revalidate path after visibility toggle", async () => {
    mockPrisma.character.update.mockResolvedValue(mockCharacter);

    await toggleCharacterVisibility("char-1");

    expect(revalidatePath).toHaveBeenCalledWith(`/world/${mockCharacter.gameWorldId}`);
  });

  it("should verify permission before toggling visibility", async () => {
    (verifyCharacterPermission as MockedFunction<typeof verifyCharacterPermission>).mockRejectedValue(new Error("No permission"));

    const _result = await toggleCharacterVisibility("char-1");

    expect(result.success).toBe(false);
  });
});

// ============================================
// CHARACTER DELETION TESTS
// ============================================

describe("Characters - Deletion", () => {
  it("should delete character", async () => {
    mockPrisma.character.delete.mockResolvedValue(mockCharacter);

    const _result = await deleteCharacter("char-1");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.characterId).toBe("char-1");
    }
  });

  it("should verify permission before deletion", async () => {
    (verifyCharacterPermission as MockedFunction<typeof verifyCharacterPermission>).mockRejectedValue(new Error("No permission"));

    const _result = await deleteCharacter("char-1");

    expect(result.success).toBe(false);
  });

  it("should revalidate path after deletion", async () => {
    mockPrisma.character.delete.mockResolvedValue(mockCharacter);

    await deleteCharacter("char-1");

    expect(revalidatePath).toHaveBeenCalledWith(`/world/${mockCharacter.gameWorldId}`);
  });
});

// ============================================
// ERROR HANDLING TESTS
// ============================================

describe("Characters - Error Handling", () => {
  it("should handle authentication errors", async () => {
    (getAuthenticatedUser as MockedFunction<typeof getAuthenticatedUser>).mockRejectedValue(new Error("Not authenticated"));

    const _result = await createCharacter({
      name: "Test",
      characterType: "NPC",
      role: "SUPPORTING",
      gameWorldId: "world-1",
    });

    expect(result.success).toBe(false);
  });

  it("should handle authorization errors", async () => {
    (verifyWorldPermission as MockedFunction<typeof verifyWorldPermission>).mockRejectedValue(new Error("No permission"));

    const _result = await createCharacter({
      name: "Test",
      characterType: "NPC",
      role: "SUPPORTING",
      gameWorldId: "world-1",
    });

    expect(result.success).toBe(false);
  });

  it("should handle database errors during create", async () => {
    mockPrisma.character.create.mockRejectedValue(new Error("Database error"));

    const _result = await createCharacter({
      name: "Test",
      characterType: "NPC",
      role: "SUPPORTING",
      gameWorldId: "world-1",
    });

    expect(result.success).toBe(false);
  });

  it("should handle database errors during update", async () => {
    mockPrisma.character.update.mockRejectedValue(new Error("Database error"));

    const _result = await updateCharacter({
      id: "char-1",
      name: "Updated",
    });

    expect(result.success).toBe(false);
  });
});
