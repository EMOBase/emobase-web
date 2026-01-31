import { Icon } from "@/components/ui/icon";
import { type IBDsRNA } from "@/utils/constants/ibeetle";
import { type Phenotype } from "@/utils/constants/phenotype";

import WorkflowPupalButton from "./WorkflowPupalButton";
import WorkflowLarvaButton from "./WorkflowLarvaButton";

type IBScreenProps = {
  id: string;
  title: string;
  dsrna: IBDsRNA;
  phenotypes: Phenotype[];
};

const IBScreen: React.FC<IBScreenProps> = ({ id, title, phenotypes }) => {
  console.log({ phenotypes });

  return (
    <div id={id}>
      <div className="flex flex-col gap-2 mb-4">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="biotech" weight={500} className="text-primary" />
          {title}
        </h2>
        <div className="flex gap-2">
          <WorkflowPupalButton />
          <WorkflowLarvaButton />
        </div>
      </div>

      <div>Section content</div>
    </div>
  );
};

export default IBScreen;
