import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

type CurrentPipelineProps = {
  steps: QueryPipelineStep[];
  onSwap: (one: string, two: string) => void;
  onRemove: (name: string) => void;
};

// Pure visual component for the step item
const StepItem = ({
  step,
  onRemove,
  isOverlay = false,
}: {
  step: QueryPipelineStep;
  onRemove?: (name: string) => void;
  isOverlay?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => onRemove?.(step.name)}
        className={`group/item text-xs flex items-center gap-2 px-3 py-2 bg-slate-100/90 hover:bg-slate-200/90 rounded-md text-sm text-slate-700 border border-slate-200 cursor-default ${
          isOverlay ? "cursor-grabbing border-slate-400 shadow-md" : ""
        }`}
      >
        {step.name}
        <Icon
          name="close"
          className="text-sm text-slate-500 group-hover/item:text-slate-700 -mr-1"
        />
      </TooltipTrigger>
      {/* Tooltip content is problematic in overlay or dragging usually, but we keep structure if needed. 
          Often better to hide tooltip during drag. */}
      {!isOverlay && (
        <TooltipContent>Click to remove or Drag to reorder</TooltipContent>
      )}
    </Tooltip>
  );
};

const SortableStep = ({
  step,
  onRemove,
}: {
  step: QueryPipelineStep;
  onRemove: (name: string) => void;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: step.name });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1, // Dim the original item
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <StepItem step={step} onRemove={onRemove} />
    </div>
  );
};

const CurrentPipeline: React.FC<CurrentPipelineProps> = ({
  steps,
  onRemove,
  onSwap,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      onSwap(active.id as string, over.id as string);
    }
  };

  const handleDragEnd = () => {
    setActiveId(null);
  };

  const activeStep = steps.find((s) => s.name === activeId);

  return (
    <div className="mt-4 space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
        Current pipeline steps
        <span className="bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-1.5 py-0.5 rounded text-[10px]">
          {steps.length}
        </span>
      </h3>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={steps.map((s) => s.name)}
          strategy={rectSortingStrategy}
        >
          <div className="flex flex-wrap gap-2 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 min-h-[60px]">
            {steps.length === 0 && (
              <span className="text-slate-400 text-sm italic">
                No steps selected
              </span>
            )}
            {steps.map((step) => {
              return step ? (
                <SortableStep key={step.name} step={step} onRemove={onRemove} />
              ) : null;
            })}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeStep ? <StepItem step={activeStep} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default CurrentPipeline;
