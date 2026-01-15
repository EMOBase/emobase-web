import { useState } from "react";

import { cn } from "@/utils/classname";

const results = [
  {
    id: "TC001720",
    phenotypes: [
      {
        description: "head & thorax & abdomen orientation irregular",
        penetrance: 80,
      },
      { description: "wings not closed", penetrance: 80 },
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDm-K6vZXxVKqhArLDM1NIwCm3BOstGnXpOl9YFrQOFVMiHv8a1uHcxTsKNRXQBpDMxlx-gQ4I0gNfrRFyWa31M4ro28tKdSLTKJ4aVFpUvhhDz0L5r-18jVGucaxZYITVJuE9hT2sSS79vvaE-ZslOwLIAyOhD-e6HGPXSvR8c9biyHyw9l4SwinJq0j7TfPUD5YkHPaJhEBZXflzgV5mdEMKGZ8Vf0nqWYMCfsYyQuPsS1nU37IU8_OMU3n3jnjySUEbce4CMm-o8",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCy0SQFv81QS9GEzOzdBi-ye1jmTHktpGZJnrJfJcEPNgb04_j-NCxeRzzzxsjbFQj17pMeGbQUkvKk4qhO4rUtPJaAs9FQlDrkVAb0FahW5i0ZN39aUT2nwImK9GvLdOdsGPv578zYk50TNYdS16-ETucFtDHiozEXI8R4zQKbyZ7HyUDVDH5jeXU8Wr__qHUADj8ApskV1gdX1OYkJJFRNozPLRv_eUYEEtTO5wZxprnPFoScovlhGEN0g7pdII8lEIHJ5cL5Cc9X",
    ],
  },
  {
    id: "TC001739",
    phenotypes: [
      { description: "head & thorax orientation irregular", penetrance: 80 },
      { description: "wings not closed", penetrance: 80 },
    ],
    images: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7N1jfnpDb55z9XHuctGDQZRn-zP_hUwKjQh2xwDzKgH0-ImnwhA7nJbj2854zQ8PY1vAp-vhwfBqKQfBDDuTpRodUp61qXQ-CNoDAf6d9EGS0uExdvjV8X4pkGqxdTnw8VbiMwRhOqCscD3jhmfEgi-mJmzyWyEawom6iZDeSFZhDBehBoSeJyXoMu3mpvdRagtFbe4xjwtW1HTd9_wmNRAnG1TRuG9GY8P0AAQ-ww6dsDaDpWfIoK7L8WNjCrBlYDe2IABZVS1Qr",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDKK5HBfP22UVVH2ct9FjzKeteeyMecd6fmdaQoEtVT9h29kcFTVzapn17RA9vfg9lty-pmoA8_B8H3TnNp4012Sf4Vj0TrF8-euLPn5-ztVvVM1wNwQN8Q92Svn-fhPHQ-pX7RLCFH8XTg49V2T1XVIn2DhoQ4GnNO0LOCQVR5rY_wXmbnViT0oKNGOxFyHOPyfU2OYRimeTKLj2nSlO-t2rY3HyDQ4dP1DT41XDi8MQ4juKNlZ6X6GRJUiQZMFbcggPVu_eMiLHbi",
    ],
  },
];

const ResultRow = ({ result }: { result: (typeof results)[number] }) => {
  return (
    <div className="group border-b border-slate-100 hover:bg-orange-50/30 transition-colors">
      <div className="grid grid-cols-12 gap-4 p-6">
        <div className="col-span-12 md:col-span-2 flex flex-row md:flex-col items-center md:items-start justify-between md:justify-start gap-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <a
                className="text-primary font-bold hover:underline font-display text-lg"
                href="#"
              >
                {result.id}
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

        <div className="col-span-12 md:col-span-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col gap-6">
            {result.phenotypes.map((p, i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="flex items-baseline gap-2 flex-wrap">
                  <span className="text-slate-700 font-medium">
                    {p.description}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                    {p.penetrance}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:flex flex-col gap-6">
            {result.images.map((img, i) => (
              <div key={i} className="h-full flex items-start">
                <img
                  alt="Larva phenotype evidence"
                  className="h-28 w-auto rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:scale-105 transition-all cursor-zoom-in"
                  src={img}
                />
              </div>
            ))}
          </div>

          {/* Mobile Images */}
          <div className="md:hidden flex gap-2 overflow-x-auto pb-2">
            {result.images.map((img, i) => (
              <img
                key={i}
                alt="Larva phenotype evidence"
                className="h-24 w-auto rounded border border-slate-200 shadow-sm"
                src={img}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchResultByPhenotype = () => {
  const [penetrance, setPenetrance] = useState(0.8);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2 pb-3 mb-8">
        <div className="flex items-center gap-6 w-full sm:w-auto">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">
            Minimum Penetrance
          </span>
          <div className="flex flex-col w-full sm:w-[320px]">
            <div className="relative h-8 flex items-center">
              <input
                type="range"
                min="0"
                max="100"
                step="10"
                value={penetrance * 100}
                onChange={(e) => setPenetrance(parseInt(e.target.value) / 100)}
                className={cn(
                  "w-full appearance-none bg-transparent rounded",
                  "[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-3.5 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:cursor-grab [&::-webkit-slider-thumb]:-mt-1.25 [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:z-20",
                  "[&::-webkit-slider-runnable-track]:h-1 [&::-webkit-slider-runnable-track]:rounded",
                )}
                style={{
                  background: `linear-gradient(to right, #d97706 0%, #d97706 ${penetrance * 100}%, #e2e8f0 ${penetrance * 100}%, #e2e8f0 100%)`,
                  backgroundSize: "100% 4px",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                }}
              />
              <div className="absolute top-[22px] left-[6px] right-[6px] flex justify-between pointer-events-none">
                {[0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((val) => (
                  <div
                    key={val}
                    className={`w-px h-1.5 bg-slate-300 ${penetrance * 100 === val ? "bg-primary h-2" : ""}`}
                  ></div>
                ))}
              </div>
              <div className="absolute top-8 left-0 -right-1 flex justify-between text-[10px] font-medium text-slate-400 select-none">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div
                className="absolute bottom-6 -translate-x-1/2 text-[10px] text-primary font-bold select-none"
                style={{
                  left: `${penetrance * 100}%`,
                }}
              >
                {penetrance * 100}%
              </div>
            </div>
          </div>
        </div>
        <div className="text-sm text-slate-500 self-start sm:self-center mt-4 sm:mt-0">
          Showing <span className="font-bold text-slate-900">1-10</span> of 27
          results
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-card border border-slate-100 overflow-hidden mb-8">
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-slate-50 border-b border-slate-100 text-xs font-bold text-slate-500 uppercase tracking-wider">
          <div className="col-span-3 md:col-span-2">Gene</div>
          <div className="col-span-9 md:col-span-5">Phenotypes</div>
          <div className="hidden md:flex md:col-span-5">Image Evidence</div>
        </div>

        <div className="flex flex-col">
          {results.map((res) => (
            <ResultRow key={res.id} result={res} />
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
