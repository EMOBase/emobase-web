import { useState } from "react";

import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface GeneResult {
  fbgn: string;
  symbol: string;
  tcId?: string;
  ibId?: string;
  lethality11?: string;
  pupal11?: string;
}

interface ResultsTableProps {
  results: GeneResult[];
}

const ResultsTable: React.FC<ResultsTableProps> = ({ results }) => {
  const [filter, setFilter] = useState("");

  const filtered = results.filter(
    (r) =>
      r.fbgn.toLowerCase().includes(filter.toLowerCase()) ||
      r.symbol.toLowerCase().includes(filter.toLowerCase()),
  );

  return (
    <section className="space-y-4 pt-4 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold dark:text-white">Results</h2>
        <div className="relative w-full sm:w-64">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
            filter_list
          </span>
          <input
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white dark:bg-sidebar-dark border-slate-200 dark:border-slate-800 rounded-lg focus:ring-2 focus:ring-primary/20 transition-all"
            placeholder="Filter results..."
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white dark:bg-sidebar-dark border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 font-semibold border-b border-slate-200 dark:border-slate-800">
                <th className="px-6 py-4">FBgn</th>
                <th className="px-6 py-4">FB symbol</th>
                <th className="px-6 py-4">TC ID</th>
                <th className="px-6 py-4">iB ID</th>
                <th className="px-6 py-4 text-center">Lethality 11 (%)</th>
                <th className="px-6 py-4 text-center">Pupal 11 (%)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filtered.length > 0 ? (
                filtered.map((item, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="px-6 py-4 font-mono text-xs text-slate-900 dark:text-slate-300">
                      {item.fbgn}
                    </td>
                    <td className="px-6 py-4 italic text-slate-900 dark:text-slate-300">
                      {item.symbol}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.tcId || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {item.ibId || <span className="text-slate-400">—</span>}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.lethality11 || (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {item.pupal11 || (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-slate-500 italic"
                  >
                    No results found for your query or filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Items per page:</span>
            <select className="bg-transparent border-slate-300 dark:border-slate-700 rounded text-xs py-1 focus:ring-primary focus:border-primary">
              <option>10</option>
              <option>25</option>
              <option>50</option>
            </select>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
              {filtered.length > 0
                ? `1-${Math.min(10, filtered.length)} of ${filtered.length}`
                : "0-0 of 0"}
            </span>
            <div className="flex items-center gap-1">
              <button
                className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                disabled
              >
                <span className="material-symbols-outlined">first_page</span>
              </button>
              <button
                className="p-1 text-slate-400 hover:text-primary transition-colors disabled:opacity-30"
                disabled
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
              <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors">
                <span className="material-symbols-outlined">last_page</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <Button variant="primary">
          <Icon name="download" className="text-lg" />
          Download
        </Button>
      </div>
    </section>
  );
};

export default ResultsTable;
