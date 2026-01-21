import { type DrosophilaGene } from "@/utils/services/geneService";
import { type GOAnnotation } from "@/utils/constants/goannotation";

export type Homolog = DrosophilaGene & {
  source: string[];
  annotations: GOAnnotation[];
};
