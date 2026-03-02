import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ToolMode = "select" | "pan" | "measure" | "area";

interface ToolModeState {
  mode: ToolMode;
  setMode: (mode: ToolMode) => void;
  reset: () => void;
}

const INITIAL_MODE: ToolMode = "select";

export const useToolMode = create<ToolModeState>()(
  persist(
    (set) => ({
      mode: INITIAL_MODE,
      setMode: (mode) => set({ mode }),
      reset: () => set({ mode: INITIAL_MODE }),
    }),
    {
      name: "tool-mode-storage",
    }
  )
);

// Keyboard shortcuts for tool switching
export const TOOL_SHORTCUTS: Record<ToolMode, string> = {
  select: "v",
  pan: "h",
  measure: "m",
  area: "a",
};

// Helper to get tool mode from keyboard event
export function getToolModeFromKey(key: string): ToolMode | null {
  const lowerKey = key.toLowerCase();
  const entry = Object.entries(TOOL_SHORTCUTS).find(
    ([, shortcut]) => shortcut === lowerKey
  );
  return (entry?.[0] as ToolMode) ?? null;
}
