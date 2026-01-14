import type { GeneSearchResult } from "@/utils/services/geneService";
import { mainSpecies } from "@/utils/mainSpecies";

type OrthologyList = Exclude<GeneSearchResult["orthologies"], undefined>;

const INITIAL_RESULTS = [
  {
    algorithm: "OrthoFinder",
    triboliumHomolog: "TC013553",
    drosophilaHomolog: "FBgn0001180",
    treeLink: null,
    starred: true,
  },
  {
    algorithm: "Eggnog6",
    triboliumHomolog: "TC013553",
    drosophilaHomolog: "FBgn0001180",
    treeLink: "EIZQT",
    starred: true,
  },
];

type GeneOrthologyTableProps = {
  orthologies: OrthologyList;
};
const GeneOrthologyTable: React.FC<GeneOrthologyTableProps> = ({
  orthologies,
}) => {
  const allSpecies = orthologies[0].orthologs.map((o) => o.species);

  const speciesDisplay = (species: string) => {
    if (species === "Tcas") return "Tribolium";
    if (species === "Dmel") return "Drosophila";
    return species;
  };

  return (
    <div className="bg-white rounded-xl shadow-card overflow-hidden border border-slate-200">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Algorithm
              </th>
              {allSpecies.map((s) => (
                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {speciesDisplay(s)} homologs
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Link to tree
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {orthologies.map(({ group, source, orthologs }, idx) => (
              <tr
                key={idx}
                className="hover:bg-orange-50/30 transition-colors group"
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900">
                  {source}
                </td>
                {orthologs.map(({ species, genes }) => (
                  <td className="px-6 py-5 whitespace-nowrap text-sm">
                    {species === mainSpecies ? (
                      <div className="flex items-center gap-2">
                        <a className="text-primary hover:text-primary-bold font-bold hover:underline decoration-primary decoration-2 underline-offset-2 cursor-pointer">
                          {genes[0].gene}
                        </a>
                        <span
                          className="material-symbols-outlined text-amber-400 text-lg"
                          style={{ fontVariationSettings: "'FILL' 1" }}
                        >
                          star
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1">
                        <a className="group/link text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 cursor-pointer">
                          <span className="group-hover/link:underline decoration-slate-700 underline-offset-2">
                            {genes[0].gene}
                          </span>
                          <span className="material-symbols-outlined text-sm text-slate-400">
                            open_in_new
                          </span>
                        </a>
                      </div>
                    )}
                  </td>
                ))}
                <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-500">
                  {source.toLowerCase() === "eggnog6" ? (
                    <div className="flex items-center gap-1">
                      <a
                        href={`http://eggnog6.embl.de/search/ogs/${group}/`}
                        target="_blank"
                        className="text-slate-700 hover:text-slate-900 transition-colors flex items-center gap-1 font-mono text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded cursor-pointer"
                      >
                        {group}
                        <span className="material-symbols-outlined text-sm text-slate-400">
                          open_in_new
                        </span>
                      </a>
                    </div>
                  ) : (
                    <span className="text-slate-300 italic">
                      No tree available
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Showing {INITIAL_RESULTS.length} results based on orthology search.
        </span>
      </div>
    </div>
  );
};

export default GeneOrthologyTable;
