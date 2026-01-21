import type { Ontology, OntologyTerm } from "@/utils/constants/ontology";
import { apiFetch } from "@/utils/apiFetch";

export interface QueryResult<T> {
  data: T[];
  total: number;
}

const fetchByIds = async (ontology: Ontology, ids: string[]) => {
  if (ids.length === 0) {
    return [];
  }
  return (
    (await apiFetch<OntologyTerm[]>(
      "ontologyservice",
      `/ontologies/${ontology}/terms/${ids.join(",")}`,
    )) || []
  );
};

const fetchById = async (ontology: Ontology, id: string) => {
  const terms = await fetchByIds(ontology, [id]);
  if (terms.length > 0) {
    return terms[0];
  }
  return null;
};

const search = (ontology: Ontology, query: string, subsets?: string[]) =>
  apiFetch<QueryResult<OntologyTerm>>(
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

export { search, fetchById, fetchByIds, shortenGOAspect };
