import { Handle, Position, type Node, type NodeProps } from "@xyflow/react";
import { cn } from "@/utils/classname";

export type WorkflowNodeData = {
  label: string;
  subLabel?: string;
  day: number | string;
  color?: "orange" | "blue" | "green" | "red";
};

// Define the Node type extending the React Flow Node
export type WorkflowNodeType = Node<WorkflowNodeData, "custom">;

export default function WorkflowNode({ data }: NodeProps<WorkflowNodeType>) {
  const { label, subLabel, day, color = "orange" } = data;

  const bgColors = {
    orange: "bg-amber-400",
    blue: "bg-sky-500",
    green: "bg-emerald-400",
    red: "bg-orange-600",
  };

  const dayColors = {
    orange: "bg-amber-500",
    blue: "bg-sky-600",
    green: "bg-emerald-500",
    red: "bg-orange-700",
  };

  return (
    <div
      className={cn(
        "flex items-stretch rounded-md overflow-hidden text-white font-bold shadow-md min-w-50",
        bgColors[color] || bgColors.orange,
      )}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!bg-transparent !border-none"
      />

      <div className="flex-1 px-4 py-3 flex flex-col justify-center">
        <div className="text-xl leading-tight">{label}</div>
        {subLabel && (
          <div className="text-base font-normal leading-tight">{subLabel}</div>
        )}
      </div>

      <div
        className={cn(
          "flex flex-col justify-center items-center px-4 py-3 border-l border-white/20",
          dayColors[color] || dayColors.orange,
        )}
      >
        <span className="text-sm font-normal opacity-90">day</span>
        <span className="text-2xl leading-none">{day}</span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!bg-transparent !border-none"
      />

      <Handle
        type="target"
        position={Position.Left}
        id="target-left"
        className="!bg-transparent !border-none"
      />
    </div>
  );
}
