import type { ImageMetadata } from "@/utils/constants/image";

export const OTHER_DSRNA = "_other";

export const STAGES = [
  "embryo",
  "L1",
  "L2",
  "L3",
  "L4",
  "L5",
  "L6",
  "L7",
  "prepupa",
  "pupa",
  "adult",
] as const;

export const PENETRANCES = [
  0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1,
] as const;

export const REFERENCE_TYPES = ["DOI", "PMID", "LAB"] as const;

export type Stage = (typeof STAGES)[number];
export type Penetrance = (typeof PENETRANCES)[number];

export type Reference = {
  type: (typeof REFERENCE_TYPES)[number];
  value: string;
};

export type Structure = {
  termId?: string;
  termName: string;
};

type PhenotypeBase = {
  dsRNA: {
    name?: string;
    sequence?: string;
  };
  injectedStage?: Stage;
  penetrance?: Penetrance;
  description: string;
  injectedStrain?: string;
  process?: string;
  comment?: string;
};

export type Phenotype = PhenotypeBase & {
  id: string;
  reference?: Reference;
  structures?: Structure[];
  images?: ImageMetadata[];
  iBeetleTopic?: string;
  iBeetleExperiment?: string;
  dayPostInjection?: number;
  concentration?: number;
  numberOfAnimals?: number;
};

export type PhenotypeInput = PhenotypeBase & {
  gene: string;
  reference: Reference;
  structure: Structure;
  imageFiles?: File[];
  concentration?: string;
  numberOfAnimals?: string;
};
