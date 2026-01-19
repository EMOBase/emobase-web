import type { GeneSearchResult } from "@/utils/services/geneService";
import { mainSpecies } from "@/utils/mainSpecies";
import { Icon } from "@/components/ui/icon";
import IBBGeneId from "@/components/common/IBBGeneId";
import FlybaseGeneId from "@/components/common/FlybaseGeneId";

type OrthologyList = Exclude<GeneSearchResult["orthologies"], undefined>;

type SearchResultByOrthologyProps = {
  orthologies: OrthologyList;
};

const SearchResultByOrthology: React.FC<SearchResultByOrthologyProps> = ({
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
                <th
                  key={s}
                  className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider"
                >
                  {speciesDisplay(s)} homologs
                </th>
              ))}
              <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Link to tree
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-100">
            {orthologies.map(({ group, source, orthologs }, index) => (
              <tr
                key={index}
                className="hover:bg-orange-50/30 transition-colors group [&>td]:align-top"
              >
                <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slate-900">
                  {source}
                </td>
                {orthologs.map(({ species, genes }, index) => (
                  <td
                    key={index}
                    className="px-6 py-5 whitespace-nowrap text-sm"
                  >
                    <div className="grid xl:grid-cols-2 gap-x-4 gap-y-2 w-fit">
                      {genes.map(({ gene, synonyms }) => (
                        <div key={gene} className="flex items-center gap-1">
                          {species === mainSpecies ? (
                            <IBBGeneId gene={gene} />
                          ) : species === "Dmel" ? (
                            <FlybaseGeneId gene={gene} />
                          ) : (
                            <span>{gene}</span>
                          )}
                          {synonyms.length > 0 && (
                            <span className="text-slate-500">
                              ({synonyms.join(", ")})
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
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
                        <Icon
                          name="open_in_new"
                          className="text-xl text-slate-400"
                        />
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
          Showing {orthologies.length} results based on orthology search.
        </span>
      </div>
    </div>
  );
};

export default SearchResultByOrthology;
