/**
 * UI Store - Centralized UI state management
 *
 * Manages all ephemeral UI state that doesn't belong in server data:
 * - Panel visibility and states
 * - Modal states
 * - Loading states (UI-only)
 * - Toast/notification states
 *
 * Uses persist middleware for user preference persistence
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";

// ============================================================================
// Types
// ============================================================================

export type ModalId =
  | "pin-create"
  | "pin-edit"
  | "pin-delete"
  | "layer-create"
  | "layer-edit"
  | "world-settings"
  | "world-delete"
  | "invite-members"
  | "export-map";

export type LoadingId =
  | "world-save"
  | "pin-save"
  | "layer-save"
  | "image-upload"
  | "export"
  | "import";

export type PanelId =
  | "layers"
  | "lore"
  | "gallery"
  | "characters"
  | "filters"
  | "properties"
  | "members"
  | "activity"
  | "comments"
  | "versions"
  | "import";

interface UIState {
  // Modals
  openModals: Set<ModalId>;
  activeModal: ModalId | null;

  // Loading states
  loadingStates: Set<LoadingId>;

  // Panel states (simplified - for visibility only, positions in floating-panels-store)
  collapsedPanels: Set<PanelId>;

  // Context menu
  contextMenu: {
    isVisible: boolean;
    position: { x: number; y: number } | null;
    targetId: string | null;
    targetType: "pin" | "layer" | "map" | null;
  };

  // Drag state
  dragState: {
    isDragging: boolean;
    draggedType: "pin" | "layer" | "panel" | null;
    draggedId: string | null;
  } | null;

  // Keyboard shortcuts
  shortcutsEnabled: boolean;

  // Theme
  theme: "light" | "dark" | "auto";

  // Actions - Modals
  openModal: (modalId: ModalId, context?: Record<string, unknown>) => void;
  closeModal: (modalId: ModalId) => void;
  closeAllModals: () => void;
  isModalOpen: (modalId: ModalId) => boolean;

  // Actions - Loading
  startLoading: (loadingId: LoadingId) => void;
  stopLoading: (loadingId: LoadingId) => void;
  isLoading: (loadingId: LoadingId) => boolean;
  hasAnyLoading: () => boolean;

  // Actions - Panels
  togglePanelCollapsed: (panelId: PanelId) => void;
  isPanelCollapsed: (panelId: PanelId) => boolean;
  collapseAllPanels: () => void;
  expandAllPanels: () => void;

  // Actions - Context Menu
  showContextMenu: (
    position: { x: number; y: number },
    targetId: string,
    targetType: "pin" | "layer" | "map"
  ) => void;
  hideContextMenu: () => void;

  // Actions - Drag
  startDrag: (type: "pin" | "layer" | "panel", id: string) => void;
  stopDrag: () => void;

  // Actions - Shortcuts
  setShortcutsEnabled: (enabled: boolean) => void;
  toggleShortcuts: () => void;

  // Actions - Theme
  setTheme: (theme: "light" | "dark" | "auto") => void;

  // Reset
  reset: () => void;
}

// ============================================================================
// Initial State
// ============================================================================

const initialState: Omit<UIState, "actions"> = {
  openModals: new Set(),
  activeModal: null,
  loadingStates: new Set(),
  collapsedPanels: new Set(),
  contextMenu: {
    isVisible: false,
    position: null,
    targetId: null,
    targetType: null,
  },
  dragState: null,
  shortcutsEnabled: true,
  theme: "auto",
};

// ============================================================================
// Store Creation
// ============================================================================

export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      ...initialState,

      // Modal actions
      openModal: (modalId) =>
        set((state) => ({
          openModals: new Set(state.openModals).add(modalId),
          activeModal: modalId,
        })),

      closeModal: (modalId) =>
        set((state) => {
          const newOpenModals = new Set(state.openModals);
          newOpenModals.delete(modalId);

          // Set new active modal to the most recently opened
          const modalArray = Array.from(newOpenModals);
          const newActive = modalArray.length > 0 ? modalArray[modalArray.length - 1] : null;

          return {
            openModals: newOpenModals,
            activeModal: newActive,
          };
        }),

      closeAllModals: () =>
        set({
          openModals: new Set(),
          activeModal: null,
        }),

      isModalOpen: (modalId) => get().openModals.has(modalId),

      // Loading actions
      startLoading: (loadingId) =>
        set((state) => {
          const newLoadingStates = new Set(state.loadingStates);
          newLoadingStates.add(loadingId);
          return { loadingStates: newLoadingStates };
        }),

      stopLoading: (loadingId) =>
        set((state) => {
          const newLoadingStates = new Set(state.loadingStates);
          newLoadingStates.delete(loadingId);
          return { loadingStates: newLoadingStates };
        }),

      isLoading: (loadingId) => get().loadingStates.has(loadingId),

      hasAnyLoading: () => get().loadingStates.size > 0,

      // Panel actions
      togglePanelCollapsed: (panelId) =>
        set((state) => {
          const newCollapsed = new Set(state.collapsedPanels);
          if (newCollapsed.has(panelId)) {
            newCollapsed.delete(panelId);
          } else {
            newCollapsed.add(panelId);
          }
          return { collapsedPanels: newCollapsed };
        }),

      isPanelCollapsed: (panelId) => get().collapsedPanels.has(panelId),

      collapseAllPanels: () =>
        set({
          collapsedPanels: new Set([
            "layers",
            "lore",
            "gallery",
            "characters",
            "filters",
            "properties",
            "members",
            "activity",
            "comments",
            "versions",
            "import",
          ]),
        }),

      expandAllPanels: () => set({ collapsedPanels: new Set() }),

      // Context menu actions
      showContextMenu: (position, targetId, targetType) =>
        set({
          contextMenu: {
            isVisible: true,
            position,
            targetId,
            targetType,
          },
        }),

      hideContextMenu: () =>
        set({
          contextMenu: {
            isVisible: false,
            position: null,
            targetId: null,
            targetType: null,
          },
        }),

      // Drag actions
      startDrag: (draggedType, draggedId) =>
        set({
          dragState: {
            isDragging: true,
            draggedType,
            draggedId,
          },
        }),

      stopDrag: () => set({ dragState: null }),

      // Shortcuts actions
      setShortcutsEnabled: (shortcutsEnabled) => set({ shortcutsEnabled }),

      toggleShortcuts: () =>
        set((state) => ({ shortcutsEnabled: !state.shortcutsEnabled })),

      // Theme actions
      setTheme: (theme) => set({ theme }),

      // Reset
      reset: () => set(initialState as UIState),
    }),
    {
      name: "genesis-ui-storage",
      // Only persist user preferences, not transient state
      partialize: (state) => ({
        collapsedPanels: Array.from(state.collapsedPanels),
        shortcutsEnabled: state.shortcutsEnabled,
        theme: state.theme,
      }),
      // Serialize Sets for storage
      merge: (persistedState, currentState) => ({
        ...currentState,
        ...(persistedState as Partial<UIState>),
        // Convert arrays back to Sets
        collapsedPanels: new Set((persistedState as { collapsedPanels: string[] })?.collapsedPanels ?? []),
      }),
    }
  )
);

// ============================================================================
// Selector Hooks (optimized for minimal re-renders)
// ============================================================================

// Modals
export const useActiveModal = () => useUIStore((state) => state.activeModal);
export const useIsModalOpen = (modalId: ModalId) =>
  useUIStore((state) => state.openModals.has(modalId));
export const useAnyModalOpen = () =>
  useUIStore((state) => state.openModals.size > 0);

// Loading
export const useHasLoading = () =>
  useUIStore((state) => state.loadingStates.size > 0);
export const useIsLoading = (loadingId: LoadingId) =>
  useUIStore((state) => state.loadingStates.has(loadingId));

// Panels
export const useCollapsedPanels = () =>
  useUIStore((state) => state.collapsedPanels);
export const useIsPanelCollapsed = (panelId: PanelId) =>
  useUIStore((state) => state.collapsedPanels.has(panelId));

// Context menu
export const useContextMenu = () =>
  useUIStore((state) => state.contextMenu);

// Drag
export const useDragState = () =>
  useUIStore((state) => state.dragState);
export const useIsDragging = () =>
  useUIStore((state) => state.dragState?.isDragging ?? false);

// Shortcuts
export const useShortcutsEnabled = () =>
  useUIStore((state) => state.shortcutsEnabled);

// Theme
export const useTheme = () =>
  useUIStore((state) => state.theme);

// ============================================================================
// Action Hooks
// ============================================================================

export const useOpenModal = () => useUIStore((state) => state.openModal);
export const useCloseModal = () => useUIStore((state) => state.closeModal);
export const useCloseAllModals = () => useUIStore((state) => state.closeAllModals);

export const useStartLoading = () => useUIStore((state) => state.startLoading);
export const useStopLoading = () => useUIStore((state) => state.stopLoading);

export const useTogglePanelCollapsed = () => useUIStore((state) => state.togglePanelCollapsed);
export const useCollapseAllPanels = () => useUIStore((state) => state.collapseAllPanels);
export const useExpandAllPanels = () => useUIStore((state) => state.expandAllPanels);

export const useShowContextMenu = () => useUIStore((state) => state.showContextMenu);
export const useHideContextMenu = () => useUIStore((state) => state.hideContextMenu);

export const useStartDrag = () => useUIStore((state) => state.startDrag);
export const useStopDrag = () => useUIStore((state) => state.stopDrag);

export const useSetShortcutsEnabled = () => useUIStore((state) => state.setShortcutsEnabled);
export const useToggleShortcuts = () => useUIStore((state) => state.toggleShortcuts);

export const useSetTheme = () => useUIStore((state) => state.setTheme);
