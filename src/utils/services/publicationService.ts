import type {
  Publication,
  PublicationInput,
} from "@/utils/constants/publication";
import { apiFetch } from "@/utils/apiFetch";

const publicationService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchByGene = async (gene: string) => {
    if (!gene) return [];
    return await fetch<Publication[]>(
      "publicationservice",
      `/publications/by-gene/${gene}`,
    );
  };

  const create = async (publication: PublicationInput) => {
    return await fetch<Publication>("publicationservice", `/publications`, {
      method: "POST",
      body: publication,
    });
  };

  const remove = async (id: string) => {
    return await fetch<Publication>(
      "publicationservice",
      `/publications/${id}`,
      {
        method: "DELETE",
      },
    );
  };

  return { fetchByGene, create, remove };
};

export default publicationService;
