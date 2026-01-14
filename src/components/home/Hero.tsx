import { useActionState } from "react";
import { navigate } from "astro:transitions/client";

import { Button } from "@/components/ui/button";

const examples = [
  "TC013553",
  "FBgn0001180",
  "rx",
  "larval head",
  "leg shortened",
];

const Hero = () => {
  const [, formAction] = useActionState((_: any, formData: FormData) => {
    const searchTerm = formData.get("search");

    if (typeof searchTerm === "string" && searchTerm.trim()) {
      navigate(`/search/${searchTerm}`);
    }
  }, null);

  return (
    <section className="flex flex-col items-center justify-center text-center gap-8 p-10 md:p-16 lg:p-24 xl:p-32">
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary to-amber-600 font-display">
          Tribolium Castaneum{" "}
          <span className="text-slate-900">Genomic Database</span>
        </h1>
        <p className="text-slate-500 text-lg md:text-xl max-w-3xl font-light">
          A comprehensive knowledge base for Beetle (aka Tribolium castaneum)
          genomics. Access thousands indexed of genes, phenotypes, and
          ontologies.
        </p>
      </div>

      <div className="w-full max-w-2xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
        <form
          action={formAction}
          className="relative bg-white p-2 rounded-2xl shadow-soft border border-slate-200 flex items-center focus-within:ring-2 focus-within:ring-primary/20 transition-all"
        >
          <span className="material-symbols-outlined text-2xl text-slate-400 ml-4">
            search
          </span>
          <input
            name="search"
            type="text"
            autoComplete="off"
            autoCorrect="off"
            placeholder="Search for gene IDs or phenotypes..."
            className="block w-full px-4 py-3 bg-transparent border-none text-slate-800 placeholder-slate-400 focus:ring-0 text-lg outline-none"
          />
          <Button type="submit" className="px-8 font-bold">
            Search
          </Button>
        </form>
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
      </div>
    </section>
  );
};

export default Hero;
