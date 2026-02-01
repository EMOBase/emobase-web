import WorkflowPupalButton from "./WorkflowPupalButton";
import WorkflowLarvaButton from "./WorkflowLarvaButton";

const WorkflowButtons = () => {
  return (
    <div className="flex gap-2">
      <WorkflowPupalButton />
      <WorkflowLarvaButton />
    </div>
  );
};

export default WorkflowButtons;
