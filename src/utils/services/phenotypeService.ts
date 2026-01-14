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

const search = async (
  query: string,
  penetrance: number = 0.5,
  from: number = 0,
  size: number = 20,
) => {
  const baseUrl = `/phenotype-groups/search?query=${query}`;
  const url = `${baseUrl}&penetrance=${penetrance}&from=${from}&size=${size}`;
  return await apiFetch<PhenotypeSearchResult>("phenotypeservice", url);
};

const fetchByGene = async (gene: string): Promise<Phenotype[]> => {
  return (
    (await apiFetch<Phenotype[]>(
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
  return await apiFetch<Phenotype>("phenotypeservice", "/phenotypes", {
    method: "POST",
    body: formData,
  });
};

const remove = async (id: string) => {
  return await apiFetch("phenotypeservice", `/phenotypes/${id}`, {
    method: "DELETE",
  });
};

const fetchLethality = (iB: string) =>
  apiFetch<IBLethality>("phenotypeservice", `/lethality/${iB}`);

export { search, fetchByGene, fetchLethality, create, remove };
