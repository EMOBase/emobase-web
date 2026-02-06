import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import { apiFetch } from "@/utils/apiFetch";

const querypipelineService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchSteps = async () => {
    return (
      (await fetch<QueryPipelineStep[]>("querypipelineservice", "/steps")) || []
    );
  };

  const submit = async (steps: QueryPipelineStep[], input: string) => {
    const payload = new FormData();
    payload.append("steps", JSON.stringify(steps));
    payload.append("data", input);
    return (
      (await fetch<string>("querypipelineservice", "/pipelines", {
        body: payload,
        method: "POST",
        responseType: "text",
      })) || ""
    );
  };

  return { fetchSteps, submit };
};

export default querypipelineService;
