import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

/**
 * UI State Store - Manages ephemeral UI state for pin interactions
 *
 * This store handles:
 * - Pin selection state
 * - Creation/editing modes
 * - Hover states
 * - Popup visibility
 *
 * All state is persisted to localStorage for better UX across page reloads
 */

export interface PinUIState {
  selectedPinId: string | null;
  isCreating: boolean;
  isEditing: boolean;
  hoverPinId: string | null;
}

interface PinUIActions {
  selectPin: (pinId: string | null) => void;
  clearSelection: () => void;
  startCreating: () => void;
  stopCreating: () => void;
  startEditing: () => void;
  stopEditing: () => void;
  setHoverPin: (pinId: string | null) => void;
  reset: () => void;
}

type PinUIStore = PinUIState & PinUIActions;

const initialState: PinUIState = {
  selectedPinId: null,
  isCreating: false,
  isEditing: false,
  hoverPinId: null,
};

export const usePinsUIStore = create<PinUIStore>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,

        selectPin: (pinId) => set({ selectedPinId: pinId }),

        clearSelection: () => set({ selectedPinId: null }),

        startCreating: () => set({ isCreating: true, selectedPinId: null }),

        stopCreating: () => set({ isCreating: false }),

        startEditing: () => set({ isEditing: true }),

        stopEditing: () => set({ isEditing: false }),

        setHoverPin: (pinId) => set({ hoverPinId: pinId }),

        reset: () => set(initialState),
      }),
      {
        name: "pins-ui-storage",
      }
    ),
    {
      name: "pins-ui-store",
    }
  )
);

// Selector hooks for optimized re-renders
export const useSelectedPinId = () => usePinsUIStore((state) => state.selectedPinId);
export const useIsCreatingPin = () => usePinsUIStore((state) => state.isCreating);
export const useIsEditingPin = () => usePinsUIStore((state) => state.isEditing);
export const useHoverPinId = () => usePinsUIStore((state) => state.hoverPinId);

// Action hooks
export const useSelectPin = () => usePinsUIStore((state) => state.selectPin);
export const useClearSelection = () => usePinsUIStore((state) => state.clearSelection);
export const useStartCreating = () => usePinsUIStore((state) => state.startCreating);
export const useStopCreating = () => usePinsUIStore((state) => state.stopCreating);
export const useStartEditing = () => usePinsUIStore((state) => state.startEditing);
export const useStopEditing = () => usePinsUIStore((state) => state.stopEditing);
export const useSetHoverPin = () => usePinsUIStore((state) => state.setHoverPin);
