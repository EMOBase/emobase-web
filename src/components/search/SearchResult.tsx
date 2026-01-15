import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { type GeneSearchResult } from "@/utils/services/geneService";
import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";

import SearchResultByOrthology from "./SearchResultByOrthology";

type SearchResultProps = {
  orthologyData: GeneSearchResult;
  phenotypeData: PhenotypeSearchResult;
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

      <TabsContent value="direct">Nothing</TabsContent>
      <TabsContent value="orthology">
        {orthologies && <SearchResultByOrthology orthologies={orthologies} />}
      </TabsContent>
      <TabsContent value="phenotype">Search by phenotype Result</TabsContent>
    </Tabs>
  );
};

export default SearchResult;
