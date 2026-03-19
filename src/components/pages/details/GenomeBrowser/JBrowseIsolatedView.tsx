import { useEffect, useState, useMemo, useCallback } from "react";

import { type TriboliumGene } from "@/utils/services/geneService";
import { mainSpecies } from "@/utils/mainSpecies";
import { getEnv } from "@/utils/env";
import assembly from "@/utils/config/genomebrowser/assembly.json";
import tracks from "@/utils/config/genomebrowser/tracks.json";

import defaultSession from "@/utils/config/genomebrowser/default_session.json";
import configuration from "@/utils/config/genomebrowser/configuration.json";

type JBrowseIsolatedViewProps = {
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

const JBrowseIsolatedView: React.FC<JBrowseIsolatedViewProps> = ({
  triboliumGene,
}) => {
  const [jbrowse, setJBrowse] = useState<any>(null);

  useEffect(() => {
    import("@jbrowse/react-linear-genome-view2").then(setJBrowse);
  }, []);

  // Use a callback ref to handle the ResizeObserver safely after JBrowse mounts.
  // This is the key fix for the "stuck height" problem.
  const contentRef = useCallback((node: HTMLDivElement | null) => {
    if (!node) return;

    let timeoutId: ReturnType<typeof setTimeout>;
    const observer = new ResizeObserver((entries) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const entry = entries[0];
        if (entry) {
          // Use getBoundingClientRect for the most accurate non-stretching height
          const height = Math.ceil(node.getBoundingClientRect().height);
          window.parent.postMessage({ type: "jbrowse-height", height }, "*");
        }
      }, 50);
    });

    observer.observe(node);
    // We don't strictly need to return a cleanup function from a callback ref,
    // but if the node changes, ResizeObserver automatically handles it
    // when garbage collected or we could store it in a local ref if needed.
  }, []);

  const state = useMemo(() => {
    if (!jbrowse) return null;

    const { seqname, start: startStr, end: endStr } = triboliumGene;
    const start = parseInt(startStr);
    const end = parseInt(endStr);
    const halfLength = (end - start) / 2;
    const zoomedInStart = Math.max(0, start - halfLength);
    const zoomedInEnd = end + halfLength;
    const zoomedInLocationStr = `${seqname}:${Math.floor(zoomedInStart)}..${Math.floor(zoomedInEnd)}`;

    const { createViewState } = jbrowse;

    return createViewState(getJBrowseConfig(zoomedInLocationStr));
  }, [jbrowse, triboliumGene]);

  if (!jbrowse || !state) {
    return null;
  }

  const { JBrowseLinearGenomeView } = jbrowse;

  return (
    <div
      id="jbrowse-container"
      ref={contentRef}
      className="overflow-hidden inline-block w-full"
    >
      <JBrowseLinearGenomeView viewState={state} />
    </div>
  );
};

export default JBrowseIsolatedView;
