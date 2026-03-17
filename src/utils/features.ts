import { mainSpecies } from "@/utils/mainSpecies";

const isBeetle = mainSpecies === "Tcas";

const featureEnabled = {
  geneIdConverter: isBeetle,
  ontologyViewer: isBeetle,
  searchInstruction: isBeetle,
};

export const hasFeature = (feature: keyof typeof featureEnabled) => {
  return featureEnabled[feature];
};
