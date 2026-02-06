import type { Phenotype, PhenotypeInput } from "@/utils/constants/phenotype";
import type { IBLethality } from "@/utils/constants/ibeetle";
import { apiFetch } from "@/utils/apiFetch";

export interface PhenotypeSearchResult {
  data: {
    gene: string;
    phenotypes: Phenotype[];
  }[];
  total: number;
}

const phenotypeService = (fetch: typeof apiFetch = apiFetch) => {
  const search = async (
    query: string,
    penetrance: number = 0.5,
    from: number = 0,
    size: number = 20,
  ) => {
    const baseUrl = `/phenotype-groups/search?query=${query}`;
    const url = `${baseUrl}&penetrance=${penetrance}&from=${from}&size=${size}`;
    return await fetch<PhenotypeSearchResult>("phenotypeservice", url);
  };

  const fetchByGene = async (gene: string): Promise<Phenotype[]> => {
    return (
      (await fetch<Phenotype[]>(
        "phenotypeservice",
        `/phenotypes/by-gene/${gene}`,
      )) || []
    );
  };

  const create = async (phenotype: PhenotypeInput): Promise<Phenotype> => {
    const formData = new FormData();
    const { imageFiles, structure, ...partialPhenotype } = phenotype;
    formData.append(
      "phenotype",
      JSON.stringify({ ...partialPhenotype, structures: [structure] }),
    );
    imageFiles?.forEach((image) => {
      formData.append("images", image);
    });
    return await fetch<Phenotype>("phenotypeservice", "/phenotypes", {
      method: "POST",
      body: formData,
    });
  };

  const remove = async (id: string) => {
    return await fetch("phenotypeservice", `/phenotypes/${id}`, {
      method: "DELETE",
    });
  };

  const fetchLethality = (iB: string) =>
    fetch<IBLethality>("phenotypeservice", `/lethality/${iB}`);

  return { search, fetchByGene, fetchLethality, create, remove };
};

export default phenotypeService;
