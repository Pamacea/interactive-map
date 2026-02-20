import { z } from "zod";

/**
 * Character validation schemas for I/O operations
 * Follows project pattern: All external data validated with Zod
 */

// Enums from Prisma schema
export const CharacterTypeEnum = z.enum([
  "PLAYER",
  "NPC",
  "ENEMY",
  "MERCHANT",
  "QUEST_GIVER",
  "COMPANION",
  "BOSS",
  "CUSTOM",
]);

export type CharacterType = z.infer<typeof CharacterTypeEnum>;

export const CharacterRoleEnum = z.enum([
  "PROTAGONIST",
  "ANTAGONIST",
  "SUPPORTING",
  "BACKGROUND",
  "MENTOR",
  "ALLY",
  "NEUTRAL",
  "HOSTILE",
  "CUSTOM",
]);

export type CharacterRole = z.infer<typeof CharacterRoleEnum>;

/**
 * Character Stats schema (stored as JSON)
 */
export const CharacterStatsSchema = z.object({
  // D&D-style stats
  strength: z.number().int().min(1).max(30).optional(),
  dexterity: z.number().int().min(1).max(30).optional(),
  constitution: z.number().int().min(1).max(30).optional(),
  intelligence: z.number().int().min(1).max(30).optional(),
  wisdom: z.number().int().min(1).max(30).optional(),
  charisma: z.number().int().min(1).max(30).optional(),
  // Custom stats
  health: z.number().int().min(0).optional(),
  maxHealth: z.number().int().min(1).optional(),
  mana: z.number().int().min(0).optional(),
  maxMana: z.number().int().min(1).optional(),
  stamina: z.number().int().min(0).optional(),
  maxStamina: z.number().int().min(1).optional(),
  // Other game-specific stats
  armorClass: z.number().int().min(0).optional(),
  speed: z.number().int().min(0).optional(),
  initiative: z.number().int().optional(),
  // Custom fields
  custom: z.record(z.unknown()).optional(),
});

export type CharacterStats = z.infer<typeof CharacterStatsSchema>;

/**
 * Character Skill schema
 */
export const CharacterSkillSchema = z.object({
  name: z.string().min(1).max(100),
  level: z.number().int().min(0).max(100).optional(),
  description: z.string().max(500).optional(),
});

export type CharacterSkill = z.infer<typeof CharacterSkillSchema>;

/**
 * Character Equipment schema
 */
export const CharacterEquipmentSchema = z.object({
  name: z.string().min(1).max(200),
  type: z.string().max(50).optional(),
  description: z.string().max(1000).optional(),
  quantity: z.number().int().min(1).default(1),
});

export type CharacterEquipment = z.infer<typeof CharacterEquipmentSchema>;

/**
 * Dialogue Entry schema
 */
export const DialogueEntrySchema = z.object({
  text: z.string().min(1).max(2000),
  condition: z.string().max(500).optional(),
  questTrigger: z.string().cuid().optional(),
  choices: z.array(z.object({
    text: z.string().min(1).max(500),
    nextDialogue: z.number().int().optional(),
    action: z.string().optional(),
  })).optional(),
});

export type DialogueEntry = z.infer<typeof DialogueEntrySchema>;

/**
 * Core Character schema - matches Prisma Character model
 */
export const CharacterSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(200),
  shortName: z.string().max(100).nullable(),
  characterType: CharacterTypeEnum,
  role: CharacterRoleEnum,
  portraitUrl: z.string().url().nullable().or(z.literal("")),
  age: z.number().int().min(0).max(10000).nullable(),
  gender: z.string().max(50).nullable(),
  species: z.string().max(100).nullable(),
  height: z.string().max(50).nullable(),
  build: z.string().max(50).nullable(),
  level: z.number().int().min(1).max(1000).nullable(),
  class: z.string().max(100).nullable(),
  faction: z.string().max(100).nullable(),
  stats: z.lazy(() => CharacterStatsSchema).nullable(),
  skills: z.array(CharacterSkillSchema).nullable(),
  equipment: z.array(CharacterEquipmentSchema).nullable(),
  personality: z.string().max(5000).nullable(),
  background: z.string().max(10000).nullable(),
  goals: z.string().max(5000).nullable(),
  fears: z.string().max(5000).nullable(),
  dialogue: z.array(DialogueEntrySchema).nullable(),
  quests: z.array(z.string().cuid()).nullable(),
  shopInventory: z.array(z.object({
    name: z.string().min(1).max(200),
    price: z.number().int().min(0),
    description: z.string().max(1000).optional(),
    stock: z.number().int().min(0).optional(),
  })).nullable(),
  isVisible: z.boolean(),
  isPublic: z.boolean(),
  order: z.number().int(),
  userId: z.string().cuid(),
  gameWorldId: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export type Character = z.infer<typeof CharacterSchema>;

/**
 * Create Character input schema (server action / API)
 */
export const CreateCharacterSchema = z.object({
  name: z.string().min(1, "Name is required").max(200, "Name too long"),
  shortName: z.string().max(100).optional(),
  characterType: CharacterTypeEnum.default("NPC"),
  role: CharacterRoleEnum.default("SUPPORTING"),
  portraitUrl: z.string().url().optional(),
  age: z.number().int().min(0).max(10000).optional(),
  gender: z.string().max(50).optional(),
  species: z.string().max(100).optional(),
  height: z.string().max(50).optional(),
  build: z.string().max(50).optional(),
  level: z.number().int().min(1).max(1000).optional(),
  class: z.string().max(100).optional(),
  faction: z.string().max(100).optional(),
  stats: CharacterStatsSchema.optional(),
  skills: z.array(CharacterSkillSchema).optional(),
  equipment: z.array(CharacterEquipmentSchema).optional(),
  personality: z.string().max(5000).optional(),
  background: z.string().max(10000).optional(),
  goals: z.string().max(5000).optional(),
  fears: z.string().max(5000).optional(),
  dialogue: z.array(DialogueEntrySchema).optional(),
  quests: z.array(z.string().cuid()).optional(),
  shopInventory: z.array(z.object({
    name: z.string().min(1).max(200),
    price: z.number().int().min(0),
    description: z.string().max(1000).optional(),
    stock: z.number().int().min(0).optional(),
  })).optional(),
  isVisible: z.boolean().default(true),
  isPublic: z.boolean().default(true),
  gameWorldId: z.string().cuid(),
});

export type CreateCharacterInput = z.infer<typeof CreateCharacterSchema>;

/**
 * Update Character input schema
 */
export const UpdateCharacterSchema = z.object({
  id: z.string().cuid(),
  name: z.string().min(1).max(200).optional(),
  shortName: z.string().max(100).optional(),
  characterType: CharacterTypeEnum.optional(),
  role: CharacterRoleEnum.optional(),
  portraitUrl: z.string().optional(),
  age: z.number().int().min(0).max(10000).optional(),
  gender: z.string().max(50).optional(),
  species: z.string().max(100).optional(),
  height: z.string().max(50).optional(),
  build: z.string().max(50).optional(),
  level: z.number().int().min(1).max(1000).optional(),
  class: z.string().max(100).optional(),
  faction: z.string().max(100).optional(),
  stats: CharacterStatsSchema.optional(),
  skills: z.array(CharacterSkillSchema).optional(),
  equipment: z.array(CharacterEquipmentSchema).optional(),
  personality: z.string().max(5000).optional(),
  background: z.string().max(10000).optional(),
  goals: z.string().max(5000).optional(),
  fears: z.string().max(5000).optional(),
  dialogue: z.array(DialogueEntrySchema).optional(),
  quests: z.array(z.string().cuid()).optional(),
  shopInventory: z.array(z.object({
    name: z.string().min(1).max(200),
    price: z.number().int().min(0),
    description: z.string().max(1000).optional(),
    stock: z.number().int().min(0).optional(),
  })).optional(),
  isVisible: z.boolean().optional(),
  isPublic: z.boolean().optional(),
  order: z.number().int().optional(),
});

export type UpdateCharacterInput = z.infer<typeof UpdateCharacterSchema>;

/**
 * Character query filters schema
 */
export const CharacterFiltersSchema = z.object({
  gameWorldId: z.string().cuid(),
  characterTypes: z.array(CharacterTypeEnum).optional(),
  roles: z.array(CharacterRoleEnum).optional(),
  factions: z.array(z.string()).optional(),
  searchTerm: z.string().optional(),
  showVisibleOnly: z.boolean().optional(),
});

export type CharacterFilters = z.infer<typeof CharacterFiltersSchema>;

/**
 * Character-Pin link relation types
 */
export const CharacterPinRelationTypeEnum = z.enum([
  "HOME",
  "WORK",
  "FREQUENTS",
  "DIED_AT",
  "BORN_AT",
  "LOCATION",
  "CUSTOM",
]);

export type CharacterPinRelationType = z.infer<typeof CharacterPinRelationTypeEnum>;

/**
 * Link character to pin schema
 */
export const LinkCharacterToPinSchema = z.object({
  characterId: z.string().cuid(),
  pinId: z.string().cuid(),
  relationType: CharacterPinRelationTypeEnum.default("LOCATION"),
  notes: z.string().max(1000).optional(),
});

export type LinkCharacterToPinInput = z.infer<typeof LinkCharacterToPinSchema>;

/**
 * Character relationship types
 */
export const RelationshipTypeEnum = z.enum([
  "FAMILY",
  "FRIEND",
  "ENEMY",
  "MENTOR",
  "COMPANION",
  "ROMANTIC",
  "ALLY",
  "SUBORDINATE",
  "CUSTOM",
]);

export type RelationshipType = z.infer<typeof RelationshipTypeEnum>;

/**
 * Create character relationship schema
 */
export const CreateCharacterRelationshipSchema = z.object({
  sourceId: z.string().cuid(),
  targetId: z.string().cuid(),
  relationshipType: RelationshipTypeEnum.default("FRIEND"),
  description: z.string().max(1000).optional(),
  strength: z.number().int().min(0).max(100).default(50),
  isVisible: z.boolean().default(true),
});

export type CreateCharacterRelationshipInput = z.infer<typeof CreateCharacterRelationshipSchema>;

/**
 * Update character relationship schema
 */
export const UpdateCharacterRelationshipSchema = z.object({
  sourceId: z.string().cuid(),
  targetId: z.string().cuid(),
  relationshipType: RelationshipTypeEnum.optional(),
  description: z.string().max(1000).optional(),
  strength: z.number().int().min(0).max(100).optional(),
  isVisible: z.boolean().optional(),
});

export type UpdateCharacterRelationshipInput = z.infer<typeof UpdateCharacterRelationshipSchema>;
