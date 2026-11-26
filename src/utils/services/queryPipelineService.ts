import type { QueryPipelineStep } from "@/utils/constants/querypipeline";
import { apiFetch } from "@/utils/apiFetch";
import { createVersionResolver } from "@/utils/version";
import genomicsService from "@/utils/services/genomics";

const querypipelineService = (fetch: typeof apiFetch = apiFetch) => {
  const { fetchPublicVersions } = genomicsService(fetch);
  const resolveVersion = createVersionResolver(fetchPublicVersions);

  const fetchSteps = async () => {
    return (
      (await fetch<QueryPipelineStep[]>("querypipelineservice", "/steps")) || []
    );
  };

  const submit = async (steps: QueryPipelineStep[], input: string) => {
    const version = await resolveVersion();
    const payload = new FormData();
    payload.append("steps", JSON.stringify(steps));
    payload.append("data", input);
    if (version) payload.append("version", version);
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
