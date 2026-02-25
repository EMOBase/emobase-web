import { getEnv } from "@/utils/env";

export const mainSpecies = getEnv("PUBLIC_MAIN_SPECIES");

export const isMainSpecies = (species: string) => {
  return species === mainSpecies;
};
