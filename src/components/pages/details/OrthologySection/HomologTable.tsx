import FlybaseGeneId from "@/components/common/FlybaseGeneId";

import type { Homolog } from "./types";

type HomologTableProps = {
  homologs: Homolog[];
  onViewGO: (homolog: Homolog) => void;
};

const HomologTable: React.FC<HomologTableProps> = ({ homologs, onViewGO }) => {
  return (
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
              <tr key={h.id} className={`transition-colors hover:bg-gray-50`}>
                <td className="px-6 py-4">
                  <FlybaseGeneId gene={h.id} className={`font-semibold`} />
                </td>

                <td className="px-6 py-4 text-gray-500 text-xs">
                  {h.source.join(", ")}
                </td>
                <td className="px-6 py-4 italic font-medium text-gray-800">
                  {h.symbol}
                </td>
                <td className="px-6 py-4 font-medium text-gray-800">
                  {h.fullname}
                </td>
                <td className="px-6 py-4 flex justify-end">
                  <a
                    href="#ortholog-gene-ontology"
                    onClick={() => onViewGO(h)}
                    className="text-gray-400 hover:text-primary transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
                  >
                    View Ontology{" "}
                    <span className="material-symbols-outlined text-[16px]">
                      chevron_right
                    </span>
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HomologTable;
