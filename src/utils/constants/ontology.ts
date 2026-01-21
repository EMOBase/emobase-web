export const ONTOLOGIES = ["TrOn", "GO"] as const;
export type Ontology = (typeof ONTOLOGIES)[number];
export type OntologyTerm = {
  id: string;
  name: string;
  definition: string;
  aspect: string;
  obsolete: boolean;
  relations: {
    predicate: string;
    object: string;
  }[];
};
