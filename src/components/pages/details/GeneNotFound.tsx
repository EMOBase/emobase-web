import { Button } from "@/components/ui/button";

const GeneNotFound = () => {
  return (
    <div className="w-full h-full overflow-y-auto flex items-center justify-center p-6 bg-background-subtle">
      <div className="max-w-md w-full bg-white rounded-xl shadow-card border border-slate-200 p-12 md:p-16 text-center animate-in fade-in zoom-in duration-300">
        <div className="mb-6 flex justify-center">
          <div className="size-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center">
            <span className="material-symbols-outlined text-slate-400 text-xl">
              error_outline
            </span>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-semibold text-slate-400 tracking-[0.25em] uppercase mb-2">
            Error 404
          </p>
          <h1 className="text-2xl font-medium text-slate-900 font-display mb-4">
            Gene Not Found
          </h1>
          <p className="text-slate-500 text-sm leading-relaxed">
            The requested gene record could not be found in our database.
          </p>
        </div>
        <div className="mt-8">
          <a href="/">
            <Button>Back to Dashboard</Button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default GeneNotFound;
