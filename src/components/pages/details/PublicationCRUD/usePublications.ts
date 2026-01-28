import { create as createStore } from "zustand";

import type {
  Publication,
  PublicationInput,
} from "@/utils/constants/publication";
import { create, remove } from "@/utils/services/publicationService";

type State = {
  data: Publication[];
};

type Action = {
  setData: (data: Publication[]) => void;
  add: (input: PublicationInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const usePublications = createStore<State & Action>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  add: async (input) => {
    const publication = await create(input);
    set((state) => ({
      data: [...state.data, publication],
    }));
  },
  remove: async (id: string) => {
    await remove(id);
    set((state) => ({
      data: state.data.filter((p) => p.id !== id),
    }));
  },
}));

export default usePublications;
