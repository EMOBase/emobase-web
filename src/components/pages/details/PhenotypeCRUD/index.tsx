import { Icon } from "@/components/ui/icon";
import type { Phenotype } from "@/utils/constants/phenotype";
import type { IBDsRNA } from "@/utils/constants/ibeetle";

import AddPhenotypeButton from "./AddPhenotypeButton";

type PhenotypeCRUDProps = {
  id: string;
  title: string;
  gene: string;
  phenotypes: Phenotype[];
  dsRNAs: IBDsRNA[];
};

const PhenotypeCRUD: React.FC<PhenotypeCRUDProps> = ({
  id,
  title,
  gene,
  phenotypes,

  dsRNAs,
}) => {
  return (
    <div id={id}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2">
          <Icon name="biotech" weight={500} className="text-primary" />
          {title}
        </h2>
        <AddPhenotypeButton gene={gene} dsRNAs={dsRNAs} />
      </div>

      <div>Phenotype list</div>
    </div>
  );
};

export default PhenotypeCRUD;
