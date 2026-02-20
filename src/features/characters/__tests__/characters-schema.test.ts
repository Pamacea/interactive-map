/**
 * Characters Feature - Schema Validation Tests
 *
 * Unit tests for character schemas and validation logic
 */

import { describe, it, expect } from "vitest";
import {
  CreateCharacterSchema,
  UpdateCharacterSchema,
  DeleteCharacterSchema,
} from "../methods/create-character";
import type { CreateCharacterInput, UpdateCharacterInput } from "../methods/create-character";

// ============================================
// CREATE CHARACTER SCHEMA TESTS
// ============================================

describe("Characters - CreateCharacterSchema", () => {
  const validBaseData = {
    name: "Gandalf the Grey",
    characterType: "COMPANION" as const,
    role: "MENTOR" as const,
    gameWorldId: "world-123",
  };

  describe("required fields", () => {
    it("should validate with all required fields", () => {
      const _result = CreateCharacterSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    it("should require name field", () => {
      const _data = { ...validBaseData, name: "" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should require characterType", () => {
      const _data = { ...validBaseData, characterType: undefined };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should require role", () => {
      const _data = { ...validBaseData, role: undefined };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should require gameWorldId", () => {
      const _data = { ...validBaseData, gameWorldId: "" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should enforce minimum length of 1", () => {
      const _data = { ...validBaseData, name: "" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 200", () => {
      const _data = { ...validBaseData, name: "a".repeat(201) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept name at max length", () => {
      const _data = { ...validBaseData, name: "a".repeat(200) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode characters", () => {
      const _data = { ...validBaseData, name: "Éowyn of Rohan" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("shortName validation", () => {
    it("should accept shortName", () => {
      const _data = { ...validBaseData, shortName: "Gandalf" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined shortName", () => {
      const _data = { ...validBaseData, shortName: undefined };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce maximum length of 100", () => {
      const _data = { ...validBaseData, shortName: "a".repeat(101) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("characterType validation", () => {
    const validTypes = [
      "PLAYER",
      "NPC",
      "ENEMY",
      "MERCHANT",
      "QUEST_GIVER",
      "COMPANION",
      "BOSS",
      "CUSTOM",
    ] as const;

    it("should accept all valid character types", () => {
      validTypes.forEach((type) => {
        const _data = { ...validBaseData, characterType: type };
        const _result = CreateCharacterSchema.safeParse(_data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid character type", () => {
      const _data = {
        ...validBaseData,
        characterType: "INVALID_TYPE" as never,
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("role validation", () => {
    const validRoles = [
      "PROTAGONIST",
      "ANTAGONIST",
      "SUPPORTING",
      "BACKGROUND",
      "MENTOR",
      "ALLY",
      "NEUTRAL",
      "HOSTILE",
      "CUSTOM",
    ] as const;

    it("should accept all valid roles", () => {
      validRoles.forEach((role) => {
        const _data = { ...validBaseData, role: role };
        const _result = CreateCharacterSchema.safeParse(_data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid role", () => {
      const _data = {
        ...validBaseData,
        role: "INVALID_ROLE" as never,
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("portraitUrl validation", () => {
    it("should accept valid URL", () => {
      const _data = {
        ...validBaseData,
        portraitUrl: "https://example.com/portrait.jpg",
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept empty string", () => {
      const _data = { ...validBaseData, portraitUrl: "" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined", () => {
      const _data = { ...validBaseData, portraitUrl: undefined };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid URL", () => {
      const _data = { ...validBaseData, portraitUrl: "not-a-url" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("numeric field validations", () => {
    it("should accept valid age", () => {
      const _data = { ...validBaseData, age: 150 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept age of 0", () => {
      const _data = { ...validBaseData, age: 0 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept max age of 10000", () => {
      const _data = { ...validBaseData, age: 10000 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should reject negative age", () => {
      const _data = { ...validBaseData, age: -1 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should reject age over 10000", () => {
      const _data = { ...validBaseData, age: 10001 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept valid level", () => {
      const _data = { ...validBaseData, level: 50 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept min level of 1", () => {
      const _data = { ...validBaseData, level: 1 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept max level of 1000", () => {
      const _data = { ...validBaseData, level: 1000 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should reject level of 0", () => {
      const _data = { ...validBaseData, level: 0 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should reject level over 1000", () => {
      const _data = { ...validBaseData, level: 1001 };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("string field validations", () => {
    it("should accept gender", () => {
      const _data = { ...validBaseData, gender: "Male" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce gender max length of 50", () => {
      const _data = { ...validBaseData, gender: "a".repeat(51) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept species", () => {
      const _data = { ...validBaseData, species: "Human" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce species max length of 100", () => {
      const _data = { ...validBaseData, species: "a".repeat(101) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept height", () => {
      const _data = { ...validBaseData, height: "6'2\"" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce height max length of 50", () => {
      const _data = { ...validBaseData, height: "a".repeat(51) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept build", () => {
      const _data = { ...validBaseData, build: "Athletic" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce build max length of 50", () => {
      const _data = { ...validBaseData, build: "a".repeat(51) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept class", () => {
      const _data = { ...validBaseData, class: "Wizard" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce class max length of 50", () => {
      const _data = { ...validBaseData, class: "a".repeat(51) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept faction", () => {
      const _data = { ...validBaseData, faction: "The Fellowship" };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce faction max length of 100", () => {
      const _data = { ...validBaseData, faction: "a".repeat(101) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("long text field validations", () => {
    it("should accept personality", () => {
      const _data = {
        ...validBaseData,
        personality: "Wise and mysterious",
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce personality max length of 1000", () => {
      const _data = { ...validBaseData, personality: "a".repeat(1001) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept background", () => {
      const _data = {
        ...validBaseData,
        background: "An ancient wizard from the Undying Lands",
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce background max length of 5000", () => {
      const _data = { ...validBaseData, background: "a".repeat(5001) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept goals", () => {
      const _data = {
        ...validBaseData,
        goals: "Defeat the Dark Lord and guide the fellowship",
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce goals max length of 2000", () => {
      const _data = { ...validBaseData, goals: "a".repeat(2001) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });

    it("should accept fears", () => {
      const _data = {
        ...validBaseData,
        fears: "Failure and corruption",
      };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should enforce fears max length of 2000", () => {
      const _data = { ...validBaseData, fears: "a".repeat(2001) };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(false);
    });
  });

  describe("boolean field validations", () => {
    it("should accept isVisible true", () => {
      const _data = { ...validBaseData, isVisible: true };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept isVisible false", () => {
      const _data = { ...validBaseData, isVisible: false };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept isPublic true", () => {
      const _data = { ...validBaseData, isPublic: true };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });

    it("should accept isPublic false", () => {
      const _data = { ...validBaseData, isPublic: false };
      const _result = CreateCharacterSchema.safeParse(_data);
      expect(result.success).toBe(true);
    });
  });

  describe("complex scenarios", () => {
    it("should accept complete valid character data", () => {
      const completeData: CreateCharacterInput = {
        name: "Gandalf the Grey",
        shortName: "Gandalf",
        characterType: "COMPANION",
        role: "MENTOR",
        portraitUrl: "https://example.com/gandalf.jpg",
        age: 1000,
        gender: "Male",
        species: "Wizard",
        height: "6'2\"",
        build: "Slender",
        level: 50,
        class: "Wizard",
        faction: "The Fellowship",
        personality: "Wise, mysterious, and powerful",
        background: "An ancient Maia sent to Middle-earth to aid against Sauron",
        goals: "Guide the fellowship to destroy the One Ring",
        fears: "The corruption that took Saruman",
        isVisible: true,
        isPublic: true,
        gameWorldId: "world-123",
      };

      const _result = CreateCharacterSchema.safeParse(completeData);
      expect(result.success).toBe(true);
    });

    it("should accept minimal valid character data", () => {
      const minimalData: CreateCharacterInput = {
        name: "Aragorn",
        characterType: "PLAYER",
        role: "PROTAGONIST",
        gameWorldId: "world-456",
      };

      const _result = CreateCharacterSchema.safeParse(minimalData);
      expect(result.success).toBe(true);
    });
  });
});

// ============================================
// UPDATE CHARACTER SCHEMA TESTS
// ============================================

describe("Characters - UpdateCharacterSchema", () => {
  const validBaseData = {
    id: "char-123",
  };

  describe("required fields", () => {
    it("should require character ID", () => {
      const _data = {};
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce ID minimum length", () => {
      const _data = { id: "" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept valid ID", () => {
      const _result = UpdateCharacterSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });
  });

  describe("optional field updates", () => {
    it("should allow updating name only", () => {
      const _data = { ...validBaseData, name: "Updated Name" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating shortName", () => {
      const _data = { ...validBaseData, shortName: "Shorty" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating characterType", () => {
      const _data = { ...validBaseData, characterType: "BOSS" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating role", () => {
      const _data = { ...validBaseData, role: "ANTAGONIST" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating portraitUrl with valid URL", () => {
      const _data = {
        ...validBaseData,
        portraitUrl: "https://example.com/new.jpg",
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating portraitUrl with empty string", () => {
      const _data = { ...validBaseData, portraitUrl: "" };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating age", () => {
      const _data = { ...validBaseData, age: 25 };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating numeric fields", () => {
      const _data = {
        ...validBaseData,
        age: 30,
        level: 10,
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating string fields", () => {
      const _data = {
        ...validBaseData,
        gender: "Female",
        species: "Elf",
        class: "Ranger",
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating boolean fields", () => {
      const _data = {
        ...validBaseData,
        isVisible: false,
        isPublic: false,
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating order", () => {
      const _data = { ...validBaseData, order: 5 };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("field validation on update", () => {
    it("should validate name max length on update", () => {
      const _data = { ...validBaseData, name: "a".repeat(201) };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate age range on update", () => {
      const _data = { ...validBaseData, age: -1 };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate level range on update", () => {
      const _data = { ...validBaseData, level: 0 };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate characterType enum on update", () => {
      const _data = {
        ...validBaseData,
        characterType: "INVALID" as never,
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate role enum on update", () => {
      const _data = {
        ...validBaseData,
        role: "INVALID" as never,
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("complex update scenarios", () => {
    it("should allow updating multiple fields at once", () => {
      const data: UpdateCharacterInput = {
        id: "char-123",
        name: "Gandalf the White",
        level: 60,
        isVisible: true,
      };
      const _result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating all characterType options", () => {
      const validTypes = [
        "PLAYER",
        "NPC",
        "ENEMY",
        "MERCHANT",
        "QUEST_GIVER",
        "COMPANION",
        "BOSS",
        "CUSTOM",
      ] as const;

      validTypes.forEach((type) => {
        const _data = { id: "char-1", characterType: type };
        const _result = UpdateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should allow updating all role options", () => {
      const validRoles = [
        "PROTAGONIST",
        "ANTAGONIST",
        "SUPPORTING",
        "BACKGROUND",
        "MENTOR",
        "ALLY",
        "NEUTRAL",
        "HOSTILE",
        "CUSTOM",
      ] as const;

      validRoles.forEach((role) => {
        const _data = { id: "char-1", role: role };
        const _result = UpdateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });
  });
});

// ============================================
// DELETE CHARACTER SCHEMA TESTS
// ============================================

describe("Characters - DeleteCharacterSchema", () => {
  it("should accept valid character ID", () => {
    const _result = DeleteCharacterSchema.safeParse({ id: "char-123" });
    expect(result.success).toBe(true);
  });

  it("should require ID field", () => {
    const _result = DeleteCharacterSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should enforce ID minimum length", () => {
    const _result = DeleteCharacterSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  it("should accept UUID-style IDs", () => {
    const _result = DeleteCharacterSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("should accept nanoid-style IDs", () => {
    const _result = DeleteCharacterSchema.safeParse({
      id: "V1StGXR8_Z5jdHi6B-myT",
    });
    expect(result.success).toBe(true);
  });
});
