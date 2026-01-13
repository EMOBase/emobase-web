import React from "react";
import {
  Columns,
  ArrowLeftRight,
  GitBranch,
  FolderOpen,
  ArrowRight,
} from "lucide-react";

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  icon,
  title,
  description,
  color,
}) => (
  <a
    href="#"
    className="group bg-white p-8 rounded-2xl border border-slate-100 shadow-card hover:shadow-xl hover:shadow-orange-500/5 hover:border-primary/30 transition-all duration-300"
  >
    <div
      className={`size-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${color}`}
    >
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 font-display group-hover:text-primary transition-colors">
      {title}
    </h3>
    <p className="text-slate-500 leading-relaxed">{description}</p>
    <div className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0">
      Launch Tool <ArrowRight size={16} className="ml-1" />
    </div>
  </a>
);

const ToolCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ToolCard
        icon={<Columns size={28} />}
        title="Genome Browser (Tcas5.2)"
        description="Interactive exploration of gene structure, expression patterns, and chromatin data based on the Tcas5.2 assembly."
        color="bg-orange-50 text-primary"
      />
      <ToolCard
        icon={<ArrowLeftRight size={28} />}
        title="ID Conversion Pipeline"
        description="Seamlessly convert lists of gene IDs between Drosophila (fly) and Tribolium (beetle) orthologs."
        color="bg-blue-50 text-blue-600"
      />
      <ToolCard
        icon={<GitBranch size={28} />}
        title="Ontology Viewer"
        description="Browse the Tribolium morphological ontology (TrOn) to understand phenotype classifications and relationships."
        color="bg-purple-50 text-purple-600"
      />
      <ToolCard
        icon={<FolderOpen size={28} />}
        title="External Resources"
        description="Access gene sets, genome assemblies for download, links to resources, and community information."
        color="bg-emerald-50 text-emerald-600"
      />
    </section>
  );
};

export default ToolCards;
