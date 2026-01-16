import { Icon } from "@/components/ui/icon";
import GeneFavoriteMark from "@/components/common/GeneFavoriteMark";

type GeneHeaderProps = {
  gene: string;
};

const GeneHeader: React.FC<GeneHeaderProps> = ({ gene }) => {
  return (
    <div className="flex flex-col gap-4 border-b border-slate-200 pb-8">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-bold text-slate-900 font-display tracking-tight">
              {gene}
            </h1>
            <GeneFavoriteMark gene={gene} className="text-3xl" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5 bg-neutral-50 rounded-xl border border-neutral-200 dark:bg-neutral-900/50 dark:border-neutral-800">
        <div className="md:col-span-5 flex flex-col gap-1">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Gene Identifier
          </span>
          <div className="flex items-center gap-2">
            <Icon name="fingerprint" className="text-neutral-400 text-xl" />
            <span className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300">
              {gene}
            </span>
            <button className="text-neutral-400 hover:text-primary transition-colors">
              <Icon name="content_copy" className="text-base" />
            </button>
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-4">
            Genomic Location
          </span>
          <div className="flex items-center gap-2">
            <Icon name="dns" className="text-neutral-400 text-xl" />
            <span className="font-mono text-sm font-medium text-neutral-700 dark:text-neutral-300">
              NC_007420.3:8101361..8105747
            </span>
            <button className="text-neutral-400 hover:text-primary transition-colors">
              <Icon name="content_copy" className="text-base" />
            </button>
          </div>
        </div>
        <div className="md:col-span-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            View Info
          </span>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: "mRNA Sequences", icon: "data_object" },
              { label: "Coding Sequences", icon: "code" },
              { label: "Protein Sequences", icon: "biotech" },
            ].map((link) => (
              <a
                key={link.label}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
                href="#"
              >
                <Icon name={link.icon} className="text-base" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Quick Links
          </span>
          <div className="flex flex-col gap-2 text-sm">
            {[
              { label: "BeetleAtlas Expression", icon: "open_in_new" },
              { label: "OrthoDB Orthologs", icon: "open_in_new" },
            ].map((link) => (
              <a
                key={link.label}
                className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
                href="#"
              >
                <Icon name={link.icon} className="text-base" />
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneHeader;
