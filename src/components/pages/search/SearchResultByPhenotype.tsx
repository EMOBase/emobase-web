import { useState, Fragment } from "react";

import phenotypeService, {
  type PhenotypeSearchResult,
} from "@/utils/services/phenotypeService";
import imageService from "@/utils/services/imageService";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import PenetranceBadge from "@/components/common/PenetranceBadge";
import BeetleLoading from "@/components/common/BeetleLoading";
import IBBGeneId from "@/components/common/IBBGeneId";
import useUpdateEffect from "@/hooks/useUpdateEffect";

import PercentageRangeInput from "./PercentageRangeInput";

const { search: searchByPhenotypes } = phenotypeService();
const { imageUrl } = imageService();

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
          <IBBGeneId gene={gene} />
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
                <PenetranceBadge value={penetrance} className="font-semibold" />
              </div>
            </div>
            <div className="col-span-12 md:col-span-5">
              <div className="flex flex-wrap gap-2">
                {images.map((image) => {
                  const imgSrc = imageUrl(image.id);
                  return (
                    <a
                      key={image.id}
                      href={imgSrc}
                      target="_blank"
                      className="shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-zoom-in"
                    >
                      <img
                        src={imgSrc}
                        alt="Phenotype evidence"
                        loading="lazy"
                        className="h-28 w-auto rounded-lg border border-slate-200"
                      />
                    </a>
                  );
                })}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
};

const SearchResultByPhenotype = ({
  term,
  phenotypeData,
  setPhenotypeData,
}: {
  term: string;
  phenotypeData: PhenotypeSearchResult;
  setPhenotypeData: React.Dispatch<React.SetStateAction<PhenotypeSearchResult>>;
}) => {
  const [loading, setLoading] = useState(false);
  const [penetrance, setPenetrance] = useState(0.8);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [page, setPage] = useState(1);

  const totalPage = Math.ceil(phenotypeData.total / itemsPerPage);

  useUpdateEffect(() => {
    setLoading(true);
    searchByPhenotypes(
      term,
      penetrance,
      itemsPerPage * (page - 1),
      itemsPerPage,
    ).then((data) => {
      setPhenotypeData(data);
      setLoading(false);
    });
  }, [penetrance, page, itemsPerPage]);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 mb-8">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Penetrance &gt;=
          </span>
          <PercentageRangeInput
            value={penetrance * 100}
            onChange={(v) => setPenetrance(v / 100)}
          />
        </div>
        <div className="text-sm text-slate-500 self-start sm:self-center mt-4 sm:mt-0">
          Showing{" "}
          <span className="font-bold text-slate-900">
            {itemsPerPage * (page - 1) + 1}-
            {Math.min(itemsPerPage * page, phenotypeData.total)}
          </span>{" "}
          of {phenotypeData.total} results
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden mb-8">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2">Gene</div>
          <div className="col-span-9 md:col-span-5">Phenotypes</div>
          <div className="hidden md:flex md:col-span-5">Image Evidence</div>
        </div>

        <div className="relative flex flex-col">
          {loading && <BeetleLoading title="Updating Data" />}
          {phenotypeData.data.map((item) => (
            <ResultRow key={item.gene} {...item} />
          ))}
        </div>

        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <span className="font-medium">Items per page:</span>
            <Select
              value={itemsPerPage.toString()}
              onValueChange={(v) => setItemsPerPage(parseInt(v))}
            >
              <SelectTrigger size="sm" className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 text-sm text-slate-600">
            <span>
              <span className="font-semibold text-slate-900">
                {itemsPerPage * (page - 1) + 1}-
                {Math.min(itemsPerPage * page, phenotypeData.total)}
              </span>{" "}
              of {phenotypeData.total} results
            </span>
            <div className="flex items-center gap-1">
              <button
                className="flex p-1 rounded-md text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage(1)}
              >
                <span className="material-symbols-outlined text-xl">
                  first_page
                </span>
              </button>
              <button
                className="flex p-1 rounded-md text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
              >
                <span className="material-symbols-outlined text-xl">
                  chevron_left
                </span>
              </button>
              <button
                className="flex p-1 rounded-md text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={page === totalPage}
                onClick={() => setPage((p) => p + 1)}
              >
                <span className="material-symbols-outlined text-xl">
                  chevron_right
                </span>
              </button>
              <button
                className="flex p-1 rounded-md text-slate-600 enabled:hover:text-slate-900 enabled:hover:bg-slate-200 transition-colors disabled:opacity-50"
                disabled={page === totalPage}
                onClick={() => setPage(totalPage)}
              >
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
