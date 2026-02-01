import { Fragment } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import PenetranceBadge from "@/components/common/PenetranceBadge";
import ImageHolder from "@/components/common/ImageHolder";
import type { IBExperiment } from "@/utils/constants/ibeetle";
import type { Phenotype } from "@/utils/constants/phenotype";
import { IBEETLE_TOPICS } from "@/utils/constants/ibeetle";

type PhenotypeListProps = {
  phenotypes: Phenotype[];
  experiment: IBExperiment;
};

const PhenotypeList: React.FC<PhenotypeListProps> = ({
  phenotypes,
  experiment,
}) => {
  const topics = [
    ...IBEETLE_TOPICS.filter((t) => t.experimentId === experiment.id),
    { id: "_no_id", name: "Other" },
  ];

  const phenotypesByTopic: Record<string, Phenotype[]> = {};
  topics.forEach((topic) => {
    phenotypesByTopic[topic.id] = [];
  });

  (phenotypes || []).forEach((o) => {
    if (!o.iBeetleTopic) {
      phenotypesByTopic._no_id.push(o);
    } else {
      phenotypesByTopic[o.iBeetleTopic].push(o);
    }
  });

  const topicsWithData = topics.filter(
    (t) => phenotypesByTopic[t.id].length > 0,
  );

  return (
    <Collapsible
      defaultOpen
      className="border border-neutral-200 rounded-xl overflow-hidden dark:border-neutral-800 shadow-sm"
    >
      <CollapsibleTrigger className="group w-full flex items-center justify-between p-4 bg-neutral-50 hover:bg-neutral-100 transition-colors text-left dark:bg-neutral-800 dark:hover:bg-neutral-700">
        <span className="font-bold text-neutral-900 dark:text-white">
          {experiment.displayName}
        </span>
        <span className="material-symbols-outlined text-neutral-500 group-data-[state=open]:rotate-180">
          expand_less
        </span>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-6 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-800">
        {topicsWithData.map((topic, index) => (
          <div
            key={topic.id}
            className={index === topicsWithData.length - 1 ? "mb-2" : "mb-8"}
          >
            <h4 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3">
              {topic.name}
            </h4>
            <ul className="flex flex-col gap-3 text-sm text-neutral-700 dark:text-neutral-300">
              {phenotypesByTopic[topic.id]
                .sort(
                  (a, b) =>
                    (a.dayPostInjection || -1) - (b.dayPostInjection || -1),
                )
                .map((p) => (
                  <Fragment key={p.id}>
                    <li className="flex items-center gap-2">
                      <span className="size-1.5 rounded-full bg-neutral-600"></span>
                      {p.description}
                      <span className="inline-flex gap-1">
                        <Tooltip>
                          <TooltipTrigger>
                            <PenetranceBadge value={p.penetrance} />
                          </TooltipTrigger>
                          <TooltipContent>
                            {(p.penetrance ?? 0) * 100 +
                              "% of 10 injected animals showed this phenotype"}
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded border border-neutral-200">
                              day {p.dayPostInjection}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            The phenotype was observed on day{" "}
                            {p.dayPostInjection} after the injection
                          </TooltipContent>
                        </Tooltip>
                      </span>
                      {(p.structures ?? []).map(
                        ({ termId }) =>
                          termId && (
                            <a
                              key={termId}
                              href={`/ontology?id=${termId?.replace(":", "_")}`}
                              className="text-xs text-primary font-medium hover:underline ml-0.5"
                            >
                              {termId}
                            </a>
                          ),
                      )}
                    </li>
                    {p.images && p.images.length > 0 && (
                      <div className="flex gap-2 mb-1">
                        <div className="size-1.5" />
                        <div className="grid grid-cols-2 gap-4 max-w-2xl">
                          {p.images.map((image) => (
                            <ImageHolder
                              key={image.id}
                              imageId={image.id}
                              status={image.status}
                            />
                          ))}
                        </div>
                        <div className="size-1.5" />
                      </div>
                    )}
                  </Fragment>
                ))}
            </ul>
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
};

export default PhenotypeList;
