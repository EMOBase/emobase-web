import { Icon } from "@/components/ui/icon";

type GenomeBrowserProps = {
  id: string;
  children: React.ReactNode;
};

const GenomeBrowser: React.FC<GenomeBrowserProps> = ({ id, children }) => {
  return (
    <div id={id}>
      <h2 className="text-2xl font-display font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
        <Icon name="view_timeline" weight={500} className="text-primary" />
        Genome Browser
      </h2>
      {children}
    </div>
  );
};

export default GenomeBrowser;
