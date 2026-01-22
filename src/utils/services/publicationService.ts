import type {
  Publication,
  PublicationInput,
} from "@/utils/constants/publication";
import { apiFetch } from "@/utils/apiFetch";

const fetchByGene = async (gene: string) => {
  if (!gene) return [];
  return await apiFetch<Publication[]>(
    "publicationservice",
    `/publications/by-gene/${gene}`,
  );
};

const create = async (publication: PublicationInput) => {
  return await apiFetch<Publication>("publicationservice", `/publications`, {
    method: "POST",
    body: publication,
  });
};

const remove = async (id: string) => {
  return await apiFetch<Publication>(
    "publicationservice",
    `/publications/${id}`,
    {
      method: "DELETE",
    },
  );
};

export { fetchByGene, create, remove };
