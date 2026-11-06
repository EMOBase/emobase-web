import type { AssemblyVersion } from "@/utils/services/genomics";
import { mainSpecies } from "@/utils/mainSpecies";

export const findAssemblyForSpecies = (
  assemblies: AssemblyVersion[] | undefined,
  species: string,
) =>
  assemblies?.find((a) => a.speciesCode === species) ??
  assemblies?.find((a) => a.speciesName === species || a.name === species);

/**
 * The short display name of a species: the first word of the full scientific
 * name returned by the API (e.g. "Tribolium castaneum" → "Tribolium").
 */
export const speciesShortName = (
  assemblies: AssemblyVersion[] | undefined,
  species: string,
) => {
  const fullName =
    findAssemblyForSpecies(assemblies, species)?.speciesName ?? species;
  return fullName.split(" ")[0];
};

/** The short name of the deployment's main species, from the API. */
export const getMainSpeciesShortName = (
  assemblies: AssemblyVersion[] | undefined,
) => {
  const assembly = assemblies?.find((a) => a.speciesCode === mainSpecies);
  return assembly?.speciesName.split(" ")[0];
};
