import type { Ontology, OntologyTerm } from "@/utils/constants/ontology";
import { apiFetch } from "@/utils/apiFetch";

export interface QueryResult<T> {
  data: T[];
  total: number;
}

const ontologyService = (
  ontology: Ontology,
  fetch: typeof apiFetch = apiFetch,
) => {
  const fetchByIds = async (ids: string[]) => {
    if (ids.length === 0) {
      return [];
    }
    return (
      (await fetch<OntologyTerm[]>(
        "ontologyservice",
        `/ontologies/${ontology}/terms/${ids.join(",")}`,
      )) || []
    );
  };

  const fetchById = async (id: string) => {
    const terms = await fetchByIds([id]);
    if (terms.length > 0) {
      return terms[0];
    }
    return null;
  };

  const search = (query: string, subsets?: string[]) =>
    fetch<QueryResult<OntologyTerm>>(
      "ontologyservice",
      `/ontologies/${ontology}/search`,
      { query: { query, subsets } },
    );

  const shortenGOAspect = (aspect: string) => {
    if (aspect === "biological_process") {
      return "P";
    } else if (aspect === "molecular_function") {
      return "F";
    } else if (aspect === "cellular_component") {
      return "C";
    }
    return "";
  };

  return { search, fetchById, fetchByIds, shortenGOAspect };
};

export const ontologyServiceFor =
  (ontology: Ontology) => (fetch?: typeof apiFetch) =>
    ontologyService(ontology, fetch);

export default ontologyService;
