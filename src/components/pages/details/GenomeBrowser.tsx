import { type TriboliumGene } from "@/utils/services/geneService";

type GenomeBrowserProps = {
  id: string;
  triboliumGene: TriboliumGene;
};

const GenomeBrowser: React.FC<GenomeBrowserProps> = ({ id }) => {
  return (
    <div id={id} className="h-[500px]">
      Genome browser
    </div>
  );
};

export default GenomeBrowser;
