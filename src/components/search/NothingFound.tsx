const NothingFound = ({ term }: { term: string }) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 bg-white rounded-3xl border-2 border-slate-100 border-dashed gap-8 animate-in zoom-in-95 duration-700">
      <div className="size-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300 shadow-inner text-5xl">
        <span
          className="material-symbols-outlined"
          style={{ fontSize: "unset" }}
        >
          search_off
        </span>
      </div>

      <div className="text-center max-w-lg px-6">
        <h2 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
          No matches found for "{term}"
        </h2>
        <p className="text-slate-500 text-base leading-relaxed mb-8">
          We couldn't find any genes, phenotypes, or orthology groups matching
          your query.
        </p>

        <div className="flex flex-col gap-4 text-left bg-slate-50/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-100 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">
            Suggestions:
          </p>
          <ul className="space-y-3">
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="size-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                1
              </span>
              <span>Check for typos in the Gene ID.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="size-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                2
              </span>
              <span>Try a broader phenotype term.</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-slate-600">
              <span className="size-5 rounded-full bg-white border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 flex-shrink-0">
                3
              </span>
              <span>
                Use the{" "}
                <a
                  href="/querypipeline"
                  className="text-primary font-semibold hover:underline decoration-2 underline-offset-4"
                >
                  Gene ID Converter
                </a>{" "}
                to find synonyms.
              </span>
            </li>
          </ul>
        </div>

        <div className="mt-10">
          <a
            href="/"
            className="text-primary text-sm font-bold hover:text-amber-700 transition-all flex items-center justify-center gap-2 group"
          >
            <span className="material-symbols-outlined text-lg group-hover:-translate-x-1 transition-transform">
              arrow_back
            </span>
            Return to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
};

export default NothingFound;
