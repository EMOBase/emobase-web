export const API_SERVICES = [
  "phenotypeservice",
  "imageservice",
  "ontologyservice",
  "goannotationservice",
  "publicationservice",
  "querypipelineservice",
  "geneservice",
] as const;

export type ApiService = (typeof API_SERVICES)[number];
