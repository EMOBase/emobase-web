import React from "react";

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
    <>
      <div className="border-b border-slate-200">
        <nav aria-label="Tabs" className="flex gap-8 -mb-px">
          <TabItem
            label="Direct Hits"
            count={directHitBadge}
            isActive={false}
          />
          <TabItem
            label="By Orthology"
            count={orthologyBadge}
            isActive={true}
          />
          <TabItem
            label="By Phenotype"
            count={phenotypeBadge}
            isActive={false}
          />
        </nav>
      </div>

      {orthologies && <SearchResultByOrthology orthologies={orthologies} />}
    </>
  );
};

const TabItem: React.FC<{
  label: string;
  count: number;
  isActive: boolean;
}> = ({ label, count, isActive }) => (
  <a
    className={`
    whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2 cursor-pointer transition-all
    ${isActive ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300"}
  `}
  >
    {label}
    <span
      className={`
      py-0.5 px-2.5 rounded-full text-xs font-semibold
      ${isActive ? "bg-orange-100 text-primary" : "bg-slate-100 text-slate-600"}
    `}
    >
      {count}
    </span>
  </a>
);

export default SearchResult;
