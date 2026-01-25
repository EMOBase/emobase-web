import { useEffect } from "react";

import { Icon } from "@/components/ui/icon";
import useAsyncData from "@/hooks/useAsyncData";
import { fetchByGenes } from "@/utils/services/goAnnotationService";

import AnnotationList from "./AnnotationList";
import ProposeTermButton from "./ProposeTermButton";
import useGOAnnotations from "./useGOAnnotations";

type GOAnnotationCRUDProps = {
  id: string;
  title: string;
  gene: string;
};

const GOAnnotationCRUD: React.FC<GOAnnotationCRUDProps> = ({
  id,
  title,
  gene,
}) => {
  const { data, loading } = useAsyncData(() => fetchByGenes([gene]));

  const annotations = useGOAnnotations((state) => state.data);
  const setAnnotations = useGOAnnotations((state) => state.setData);

  useEffect(() => {
    if (data) setAnnotations(data);
  }, [data]);

  return (
    <div id={id}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="font-display text-2xl font-semibold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="account_tree" weight={500} className="text-primary" />
          {title}
        </h2>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white dark:bg-neutral-800 rounded-md text-xs font-medium text-neutral-600 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700">
          Gene Ontology terms for{" "}
          <span className="font-bold text-primary">{gene}</span>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-8">
          <AnnotationList loading={loading} annotations={annotations} />
          <div className="mt-7 pt-6 border-t border-neutral-100 dark:border-neutral-800">
            <ProposeTermButton gene={gene} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default GOAnnotationCRUD;
