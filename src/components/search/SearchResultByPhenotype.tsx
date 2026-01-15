import { useState, Fragment } from "react";

import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";
import { imageUrl } from "@/utils/services/imageService";

import PercentageRangeInput from "./PercentageRangeInput";

type GenePhenotypesItem = PhenotypeSearchResult["data"][number];

const ResultRow = ({ gene, phenotypes }: GenePhenotypesItem) => {
  return (
    <div className="group border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
      <div className="grid grid-cols-12 gap-4 p-6">
        <div
          className="col-span-12 md:col-span-2 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-2"
          style={{
            gridRow: `span ${phenotypes.length}`,
          }}
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <a
                className="text-primary font-bold hover:underline font-display text-lg"
                href="#"
              >
                {gene}
              </a>
              <button className="text-slate-300 hover:text-yellow-400 transition-colors">
                <span className="material-symbols-outlined text-lg">star</span>
              </button>
            </div>
          </div>
          <span className="md:hidden text-xs text-slate-400 bg-slate-100 px-2 py-1 rounded">
            Gene ID
          </span>
        </div>

        {phenotypes.map(({ description, penetrance, images = [] }, index) => (
          <Fragment key={index}>
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-slate-700 font-medium">
                  {description}
                </span>
                {!!penetrance && (
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                    {penetrance * 100}%
                  </span>
                )}
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="flex flex-wrap gap-2">
                {images.map((image) => (
                  <img
                    key={image.id}
                    alt="Larva phenotype evidence"
                    className="h-28 w-auto rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-zoom-in"
                    src={imageUrl(image.id)}
                  />
                ))}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const SearchResultByPhenotype = ({
  phenotypeData,
}: {
  phenotypeData: PhenotypeSearchResult;
}) => {
  const [penetrance, setPenetrance] = useState(0.8);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 mb-8">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Minimum Penetrance
          </span>
          <PercentageRangeInput
            value={penetrance * 100}
            onChange={(v) => setPenetrance(v / 100)}
          />
        </div>
        <div className="text-sm text-slate-500 self-start sm:self-center mt-4 sm:mt-0">
          Showing <span className="font-bold text-slate-900">1-10</span> of{" "}
          {phenotypeData.total} results
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden mb-8">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2">Gene</div>
          <div className="col-span-9 md:col-span-5">Phenotypes</div>
          <div className="hidden md:flex md:col-span-5">Image Evidence</div>
        </div>

        <div className="flex flex-col">
          {phenotypeData.data.map((item) => (
            <ResultRow key={item.gene} {...item} />
          ))}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="font-medium">Items per page:</span>
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 rounded-md shadow-sm pl-3 pr-8 py-1.5 text-slate-700 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer">
                <option>10</option>
                <option>25</option>
                <option>50</option>
                <option>100</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <span className="material-symbols-outlined text-lg">
                  arrow_drop_down
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              <span className="font-medium text-slate-900">1-10</span> of{" "}
              <span className="font-medium text-slate-900">27</span> results
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1 rounded-md text-slate-400 disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-xl">
                  first_page
                </span>
              </button>
              <button
                className="p-1 rounded-md text-slate-400 disabled:opacity-50"
                disabled
              >
                <span className="material-symbols-outlined text-xl">
                  chevron_left
                </span>
              </button>
              <button className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  chevron_right
                </span>
              </button>
              <button className="p-1 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors">
                <span className="material-symbols-outlined text-xl">
                  last_page
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SearchResultByPhenotype;
