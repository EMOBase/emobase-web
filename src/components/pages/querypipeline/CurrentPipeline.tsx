import { Icon } from "@/components/ui/icon";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";

type CurrentPipelineProps = {
  steps: QueryPipelineStep[];
  onRemove: (name: string) => void;
};

const StepItem = ({
  step,
  onRemove,
}: {
  step: QueryPipelineStep;
  onRemove?: (name: string) => void;
}) => {
  if (!onRemove) {
    return (
      <span
        className={`text-xs flex items-center gap-2 px-3 py-2 bg-slate-100/90 rounded-md text-sm text-slate-700 border border-slate-200`}
      >
        {step.name.replace("->", "\u2192")}
      </span>
    );
  }

  return (
    <button
      onClick={() => onRemove?.(step.name)}
      className={`group/item text-xs flex items-center gap-2 px-3 py-2 bg-slate-100/90 hover:bg-slate-200/90 rounded-md text-sm text-slate-700 border border-slate-200 cursor-pointer`}
    >
      {step.name.replace("->", "\u2192")}
      <Icon
        name="close"
        className="text-sm text-slate-500 group-hover/item:text-slate-700 -mr-1"
      />
    </button>
  );
};

const CurrentPipeline: React.FC<CurrentPipelineProps> = ({
  steps,
  onRemove,
}) => {
  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
        Current pipeline steps
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
          {steps.length}
        </span>
      </h3>
      <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 min-h-[60px]">
        {steps.length === 0 && (
          <span className="text-slate-400 text-sm italic">
            No steps selected
          </span>
        )}
        {steps.map((step, index) => {
          return step ? (
            <StepItem
              key={step.name}
              step={step}
              onRemove={index === steps.length - 1 ? onRemove : undefined}
            />
          ) : null;
        })}
      </div>
    </div>
  );
};

export default CurrentPipeline;
