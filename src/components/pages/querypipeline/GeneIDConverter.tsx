import { useState } from "react";
import { arrayMove } from "@dnd-kit/sortable";

import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import { isNotUndefined } from "@/utils/filterFn";

import CurrentPipeline from "./CurrentPipeline";
import ResultsTable from "./ResultsTable";
import { EXAMPLE_INPUT, EXAMPLE_STEP_NAMES } from "./constants";

interface GeneResult {
  fbgn: string;
  symbol: string;
  tcId?: string;
  ibId?: string;
  lethality11?: string;
  pupal11?: string;
}

type GeneIDConverterProps = {
  steps: QueryPipelineStep[];
};

const GeneIDConverter: React.FC<GeneIDConverterProps> = ({ steps }) => {
  const [ids, setIds] = useState("");
  const [pipeline, setPipeline] = useState<string[]>([]);
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
    setIds(EXAMPLE_INPUT);
    setPipeline(EXAMPLE_STEP_NAMES);
  };

  const toggleStep = (stepName: string) => {
    setPipeline((prev) =>
      prev.includes(stepName)
        ? prev.filter((s) => s !== stepName)
        : [...prev, stepName],
    );
  };

  const moveStep = (target: string, destination: string) => {
    setPipeline((prev) => {
      const oldIndex = prev.indexOf(target);
      const newIndex = prev.indexOf(destination);

      return arrayMove(prev, oldIndex, newIndex);
    });
  };

  const removeStep = (stepName: string) => {
    setPipeline((prev) => prev.filter((s) => s !== stepName));
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
              className="flex-1 w-full min-h-64 p-4 font-mono text-sm bg-white dark:bg-sidebar-dark border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm transition-colors focus:ring-0 resize-none dark:placeholder-slate-600 dark:text-slate-300"
              placeholder={"Paste your IDs here\n(one per line)..."}
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
              {steps.map((step) => {
                const isSelected = pipeline.includes(step.name);
                return (
                  <Tooltip key={step.name} disableHoverableContent>
                    <TooltipTrigger
                      onClick={() => toggleStep(step.name)}
                      className={`group/step flex items-center justify-between px-3 py-2 text-xs font-medium border rounded-md transition-all ${
                        isSelected
                          ? "border-primary bg-primary/5 text-primary shadow-sm"
                          : "border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-primary/40"
                      }`}
                    >
                      <span className="truncate">
                        {step.name.replace("->", "\u2192")}
                      </span>
                      {isSelected ? (
                        <>
                          <Icon
                            name="check_circle"
                            className="text-sm shrink-0 group-hover/step:hidden"
                          />
                          <Icon
                            name="remove"
                            className="text-sm text-slate-500 shrink-0 hidden group-hover/step:inline-flex"
                          />
                        </>
                      ) : (
                        <Icon
                          name="add"
                          className="text-sm shrink-0 group-hover/step:text-primary"
                        />
                      )}
                    </TooltipTrigger>
                    <TooltipContent>{step.description}</TooltipContent>
                  </Tooltip>
                );
              })}
            </div>

            <CurrentPipeline
              steps={pipeline
                .map((stepName) => steps.find((s) => s.name === stepName))
                .filter(isNotUndefined)}
              onMove={moveStep}
              onRemove={removeStep}
            />

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
