import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import type { Phenotype, PhenotypeInput } from "@/utils/constants/phenotype";
import phenotypeService from "@/utils/services/phenotypeService";

const { fetchByGene, create } = phenotypeService();

const phenotypeKeys = {
  all: ["phenotypes"] as const,
  byGene: (gene: string) => [...phenotypeKeys.all, gene] as const,
};

export const usePhenotypes = (gene: string, initialData: Phenotype[]) =>
  useQuery({
    queryKey: phenotypeKeys.byGene(gene),
    queryFn: () => fetchByGene(gene),
    initialData,
  });

export const useCreatePhenotype = (gene: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: Omit<PhenotypeInput, "gene">) =>
      create({ ...input, gene }),
    onSuccess: (newPhenotype) => {
      queryClient.setQueryData<Phenotype[]>(
        phenotypeKeys.byGene(gene),
        (old) => [...(old ?? []), newPhenotype],
      );
    },
  });
};
