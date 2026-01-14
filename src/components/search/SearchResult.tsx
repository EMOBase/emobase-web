import React from "react";

import { type GeneSearchResult } from "@/utils/services/geneService";
import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";

const INITIAL_RESULTS = [
  {
    algorithm: "OrthoFinder",
    triboliumHomolog: "TC013553",
    drosophilaHomolog: "FBgn0001180",
    treeLink: null,
    starred: true,
  },
  {
    algorithm: "Eggnog6",
    triboliumHomolog: "TC013553",
    drosophilaHomolog: "FBgn0001180",
    treeLink: "EIZQT",
    starred: true,
  },
];

const state = {
  query: "FBgn0001180",
  results: INITIAL_RESULTS,
  counts: {
    direct: 0,
    orthology: 2,
    phenotype: 0,
  },
  loading: false,
};

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

      <div className="bg-white rounded-xl shadow-card overflow-hidden border border-slate-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Algorithm
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Tribolium homologs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Drosophila homologs
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Link to tree
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {state.loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-slate-400 italic">
                        Processing genomics data...
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                state.results.map((row, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-orange-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900">
                      {row.algorithm}
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        <a className="text-primary hover:text-amber-700 font-bold hover:underline decoration-primary decoration-2 underline-offset-2 cursor-pointer">
                          {row.triboliumHomolog}
                        </a>
                        {row.starred && (
                          <span
                            className="material-symbols-outlined text-amber-400 text-lg"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            star
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-1">
                        <a className="text-slate-700 hover:text-primary transition-colors flex items-center gap-1 cursor-pointer">
                          {row.drosophilaHomolog}
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            open_in_new
                          </span>
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                      {row.treeLink ? (
                        <div className="flex items-center gap-1">
                          <a className="text-slate-700 hover:text-primary transition-colors flex items-center gap-1 font-mono text-xs bg-slate-100 px-2 py-1 rounded cursor-pointer">
                            {row.treeLink}
                            <span className="material-symbols-outlined text-sm text-slate-400">
                              open_in_new
                            </span>
                          </a>
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">
                          No tree available
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Showing {state.results.length} results based on orthology search.
          </span>
        </div>
      </div>
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
