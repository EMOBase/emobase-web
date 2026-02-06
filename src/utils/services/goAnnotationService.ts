import type {
  GOAnnotation,
  GOAnnotationInput,
  GOAnnotationUpdate,
} from "@/utils/constants/goannotation";
import { apiFetch } from "@/utils/apiFetch";

const goAnnotationService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchByGenes = async (genes: string[]) => {
    if (genes.length === 0) return [];

    const concatenatedGenes = genes.join(",");
    return (
      (await fetch<GOAnnotation[]>(
        "goannotationservice",
        `/go-annotations/by-genes/${concatenatedGenes}`,
      )) || []
    );
  };

  const create = async (goAnnotation: GOAnnotationInput) => {
    const { pmid, ...rest } = goAnnotation;
    return await fetch<GOAnnotation>(
      "goannotationservice",
      "/go-annotations/unreviewed",
      {
        method: "POST",
        body: {
          ...rest,
          reference: `PMID:${pmid}`,
        },
      },
    );
  };

  const update = async (goAnnotations: GOAnnotationUpdate[]) => {
    if (goAnnotations.length === 0) return;
    await fetch<void>("goannotationservice", `/go-annotations`, {
      method: "PUT",
      body: goAnnotations,
    });
  };

  const fetchForInternalReview = () =>
    fetch<GOAnnotation[]>(
      "goannotationservice",
      "/go-annotations/for-internal-review",
    );

  const fetchForOfficialSubmission = () =>
    fetch<string>(
      "goannotationservice",
      "/go-annotations/for-official-submission",
    );

  return {
    fetchByGenes,
    create,
    update,
    fetchForInternalReview,
    fetchForOfficialSubmission,
  };
};

export default goAnnotationService;
