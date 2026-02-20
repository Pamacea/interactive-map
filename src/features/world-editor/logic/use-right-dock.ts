import { create } from "zustand";
import { persist } from "zustand/middleware";

interface RightDockState {
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
}

export const useRightDock = create<RightDockState>()(
  persist(
    (set, get) => ({
      isCollapsed: false,
      toggle: () => set({ isCollapsed: !get().isCollapsed }),
      expand: () => set({ isCollapsed: false }),
      collapse: () => set({ isCollapsed: true }),
    }),
    {
      name: "right-dock-storage",
    }
  )
);
