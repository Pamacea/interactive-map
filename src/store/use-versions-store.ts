import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Version } from '@/hooks/use-versions';

interface VersionsState {
  // UI state
  isOpen: boolean;
  selectedVersionId: string | null;
  isCreating: boolean;
  isRestoring: boolean;

  // Data
  versions: Version[];

  // Actions
  openPanel: () => void;
  closePanel: () => void;
  togglePanel: () => void;
  selectVersion: (id: string | null) => void;
  setCreating: (creating: boolean) => void;
  setRestoring: (restoring: boolean) => void;
  setVersions: (versions: Version[]) => void;
  addVersion: (version: Version) => void;
  removeVersion: (id: string) => void;
  clear: () => void;
}

const initialState = {
  isOpen: false,
  selectedVersionId: null,
  isCreating: false,
  isRestoring: false,
  versions: [],
};

export const useVersionsStore = create<VersionsState>()(
  persist(
    (set, get) => ({
      ...initialState,

      openPanel: () => set({ isOpen: true }),

      closePanel: () => set({ isOpen: false, selectedVersionId: null }),

      togglePanel: () => set((state) => ({
        isOpen: !state.isOpen,
        selectedVersionId: !state.isOpen ? state.selectedVersionId : null,
      })),

      selectVersion: (id) => set({ selectedVersionId: id }),

      setCreating: (creating) => set({ isCreating: creating }),

      setRestoring: (restoring) => set({ isRestoring: restoring }),

      setVersions: (versions) => set({ versions }),

      addVersion: (version) => set((state) => ({
        versions: [version, ...state.versions],
      })),

      removeVersion: (id) => set((state) => ({
        versions: state.versions.filter((v) => v.id !== id),
        selectedVersionId: state.selectedVersionId === id ? null : state.selectedVersionId,
      })),

      clear: () => set(initialState),
    }),
    {
      name: 'genesis-versions-storage',
      partialize: (state) => ({
        isOpen: state.isOpen,
      }),
    }
  )
);

// Selector hooks
export const useVersionsPanelOpen = () =>
  useVersionsStore((state) => state.isOpen);

export const useSelectedVersionId = () =>
  useVersionsStore((state) => state.selectedVersionId);

export const useIsCreatingVersion = () =>
  useVersionsStore((state) => state.isCreating);

export const useIsRestoringVersion = () =>
  useVersionsStore((state) => state.isRestoring);

export const useVersionsList = () =>
  useVersionsStore((state) => state.versions);
