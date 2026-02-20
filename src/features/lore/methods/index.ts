/**
 * Lore Methods - Barrel Export
 *
 * Centralized exports for all lore Server Action wrappers
 */

// Re-export from actions/lore.ts
export {
  createLoreEntry,
  getLoreEntryById,
  getLoreEntriesByWorld,
  updateLoreEntry,
  deleteLoreEntry,
  toggleLoreVisibility,
  linkLoreToPin,
  unlinkLoreFromPin,
  getPinsForLore,
  getLoreForPin,
  reorderLorePinLinks,
  createLoreReference,
  deleteLoreReference,
  getLoreReferences,
  getLoreReferencedBy,
  getLoreEntryBySlug,
  type LoreEntryCreateInput,
  type LoreEntryUpdateInput,
} from "@/features/lore/actions/lore";
