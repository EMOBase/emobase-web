import { Icon } from "@/components/ui/icon";
import GeneFavoriteMark from "@/components/common/GeneFavoriteMark";
import CopyButton from "@/components/common/CopyButton";
import { type TriboliumGene } from "@/utils/services/geneService";

import ViewSequencesButton from "./ViewSequencesButton";

type GeneOverviewProps = {
  id: string;
  gene: string;
  triboliumGene: TriboliumGene;
};

const GeneOverview: React.FC<GeneOverviewProps> = ({
  id: sectionId,
  gene,
  triboliumGene,
}) => {
  const { seqname, start, end, id, mRNAs, CDS, proteins } = triboliumGene;
  const genomicLocation = `${seqname}:${start}..${end}`;

  const sequencesButtons = [
    {
      text: "mRNA sequences",
      title: `${id} mRNAs`,
      sequences: mRNAs,
      icon: "data_object",
    },
    {
      text: "Coding sequences",
      title: `${id} CDS`,
      sequences: CDS,
      icon: "code",
    },
    {
      text: "Protein sequences",
      title: `${id} Proteins`,
      sequences: proteins,
      icon: "biotech",
    },
  ];

  const links = [
    {
      label: "BeetleAtlas Expression",
      icon: "open_in_new",
      href: `https://motif.mvls.gla.ac.uk/BeetleAtlas/?search=gene&gene=${gene}&idtype=geneID`,
    },
    {
      label: "OrthoDB Orthologs",
      icon: "open_in_new",
      href: `http://www.orthodb.org/?query=${gene}`,
    },
  ];

  return (
    <div
      id={sectionId}
      className="flex flex-col gap-4 border-b border-slate-200 pb-8"
    >
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
            <CopyButton icon content={gene} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 mt-4">
            Genomic Location
          </span>
          <div className="flex items-center gap-2">
            <Icon name="dns" className="text-neutral-400 text-xl" />
            <a
              href={`/genomebrowser/?loc=${genomicLocation}`}
              className="text-neutral-700 dark:text-neutral-300 hover:text-primary font-mono text-sm font-medium"
            >
              {genomicLocation}
            </a>
            <CopyButton icon content={genomicLocation} />
          </div>
        </div>
        <div className="md:col-span-3">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            View Info
          </span>
          <div className="flex flex-col gap-2 text-sm">
            {sequencesButtons.map((props) => (
              <ViewSequencesButton key={props.text} {...props} />
            ))}
          </div>
        </div>
        <div className="md:col-span-4">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-400 block mb-2">
            Quick Links
          </span>
          <div className="flex flex-col gap-2 text-sm">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                className="flex items-center gap-2 text-neutral-600 hover:text-primary transition-colors dark:text-neutral-400 dark:hover:text-primary"
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

export default GeneOverview;
