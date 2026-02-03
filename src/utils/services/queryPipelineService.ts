import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import { apiFetch } from "@/utils/apiFetch";

const fetchSteps = async () => {
  return (
    (await apiFetch<QueryPipelineStep[]>("querypipelineservice", "/steps")) ||
    []
  );
};

const submit = async (steps: QueryPipelineStep[], input: string) => {
  const payload = new FormData();
  payload.append("steps", JSON.stringify(steps));
  payload.append("data", input);
  return (
    (await apiFetch<string>("querypipelineservice", "/pipelines", {
      body: payload,
      method: "POST",
      responseType: "text",
    })) || ""
  );
};

export { fetchSteps, submit };
