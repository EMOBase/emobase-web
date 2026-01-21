import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import { type DrosophilaGene } from "@/utils/services/geneService";

import HomologTable from "./HomologTable";
import GeneOntology from "./GeneOntology";

type OrthologySectionProps = {
  id: string;
  gene: string;
  homologs: (DrosophilaGene & { source: string[] })[];
};

const OrthologySection: React.FC<OrthologySectionProps> = ({
  id,
  homologs,
}) => {
  const [selectedGene, setSelectedGene] = useState<string | null>(
    homologs[0]?.id ?? null,
  );

  return (
    <div id={id}>
      <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
        <Icon name="group_work" className="text-primary" />
        Closest Fly Homologs
      </h2>
      <HomologTable homologs={homologs} onViewGO={setSelectedGene} />
      {selectedGene && <GeneOntology homologs={homologs} gene={selectedGene} />}
    </div>
  );
};

export default OrthologySection;
