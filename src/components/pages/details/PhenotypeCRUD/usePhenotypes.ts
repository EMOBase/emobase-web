import { create as createStore } from "zustand";

import type { Phenotype, PhenotypeInput } from "@/utils/constants/phenotype";
import { create, remove } from "@/utils/services/phenotypeService";

type State = {
  data: Phenotype[];
};

type Action = {
  setData: (data: Phenotype[]) => void;
  add: (input: PhenotypeInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const usePhenotypes = createStore<State & Action>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  add: async (input) => {
    const phenotype = await create(input);
    set((state) => ({
      data: [...state.data, phenotype],
    }));
  },
  remove: async (id: string) => {
    await remove(id);
    set((state) => ({
      data: state.data.filter((p) => p.id !== id),
    }));
  },
}));

export default usePhenotypes;
