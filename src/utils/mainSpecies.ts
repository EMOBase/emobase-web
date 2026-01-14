export const mainSpecies = import.meta.env.PUBLIC_MAIN_SPECIES;

export const isMainSpecies = (species: string) => {
  return species === mainSpecies;
};
