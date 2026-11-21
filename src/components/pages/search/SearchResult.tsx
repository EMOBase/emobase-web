import React, { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ExternalGeneLink from "@/components/common/ExternalGeneLink";
import IBBGeneId from "@/components/common/IBBGeneId";
import {
  type AssemblyVersion,
  type GeneSearchResult,
} from "@/utils/services/genomics";
import { type PhenotypeSearchResult } from "@/utils/services/phenotypeService";
import { mainSpecies } from "@/utils/mainSpecies";
import {
  findAssemblyForSpecies,
  getMainSpeciesShortName,
  speciesShortName,
} from "@/utils/species";

import NothingFound from "./NothingFound";
import SearchResultByOrthology from "./SearchResultByOrthology";
import SearchResultByPhenotype from "./SearchResultByPhenotype";

const EmptyContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 shadow-sm min-h-[400px] flex items-center justify-center">
      <p className="text-slate-400 font-medium">{children}</p>
    </div>
  );
};

type SearchResultProps = {
  term: string;
  orthologyData: GeneSearchResult;
  phenotypeData: PhenotypeSearchResult;
  assemblies?: AssemblyVersion[];
  version?: string;
};

const SearchResult: React.FC<SearchResultProps> = ({
  term,
  orthologyData,
  phenotypeData: defaultPhenotypeData,
  assemblies,
  version,
}) => {
  const [phenotypeData, setPhenotypeData] =
    useState<PhenotypeSearchResult>(defaultPhenotypeData);

  const orthologies = orthologyData.orthologies;
  const otherGenes = orthologyData.otherGenes;

  const phenotypeBadge = phenotypeData.total || 0;
  const orthologyBadge = (orthologies?.length || 0) + (otherGenes?.length || 0);

  // The old "Found X genes ... which have no orthologous gene in Y" layout
  // needs a single non-main species and the main species' short name from the
  // API. When either is missing, keep the generic species-labelled list.
  const otherSpecies = new Set((otherGenes ?? []).map((g) => g.species));
  const singleOtherSpecies =
    otherSpecies.size === 1 ? [...otherSpecies][0] : undefined;
  const mainSpeciesShortName = getMainSpeciesShortName(assemblies);
  const legacyOtherSpecies =
    singleOtherSpecies &&
    singleOtherSpecies !== mainSpecies &&
    mainSpeciesShortName
      ? singleOtherSpecies
      : undefined;

  if (orthologyBadge === 0 && phenotypeBadge === 0) {
    return <NothingFound term={term} version={version} />;
  }

  return (
    <Tabs defaultValue={phenotypeBadge > 0 ? "phenotype" : "orthology"}>
      <TabsList>
        <TabsTrigger value="orthology" badge={orthologyBadge}>
          By Orthology
        </TabsTrigger>
        <TabsTrigger value="phenotype" badge={phenotypeBadge}>
          By Phenotype
        </TabsTrigger>
      </TabsList>

      <TabsContent value="orthology">
        {orthologies && orthologies.length ? (
          <SearchResultByOrthology
            orthologies={orthologies}
            assemblies={assemblies}
            version={version}
          />
        ) : otherGenes && otherGenes.length ? (
          legacyOtherSpecies ? (
            <div className="flex flex-col gap-3 text-slate-700">
              <p>
                Found{" "}
                <i className="font-medium italic">
                  {speciesShortName(assemblies, legacyOtherSpecies)}
                </i>{" "}
                genes:
              </p>
              <div className="flex flex-wrap items-center gap-3">
                {otherGenes.map(({ gene, species }) => (
                  <ExternalGeneLink
                    key={`${species}:${gene}`}
                    gene={gene}
                    species={species}
                    assemblyInfoUrl={
                      findAssemblyForSpecies(assemblies, species)?.infoUrl
                    }
                    version={version}
                  />
                ))}
              </div>
              <p>
                which have no orthologous gene in{" "}
                <i className="font-medium italic">{mainSpeciesShortName}</i>.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 text-slate-700">
              <p>Found genes:</p>
              <div className="flex flex-wrap items-center gap-3">
                {otherGenes.map(({ gene, species }) => (
                  <div
                    key={`${species}:${gene}`}
                    className="flex items-center gap-1"
                  >
                    {species === mainSpecies ? (
                      <IBBGeneId gene={gene} />
                    ) : (
                      <ExternalGeneLink
                        gene={gene}
                        species={species}
                        assemblyInfoUrl={
                          findAssemblyForSpecies(assemblies, species)?.infoUrl
                        }
                        version={version}
                      />
                    )}
                    <span className="text-slate-500 text-sm">
                      ({speciesShortName(assemblies, species)})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )
        ) : (
          <EmptyContent>No results found searching by orthology</EmptyContent>
        )}
      </TabsContent>
      <TabsContent value="phenotype">
        {phenotypeData.total > 0 ? (
          <SearchResultByPhenotype
            term={term}
            phenotypeData={phenotypeData}
            setPhenotypeData={setPhenotypeData}
          />
        ) : (
          <EmptyContent>No results found searching by phenototype</EmptyContent>
        )}
      </TabsContent>
    </Tabs>
  );
};

export default SearchResult;
