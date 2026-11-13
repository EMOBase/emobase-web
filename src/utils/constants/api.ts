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

export type ApiServiceEnv = {
  public: string;
  internal: string;
};

export const API_SERVICE_ENVS: Record<ApiService, ApiServiceEnv> = {
  phenotypeservice: {
    public: "PUBLIC_API_PHENOTYPE_SERVICE",
    internal: "INTERNAL_API_PHENOTYPE_SERVICE",
  },
  imageservice: {
    public: "PUBLIC_API_IMAGE_SERVICE",
    internal: "INTERNAL_API_IMAGE_SERVICE",
  },
  ontologyservice: {
    public: "PUBLIC_API_ONTOLOGY_SERVICE",
    internal: "INTERNAL_API_ONTOLOGY_SERVICE",
  },
  goannotationservice: {
    public: "PUBLIC_API_GO_ANNOTATION_SERVICE",
    internal: "INTERNAL_API_GO_ANNOTATION_SERVICE",
  },
  publicationservice: {
    public: "PUBLIC_API_PUBLICATION_SERVICE",
    internal: "INTERNAL_API_PUBLICATION_SERVICE",
  },
  querypipelineservice: {
    public: "PUBLIC_API_QUERY_PIPELINE_SERVICE",
    internal: "INTERNAL_API_QUERY_PIPELINE_SERVICE",
  },
  geneservice: {
    public: "PUBLIC_API_GENE_SERVICE",
    internal: "INTERNAL_API_GENE_SERVICE",
  },
  genomicsservice: {
    public: "PUBLIC_API_GENOMICS_SERVICE",
    internal: "INTERNAL_API_GENOMICS_SERVICE",
  },
};
