import React from "react";
import { navigate } from "astro:transitions/client";
import {
  Columns,
  ArrowLeftRight,
  GitBranch,
  FolderOpen,
  ArrowRight,
} from "lucide-react";
import { twMerge } from "tailwind-merge";

import { Icon } from "@/components/ui/icon";
import { hasFeature } from "@/utils/features";
import { mainSpecies } from "@/utils/mainSpecies";

interface ToolCardProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;
  color: string;
  buttonText?: string;
}

const ToolCard: React.FC<ToolCardProps> = ({
  href,
  icon,
  title,
  description,
  color,
  buttonText = "Launch Tool",
}) => (
  <div
    onClick={() => {
      console.log("zo onClick");
      navigate(href);
    }}
    className={twMerge(
      "cursor-pointer group bg-white p-8 rounded-2xl border border-slate-100 shadow-card transition-all duration-300",
      "[&:hover:not(:has(a:hover))]:shadow-xl [&:hover:not(:has(a:hover))]:shadow-orange-500/5 [&:hover:not(:has(a:hover))]:border-primary/30",
      "[&:hover:not(:has(a:hover))>#hover-text]:opacity-100 [&:hover:not(:has(a:hover))>#hover-text]:translate-x-0",
    )}
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
    <div
      id="hover-text"
      className="mt-6 flex items-center text-sm font-bold text-primary opacity-0 transition-opacity -translate-x-2"
    >
      {buttonText} <ArrowRight size={16} className="ml-1" />
    </div>
  </div>
);

const ToolCards: React.FC = () => {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <ToolCard
        href="/genomebrowser"
        icon={<Columns size={28} />}
        title="Genome Browser"
        description={
          mainSpecies === "Tcas" ? (
            <span>
              Interactive exploration of Gene structure, expression patterns and
              chromatin data based on Tcas5.2 (
              <a
                href="https://doi.org/10.1186/s12864-019-6394-6"
                target="_blank"
                onClick={(e) => e.stopPropagation()}
                className="group/link text-primary whitespace-nowrap inline-flex items-center gap-1"
              >
                <span className="group-hover/link:underline underline-offset-2">
                  Herndon et al. 2020
                </span>
                <Icon name="open_in_new" className="text-lg text-slate-500" />
              </a>
              )
            </span>
          ) : (
            `Interactive exploration of gene structure, expression patterns, and chromatin data based on the ${mainSpecies} assembly.`
          )
        }
        color="bg-orange-50 text-orange-600/80"
      />
      {hasFeature("geneIdConverter") && (
        <ToolCard
          href="/querypipeline"
          icon={<ArrowLeftRight size={28} />}
          title="Gene ID Converter"
          description="Seamlessly convert lists of gene IDs between Drosophila (fly) and Tribolium (beetle) orthologs."
          color="bg-blue-50 text-blue-600"
        />
      )}
      {hasFeature("ontologyViewer") && (
        <ToolCard
          href="/ontology"
          icon={<GitBranch size={28} />}
          title="Ontology Viewer"
          description="Browse the Tribolium morphological ontology (TrOn) to understand phenotype classifications and relationships."
          color="bg-purple-50 text-purple-600"
        />
      )}
      <ToolCard
        href="/resources"
        icon={<FolderOpen size={28} />}
        title="Resources"
        description="Access gene sets, genome assemblies for download, links to resources, and community information."
        color="bg-emerald-50 text-emerald-600"
        buttonText="View Resources"
      />
    </section>
  );
};

export default ToolCards;
