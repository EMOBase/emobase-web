import { useState } from "react";

import { Spinner } from "@/components/ui/spinner";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { isNotUndefined } from "@/utils/filterFn";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import { submit } from "@/utils/services/queryPipelineService";

import StepList from "./StepList";
import CurrentPipeline from "./CurrentPipeline";
import ResultTable from "./ResultTable";
import { EXAMPLE_INPUT, EXAMPLE_STEP_NAMES } from "./constants";

type GeneIDConverterProps = {
  steps: QueryPipelineStep[];
};

const GeneIDConverter: React.FC<GeneIDConverterProps> = ({ steps }) => {
  const [ids, setIds] = useState("");
  const [pipeline, setPipeline] = useState<string[]>([]);
  const [result, setResult] = useState<string>();
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSteps = pipeline
    .map((stepName) => steps.find((s) => s.name === stepName))
    .filter(isNotUndefined);

  const handleSubmit = () => {
    setIsSubmitting(true);

    submit(
      steps.filter((step) => pipeline.includes(step.name)),
      ids,
    )
      .then((result) => {
        console.log("submit then", { result });
        setResult(result);
      })
      .catch((error) => {
        console.log("submit catch", { error });
        setError(error.message);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const handleReset = () => {
    setIds("");
    setPipeline([]);
    setResult(undefined);
  };

  const handleLoadExample = () => {
    setIds(EXAMPLE_INPUT);
    setPipeline(EXAMPLE_STEP_NAMES);
  };

  const addStep = (stepName: string) => {
    setPipeline((prev) =>
      prev.includes(stepName) ? prev : [...prev, stepName],
    );
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

            <StepList
              steps={steps}
              pipeline={pipeline}
              selectedSteps={selectedSteps}
              onAdd={addStep}
              onRemove={removeStep}
            />

            <CurrentPipeline steps={selectedSteps} onRemove={removeStep} />

            {/* Actions */}
            <div className="flex justify-end gap-3">
              <Button
                onClick={handleReset}
                disabled={!ids.trim() && pipeline.length === 0}
              >
                Reset
              </Button>
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={isSubmitting || !ids.trim() || pipeline.length == 0}
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
        <ResultTable result={result} error={error} />
      </div>
    </div>
  );
};

export default GeneIDConverter;
