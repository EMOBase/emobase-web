import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";

type StepListProps = {
  steps: QueryPipelineStep[];
  pipeline: string[];
  selectedSteps: QueryPipelineStep[];
  onAdd: (name: string) => void;
  onRemove: (name: string) => void;
};

const StepList: React.FC<StepListProps> = ({
  steps,
  pipeline,
  selectedSteps,
  onAdd,
  onRemove,
}) => {
  const availableKeys = new Set(
    selectedSteps.flatMap((step) => [step.input, step.output]),
  );

  const checkSelectable = (step: QueryPipelineStep) => {
    if (pipeline.length == 0) return true;

    return availableKeys.has(step.input);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {steps.map((step) => {
        const isSelected = pipeline.includes(step.name);
        const isSelectable = checkSelectable(step);
        const isLastSelected = pipeline[pipeline.length - 1] === step.name;

        return (
          <Tooltip key={step.name} disableHoverableContent>
            <TooltipTrigger
              onClick={() =>
                isLastSelected ? onRemove(step.name) : onAdd(step.name)
              }
              className={twMerge(
                `flex items-center justify-between px-3 py-2 text-xs font-medium border rounded-md transition-all`,
                isSelected
                  ? "border-primary bg-primary/5 text-primary shadow-sm"
                  : isSelectable
                    ? "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:border-primary/40 hover:text-primary cursor-pointer"
                    : "border-slate-200 text-slate-400",
                isLastSelected && "cursor-pointer",
              )}
              disabled={!isSelectable && !isLastSelected}
            >
              <span className="truncate">
                {step.name.replace("->", "\u2192")}
              </span>
              {isSelected ? (
                <>
                  <Icon name="check_circle" className="text-sm shrink-0" />
                </>
              ) : isSelectable ? (
                <Icon name="add" className="text-sm shrink-0" />
              ) : null}
            </TooltipTrigger>
            <TooltipContent>{step.description}</TooltipContent>
          </Tooltip>
        );
      })}
    </div>
  );
};

export default StepList;
