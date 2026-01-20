import { Icon } from "@/components/ui/icon";
import { type TriboliumGene } from "@/utils/services/geneService";

import JBrowseGenomeView from "./JBrowseGenomeView";

type GenomeBrowserProps = {
  id: string;
  triboliumGene: TriboliumGene;
};

const GenomeBrowser: React.FC<GenomeBrowserProps> = ({ id, triboliumGene }) => {
  const { seqname, start, end } = triboliumGene;
  const genomicLocation = `${seqname}:${start}..${end}`;

  return (
    <div id={id}>
      <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
        <Icon name="view_timeline" className="text-primary" />
        Genome Browser
      </h2>
      <JBrowseGenomeView location={genomicLocation} />
    </div>
  );
};

export default GenomeBrowser;
