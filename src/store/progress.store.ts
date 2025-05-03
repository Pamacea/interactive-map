import { create } from "zustand";

type ProgressStore = {
  progress: number;
  setProgress: (progress: number) => void;
};
export const useProgress = create<ProgressStore>((set) => ({
  progress: 0,
  setProgress: (progress: number) => set({ progress }),
}));
