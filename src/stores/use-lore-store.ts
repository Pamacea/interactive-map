import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { LoreEntry, LoreCategory } from "@prisma/client";
import {
  createLoreEntry as createLoreAction,
  deleteLoreEntry as deleteLoreAction,
  updateLoreEntry as updateLoreAction,
} from "@/features/lore";

// UI State for lore interactions
export interface LoreUIState {
  selectedLoreId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  expandedLoreIds: Set<string>;
}

// Filter state for lore entries
export interface LoreFilters {
  searchTerm: string;
  categoryFilters: Record<LoreCategory, boolean>;
  showVisibleOnly: boolean;
}

// Lore data stored in client state (synced with server)
interface LoreDataState {
  loreEntries: LoreEntry[];
  filteredLoreEntries: LoreEntry[];
  isLoading: boolean;
  error: string | null;
}

interface LoreStore extends LoreUIState, LoreFilters, LoreDataState {
  // Selection state
  selectLore: (loreId: string | null) => void;
  clearSelection: () => void;
  toggleExpanded: (loreId: string) => void;

  // Creation/editing state
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;

  // Lore CRUD operations (local state)
  setLoreEntries: (loreEntries: LoreEntry[]) => void;
  addLoreEntry: (loreEntry: LoreEntry) => void;
  updateLoreEntry: (loreId: string, updates: Partial<LoreEntry>) => void;
  deleteLoreEntry: (loreId: string) => void;

  // Lore CRUD operations (server sync with optimistic updates)
  createLoreEntry: (
    data: Parameters<typeof createLoreAction>[0]
  ) => Promise<LoreEntry>;
  deleteLoreEntryServer: (loreId: string) => Promise<void>;
  updateLoreEntryServer: (
    data: Parameters<typeof updateLoreAction>[0]
  ) => Promise<LoreEntry | void>;

  // Filter actions
  setSearchTerm: (term: string) => void;
  setCategoryFilter: (category: LoreCategory, value: boolean) => void;
  toggleCategoryFilter: (category: LoreCategory) => void;
  showAllCategories: () => void;
  hideAllCategories: () => void;
  toggleShowVisibleOnly: () => void;
  resetFilters: () => void;
  applyFilters: () => void;
  getVisibleCategories: () => LoreCategory[];

  // Loading and error state
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;

  // Reset all
  reset: () => void;
}

// Helper function to create default category filters
const createDefaultCategoryFilters = (): Record<LoreCategory, boolean> => ({
  GENERAL: true,
  HISTORY: true,
  GEOGRAPHY: true,
  CHARACTERS: true,
  FACTIONS: true,
  MAGIC: true,
  ITEMS: true,
  QUESTS: true,
  CUSTOM: true,
});

const initialState: LoreUIState & LoreFilters & LoreDataState = {
  // UI State
  selectedLoreId: null,
  isCreating: false,
  isEditing: false,
  expandedLoreIds: new Set(),

  // Filters
  searchTerm: "",
  categoryFilters: createDefaultCategoryFilters(),
  showVisibleOnly: false,

  // Data
  loreEntries: [],
  filteredLoreEntries: [],
  isLoading: false,
  error: null,
};

export const useLoreStore = create<LoreStore>()(
  devtools(
    (set, get) => ({
      ...initialState,

      // Selection actions
      selectLore: (loreId) =>
        set({ selectedLoreId: loreId }, false, "selectLore"),

      clearSelection: () =>
        set({ selectedLoreId: null }, false, "clearSelection"),

      toggleExpanded: (loreId) =>
        set((state) => {
          const newExpanded = new Set(state.expandedLoreIds);
          if (newExpanded.has(loreId)) {
            newExpanded.delete(loreId);
          } else {
            newExpanded.add(loreId);
          }
          return { expandedLoreIds: newExpanded };
        }, false, "toggleExpanded"),

      // Creation/editing actions
      startCreating: () =>
        set({
          isCreating: true,
          isEditing: false,
          selectedLoreId: null,
        }, false, "startCreating"),

      stopCreating: () =>
        set({ isCreating: false }, false, "stopCreating"),

      startEditing: () =>
        set({ isEditing: true }, false, "startEditing"),

      stopEditing: () =>
        set({ isEditing: false }, false, "stopEditing"),

      // Lore CRUD operations (local state)
      setLoreEntries: (loreEntries) =>
        set(
          { loreEntries },
          false,
          "setLoreEntries"
        ),

      addLoreEntry: (loreEntry) =>
        set(
          (state) => ({
            loreEntries: [loreEntry, ...state.loreEntries],
          }),
          false,
          "addLoreEntry"
        ),

      updateLoreEntry: (loreId, updates) =>
        set(
          (state) => ({
            loreEntries: state.loreEntries.map((lore) =>
              lore.id === loreId ? { ...lore, ...updates } : lore
            ),
          }),
          false,
          "updateLoreEntry"
        ),

      deleteLoreEntry: (loreId) =>
        set(
          (state) => ({
            loreEntries: state.loreEntries.filter((lore) => lore.id !== loreId),
            selectedLoreId:
              state.selectedLoreId === loreId ? null : state.selectedLoreId,
          }),
          false,
          "deleteLoreEntry"
        ),

      // Lore CRUD operations (server sync with optimistic updates)
      createLoreEntry: async (data) => {
        const _state = get();

        // Optimistic update
        const tempId = `temp-${Date.now()}`;
        const optimisticLore: LoreEntry = {
          id: tempId,
          title: data.title,
          content: data.content,
          slug: data.title.toLowerCase().replace(/\s+/g, "-"),
          category: data.category || "GENERAL",
          isVisible: data.isVisible ?? false,
          isPublic: data.isPublic ?? true,
          userId: "", // Will be filled by server
          gameWorldId: data.gameWorldId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        set(
          (state) => ({
            loreEntries: [optimisticLore, ...state.loreEntries],
          }),
          false,
          "createLoreEntry_optimistic"
        );

        try {
          const result = await createLoreAction(data);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          // Replace optimistic entry with real one
          const createdLore = result.data.loreEntry;
          set(
            (state) => ({
              loreEntries: state.loreEntries.map((lore) =>
                lore.id === tempId ? createdLore : lore
              ),
            }),
            false,
            "createLoreEntry_success"
          );

          return createdLore;
        } catch (error) {
          // Rollback on error
          set(
            (state) => ({
              loreEntries: state.loreEntries.filter(
                (lore) => lore.id !== tempId
              ),
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to create lore entry",
            }),
            false,
            "createLoreEntry_error"
          );
          throw error;
        }
      },

      deleteLoreEntryServer: async (loreId) => {
        const _state = get();
        const originalLore = _state.loreEntries.find((lore) => lore.id === loreId);

        // Optimistic delete
        set(
          (state) => ({
            loreEntries: state.loreEntries.filter((lore) => lore.id !== loreId),
            selectedLoreId:
              state.selectedLoreId === loreId ? null : state.selectedLoreId,
          }),
          false,
          "deleteLoreEntry_optimistic"
        );

        try {
          await deleteLoreAction(loreId);
        } catch (error) {
          // Rollback on error
          if (originalLore) {
            set(
              (state) => ({
                loreEntries: [...state.loreEntries, originalLore],
                selectedLoreId: loreId,
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to delete lore entry",
              }),
              false,
              "deleteLoreEntry_error"
            );
          }
          throw error;
        }
      },

      updateLoreEntryServer: async (data) => {
        const _state = get();
        const originalLore = state.loreEntries.find(
          (lore) => lore.id === data.id
        );

        // Optimistic update
        const updates: Partial<LoreEntry> = {};
        if (data.title !== undefined) updates.title = data.title;
        if (data.content !== undefined) updates.content = data.content;
        if (data.category !== undefined) updates.category = data.category;
        if (data.isVisible !== undefined) updates.isVisible = data.isVisible;
        if (data.isPublic !== undefined) updates.isPublic = data.isPublic;

        set(
          (state) => ({
            loreEntries: state.loreEntries.map((lore) =>
              lore.id === data.id ? { ...lore, ...updates, updatedAt: new Date() } : lore
            ),
          }),
          false,
          "updateLoreEntry_optimistic"
        );

        try {
          const result = await updateLoreAction(data);

          if (!result.success) {
            throw new Error(result.error.message);
          }

          // Update with server response
          const updatedLore = result.data;
          set(
            (state) => ({
              loreEntries: state.loreEntries.map((lore) =>
                lore.id === data.id ? updatedLore : lore
              ),
            }),
            false,
            "updateLoreEntry_success"
          );

          return updatedLore;
        } catch (error) {
          // Rollback on error
          if (originalLore) {
            set(
              (state) => ({
                loreEntries: state.loreEntries.map((lore) =>
                  lore.id === data.id ? originalLore : lore
                ),
                error:
                  error instanceof Error
                    ? error.message
                    : "Failed to update lore entry",
              }),
              false,
              "updateLoreEntry_error"
            );
          }
          throw error;
        }
      },

      // Filter actions
      setSearchTerm: (term) =>
        set({ searchTerm: term }, false, "setSearchTerm"),

      setCategoryFilter: (category, value) =>
        set(
          (state) => ({
            categoryFilters: {
              ...state.categoryFilters,
              [category]: value,
            },
          }),
          false,
          "setCategoryFilter"
        ),

      toggleCategoryFilter: (category) =>
        set(
          (state) => ({
            categoryFilters: {
              ...state.categoryFilters,
              [category]: !state.categoryFilters[category],
            },
          }),
          false,
          "toggleCategoryFilter"
        ),

      showAllCategories: () =>
        set(
          { categoryFilters: createDefaultCategoryFilters() },
          false,
          "showAllCategories"
        ),

      hideAllCategories: () =>
        set(
          (state) => {
            const filters = { ...state.categoryFilters };
            Object.keys(filters).forEach((key) => {
              filters[key as LoreCategory] = false;
            });
            return { categoryFilters: filters };
          },
          false,
          "hideAllCategories"
        ),

      toggleShowVisibleOnly: () =>
        set(
          (state) => ({
            showVisibleOnly: !state.showVisibleOnly,
          }),
          false,
          "toggleShowVisibleOnly"
        ),

      resetFilters: () =>
        set(
          {
            searchTerm: "",
            categoryFilters: createDefaultCategoryFilters(),
            showVisibleOnly: false,
          },
          false,
          "resetFilters"
        ),

      applyFilters: () => {
        const _state = get();
        const { loreEntries, searchTerm, categoryFilters, showVisibleOnly } =
          _state;

        const filtered = loreEntries.filter((lore) => {
          // Search term filter
          if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            const matchesSearch =
              lore.title.toLowerCase().includes(searchLower) ||
              lore.content.toLowerCase().includes(searchLower);
            if (!matchesSearch) return false;
          }

          // Category filter
          if (!categoryFilters[lore.category]) {
            return false;
          }

          // Visibility filter
          if (showVisibleOnly && !lore.isVisible) {
            return false;
          }

          return true;
        });

        set({ filteredLoreEntries: filtered }, false, "applyFilters");
      },

      getVisibleCategories: () => {
        const _state = get();
        return Object.entries(_state.categoryFilters)
          .filter(([_, enabled]) => enabled)
          .map(([category]) => category as LoreCategory);
      },

      // Loading and error state
      setLoading: (isLoading) =>
        set({ isLoading }, false, "setLoading"),

      setError: (error) =>
        set({ error }, false, "setError"),

      // Reset all
      reset: () => set(initialState, false, "reset"),
    }),
    { name: "LoreStore" }
  )
);
