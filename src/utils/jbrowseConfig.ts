import { type GeneDetail } from "@/utils/services/genomics";
import configuration from "@/utils/config/genomebrowser/configuration.json";
import { resolveBaseUrl } from "@/utils/url";
import { isNotNull } from "@/utils/filterFn";

export type JBrowseConfig = {
  assembly: any;
  tracks: any[];
  defaultSession: {
    name: string;
    view: {
      type: string;
      tracks: any[];
    } & typeof VIEW_SETTINGS;
  };
  configuration: typeof configuration;
  location: string;
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

export const getZoomedInLocation = (geneInfo: GeneDetail): string | null => {
  const { seqname, start, end } = geneInfo;
  if (!seqname || start == null || end == null) return null;
  const halfLength = (end - start) / 2;
  const zoomedInStart = Math.max(0, start - halfLength);
  const zoomedInEnd = end + halfLength;
  return `${seqname}:${Math.floor(zoomedInStart)}..${Math.floor(zoomedInEnd)}`;
};

export const buildJBrowseConfig = (
  data: any,
  zoomedInLocationStr: string,
): JBrowseConfig => {
  const baseURL = resolveBaseUrl("jbrowse").replace(/\/+$/, "");
  const dataBaseURL = `${baseURL}/data`;

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

export const getJBrowseConfig = async (
  zoomedInLocationStr: string,
): Promise<JBrowseConfig> => {
  const baseURL = resolveBaseUrl("jbrowse").replace(/\/+$/, "");
  const res = await fetch(`${baseURL}/data/config.json`);
  const data = await res.json();
  return buildJBrowseConfig(data, zoomedInLocationStr);
};