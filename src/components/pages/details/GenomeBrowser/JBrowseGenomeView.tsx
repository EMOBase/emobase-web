import { useEffect, useState, useMemo } from "react";
import { type GeneDetail } from "@/utils/services/genomics";
import { getEnv } from "@/utils/env";
import { isNotNull } from "@/utils/filterFn";
import configuration from "@/utils/config/genomebrowser/configuration.json";

type JBrowseGenomeViewProps = {
  geneInfo: GeneDetail;
};

const VIEW_SETTINGS = {
  hideHeader: true,
  hideHeaderOverview: true,
  hideNoTracksActive: true,
  trackSelectorType: "hierarchical",
  trackLabels: "offset",
  showCenterLine: false,
  showCytobandsSetting: false,
  showGridlines: true,
  showCytobands: false,
};

const DISPLAY_TYPE_BY_TRACK_TYPE: Record<string, string> = {
  FeatureTrack: "LinearBasicDisplay",
  QuantitativeTrack: "LinearWiggleDisplay",
  ReferenceSequenceTrack: "LinearReferenceSequenceDisplay",
  AlignmentTrack: "LinearAlignmentsDisplay",
  VariantTrack: "LinearVariantDisplay",
};

const buildViewTracks = (trackIds: string[], tracks: any[]) =>
  trackIds
    .map((trackId) => {
      const track = tracks.find((t) => t.trackId === trackId);
      if (!track) return null;
      return {
        type: track.type,
        configuration: track.trackId,
        displays: track.displays.map((d: any) => ({
          type: d.type,
          configuration: d.displayId,
        })),
      };
    })
    .filter(isNotNull);

const buildTracks = (tracks: any[]) =>
  tracks.map((track) => {
    const displayType =
      DISPLAY_TYPE_BY_TRACK_TYPE[track.type] || "LinearBasicDisplay";
    return {
      ...track,
      displays: [
        {
          type: displayType,
          displayId: `${track.trackId}-${displayType}`,
          height: 50,
        },
      ],
    };
  });

const isAbsoluteUri = (uri: string) =>
  /^[a-z][a-z0-9+.-]*:/i.test(uri) || uri.startsWith("/");

const resolveRelativeUris = (node: unknown, dataBaseURL: string): any => {
  if (Array.isArray(node)) {
    return node.map((n) => resolveRelativeUris(n, dataBaseURL));
  }
  if (node && typeof node === "object") {
    if (typeof (node as any).uri === "string") {
      const { uri, ...rest } = node as Record<string, unknown> & {
        uri: string;
      };
      return {
        ...rest,
        uri: isAbsoluteUri(uri) ? uri : `${dataBaseURL}/${uri}`,
      };
    }
    const out: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(
      node as Record<string, unknown>,
    )) {
      out[key] = resolveRelativeUris(value, dataBaseURL);
    }
    return out;
  }
  return node;
};

const getJBrowseConfig = async (zoomedInLocationStr: string) => {
  const baseURL = getEnv("PUBLIC_UI_PAGE_GENOMEBROWSER").replace(/\/+$/, "");
  const dataBaseURL = `${baseURL}/data`;
  const res = await fetch(`${dataBaseURL}/config.json`);
  const data = await res.json();

  const assemblies: any[] = resolveRelativeUris(
    data.assemblies || [],
    dataBaseURL,
  );
  const tracks: any[] = buildTracks(
    resolveRelativeUris(data.tracks || [], dataBaseURL),
  );
  const defaultSession: any = data.defaultSession || {};

  const view = defaultSession.view || defaultSession.views?.[0] || {};
  const initAssembly = view?.init?.assembly;
  const assembly =
    assemblies.find((a) => a.name === initAssembly) || assemblies[0];

  return {
    assembly,
    tracks,
    defaultSession: {
      name: "default",
      view: {
        type: "LinearGenomeView",
        tracks: buildViewTracks(view?.init?.tracks || [], tracks),
        ...VIEW_SETTINGS,
      },
    },
    configuration,
    location: zoomedInLocationStr,
  };
};

const JBrowseGenomeView: React.FC<JBrowseGenomeViewProps> = ({ geneInfo }) => {
  const [modules, setModules] = useState<any>(null);
  const [config, setConfig] = useState<any>(null);

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

  useEffect(() => {
    let cancelled = false;

    const { seqname, start, end } = geneInfo;
    if (!seqname || start == null || end == null) return;
    const halfLength = (end - start) / 2;
    const zoomedInStart = Math.max(0, start - halfLength);
    const zoomedInEnd = end + halfLength;
    const zoomedInLocationStr = `${seqname}:${Math.floor(zoomedInStart)}..${Math.floor(zoomedInEnd)}`;

    getJBrowseConfig(zoomedInLocationStr).then((jbrowseConfig) => {
      if (!cancelled) setConfig(jbrowseConfig);
    });

    return () => {
      cancelled = true;
    };
  }, [geneInfo]);

  const state = useMemo(() => {
    if (!modules?.jb || !config) return null;

    const { createViewState } = modules.jb;

    return createViewState(config);
  }, [modules, config]);

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
