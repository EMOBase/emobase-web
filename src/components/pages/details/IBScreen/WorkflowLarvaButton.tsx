import { Icon } from "@/components/ui/icon";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  ReactFlow,
  Background,
  Controls,
  type Node,
  type Edge,
  type NodeTypes,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import WorkflowNode from "./WorkflowNode";

const nodeTypes: NodeTypes = {
  custom: WorkflowNode,
};

const WorkflowLarvaButton = () => {
  const nodes: Node[] = [
    {
      id: "1",
      position: { x: 150, y: 0 },
      data: { label: "Injection", day: 0, color: "orange" },
      type: "custom",
    },
    {
      id: "2",
      position: { x: 150, y: 120 },
      data: { label: "Pupal", subLabel: "analysis", day: 11, color: "orange" },
      type: "custom",
    },
    {
      id: "3",
      position: { x: 150, y: 240 },
      data: { label: "Adult", subLabel: "analysis", day: 16, color: "orange" },
      type: "custom",
    },
    {
      id: "4",
      position: { x: 150, y: 360 },
      data: { label: "Sieving", day: 20, color: "orange" },
      type: "custom",
    },
    {
      id: "5",
      position: { x: 150, y: 480 },
      data: {
        label: "Ovary",
        subLabel: "analysis",
        day: "21/23",
        color: "orange",
      },
      type: "custom",
    },
    {
      id: "6",
      position: { x: 400, y: 420 },
      data: {
        label: "Stinkgland",
        subLabel: "analysis",
        day: 38,
        color: "red",
      },
      type: "custom",
    },
  ];

  const edges: Edge[] = [
    {
      id: "e1-2",
      source: "1",
      target: "2",
      style: { strokeWidth: 2, stroke: "#555" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#555" },
    },
    {
      id: "e2-3",
      source: "2",
      target: "3",
      style: { strokeWidth: 2, stroke: "#555" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#555" },
    },
    {
      id: "e3-4",
      source: "3",
      target: "4",
      style: { strokeWidth: 2, stroke: "#555" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#555" },
    },
    {
      id: "e4-5",
      source: "4",
      target: "5",
      style: { strokeWidth: 2, stroke: "#555" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#555" },
    },
    {
      id: "e4-6",
      source: "4",
      target: "6",
      targetHandle: "target-left",
      style: { strokeWidth: 2, stroke: "#555" },
      markerEnd: { type: MarkerType.ArrowClosed, color: "#555" },
    },
  ];

  return (
    <Dialog>
      <DialogTrigger className="inline-flex items-center gap-1.5 px-3 py-1.25 rounded-sm bg-neutral-100 text-neutral-600 text-[10px] font-bold hover:bg-neutral-200 transition-colors uppercase tracking-wider border border-neutral-200">
        <Icon name="science" weight={600} className="text-xs" />
        Workflow Larval Screen
      </DialogTrigger>
      <DialogContent className="h-150 flex flex-col">
        <DialogHeader>
          <DialogTitle>Workflow Larval Screen</DialogTitle>
        </DialogHeader>

        <div className="flex-1 w-full min-h-0 bg-white/50 rounded-b-lg border-t overflow-hidden">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            fitView
            proOptions={{ hideAttribution: true }}
          >
            <Background color="#aaa" gap={16} />
            <Controls />
          </ReactFlow>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WorkflowLarvaButton;
