import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LeftDockState {
  isExpanded: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
  reset: () => void;
}

export const useLeftDock = create<LeftDockState>()(
  persist(
    (set, get) => ({
      isExpanded: true,
      toggle: () => set({ isExpanded: !get().isExpanded }),
      expand: () => set({ isExpanded: true }),
      collapse: () => set({ isExpanded: false }),
      reset: () => set({ isExpanded: true }),
    }),
    {
      name: "left-dock-storage",
    }
  )
);
