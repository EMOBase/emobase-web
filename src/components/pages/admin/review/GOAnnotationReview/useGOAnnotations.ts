import { useState, useEffect } from "react";

import type { GOAnnotation } from "@/utils/constants/goannotation";
import goAnnotationService from "@/utils/services/goAnnotationService";
import useService from "@/hooks/useService";

const useGOAnnotations = () => {
  const [loading, setLoading] = useState(true);
  const [goAnnotations, setGOAnnotations] = useState<GOAnnotation[]>([]);
  const { fetchForInternalReview, update } = useService(goAnnotationService);

  useEffect(() => {
    fetchForInternalReview().then((anns) => {
      setGOAnnotations(anns);
      setLoading(false);
    });
  }, []);

  const removeGOAnnotations = (ids: string[]) => {
    setGOAnnotations((current) =>
      current.filter((item) => !ids.includes(item.id)),
    );
  };

  const markAsInternal = async (ids: string[]) => {
    const items = ids.map((id) => ({ id, status: "INTERNAL" }) as const);

    return update(items).then(() => removeGOAnnotations(ids));
  };

  const markAsDeleted = async (ids: string[]) => {
    const items = ids.map((id) => ({ id, status: "TO_BE_DELETED" }) as const);

    return update(items).then(() => removeGOAnnotations(ids));
  };

  return {
    data: goAnnotations,
    loading,
    accept: markAsInternal,
    discard: markAsDeleted,
  };
};

export default useGOAnnotations;
