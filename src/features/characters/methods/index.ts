/**
 * Character Methods - Barrel Export
 *
 * Centralized exports for all character Server Action wrappers
 */

// Get characters
export {
  getCharacterById,
  getCharactersByWorld,
  getCharactersFiltered,
  type CharacterWithRelations,
} from "./get-character";

// Create character
export {
  createCharacter,
  type CreateCharacterInput,
  type Character,
} from "./create-character";

// Update character
export {
  updateCharacter,
  toggleCharacterVisibility,
  reorderCharacters,
  type UpdateCharacterInput,
} from "./update-character";

// Delete character
export {
  deleteCharacter,
  type DeleteCharacterInput,
} from "./delete-character";

// Character-Pin relations
export {
  linkCharacterToPin,
  unlinkCharacterFromPin,
  getPinsForCharacter,
  getCharactersForPin,
  reorderCharacterPinLinks,
  type LinkCharacterToPinInput,
  type CharacterPinRelationWithInclude,
} from "./character-relations";

// Character-Character relationships
export {
  createCharacterRelationship,
  updateCharacterRelationship,
  deleteCharacterRelationship,
  getCharacterRelationships,
  type CreateCharacterRelationshipInput,
  type UpdateCharacterRelationshipInput,
  type CharacterRelationshipWithInclude,
} from "./character-relationships";
