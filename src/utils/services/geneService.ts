import type { IBDsRNA } from "@/utils/constants/ibeetle";
import { apiFetch } from "@/utils/apiFetch";

export interface Sequence {
  id: string;
  seq: string;
}

export interface Orthology {
  gene: string;
  orthologs: {
    source: string;
    gene: string;
    score: number;
  }[];
}

const geneService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchIBs = async (gene: string) => {
    return (
      (await fetch<IBDsRNA[]>(
        "geneservice",
        `/silencingseqs?geneIds=${gene}`,
      )) || []
    );
  };

  const fetchOrthology = async (gene: string) => {
    return (
      ((await fetch<Orthology[]>(
        "geneservice",
        `/datasources/all/tribolium/genes?geneIds=${gene}`,
      )) || [])[0] || {
        gene,
        orthologs: [],
      }
    );
  };

  return {
    fetchIBs,
    fetchOrthology,
  };
};

export default geneService;
