import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface VersionState {
  selectedVersion: string | null;
  setSelectedVersion: (version: string | null) => void;
}

export const useVersionStore = create<VersionState>()(
  persist(
    (set) => ({
      selectedVersion: null,
      setSelectedVersion: (version) => set({ selectedVersion: version }),
    }),
    {
      name: "emobase-version",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
