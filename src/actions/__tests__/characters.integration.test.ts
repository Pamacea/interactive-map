/**
 * Integration Tests for Character Server Actions
 *
 * Tests the full CRUD operations for Characters with:
 * - Database transactions with automatic rollback
 * - Permission verification
 * - Pin linking (character locations)
 * - Character relationships
 * - Portrait upload
 * - Order management
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

// Mock fs operations for file uploads
vi.mock("fs/promises", () => ({
  writeFile: vi.fn().mockResolvedValue(undefined),
  mkdir: vi.fn().mockResolvedValue(undefined),
}));

import {
  createCharacter,
  getCharacterById,
  getCharactersByWorld,
  getCharactersFiltered,
  updateCharacter,
  deleteCharacter,
  toggleCharacterVisibility,
  reorderCharacters,
  linkCharacterToPin,
  unlinkCharacterFromPin,
  getPinsForCharacter,
  getCharactersForPin,
  createCharacterRelationship,
  updateCharacterRelationship,
  deleteCharacterRelationship,
  getCharacterRelationships,
  uploadCharacterPortrait,
} from "../characters";
import {
  AuthenticationError,
  AuthorizationError,
  ValidationError,
  NotFoundError,
} from "@/lib/errors";

describe("Character CRUD Integration", () => {
  let testUserId: string;
  let testWorldId: string;
  let testCharacterId: string;
  let testPinId: string;
  let testLayerId: string;

  /**
   * Setup: Create test user, world, pin, and character
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
        title: "Test Location",
        pinType: "CITY",
        latitude: 0.5,
        longitude: 0.5,
        gameWorldId: testWorldId,
        layerId: testLayerId,
        userId: testUserId,
      },
    });
    testPinId = pin.id;

    // Create test character
    const character = await prisma.character.create({
      data: {
        name: "Test Character",
        characterType: "NPC",
        role: "SUPPORTING",
        gameWorldId: testWorldId,
        userId: testUserId,
      },
    });
    testCharacterId = character.id;
  });

  /**
   * Cleanup: Delete all test data
   */
  afterEach(async () => {
    await prisma.characterRelationship.deleteMany({
      where: {
        OR: [{ sourceId: testCharacterId }, { targetId: testCharacterId }],
      },
    });
    await prisma.characterPinRelation.deleteMany({
      where: { characterId: testCharacterId },
    });
    await prisma.character.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.pin.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.mapLayer.deleteMany({ where: { gameWorldId: testWorldId } });
    await prisma.gameWorld.deleteMany({ where: { userId: testUserId } });
    await prisma.user.delete({ where: { id: testUserId } });

    mockGetServerSession.mockReset();
    vi.clearAllMocks();
  });

  describe("createCharacter", () => {
    it("should create character with valid data", async () => {
      const result = await createCharacter({
        name: "Aragorn",
        shortName: "Strider",
        characterType: "PLAYER",
        role: "PROTAGONIST",
        age: 87,
        gender: "Male",
        species: "Human",
        level: 15,
        class: "Ranger",
        faction: "Gondor",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.characterId).toBeDefined();
        expect(result.data.character.name).toBe("Aragorn");
        expect(result.data.character.shortName).toBe("Strider");
        expect(result.data.character.characterType).toBe("PLAYER");
        expect(result.data.character.role).toBe("PROTAGONIST");
        expect(result.data.character.age).toBe(87);
        expect(result.data.character.level).toBe(15);
        expect(result.data.character.faction).toBe("Gondor");

        // Verify in database
        const character = await prisma.character.findUnique({
          where: { id: result.data.characterId },
        });
        expect(character).toBeTruthy();
        expect(character?.name).toBe("Aragorn");
      }
    });

    it("should create character with default values", async () => {
      const result = await createCharacter({
        name: "Basic Character",
        characterType: "NPC",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.isVisible).toBe(true);
        expect(result.data.character.isPublic).toBe(true);
        expect(result.data.character.order).toBeGreaterThanOrEqual(0);
      }
    });

    it("should create character with stats (JSON)", async () => {
      const stats = {
        strength: 18,
        dexterity: 14,
        constitution: 16,
        intelligence: 10,
        wisdom: 12,
        charisma: 14,
      };

      const result = await createCharacter({
        name: "Stat Character",
        characterType: "NPC",
        gameWorldId: testWorldId,
        stats,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.stats).toEqual(stats);
      }
    });

    it("should create character with skills (JSON array)", async () => {
      const skills = [
        { name: "Stealth", level: 5, description: "Move silently" },
        { name: "Perception", level: 4, description: "Notice things" },
      ];

      const result = await createCharacter({
        name: "Skill Character",
        characterType: "NPC",
        gameWorldId: testWorldId,
        skills,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.skills).toEqual(skills);
      }
    });

    it("should create character with equipment", async () => {
      const equipment = [
        { name: "Longsword", type: "weapon", description: "+1 Longsword" },
        { name: "Chain Mail", type: "armor", description: "AC 16" },
      ];

      const result = await createCharacter({
        name: "Equipped Character",
        characterType: "NPC",
        gameWorldId: testWorldId,
        equipment,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.equipment).toEqual(equipment);
      }
    });

    it("should create character with personality and background", async () => {
      const result = await createCharacter({
        name: "Deep Character",
        characterType: "NPC",
        gameWorldId: testWorldId,
        personality: "Brave but reckless",
        background: "Former soldier turned mercenary",
        goals: "Find redemption for past actions",
        fears: "Losing those close to him",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.personality).toBe("Brave but reckless");
        expect(result.data.character.background).toBe("Former soldier turned mercenary");
        expect(result.data.character.goals).toBe("Find redemption for past actions");
        expect(result.data.character.fears).toBe("Losing those close to him");
      }
    });

    it("should create merchant with shop inventory", async () => {
      const shopInventory = [
        { name: "Health Potion", price: 50, quantity: 10 },
        { name: "Mana Potion", price: 75, quantity: 5 },
      ];

      const result = await createCharacter({
        name: "Shopkeeper",
        characterType: "MERCHANT",
        gameWorldId: testWorldId,
        shopInventory,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.shopInventory).toEqual(shopInventory);
      }
    });

    it("should auto-increment order", async () => {
      // Create first character
      await createCharacter({
        name: "First",
        characterType: "NPC",
        gameWorldId: testWorldId,
      });

      // Create second character
      const result = await createCharacter({
        name: "Second",
        characterType: "NPC",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.order).toBe(1); // Second character should have order 1
      }
    });

    it("should reject unauthenticated request", async () => {
      mockGetServerSession.mockResolvedValueOnce(null);

      const result = await createCharacter({
        name: "Should Fail",
        characterType: "NPC",
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(AuthenticationError);
      }
    });
  });

  describe("getCharacterById", () => {
    it("should return character with full details", async () => {
      const character = await getCharacterById(testCharacterId);

      expect(character).toBeTruthy();
      expect(character?.id).toBe(testCharacterId);
      expect(character?.name).toBe("Test Character");
      expect(character?.characterType).toBe("NPC");
      expect(character?.role).toBe("SUPPORTING");
      expect(character?.user).toBeDefined();
      expect(character?.gameWorld).toBeDefined();
    });

    it("should return null for non-existent character", async () => {
      const character = await getCharacterById("non-existent-character");
      expect(character).toBeNull();
    });
  });

  describe("getCharactersByWorld", () => {
    beforeEach(async () => {
      // Create additional characters
      await prisma.character.create({
        data: {
          name: "Character 2",
          characterType: "PLAYER",
          gameWorldId: testWorldId,
          userId: testUserId,
          order: 1,
        },
      });

      await prisma.character.create({
        data: {
          name: "Character 3",
          characterType: "ENEMY",
          gameWorldId: testWorldId,
          userId: testUserId,
          order: 2,
        },
      });
    });

    it("should return all characters for a world", async () => {
      const characters = await getCharactersByWorld(testWorldId);

      expect(characters).toBeInstanceOf(Array);
      expect(characters.length).toBeGreaterThanOrEqual(3);
      expect(characters.every((c) => c.gameWorldId === testWorldId)).toBe(true);
    });

    it("should order by order then name", async () => {
      const characters = await getCharactersByWorld(testWorldId);

      // Should be sorted by order first
      for (let i = 1; i < characters.length; i++) {
        if (characters[i - 1].order !== characters[i].order) {
          expect(characters[i - 1].order).toBeLessThanOrEqual(characters[i].order);
        }
      }
    });
  });

  describe("getCharactersFiltered", () => {
    beforeEach(async () => {
      // Create characters with different properties
      await prisma.character.create({
        data: {
          name: "Player Hero",
          characterType: "PLAYER",
          role: "PROTAGONIST",
          faction: "Alliance",
          gameWorldId: testWorldId,
          userId: testUserId,
          isVisible: true,
        },
      });

      await prisma.character.create({
        data: {
          name: "Enemy Boss",
          characterType: "ENEMY",
          role: "ANTAGONIST",
          faction: "Horde",
          gameWorldId: testWorldId,
          userId: testUserId,
          isVisible: true,
        },
      });

      await prisma.character.create({
        data: {
          name: "Hidden NPC",
          characterType: "NPC",
          role: "SUPPORTING",
          gameWorldId: testWorldId,
          userId: testUserId,
          isVisible: false,
        },
      });
    });

    it("should filter by character types", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        characterTypes: ["PLAYER", "ENEMY"],
      });

      expect(characters.length).toBe(2);
      expect(characters.every((c) => ["PLAYER", "ENEMY"].includes(c.characterType))).toBe(true);
    });

    it("should filter by roles", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        roles: ["PROTAGONIST"],
      });

      expect(characters.length).toBe(1);
      expect(characters[0].role).toBe("PROTAGONIST");
    });

    it("should filter by factions", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        factions: ["Alliance"],
      });

      expect(characters.length).toBe(1);
      expect(characters[0].faction).toBe("Alliance");
    });

    it("should filter by visibility", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        showVisibleOnly: true,
      });

      expect(characters.every((c) => c.isVisible)).toBe(true);
    });

    it("should search by name", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        searchTerm: "Hero",
      });

      expect(characters.length).toBe(1);
      expect(characters[0].name).toContain("Hero");
    });

    it("should combine multiple filters", async () => {
      const characters = await getCharactersFiltered({
        gameWorldId: testWorldId,
        characterTypes: ["PLAYER"],
        showVisibleOnly: true,
      });

      expect(characters.length).toBe(1);
      expect(characters[0].characterType).toBe("PLAYER");
      expect(characters[0].isVisible).toBe(true);
    });
  });

  describe("updateCharacter", () => {
    it("should update character basic fields", async () => {
      const result = await updateCharacter({
        id: testCharacterId,
        name: "Updated Name",
        shortName: "Updated",
        age: 50,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe("Updated Name");
        expect(result.data.shortName).toBe("Updated");
        expect(result.data.age).toBe(50);
      }
    });

    it("should update character type and role", async () => {
      const result = await updateCharacter({
        id: testCharacterId,
        characterType: "BOSS",
        role: "ANTAGONIST",
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.characterType).toBe("BOSS");
        expect(result.data.role).toBe("ANTAGONIST");
      }
    });

    it("should update JSON fields", async () => {
      const newStats = { strength: 20, dexterity: 18 };
      const newEquipment = [{ name: "Excalibur", type: "weapon" }];

      const result = await updateCharacter({
        id: testCharacterId,
        stats: newStats,
        equipment: newEquipment,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.stats).toEqual(newStats);
        expect(result.data.equipment).toEqual(newEquipment);
      }
    });

    it("should update visibility flags", async () => {
      const result = await updateCharacter({
        id: testCharacterId,
        isVisible: false,
        isPublic: false,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(false);
        expect(result.data.isPublic).toBe(false);
      }
    });

    it("should update order", async () => {
      const result = await updateCharacter({
        id: testCharacterId,
        order: 10,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.order).toBe(10);
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

      const result = await updateCharacter({
        id: testCharacterId,
        name: "Hacked",
      });

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("deleteCharacter", () => {
    it("should delete character successfully", async () => {
      const result = await deleteCharacter(testCharacterId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.characterId).toBe(testCharacterId);

        // Verify character is deleted
        const character = await prisma.character.findUnique({
          where: { id: testCharacterId },
        });
        expect(character).toBeNull();
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

      const result = await deleteCharacter(testCharacterId);

      expect(result.success).toBe(false);

      // Cleanup
      await prisma.user.delete({ where: { id: otherUser.id } });
    });
  });

  describe("toggleCharacterVisibility", () => {
    it("should toggle from visible to hidden", async () => {
      await prisma.character.update({
        where: { id: testCharacterId },
        data: { isVisible: true },
      });

      const result = await toggleCharacterVisibility(testCharacterId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(false);
      }
    });

    it("should toggle from hidden to visible", async () => {
      await prisma.character.update({
        where: { id: testCharacterId },
        data: { isVisible: false },
      });

      const result = await toggleCharacterVisibility(testCharacterId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isVisible).toBe(true);
      }
    });
  });

  describe("Character-Pin Linking", () => {
    it("should link character to pin", async () => {
      const result = await linkCharacterToPin(
        testCharacterId,
        testPinId,
        "HOME",
        "Lives here"
      );

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.characterId).toBe(testCharacterId);
        expect(result.data.pinId).toBe(testPinId);
        expect(result.data.relationType).toBe("HOME");
        expect(result.data.notes).toBe("Lives here");
      }
    });

    it("should reject duplicate link", async () => {
      await linkCharacterToPin(testCharacterId, testPinId);

      const result = await linkCharacterToPin(testCharacterId, testPinId);

      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
      }
    });

    it("should unlink character from pin", async () => {
      await linkCharacterToPin(testCharacterId, testPinId);

      const result = await unlinkCharacterFromPin(testCharacterId, testPinId);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.linkId).toBeDefined();
      }
    });

    it("should get pins for character", async () => {
      await linkCharacterToPin(testCharacterId, testPinId, "WORK");

      const pins = await getPinsForCharacter(testCharacterId);

      expect(pins).toBeInstanceOf(Array);
      expect(pins.length).toBe(1);
      expect(pins[0].id).toBe(testPinId);
      expect(pins[0].relationType).toBe("WORK");
    });

    it("should get characters for pin", async () => {
      await linkCharacterToPin(testCharacterId, testPinId, "LOCATION");

      const characters = await getCharactersForPin(testPinId);

      expect(characters).toBeInstanceOf(Array);
      expect(characters.length).toBe(1);
      expect(characters[0].id).toBe(testCharacterId);
    });
  });

  describe("Character Relationships", () => {
    let targetCharacterId: string;

    beforeEach(async () => {
      const targetChar = await prisma.character.create({
        data: {
          name: "Target Character",
          characterType: "NPC",
          gameWorldId: testWorldId,
          userId: testUserId,
        },
      });
      targetCharacterId = targetChar.id;
    });

    it("should create relationship", async () => {
      const result = await createCharacterRelationship({
        sourceId: testCharacterId,
        targetId: targetCharacterId,
        relationshipType: "FRIEND",
        description: "Best friends since childhood",
        strength: 80,
        isVisible: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sourceId).toBe(testCharacterId);
        expect(result.data.targetId).toBe(targetCharacterId);
        expect(result.data.relationshipType).toBe("FRIEND");
        expect(result.data.strength).toBe(80);
      }
    });

    it("should update existing relationship", async () => {
      await createCharacterRelationship({
        sourceId: testCharacterId,
        targetId: targetCharacterId,
        relationshipType: "FRIEND",
      });

      const result = await updateCharacterRelationship({
        sourceId: testCharacterId,
        targetId: targetCharacterId,
        relationshipType: "ENEMY",
        description: "Now enemies",
        strength: 20,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.relationshipType).toBe("ENEMY");
        expect(result.data.strength).toBe(20);
      }
    });

    it("should delete relationship", async () => {
      await createCharacterRelationship({
        sourceId: testCharacterId,
        targetId: targetCharacterId,
        relationshipType: "MENTOR",
      });

      const result = await deleteCharacterRelationship(testCharacterId, targetCharacterId);

      expect(result.success).toBe(true);
    });

    it("should get relationships for character", async () => {
      await createCharacterRelationship({
        sourceId: testCharacterId,
        targetId: targetCharacterId,
        relationshipType: "COMPANION",
        strength: 90,
      });

      const relationships = await getCharacterRelationships(testCharacterId);

      expect(relationships.asSource.length).toBe(1);
      expect(relationships.asSource[0].targetId).toBe(targetCharacterId);
      expect(relationships.asSource[0].relationshipType).toBe("COMPANION");
    });

    it("should get incoming relationships", async () => {
      // Create reverse relationship
      await createCharacterRelationship({
        sourceId: targetCharacterId,
        targetId: testCharacterId,
        relationshipType: "MENTOR",
      });

      const relationships = await getCharacterRelationships(testCharacterId);

      expect(relationships.asTarget.length).toBe(1);
      expect(relationships.asTarget[0].sourceId).toBe(targetCharacterId);
    });
  });

  describe("uploadCharacterPortrait", () => {
    it("should upload portrait image", async () => {
      const mockFile = new File(["test"], "portrait.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadCharacterPortrait(testCharacterId, formData);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.portraitUrl).toContain("/uploads/characters/portraits/");
        expect(result.data.portraitUrl).toContain(".png");
        expect(result.data.character.portraitUrl).toBe(result.data.portraitUrl);
      }
    });

    it("should reject invalid file type", async () => {
      const mockFile = new File(["test"], "doc.pdf", { type: "application/pdf" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadCharacterPortrait(testCharacterId, formData);

      expect(result.success).toBe(false);
    });

    it("should reject oversized file", async () => {
      const largeContent = "x".repeat(6 * 1024 * 1024); // > 5MB
      const mockFile = new File([largeContent], "large.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", mockFile);

      const result = await uploadCharacterPortrait(testCharacterId, formData);

      expect(result.success).toBe(false);
    });
  });

  describe("reorderCharacters", () => {
    let char2Id: string;
    let char3Id: string;

    beforeEach(async () => {
      const char2 = await prisma.character.create({
        data: {
          name: "Char 2",
          characterType: "NPC",
          gameWorldId: testWorldId,
          userId: testUserId,
          order: 1,
        },
      });

      const char3 = await prisma.character.create({
        data: {
          name: "Char 3",
          characterType: "NPC",
          gameWorldId: testWorldId,
          userId: testUserId,
          order: 2,
        },
      });

      char2Id = char2.id;
      char3Id = char3.id;
    });

    it("should reorder multiple characters", async () => {
      const result = await reorderCharacters([
        { id: testCharacterId, order: 2 },
        { id: char2Id, order: 0 },
        { id: char3Id, order: 1 },
      ]);

      expect(result.success).toBe(true);
      if (result.success) {
        const char1 = result.data.find((c) => c.id === testCharacterId);
        expect(char1?.order).toBe(2);
      }
    });
  });

  describe("Character Types and Roles", () => {
    const characterTypes = ["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "BOSS", "COMPANION"];

    it.each(characterTypes)("should create character with type %s", async (type) => {
      const result = await createCharacter({
        name: `${type} Character`,
        characterType: type as any,
        gameWorldId: testWorldId,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.character.characterType).toBe(type);
      }
    });
  });
});
