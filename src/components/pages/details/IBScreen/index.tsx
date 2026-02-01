import { Icon } from "@/components/ui/icon";
import { type IBDsRNA } from "@/utils/constants/ibeetle";
import { type Phenotype } from "@/utils/constants/phenotype";

import WorkflowPupalButton from "./WorkflowPupalButton";
import WorkflowLarvaButton from "./WorkflowLarvaButton";
import Lethalities from "./Lethalities";

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
  console.log({ phenotypes });

  return (
    <div id={id}>
      <div className="flex flex-col gap-2 mb-5">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="biotech" weight={500} className="text-primary" />
          {title}
        </h2>
        <div className="flex gap-2">
          <WorkflowPupalButton />
          <WorkflowLarvaButton />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-neutral-200 dark:bg-neutral-900 dark:border-neutral-800 overflow-hidden mb-6 shadow-sm">
        <div className="p-6">
          <Lethalities dsrnaId={dsrna.id} />
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <a
              className="group/link text-sm text-primary flex items-center gap-1"
              href="#"
            >
              <Icon name="chevron_left" className="text-lg" />
              <span className="group-hover/link:underline">
                View left primer
              </span>
            </a>
            <span className="text-neutral-300">|</span>
            <a
              className="group/link text-sm text-primary flex items-center gap-1"
              href="#"
            >
              <Icon name="genetics" className="text-base" />
              <span className="group-hover/link:underline">
                View dsRNA sequence
              </span>
            </a>
            <span className="text-neutral-300">|</span>
            <a
              className="group/link text-sm text-primary flex items-center gap-1"
              href="#"
            >
              <span className="group-hover/link:underline">
                View right primer
              </span>
              <Icon name="chevron_right" className="text-lg" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IBScreen;
