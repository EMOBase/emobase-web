import type {
  AssemblyVersion,
  GeneSearchResult,
} from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import ExternalGeneLink from "@/components/common/ExternalGeneLink";
import IBBGeneId from "@/components/common/IBBGeneId";
import { mainSpecies } from "@/utils/mainSpecies";
import { findAssemblyForSpecies, speciesShortName } from "@/utils/species";

type OrthologyList = Exclude<GeneSearchResult["orthologies"], undefined>;

type SearchResultByOrthologyProps = {
  orthologies: OrthologyList;
  assemblies?: AssemblyVersion[];
  version?: string;
};

const SearchResultByOrthology: React.FC<SearchResultByOrthologyProps> = ({
  orthologies,
  assemblies,
  version,
}) => {
  // A later group may contain a species the first group does not, so build the
  // column list from every group and render a cell for each column. Put the
  // deployment's main species first, then the others alphabetically.
  const allSpecies = [
    ...new Set(
      orthologies.flatMap((o) => o.orthologs.map((entry) => entry.species)),
    ),
  ].sort((a, b) => {
    if (a === mainSpecies) return -1;
    if (b === mainSpecies) return 1;
    return a.localeCompare(b);
  });

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
                  {speciesShortName(assemblies, s)} homologs
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
                {allSpecies.map((species) => {
                  const entry = orthologs.find(
                    (ortholog) => ortholog.species === species,
                  );
                  const assembly = findAssemblyForSpecies(assemblies, species);
                  return (
                    <td
                      key={species}
                      className="px-6 py-5 whitespace-nowrap text-sm"
                    >
                      {entry && entry.genes.length > 0 ? (
                        <div className="grid xl:grid-cols-2 gap-x-4 gap-y-2 w-fit">
                          {entry.genes.map(({ gene, synonyms }) => (
                            <div key={gene} className="flex items-center gap-1">
                              {species === mainSpecies ? (
                                <IBBGeneId gene={gene} />
                              ) : (
                                <ExternalGeneLink
                                  gene={gene}
                                  species={species}
                                  assemblyInfoUrl={assembly?.infoUrl}
                                  version={version}
                                />
                              )}
                              {synonyms.length > 0 && (
                                <span className="text-slate-500">
                                  ({synonyms.join(", ")})
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-300 italic">—</span>
                      )}
                    </td>
                  );
                })}
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
                          className="text-lg text-slate-400"
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
