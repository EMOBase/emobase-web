import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GeneSearchResult } from "@/utils/services/geneService";
import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";

import SearchResultByOrthology from "./SearchResultByOrthology";

type SearchResultProps = {
  orthologyData: GeneSearchResult;
  phenotypeData: PhenotypeSearchResult;
};

const EmptyContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
      <p className="text-slate-400 font-medium">{children}</p>
    </div>
  );
};

const SearchResult: React.FC<SearchResultProps> = ({
  orthologyData,
  phenotypeData,
}) => {
  const genes = orthologyData.genes;
  const orthologies = orthologyData.orthologies;
  const otherGenes = orthologyData.otherGenes;

  const directHitBadge = genes?.length || 0;
  const phenotypeBadge = phenotypeData.total || 0;
  const orthologyBadge = (orthologies?.length || 0) + (otherGenes?.length || 0);

  return (
    <Tabs
      defaultValue={
        orthologyBadge > 0
          ? "orthology"
          : phenotypeBadge > 0
            ? "phenotype"
            : "direct"
      }
    >
      <TabsList>
        <TabsTrigger value="direct" badge={directHitBadge}>
          Direct Hits
        </TabsTrigger>
        <TabsTrigger value="orthology" badge={orthologyBadge}>
          By Orthology
        </TabsTrigger>
        <TabsTrigger value="phenotype" badge={phenotypeBadge}>
          By Phenotype
        </TabsTrigger>
      </TabsList>

      <TabsContent value="direct">
        <EmptyContent>No direct hits found for this query</EmptyContent>
      </TabsContent>
      <TabsContent value="orthology">
        {orthologies && orthologies.length ? (
          <SearchResultByOrthology orthologies={orthologies} />
        ) : (
          <EmptyContent>No results found searching by orthology</EmptyContent>
        )}
      </TabsContent>
      <TabsContent value="phenotype">
        {phenotypeData.total > 0 ? (
          "Search by phenotype Result"
        ) : (
          <EmptyContent>No results found searching by phenototype</EmptyContent>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SearchResult;
