import SearchInput from "@/components/common/SearchInput";

interface HeroProps {
  title: string;
  description?: string;
  examples?: string[];
}

const Hero = ({ title, description, examples = [] }: HeroProps) => {
  const titleLines = title.split("\n");

  return (
    <section className="flex flex-col items-center justify-center text-center gap-8 p-10 md:p-16 lg:p-24 xl:p-32">
      <div className="flex flex-col items-center gap-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-primary-bold to-primary-light font-display">
          {titleLines[0]}
          <br />
          {titleLines.slice(1).map((line) => (
            <>
              <span className="text-slate-900">{line}</span>
              <br />
            </>
          ))}
        </h1>
        {description ? (
          <p className="text-slate-500 text-lg md:text-xl max-w-3xl font-light">
            {description}
          </p>
        ) : (
          <div className="h-10" />
        )}
      </div>

      <div className="w-full max-w-3xl relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-200 to-amber-200 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity pointer-events-none"></div>
        <SearchInput
          size="big"
          className="relative bg-white max-w-[45rem] mx-auto p-2 rounded-2xl shadow-soft border border-slate-200 focus-within:ring-2 focus-within:ring-primary/20 transition-all"
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
