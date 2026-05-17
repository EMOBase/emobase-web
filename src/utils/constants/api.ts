export const API_SERVICES = [
  "phenotypeservice",
  "imageservice",
  "ontologyservice",
  "goannotationservice",
  "publicationservice",
  "querypipelineservice",
  "geneservice",
  "genomicsservice",
] as const;

export type ApiService = (typeof API_SERVICES)[number];
