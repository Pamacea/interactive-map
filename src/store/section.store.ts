import { create } from "zustand";

type SectionStore = {
    section: string;
    setSection: (section: string) => void;
}
export const useSection = create<SectionStore>((set) => ({
    section: "hero",
    setSection: (section) => set({ section }),
}));