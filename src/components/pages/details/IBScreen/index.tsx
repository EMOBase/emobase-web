import { Icon } from "@/components/ui/icon";
import { type IBDsRNA } from "@/utils/constants/ibeetle";
import { type Phenotype } from "@/utils/constants/phenotype";
import { IBEETLE_EXPERIMENTS } from "@/utils/constants/ibeetle";

import WorkflowButtons from "./WorkflowButtons";
import Lethalities from "./Lethalities";
import SequenceList from "./SequenceList";
import PhenotypeList from "./PhenotypeList";

type IBScreenProps = {
  id: string;
  title: string;
  dsrna: IBDsRNA;
  phenotypes: Phenotype[];
};

const IBScreen: React.FC<IBScreenProps> = ({
  id,
  title,
  dsrna,
  phenotypes,
}) => {
  const phenotypesMap = phenotypes.reduce(
    (acc, p) => {
      const experimentId = p.iBeetleExperiment || "Unknown";
      if (acc[experimentId]) {
        acc[experimentId].push(p);
      } else {
        acc[experimentId] = [p];
      }
      return acc;
    },
    {} as Record<string, Phenotype[]>,
  );

  return (
    <div id={id}>
      <div className="flex flex-col gap-2 mb-5">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="biotech" weight={500} className="text-primary" />
          {title}
        </h2>
        <WorkflowButtons />
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <Lethalities dsrnaId={dsrna.id} />
          <SequenceList dsrna={dsrna} />
        </div>
      </div>

      <div className="space-y-6">
        {IBEETLE_EXPERIMENTS.map(
          (exp) =>
            phenotypesMap[exp.id] && (
              <PhenotypeList
                experiment={exp}
                phenotypes={phenotypesMap[exp.id]}
              />
            ),
        )}
      </div>
    </div>
  );
};

export default IBScreen;
