/**
 * Characters Actions
 *
 * Server actions for character management.
 * Split into multiple files for better organization:
 * - create-character.ts: Character creation
 * - get-character.ts: Query operations
 * - update-character.ts: Update operations
 * - delete-character.ts: Deletion operations
 * - character-relations.ts: Character-pin linking
 * - character-relationships.ts: Character-to-character relationships
 * - portrait-upload.ts: Portrait image upload
 */

export { createCharacter } from "./create-character";

export {
  getCharacterById,
  getCharactersByWorld,
  getCharactersFiltered,
} from "./get-character";

export {
  updateCharacter,
  toggleCharacterVisibility,
  reorderCharacters,
} from "./update-character";

export { deleteCharacter } from "./delete-character";

export {
  linkCharacterToPin,
  unlinkCharacterFromPin,
  getPinsForCharacter,
  getCharactersForPin,
  reorderCharacterPinLinks,
} from "./character-relations";

export {
  createCharacterRelationship,
  updateCharacterRelationship,
  deleteCharacterRelationship,
  getCharacterRelationships,
} from "./character-relationships";

export { uploadCharacterPortrait } from "./portrait-upload";
