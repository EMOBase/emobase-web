import type { IBDsRNA } from "@/utils/constants/ibeetle";
import { apiFetch } from "@/utils/apiFetch";

export interface GeneSearchResult {
  genes?: string[];
  orthologies?: {
    source: string;
    group: string;
    orthologs: {
      species: string;
      genes: {
        gene: string;
        synonyms: string[];
      }[];
    }[];
  }[];
  otherGenes?: {
    species: string;
    gene: string;
  }[];
}

export interface Sequence {
  id: string;
  seq: string;
}

export interface TriboliumGene {
  id: string;
  seqname: string;
  start: string;
  end: string;
  strand: string;
  mRNAs: Sequence[];
  CDS: Sequence[];
  proteins: Sequence[];
}

export interface DrosophilaGene {
  id: string;
  annotationId: string;
  fullname: string;
  symbol: string;
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
  const search = async (query: string) => {
    return await fetch<GeneSearchResult>(
      "geneservice",
      `/search?query=${encodeURIComponent(query)}`,
    );
  };

  const suggest = async (query: string) => {
    return await fetch<string[]>(
      "geneservice",
      `/search/_suggest?query=${encodeURIComponent(query)}`,
    );
  };

  const fetchTriboliumGenes = async (genes: string[]) => {
    if (genes.length === 0) return [];

    const concatenatedGenes = genes.join(",");
    return (
      (await fetch<TriboliumGene[]>(
        "geneservice",
        `/tribolium/genes?ids=${concatenatedGenes}`,
      )) || []
    );
  };

  const fetchDrosophilaGenes = async (genes: string[]) => {
    if (genes.length === 0) return [];

    const concatenatedGenes = genes.join(",");
    return (
      (await fetch<DrosophilaGene[]>(
        "geneservice",
        `/drosophila/genes?ids=${concatenatedGenes}`,
      )) || []
    );
  };

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
    search,
    suggest,
    fetchTriboliumGenes,
    fetchDrosophilaGenes,
    fetchIBs,
    fetchOrthology,
  };
};

export default geneService;
