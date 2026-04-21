import { useEffect, useState, useMemo } from "react";
import { type TriboliumGene } from "@/utils/services/geneService";
import { mainSpecies } from "@/utils/mainSpecies";
import { getEnv } from "@/utils/env";
import assembly from "@/utils/config/genomebrowser/assembly.json";
import tracks from "@/utils/config/genomebrowser/tracks.json";
import defaultSession from "@/utils/config/genomebrowser/default_session.json";
import configuration from "@/utils/config/genomebrowser/configuration.json";

type JBrowseGenomeViewProps = {
  triboliumGene: TriboliumGene;
};

const getJBrowseConfig = (zoomedInLocationStr: string) => {
  if (mainSpecies !== "Tcas") {
    const baseURL = getEnv("PUBLIC_UI_PAGE_GENOMEBROWSER");
    return {
      assembly: {
        name: "genomic.fna",
        sequence: {
          type: "ReferenceSequenceTrack",
          trackId: "genomic.fna",
          adapter: {
            type: "IndexedFastaAdapter",
            fastaLocation: {
              uri: `${baseURL}/data/genomic.fna`,
              locationType: "UriLocation",
            },
            faiLocation: {
              uri: `${baseURL}/data/genomic.fna.fai`,
              locationType: "UriLocation",
            },
          },
        },
      },
      tracks: [
        {
          type: "FeatureTrack",
          trackId: "genomic.sorted.gff",
          name: "genomic.sorted.gff",
          adapter: {
            type: "Gff3TabixAdapter",
            gffGzLocation: {
              uri: `${baseURL}/data/genomic.sorted.gff.gz`,
              locationType: "UriLocation",
            },
            index: {
              location: {
                uri: `${baseURL}/data/genomic.sorted.gff.gz.tbi`,
                locationType: "UriLocation",
              },
              indexType: "TBI",
            },
          },
          assemblyNames: ["genomic.fna"],
        },
      ],
      defaultSession: {
        name: "default",
        view: {
          type: "LinearGenomeView",
          tracks: [
            {
              type: "FeatureTrack",
              configuration: "genomic.sorted.gff",
              displays: [
                {
                  type: "LinearBasicDisplay",
                  configuration: "genomic.sorted.gff-LinearBasicDisplay",
                  height: 180,
                },
              ],
            },
          ],
          hideHeader: true,
          hideHeaderOverview: true,
          hideNoTracksActive: true,
          trackSelectorType: "hierarchical",
          trackLabels: "offset",
          showCenterLine: false,
          showCytobandsSetting: false,
          showGridlines: true,
          showCytobands: false,
        },
      },
      configuration,
      location: zoomedInLocationStr,
    };
  }

  return {
    assembly,
    tracks,
    defaultSession,
    configuration,
    location: zoomedInLocationStr,
  };
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({
  triboliumGene,
}) => {
  const [modules, setModules] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      import("@jbrowse/react-linear-genome-view2"),
      import("@emotion/cache"),
      import("@emotion/react"),
    ]).then(([jb, cachePkg, reactPkg]) => {
      const createCache = cachePkg.default || cachePkg;
      const { CacheProvider } = reactPkg;
      
      // Look for the persistent style container
      const container = document.getElementById("jbrowse-styles-container");
      
      const emotionCache = createCache({
        key: "jbrowse-native",
        container: container || document.head,
      });

      setModules({
        jb,
        CacheProvider,
        emotionCache,
      });
    });
  }, []);

  const state = useMemo(() => {
    if (!modules?.jb) return null;

    const { seqname, start: startStr, end: endStr } = triboliumGene;
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    const halfLength = (end - start) / 2;
    const zoomedInStart = Math.max(0, start - halfLength);
    const zoomedInEnd = end + halfLength;
    const zoomedInLocationStr = `${seqname}:${Math.floor(zoomedInStart)}..${Math.floor(zoomedInEnd)}`;

    const { createViewState } = modules.jb;

    return createViewState(getJBrowseConfig(zoomedInLocationStr));
  }, [modules, triboliumGene]);

  if (!modules || !state) {
    return (
      <div className="w-full h-[300px] flex items-center justify-center text-neutral-400 italic bg-neutral-50 rounded-lg border border-dashed border-neutral-200">
        Loading Genome Browser...
      </div>
    );
  }

  const { JBrowseLinearGenomeView } = modules.jb;
  const { CacheProvider, emotionCache } = modules;

  return (
    <CacheProvider value={emotionCache}>
      <div className="w-full bg-white rounded-lg border border-neutral-200 overflow-hidden relative shadow-sm">
        <JBrowseLinearGenomeView viewState={state} />
      </div>
    </CacheProvider>
  );
};

export default JBrowseGenomeView;
