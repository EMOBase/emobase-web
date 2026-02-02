import { useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

import ResultsTable from "./ResultsTable";

interface GeneResult {
  fbgn: string;
  symbol: string;
  tcId?: string;
  ibId?: string;
  lethality11?: string;
  pupal11?: string;
}

interface ConversionStep {
  id: string;
  label: string;
}

const CONVERSION_STEPS: ConversionStep[] = [
  { id: "fbgn_to_symbol", label: "FBgn → FB symbol" },
  { id: "fbgn_to_name", label: "FBgn → FB name" },
  { id: "fbgn_to_cg", label: "FBgn → CG" },
  { id: "symbol_to_fbgn", label: "FB symbol → FBgn" },
  { id: "cg_to_fbgn", label: "CG → FBgn" },
  { id: "fbgn_to_tc", label: "FBgn → TC" },
  { id: "tc_to_fbgn", label: "TC → FBgn" },
  { id: "tc_to_ib", label: "TC → iB" },
  { id: "ib_to_tc", label: "iB → TC" },
  { id: "ib_to_lethal11", label: "iB → lethal 11" },
  { id: "ib_to_lethal22", label: "iB → lethal 22" },
  { id: "ib_to_pupal11", label: "iB → pupal 11" },
];

export const EXAMPLE_IDS = `FBgn0020412
FBgn0262866
FBgn0052528
FBgn0003360
FBgn0025111
FBgn0011742
FBgn0001217`;

const GeneIDConverter = () => {
  const [ids, setIds] = useState(EXAMPLE_IDS);
  const [pipeline, setPipeline] = useState<string[]>([
    "fbgn_to_symbol",
    "fbgn_to_tc",
    "tc_to_ib",
    "ib_to_lethal11",
    "ib_to_pupal11",
  ]);
  const [results, setResults] = useState<GeneResult[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMockSubmit = () => {
    setIsSubmitting(true);
    // Simulate API delay
    setTimeout(() => {
      const mockResults: GeneResult[] = ids
        .split("\n")
        .filter(Boolean)
        .map((id, idx) => ({
          fbgn: id.trim(),
          symbol:
            ["JIL-1", "S6kII", "parvin", "sesB", "Ant2", "Aats-met", "lola"][
              idx % 7
            ] || "Unknown",
          tcId: idx % 3 === 0 ? undefined : `TC00${1074 + idx}`,
          ibId: idx % 3 === 0 ? undefined : `iB_0${6763 + idx}`,
          lethality11:
            idx % 3 === 0 ? undefined : (Math.random() * 50).toFixed(1),
          pupal11: idx % 3 === 0 ? undefined : (Math.random() * 50).toFixed(1),
        }));
      setResults(mockResults);
      setIsSubmitting(false);
    }, 600);
  };

  const handleReset = () => {
    setIds("");
    setPipeline([]);
    setResults([]);
  };

  const handleLoadExample = () => {
    setIds(EXAMPLE_IDS);
  };

  const toggleStep = (stepId: string) => {
    setPipeline((prev) =>
      prev.includes(stepId)
        ? prev.filter((s) => s !== stepId)
        : [...prev, stepId],
    );
  };

  const removeStep = (stepId: string) => {
    setPipeline((prev) => prev.filter((s) => s !== stepId));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 p-4 rounded-xl text-sm text-slate-700 dark:text-slate-300 flex gap-3 shadow-sm">
          <Icon
            name="info"
            className="text-amber-600 dark:text-amber-400 text-xl"
          />
          <p>
            To convert a list of gene IDs into other IDs: Paste your list of IDs
            and then select processing steps by clicking the respective query
            steps. Finally, submit the query and download the table.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Step 1: Paste IDs */}
          <section className="lg:col-span-4 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                1
              </span>
              <h2 className="text-xl font-bold dark:text-white">Paste IDs</h2>
            </div>
            <textarea
              className="flex-1 w-full min-h-64 p-4 font-mono text-sm bg-white dark:bg-sidebar-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm transition-colors focus:ring-0 resize-none dark:placeholder-slate-600 dark:text-slate-300"
              placeholder="Paste your IDs here (one per line)..."
              value={ids}
              onChange={(e) => setIds(e.target.value)}
            />
            <Button
              onClick={handleLoadExample}
              className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg tracking-tight"
            >
              Load Example Data
            </Button>
          </section>

          {/* Step 2: Pipeline */}
          <section className="lg:col-span-8 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </span>
              <h2 className="text-xl font-bold dark:text-white">
                Add query steps to the pipeline
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {CONVERSION_STEPS.map((step) => {
                const isSelected = pipeline.includes(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleStep(step.id)}
                    className={`flex items-center justify-between px-3 py-2 text-xs font-medium border rounded-lg transition-all ${
                      isSelected
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/40"
                    }`}
                  >
                    <span className="truncate">{step.label}</span>
                    <Icon
                      name={isSelected ? "check_circle" : "add"}
                      className="text-sm shrink-0"
                    />
                  </button>
                );
              })}
            </div>

            {/* Current Pipeline Tags */}
            <div className="mt-4 space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                Current pipeline steps
                <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
                  {pipeline.length}
                </span>
              </h3>
              <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 min-h-[60px]">
                {pipeline.length === 0 && (
                  <span className="text-slate-400 text-sm italic">
                    No steps selected
                  </span>
                )}
                {pipeline.map((stepId) => {
                  const step = CONVERSION_STEPS.find((s) => s.id === stepId);
                  return step ? (
                    <button
                      key={stepId}
                      onClick={() => removeStep(stepId)}
                      className="group/item text-xs flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm text-slate-700 border border-slate-200"
                    >
                      {step.label}
                      <Icon
                        name="close"
                        className="text-sm text-slate-500 group-hover/item:text-slate-700"
                      />
                    </button>
                  ) : null;
                })}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button onClick={handleReset}>Reset</Button>
              <Button
                variant="primary"
                onClick={handleMockSubmit}
                disabled={isSubmitting || !ids.trim()}
              >
                {isSubmitting ? (
                  <>
                    <Spinner />
                    Processing...
                  </>
                ) : (
                  "Submit Query"
                )}
              </Button>
            </div>
          </section>
        </div>

        {/* Results Section */}
        <ResultsTable results={results} />
      </div>
    </div>
  );
};

export default GeneIDConverter;
