export const IBEETLE_TOPICS = [
  {
    id: "larval_phase_1_metamorphosis",
    experimentId: "larval_phase_1",
    name: "Metamorphosis and survival",
  },
  {
    id: "larval_phase_1_pupal_morphology",
    experimentId: "larval_phase_1",
    name: "Pupal morphology",
  },
  {
    id: "larval_phase_1_adult_morphology",
    experimentId: "larval_phase_1",
    name: "Adult morphology",
  },
  {
    id: "larval_phase_1_fertility",
    experimentId: "larval_phase_1",
    name: "Fertility",
  },
  {
    id: "pupal_phase_1_metamorphosis",
    experimentId: "pupal_phase_1",
    name: "Metamorphosis and survival",
  },
  {
    id: "pupal_phase_1_pupal_morphology",
    experimentId: "pupal_phase_1",
    name: "Pupal morphology",
  },
  {
    id: "pupal_phase_1_adult_morphology",
    experimentId: "pupal_phase_1",
    name: "Adult morphology",
  },
  {
    id: "pupal_phase_1_fertility",
    experimentId: "pupal_phase_1",
    name: "Fertility",
  },
  {
    id: "pupal_phase_1_musculature",
    experimentId: "pupal_phase_1",
    name: "Analysis of embryonic musculature and early development",
  },
  {
    id: "pupal_phase_1_stage_1_cuticle",
    experimentId: "pupal_phase_1",
    name: "Analysis of larval stage 1 cuticle",
  },
  {
    id: "pupal_phase_2_metamorphosis",
    experimentId: "pupal_phase_2",
    name: "Metamorphosis and survival",
  },
  {
    id: "pupal_phase_2_pupal_morphology",
    experimentId: "pupal_phase_2",
    name: "Pupal morphology",
  },
  {
    id: "pupal_phase_2_adult_morphology",
    experimentId: "pupal_phase_2",
    name: "Adult morphology",
  },
  {
    id: "pupal_phase_2_fertility",
    experimentId: "pupal_phase_2",
    name: "Fertility",
  },
  {
    id: "pupal_phase_2_musculature",
    experimentId: "pupal_phase_2",
    name: "Analysis of embryonic musculature and early development",
  },
  {
    id: "pupal_phase_2_stage_1_cuticle",
    experimentId: "pupal_phase_2",
    name: "Analysis of larval stage 1 cuticle",
  },
  {
    id: "pupal_phase_3_metamorphosis",
    experimentId: "pupal_phase_3",
    name: "Metamorphosis and survival",
  },
  {
    id: "pupal_phase_3_pupal_morphology",
    experimentId: "pupal_phase_3",
    name: "Pupal morphology",
  },
  {
    id: "pupal_phase_3_adult_morphology",
    experimentId: "pupal_phase_3",
    name: "Adult morphology",
  },
  {
    id: "pupal_phase_3_fertility",
    experimentId: "pupal_phase_3",
    name: "Fertility",
  },
  {
    id: "pupal_phase_3_musculature",
    experimentId: "pupal_phase_3",
    name: "Analysis of embryonic musculature and early development",
  },
  {
    id: "pupal_phase_3_stage_1_cuticle",
    experimentId: "pupal_phase_3",
    name: "Analysis of larval stage 1 cuticle",
  },
];

export interface IBExperiment {
  id: string;
  displayName: string;
  developmentalStage: string;
  description: string;
}

export const IBEETLE_EXPERIMENTS: IBExperiment[] = [
  {
    id: "larval_phase_1",
    displayName: "Phenotype after larval injection",
    description: "larval screen phase 1",
    developmentalStage: "larval",
  },
  {
    id: "pupal_phase_1",
    displayName: "Phenotype after pupal injection",
    description: "pupal screen phase 1",
    developmentalStage: "pupal",
  },
  {
    id: "pupal_phase_2",
    displayName: "Phenotype after pupal injection",
    description: "pupal screen phase 2",
    developmentalStage: "pupal",
  },
  {
    id: "pupal_phase_3",
    displayName: "Phenotype after pupal injection",
    description: "pupal screen phase 3",
    developmentalStage: "pupal",
  },
  {
    id: "egg_empty",
    displayName: "Empty egg screen",
    description: "empty egg screen",
    developmentalStage: "egg",
  },
  {
    id: "bibi_stink_gland",
    displayName: "Phenotype after pupal injection (Stink gland screen)",
    description: "stink gland phenotypes from Bibi Atika",
    developmentalStage: "pupal",
  },
];

export interface IBDsRNA {
  id: string;
  geneIds: string[];
  leftPrimer: string;
  rightPrimer: string;
  seq: string;
}

export interface IBPhenotype {
  id: string;
  description: string;
  dayPostInjection: number;
  penetranceType?: "MISSING" | "ABSOLUTE" | "PERCENTAGE";
  penetranceValue?: number;
  imageIds?: string[];
  comment?: string;
  topicId?: string;
  entities?: {
    id: number;
    name: string;
    ontologyTermId: string;
  }[];
}

export interface IBScreen {
  id: string;
  experimentId?: string;
  silencingSeqId: string;
  observations?: IBPhenotype[];
  topics?: {
    id: string;
    name?: string;
    description?: string;
  }[];
}

export interface IBLethality {
  dapi11: number;
  dali11: number;
  dali22: number;
}
