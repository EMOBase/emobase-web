import { useState } from "react";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { type GOAnnotation } from "@/utils/constants/goannotation";

import type { Homolog } from "./types";

const aspects = [
  { id: "P", title: "Biological Process" },
  { id: "F", title: "Molecular Function" },
  { id: "C", title: "Cellular Component" },
] as const;

type TabId = (typeof aspects)[number]["id"];

const sorted = (annos: GOAnnotation[]) => {
  return [...annos].sort((a, b) => {
    const aName = a.term.name;
    const bName = b.term.name;
    if (aName > bName) {
      return 1;
    } else if (aName < bName) {
      return -1;
    } else {
      return 0;
    }
  });
};

const uniq = (annos: GOAnnotation[]) => {
  const res: GOAnnotation[] = [];
  sorted(annos).forEach((anno, idx, arr) => {
    if (idx === 0 || anno.term.name !== arr[idx - 1].term.name) {
      res.push(anno);
    }
  });
  return res;
};

type GeneOntologyProps = {
  homologs: Homolog[];
  selectedHomolog: Homolog;
  onSelectHomolog: (h: Homolog | null) => void;
};

const GeneOntology: React.FC<GeneOntologyProps> = ({
  homologs,
  selectedHomolog,
  onSelectHomolog,
}) => {
  const [activeTab, setActiveTab] = useState<TabId>(aspects[0].id);

  const annotationMap = selectedHomolog.annotations.reduce(
    (acc, item) => {
      if (item.term.aspect && Object.keys(acc).includes(item.term.aspect)) {
        acc[item.term.aspect].push(item);
      }
      return acc;
    },
    {
      P: [],
      F: [],
      C: [],
    } as Record<TabId, GOAnnotation[]>,
  );

  const tabAnns = uniq(annotationMap[activeTab]);

  return (
    <div
      id="ortholog-gene-ontology"
      className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden"
    >
      <div className="bg-gray-50/50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <h4 className="text-[10px] font-bold text-gray-900 uppercase tracking-widest flex items-center gap-2">
          Gene Ontology terms for:
          <Select
            value={selectedHomolog.id}
            onValueChange={(v) =>
              onSelectHomolog(homologs.find((h) => h.id === v) ?? null)
            }
          >
            <SelectTrigger className="rounded-xs border-none shadow-none font-display text-xs data-[size=default]:h-auto py-0.5 pl-1.5 pr-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {homologs.map(({ id }) => (
                <SelectItem key={id} value={id}>
                  {id}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </h4>
      </div>

      <div className="flex flex-col md:flex-row min-h-[300px]">
        <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200 bg-gray-50/30 p-4 space-y-1">
          {aspects.map(({ id, title }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-[11px] font-bold uppercase tracking-wider rounded-md rounded-l-xs transition-all ${
                activeTab === id
                  ? "text-gray-900 bg-white shadow-sm border-l-4 border-primary"
                  : "text-gray-400 hover:text-primary hover:bg-white/50"
              }`}
            >
              {title}
            </button>
          ))}
        </div>

        <div className="flex-1 p-6 max-h-[80vh] overflow-y-auto">
          {tabAnns.length > 0 ? (
            <div className="space-y-2">
              {tabAnns.map(({ term }) => (
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
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center py-12">
              <p className="text-gray-400 text-sm">
                No terms found for this category
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GeneOntology;
