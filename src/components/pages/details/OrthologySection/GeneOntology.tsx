import { useState } from "react";

import { type DrosophilaGene } from "@/utils/services/geneService";
type GeneOntologyProps = {
  gene: string;
  homologs: (DrosophilaGene & { source: string[] })[];
};

const terms = [
  {
    id: "GO:0009798",
    name: "axis specification",
    category: "Biological Process",
  },
  {
    id: "GO:0048699",
    name: "generation of neurons",
    category: "Biological Process",
  },
  {
    id: "GO:0007179",
    name: "transforming growth factor beta receptor signaling pathway",
    category: "Biological Process",
  },
  {
    id: "GO:0008285",
    name: "negative regulation of cell proliferation",
    category: "Biological Process",
  },
];

const categories = [
  "Biological Process",
  "Molecular Function",
  "Cellular Component",
] as const;

const GeneOntology: React.FC<GeneOntologyProps> = ({ gene }) => {
  const [activeTab, setActiveTab] = useState<(typeof categories)[number]>(
    categories[0],
  );

  return (
    <div
      id="ortholog-gene-ontology"
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          Gene Ontology terms for: {gene}
        </h4>
      </div>

      <div className="flex flex-col md:flex-row min-h-[300px]">
        {/* Tab Sidebar */}
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/30 p-4 space-y-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider rounded-md rounded-l-xs transition-all ${
                activeTab === cat
                  ? "text-gray-900 bg-white shadow-sm border-l-4 border-primary"
                  : "text-gray-400 hover:text-primary hover:bg-white/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6">
          <div className="space-y-2">
            {terms.length > 0 ? (
              terms.map((term) => (
                <a
                  key={term.id}
                  href={`https://amigo.geneontology.org/amigo/term/${term.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between p-3 bg-white border border-gray-100 rounded-lg hover:border-primary/30 hover:bg-gray-50 transition-all"
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-800">
                      {term.name}
                    </span>
                    <span className="text-[10px] font-mono text-gray-400">
                      {term.id}
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 group-hover:text-primary text-[18px]">
                    open_in_new
                  </span>
                </a>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <span className="material-symbols-outlined text-gray-300 text-[40px] mb-2">
                  sentiment_neutral
                </span>
                <p className="text-gray-400 text-sm">
                  No terms found for this category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneOntology;
