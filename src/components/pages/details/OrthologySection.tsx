import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import FlyBaseGeneId from "@/components/common/FlyBaseGeneId";
import { type DrosophilaGene } from "@/utils/services/geneService";

type OrthologySectionProps = {
  id: string;
  gene: string;
  homologs: (DrosophilaGene & { source: string[] })[];
};

const OrthologySection: React.FC<OrthologySectionProps> = ({
  id,
  homologs,
}) => {
  const [selectedGene, setSelectedGene] = useState<string | null>(
    homologs[0]?.id ?? null,
  );

  return (
    <div id={id}>
      <h2 className="font-display text-2xl font-bold text-neutral-800 dark:text-white flex items-center gap-2 mb-4">
        <Icon name="group_work" className="text-primary" />
        Closest Fly Homologs
      </h2>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-widest text-[10px]">
                  Gene ID
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-widest text-[10px]">
                  Algorithms
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-widest text-[10px]">
                  Gene Symbol
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-widest text-[10px]">
                  Gene Name
                </th>
                <th className="px-6 py-4 font-bold text-gray-900 uppercase tracking-widest text-[10px] text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {homologs.length === 0 && (
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-slate-500 dark:text-slate-400 italic"
                >
                  No fly homologs found for this gene.
                </td>
              )}
              {homologs.map((h) => (
                <tr
                  key={h.id}
                  className={`transition-colors hover:bg-gray-50 border-l-4 border-transparent`}
                >
                  <td className="px-6 py-4">
                    <FlyBaseGeneId gene={h.id} className={`font-semibold`} />
                  </td>

                  <td className="px-6 py-4 text-gray-500 text-xs">
                    {h.source.join(", ")}
                  </td>
                  <td className="px-6 py-4 italic font-medium text-gray-800">
                    {h.symbol}
                  </td>
                  <td className="px-6 py-4 italic font-medium text-gray-800">
                    {h.fullname}
                  </td>
                  <td className="px-6 py-4 flex justify-end">
                    <button className="text-gray-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1">
                      View Ontology{" "}
                      <span className="material-symbols-outlined text-[16px]">
                        chevron_right
                      </span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default OrthologySection;
