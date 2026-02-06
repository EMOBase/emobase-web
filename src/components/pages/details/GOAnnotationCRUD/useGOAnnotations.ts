import { create as createStore } from "zustand";

import type {
  GOAnnotation,
  GOAnnotationInput,
} from "@/utils/constants/goannotation";
import goAnnotationService from "@/utils/services/goAnnotationService";

const { create, update } = goAnnotationService();

type State = {
  data: GOAnnotation[];
};

type Action = {
  setData: (data: GOAnnotation[]) => void;
  add: (input: GOAnnotationInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
};

const useGOAnnotations = createStore<State & Action>((set) => ({
  data: [],
  setData: (data) => set({ data }),
  add: async (input) => {
    const annotation = await create(input);
    set((state) => ({
      data: [...state.data, annotation],
    }));
  },
  remove: async (id: string) => {
    update([{ id, status: "TO_BE_DELETED" }]);
    set((state) => ({
      data: state.data.filter((a) => a.id !== id),
    }));
  },
}));

export default useGOAnnotations;
