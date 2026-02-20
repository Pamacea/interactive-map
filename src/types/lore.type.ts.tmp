import type { LoreEntry, LoreCategory } from "@prisma/client";

/**
 * Lore entry types matching Prisma schema
 */

export type { LoreEntry, LoreCategory };

/**
 * Create Lore Entry input (for server actions)
 */
export interface LoreEntryCreateInput {
  title: string;
  content: string;
  category?: LoreCategory;
  isVisible?: boolean;
  isPublic?: boolean;
  gameWorldId: string;
}

/**
 * Update Lore Entry input (for server actions)
 */
export interface LoreEntryUpdateInput {
  id: string;
  title?: string;
  content?: string;
  category?: LoreCategory;
  isVisible?: boolean;
  isPublic?: boolean;
}

/**
 * Lore entry form state
 */
export interface LoreEntryFormState {
  title: string;
  content: string;
  category: LoreCategory;
  isVisible: boolean;
  isPublic: boolean;
  isSubmitting: boolean;
  error: string | null;
}

/**
 * Lore filter state
 */
export interface LoreFilters {
  searchTerm: string;
  categories: Record<LoreCategory, boolean>;
  showVisibleOnly: boolean;
}

/**
 * Lore UI state
 */
export interface LoreUIState {
  selectedLoreId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  expandedLoreIds: Set<string>;
}

/**
 * Lore entry with relations
 */
export interface LoreEntryWithRelations extends LoreEntry {
  user: {
    name: string | null;
    image: string | null;
  };
  gameWorld: {
    id: string;
    title: string;
  };
  gallery?: Array<{
    id: string;
    title: string;
    imageUrl: string;
  }>;
}
