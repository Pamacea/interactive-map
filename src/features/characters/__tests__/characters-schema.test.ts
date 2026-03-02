/**
 * Characters Feature - Schema Validation Tests
 *
 * Unit tests for character schemas and validation logic
 */

import { describe, it, expect } from "vitest";
import {
  CreateCharacterSchema,
  UpdateCharacterSchema,
  CharacterSchema,
  CharacterTypeEnum,
  CharacterRoleEnum,
  type CreateCharacterInput,
  type UpdateCharacterInput,
} from "../logic/character-schemas";

describe("Characters - Schema Imports", () => {
  it("should export CreateCharacterSchema", () => {
    expect(CreateCharacterSchema).toBeDefined();
  });

  it("should export UpdateCharacterSchema", () => {
    expect(UpdateCharacterSchema).toBeDefined();
  });

  it("should export CharacterSchema", () => {
    expect(CharacterSchema).toBeDefined();
  });

  it("should export CharacterTypeEnum", () => {
    expect(CharacterTypeEnum).toBeDefined();
  });

  it("should export CharacterRoleEnum", () => {
    expect(CharacterRoleEnum).toBeDefined();
  });
});

describe("Characters - CreateCharacterSchema", () => {
  const validBaseData: CreateCharacterInput = {
    name: "Gandalf the Grey",
    characterType: "COMPANION",
    role: "MENTOR",
    gameWorldId: "clx1234567890abc",
  };

  it("should validate with all required fields", () => {
    const result = CreateCharacterSchema.safeParse(validBaseData);
    expect(result.success).toBe(true);
  });

  it("should require name field", () => {
    const data = { ...validBaseData, name: "" };
    const result = CreateCharacterSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should enforce name max length", () => {
    const data = { ...validBaseData, name: "a".repeat(201) };
    const result = CreateCharacterSchema.safeParse(data);
    expect(result.success).toBe(false);
  });

  it("should accept all valid character types", () => {
    const validTypes = ["PLAYER", "NPC", "ENEMY", "MERCHANT", "QUEST_GIVER", "COMPANION", "BOSS", "CUSTOM"] as const;
    validTypes.forEach((type) => {
      const data = { ...validBaseData, characterType: type };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it("should accept all valid roles", () => {
    const validRoles = ["PROTAGONIST", "ANTAGONIST", "SUPPORTING", "BACKGROUND", "MENTOR", "ALLY", "NEUTRAL", "HOSTILE", "CUSTOM"] as const;
    validRoles.forEach((role) => {
      const data = { ...validBaseData, role: role };
      const result = CreateCharacterSchema.safeParse(data);
      expect(result.success).toBe(true);
    });
  });

  it("should accept optional fields", () => {
    const data: CreateCharacterInput = {
      ...validBaseData,
      shortName: "Gandalf",
      age: 1000,
      level: 50,
      isVisible: false,
    };
    const result = CreateCharacterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe("Characters - UpdateCharacterSchema", () => {
  const validBaseData: UpdateCharacterInput = {
    id: "clx1234567890abc",
  };

  it("should require character ID", () => {
    const result = UpdateCharacterSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("should accept valid ID", () => {
    const result = UpdateCharacterSchema.safeParse(validBaseData);
    expect(result.success).toBe(true);
  });

  it("should allow updating name only", () => {
    const data = { ...validBaseData, name: "Updated Name" };
    const result = UpdateCharacterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });

  it("should allow updating multiple fields", () => {
    const data: UpdateCharacterInput = {
      id: "clx1234567890abc",
      name: "Gandalf the White",
      level: 60,
      isVisible: false,
    };
    const result = UpdateCharacterSchema.safeParse(data);
    expect(result.success).toBe(true);
  });
});

describe("Characters - CharacterTypeEnum", () => {
  it("should validate PLAYER type", () => {
    const result = CharacterTypeEnum.safeParse("PLAYER");
    expect(result.success).toBe(true);
  });

  it("should validate NPC type", () => {
    const result = CharacterTypeEnum.safeParse("NPC");
    expect(result.success).toBe(true);
  });

  it("should reject invalid type", () => {
    const result = CharacterTypeEnum.safeParse("INVALID_TYPE");
    expect(result.success).toBe(false);
  });
});

describe("Characters - CharacterRoleEnum", () => {
  it("should validate PROTAGONIST role", () => {
    const result = CharacterRoleEnum.safeParse("PROTAGONIST");
    expect(result.success).toBe(true);
  });

  it("should validate MENTOR role", () => {
    const result = CharacterRoleEnum.safeParse("MENTOR");
    expect(result.success).toBe(true);
  });

  it("should reject invalid role", () => {
    const result = CharacterRoleEnum.safeParse("INVALID_ROLE");
    expect(result.success).toBe(false);
  });
});
