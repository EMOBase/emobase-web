import { useRef } from "react";
import { navigate } from "astro:transitions/client";
import { Autocomplete as AutocompletePrimitive } from "@base-ui/react/autocomplete";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Spinner } from "@/components/ui/spinner";
import SearchAutocomplete from "@/components/common/SearchAutocomplete";
import { SearchHelpModal } from "@/components/common/SearchHelpModal";
import { getEnv } from "@/utils/env";

interface HeroProps {
  examples?: string[];
}

const Hero = ({ examples = [] }: HeroProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.target as HTMLFormElement);
    const searchTerm = formData.get("search");
    if (typeof searchTerm === "string" && searchTerm.trim()) {
      navigate(`/search/${searchTerm.trim()}`);
    }
  };

  return (
    <section className="flex flex-col items-center justify-center text-center gap-8 p-10 md:p-16 lg:p-24 xl:p-32">
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-bold to-primary-light font-display mb-10">
          {getEnv("PUBLIC_SPECIES_SCIENTIFIC_NAME")}{" "}
          <span className="text-slate-900">Genomic Database</span>
        </h1>
      </div>

      <div className="w-full max-w-3xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
        <SearchAutocomplete
          anchor={formRef}
          renderInput={({
            searchValue,
            setSearchValue,
            loading,
            fetchSuggestions,
          }) => (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="relative bg-white max-w-[45rem] mx-auto p-2 rounded-2xl shadow-soft border border-slate-200 flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all"
            >
              <Icon name="search" className="text-2xl text-slate-400 ml-4" />
              <AutocompletePrimitive.Input
                render={
                  <input
                    name="search"
                    type="text"
                    autoComplete="off"
                    autoCorrect="off"
                    placeholder="Search for gene IDs or phenotypes..."
                    className="block w-full px-4 py-3 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 text-lg outline-none"
                    value={searchValue}
                    onChange={(e) => {
                      const val = e.target.value;
                      setSearchValue(val);
                      fetchSuggestions(val);
                    }}
                  />
                }
              />
              {loading && (
                <div className="flex items-center px-2">
                  <Spinner className="size-5" />
                </div>
              )}
              <div className="flex items-center gap-1 pr-1">
                <SearchHelpModal>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    title="Search instruction"
                    className="text-slate-400 hover:text-slate-600 h-10 w-10 shrink-0"
                  >
                    <Icon name="help" className="text-2xl" />
                  </Button>
                </SearchHelpModal>
                <Button
                  type="submit"
                  variant="primary"
                  className="px-8 font-bold rounded-xl h-12"
                >
                  Search
                </Button>
              </div>
            </form>
          )}
        />
        {examples.length > 0 && (
          <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs text-slate-500">
            <span className="font-semibold">Examples:</span>
            {examples.map((example) => (
              <a
                key={example}
                href={`/search/${example}`}
                className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-600 transition-colors"
              >
                {example}
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;
