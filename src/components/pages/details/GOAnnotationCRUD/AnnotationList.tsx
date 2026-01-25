import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import BeetleLoading from "@/components/common/BeetleLoading";
import type { GOAnnotation } from "@/utils/constants/goannotation";

const getLinkEvidence = (annotation: GOAnnotation) => {
  if (annotation.evidence) {
    return "http://geneontology.org/docs/guide-go-evidence-codes/";
  }
};

const getPmid = (annotation: GOAnnotation) => {
  return annotation.reference
    .split("|")
    .filter((r) => r.startsWith("PMID:"))[0]
    ?.split(":")[1];
};

const getLinkReference = (annotation: GOAnnotation) => {
  const pmid = getPmid(annotation);

  if (pmid) {
    return `https://pubmed.ncbi.nlm.nih.gov/${pmid}`;
  }
};

const getLinkGeneOntologyTerm = (annotation: GOAnnotation) => {
  if (annotation.term.id) {
    return `http://amigo.geneontology.org/amigo/term/${annotation.term.id}`;
  }
};

type AnnotationListProps = {
  loading: boolean;
  annotations: GOAnnotation[];
};

const AnnotationList: React.FC<AnnotationListProps> = ({
  loading,
  annotations,
}) => {
  if (loading) {
    return (
      <div className="relative h-40">
        <BeetleLoading title="Getting Data" />
      </div>
    );
  }

  if (annotations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-40">
        <Icon name="search_off" className="text-neutral-300 text-5xl mb-4" />
        <p className="text-neutral-400 text-sm">
          No ontology terms found for this gene.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {annotations.map((annotation) => {
        const isReviewed = annotation.status === "INTERNAL";

        return (
          <div key={annotation.id} className="group">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <a
                href={getLinkGeneOntologyTerm(annotation)}
                target="_blank"
                className="group/link inline-flex flex items-center gap-2 hover:text-primary transition-colors"
              >
                <span className="text-base font-bold">
                  {annotation.term.id}
                </span>
                <span className="text-base font-medium text-neutral-800 group-hover/link:text-primary/90 dark:text-neutral-200">
                  - {annotation.term.name}
                </span>
                <Icon name="open_in_new" className="text-lg text-neutral-400" />
              </a>

              <div className="flex items-center gap-2 ml-2">
                <a
                  href={getLinkEvidence(annotation)}
                  target="_blank"
                  className="flex items-center gap-0.5 px-2 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400 border border-neutral-200 dark:border-neutral-700"
                >
                  {annotation.evidence}{" "}
                  <Icon name="open_in_new" className="text-xs" />
                </a>
                <span
                  className={twMerge(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-tight border",
                    isReviewed
                      ? "bg-green-50 text-green-600 border-green-100"
                      : "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-500 border-amber-100 dark:border-amber-900/30",
                  )}
                >
                  {isReviewed ? "REVIEWED" : annotation.status}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 pl-4">
              {annotation.quotation && (
                <div className="flex items-center gap-2">
                  <Icon
                    name="keyboard_double_arrow_right"
                    className="text-base"
                  />
                  <span>{annotation.quotation}</span>
                  <Icon
                    name="keyboard_double_arrow_left"
                    className="text-base"
                  />
                </div>
              )}
              <a
                href={getLinkReference(annotation)}
                target="_blank"
                className="group/link flex items-center gap-1"
              >
                <span className="group-hover/link:text-primary cursor-pointer transition-colors">
                  PMID:{getPmid(annotation)}
                </span>
                <Icon name="open_in_new" className="text-sm" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnnotationList;
