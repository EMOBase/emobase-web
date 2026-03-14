import { getEnv } from "@/utils/env";

export const mainSpecies = getEnv("PUBLIC_MAIN_SPECIES");

export const scientificName = getEnv("PUBLIC_SPECIES_SCIENTIFIC_NAME");
export const shortName = scientificName.split(" ")[0];

export const genePrefix = getEnv("PUBLIC_GENE_PREFIX");

export const isMainSpecies = (species: string) => {
  return species === mainSpecies;
};
