import { useState } from "react";

import { Icon } from "@/components/ui/icon";

import HomologTable from "./HomologTable";
import GeneOntology from "./GeneOntology";
import type { Homolog } from "./types";

type OrthologySectionProps = {
  id: string;
  gene: string;
  homologs: Homolog[];
};

const OrthologySection: React.FC<OrthologySectionProps> = ({
  id,
  homologs,
}) => {
  const [selectedHomolog, setSelectedHomolog] = useState<Homolog | null>(
    homologs[0] ?? null,
  );

  return (
    <div id={id}>
      <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
        <Icon name="group_work" className="text-primary" />
        Closest Fly Homologs
      </h2>
      <HomologTable homologs={homologs} onViewGO={setSelectedHomolog} />
      {selectedHomolog && <GeneOntology homolog={selectedHomolog} />}
    </div>
  );
};

export default OrthologySection;
