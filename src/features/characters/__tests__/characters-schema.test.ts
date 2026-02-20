/**
 * Characters Feature - Schema Validation Tests
 *
 * Unit tests for character schemas and validation logic
 */

import { describe, it, expect } from "vitest";
import { z } from "zod";
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
      const result = CreateCharacterSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });

    it("should require name field", () => {
      const data = { ...validBaseData, name: "" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require characterType", () => {
      const data = { ...validBaseData, characterType: undefined };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require role", () => {
      const data = { ...validBaseData, role: undefined };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should require gameWorldId", () => {
      const data = { ...validBaseData, gameWorldId: "" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("name validation", () => {
    it("should enforce minimum length of 1", () => {
      const data = { ...validBaseData, name: "" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce maximum length of 200", () => {
      const data = { ...validBaseData, name: "a".repeat(201) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept name at max length", () => {
      const data = { ...validBaseData, name: "a".repeat(200) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept unicode characters", () => {
      const data = { ...validBaseData, name: "Éowyn of Rohan" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("shortName validation", () => {
    it("should accept shortName", () => {
      const data = { ...validBaseData, shortName: "Gandalf" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined shortName", () => {
      const data = { ...validBaseData, shortName: undefined };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce maximum length of 100", () => {
      const data = { ...validBaseData, shortName: "a".repeat(101) };
      const result = CreateCharacterSchema.safeParse(data);
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
        const data = { ...validBaseData, characterType: type };
        const result = CreateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid character type", () => {
      const data = {
        ...validBaseData,
        characterType: "INVALID_TYPE" as never,
      };
      const result = CreateCharacterSchema.safeParse(data);
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
        const data = { ...validBaseData, role: role };
        const result = CreateCharacterSchema.safeParse(data);
        expect(result.success).toBe(true);
      });
    });

    it("should reject invalid role", () => {
      const data = {
        ...validBaseData,
        role: "INVALID_ROLE" as never,
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("portraitUrl validation", () => {
    it("should accept valid URL", () => {
      const data = {
        ...validBaseData,
        portraitUrl: "https://example.com/portrait.jpg",
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept empty string", () => {
      const data = { ...validBaseData, portraitUrl: "" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept undefined", () => {
      const data = { ...validBaseData, portraitUrl: undefined };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject invalid URL", () => {
      const data = { ...validBaseData, portraitUrl: "not-a-url" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("numeric field validations", () => {
    it("should accept valid age", () => {
      const data = { ...validBaseData, age: 150 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept age of 0", () => {
      const data = { ...validBaseData, age: 0 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept max age of 10000", () => {
      const data = { ...validBaseData, age: 10000 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject negative age", () => {
      const data = { ...validBaseData, age: -1 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject age over 10000", () => {
      const data = { ...validBaseData, age: 10001 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept valid level", () => {
      const data = { ...validBaseData, level: 50 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept min level of 1", () => {
      const data = { ...validBaseData, level: 1 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept max level of 1000", () => {
      const data = { ...validBaseData, level: 1000 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should reject level of 0", () => {
      const data = { ...validBaseData, level: 0 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should reject level over 1000", () => {
      const data = { ...validBaseData, level: 1001 };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("string field validations", () => {
    it("should accept gender", () => {
      const data = { ...validBaseData, gender: "Male" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce gender max length of 50", () => {
      const data = { ...validBaseData, gender: "a".repeat(51) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept species", () => {
      const data = { ...validBaseData, species: "Human" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce species max length of 100", () => {
      const data = { ...validBaseData, species: "a".repeat(101) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept height", () => {
      const data = { ...validBaseData, height: "6'2\"" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce height max length of 50", () => {
      const data = { ...validBaseData, height: "a".repeat(51) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept build", () => {
      const data = { ...validBaseData, build: "Athletic" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce build max length of 50", () => {
      const data = { ...validBaseData, build: "a".repeat(51) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept class", () => {
      const data = { ...validBaseData, class: "Wizard" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce class max length of 50", () => {
      const data = { ...validBaseData, class: "a".repeat(51) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept faction", () => {
      const data = { ...validBaseData, faction: "The Fellowship" };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce faction max length of 100", () => {
      const data = { ...validBaseData, faction: "a".repeat(101) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("long text field validations", () => {
    it("should accept personality", () => {
      const data = {
        ...validBaseData,
        personality: "Wise and mysterious",
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce personality max length of 1000", () => {
      const data = { ...validBaseData, personality: "a".repeat(1001) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept background", () => {
      const data = {
        ...validBaseData,
        background: "An ancient wizard from the Undying Lands",
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce background max length of 5000", () => {
      const data = { ...validBaseData, background: "a".repeat(5001) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept goals", () => {
      const data = {
        ...validBaseData,
        goals: "Defeat the Dark Lord and guide the fellowship",
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce goals max length of 2000", () => {
      const data = { ...validBaseData, goals: "a".repeat(2001) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept fears", () => {
      const data = {
        ...validBaseData,
        fears: "Failure and corruption",
      };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should enforce fears max length of 2000", () => {
      const data = { ...validBaseData, fears: "a".repeat(2001) };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });
  });

  describe("boolean field validations", () => {
    it("should accept isVisible true", () => {
      const data = { ...validBaseData, isVisible: true };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept isVisible false", () => {
      const data = { ...validBaseData, isVisible: false };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept isPublic true", () => {
      const data = { ...validBaseData, isPublic: true };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should accept isPublic false", () => {
      const data = { ...validBaseData, isPublic: false };
      const result = CreateCharacterSchema.safeParse(data);
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

      const result = CreateCharacterSchema.safeParse(completeData);
      expect(result.success).toBe(true);
    });

    it("should accept minimal valid character data", () => {
      const minimalData: CreateCharacterInput = {
        name: "Aragorn",
        characterType: "PLAYER",
        role: "PROTAGONIST",
        gameWorldId: "world-456",
      };

      const result = CreateCharacterSchema.safeParse(minimalData);
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
      const data = {};
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should enforce ID minimum length", () => {
      const data = { id: "" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should accept valid ID", () => {
      const result = UpdateCharacterSchema.safeParse(validBaseData);
      expect(result.success).toBe(true);
    });
  });

  describe("optional field updates", () => {
    it("should allow updating name only", () => {
      const data = { ...validBaseData, name: "Updated Name" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating shortName", () => {
      const data = { ...validBaseData, shortName: "Shorty" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating characterType", () => {
      const data = { ...validBaseData, characterType: "BOSS" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating role", () => {
      const data = { ...validBaseData, role: "ANTAGONIST" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating portraitUrl with valid URL", () => {
      const data = {
        ...validBaseData,
        portraitUrl: "https://example.com/new.jpg",
      };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating portraitUrl with empty string", () => {
      const data = { ...validBaseData, portraitUrl: "" };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating age", () => {
      const data = { ...validBaseData, age: 25 };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating numeric fields", () => {
      const data = {
        ...validBaseData,
        age: 30,
        level: 10,
      };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating string fields", () => {
      const data = {
        ...validBaseData,
        gender: "Female",
        species: "Elf",
        class: "Ranger",
      };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating boolean fields", () => {
      const data = {
        ...validBaseData,
        isVisible: false,
        isPublic: false,
      };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });

    it("should allow updating order", () => {
      const data = { ...validBaseData, order: 5 };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  describe("field validation on update", () => {
    it("should validate name max length on update", () => {
      const data = { ...validBaseData, name: "a".repeat(201) };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate age range on update", () => {
      const data = { ...validBaseData, age: -1 };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate level range on update", () => {
      const data = { ...validBaseData, level: 0 };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate characterType enum on update", () => {
      const data = {
        ...validBaseData,
        characterType: "INVALID" as never,
      };
      const result = UpdateCharacterSchema.safeParse(data);
      expect(result.success).toBe(false);
    });

    it("should validate role enum on update", () => {
      const data = {
        ...validBaseData,
        role: "INVALID" as never,
      };
      const result = UpdateCharacterSchema.safeParse(data);
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
      const result = UpdateCharacterSchema.safeParse(data);
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
        const data = { id: "char-1", characterType: type };
        const result = UpdateCharacterSchema.safeParse(data);
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
        const data = { id: "char-1", role: role };
        const result = UpdateCharacterSchema.safeParse(data);
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
    const result = DeleteCharacterSchema.safeParse({ id: "char-123" });
    expect(result.success).toBe(true);
  });

  it("should require ID field", () => {
    const result = DeleteCharacterSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should enforce ID minimum length", () => {
    const result = DeleteCharacterSchema.safeParse({ id: "" });
    expect(result.success).toBe(false);
  });

  it("should accept UUID-style IDs", () => {
    const result = DeleteCharacterSchema.safeParse({
      id: "550e8400-e29b-41d4-a716-446655440000",
    });
    expect(result.success).toBe(true);
  });

  it("should accept nanoid-style IDs", () => {
    const result = DeleteCharacterSchema.safeParse({
      id: "V1StGXR8_Z5jdHi6B-myT",
    });
    expect(result.success).toBe(true);
  });
});
