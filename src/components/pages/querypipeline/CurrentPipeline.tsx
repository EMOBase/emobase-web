import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";

type CurrentPipelineProps = {
  steps: QueryPipelineStep[];
  onRemove: (name: string) => void;
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
        {steps.map((step) => {
          return step ? (
            <Tooltip>
              <TooltipTrigger
                key={step.name}
                onClick={() => onRemove(step.name)}
                className="group/item text-xs flex items-center gap-2 px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-md text-sm text-slate-700 border border-slate-200"
              >
                {step.name}
                <Icon
                  name="close"
                  className="text-sm text-slate-500 group-hover/item:text-slate-700 -mr-1"
                />
              </TooltipTrigger>
              <TooltipContent>
                Click to remove or Drag to reorder
              </TooltipContent>
            </Tooltip>
          ) : null;
        })}
      </div>
    </div>
  );
};

export default CurrentPipeline;
