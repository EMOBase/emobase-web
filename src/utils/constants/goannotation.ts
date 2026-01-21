export const GO_ASPECTS = ["P", "F", "C"] as const;

export const GENE_PRODUCTS = [
  "unknown",
  "protein complex",
  "protein",
  "transcript",
  "ncRNA",
  "rRNA",
  "tRNA",
  "snRNA",
  "snoRNA",
] as const;

export const STATUSES = [
  "UNREVIEWED",
  "INTERNAL",
  "OFFICIAL",
  "TO_BE_DELETED",
] as const;

type GOAspect = (typeof GO_ASPECTS)[number];
type GeneProduct = (typeof GENE_PRODUCTS)[number];
type Status = (typeof STATUSES)[number];

export interface GOTerm {
  id: string;
  name: string;
  aspect: GOAspect | "";
}

export interface GOAnnotation {
  id: string;
  gene: string;
  status: Status;
  term: GOTerm;
  geneProduct: GeneProduct;
  evidence: string;
  reference: string;
  quotation: string;
  lab: string;
  date?: string;
}

export type GOAnnotationInput = Omit<
  GOAnnotation,
  "id" | "status" | "reference"
> & {
  pmid: string;
};

export type GOAnnotationUpdate = Partial<GOAnnotation> & { id: string };
