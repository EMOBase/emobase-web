import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GeneSearchResult } from "@/utils/services/geneService";
import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";

import NothingFound from "./NothingFound";
import SearchResultByOrthology from "./SearchResultByOrthology";
import SearchResultByPhenotype from "./SearchResultByPhenotype";

const EmptyContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
      <p className="text-slate-400 font-medium">{children}</p>
    </div>
  );
};

type SearchResultProps = {
  term: string;
  orthologyData: GeneSearchResult;
  phenotypeData: PhenotypeSearchResult;
};

const SearchResult: React.FC<SearchResultProps> = ({
  term,
  orthologyData,
  phenotypeData: defaultPhenotypeData,
}) => {
  const [phenotypeData, setPhenotypeData] =
    useState<PhenotypeSearchResult>(defaultPhenotypeData);

  const orthologies = orthologyData.orthologies;
  const otherGenes = orthologyData.otherGenes;

  const phenotypeBadge = phenotypeData.total || 0;
  const orthologyBadge = (orthologies?.length || 0) + (otherGenes?.length || 0);

  if (orthologyBadge === 0 && phenotypeBadge === 0) {
    return <NothingFound term={term} />;
  }

  return (
    <Tabs defaultValue={phenotypeBadge > 0 ? "phenotype" : "orthology"}>
      <TabsList>
        <TabsTrigger value="orthology" badge={orthologyBadge}>
          By Orthology
        </TabsTrigger>
        <TabsTrigger value="phenotype" badge={phenotypeBadge}>
          By Phenotype
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orthology">
        {orthologies && orthologies.length ? (
          <SearchResultByOrthology orthologies={orthologies} />
        ) : (
          <EmptyContent>No results found searching by orthology</EmptyContent>
        )}
      </TabsContent>
      <TabsContent value="phenotype">
        {phenotypeData.total > 0 ? (
          <SearchResultByPhenotype
            term={term}
            phenotypeData={phenotypeData}
            setPhenotypeData={setPhenotypeData}
          />
        ) : (
          <EmptyContent>No results found searching by phenototype</EmptyContent>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SearchResult;
