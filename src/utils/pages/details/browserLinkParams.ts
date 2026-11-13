import { getJbrowseConfigBaseUrl } from "@/utils/url";

export type JBrowseLinkParams = {
  assembly: string;
  tracks: string[];
  loc?: string;
};

type JBrowseConfig = {
  assemblies?: { name: string }[];
  defaultSession?: {
    views?: {
      init?: {
        assembly?: string;
        loc?: string;
        tracks?: (string | { configuration?: string })[];
      };
    }[];
  };
};

const toTrackId = (track: string | { configuration?: string }) =>
  typeof track === "string" ? track : track.configuration;

export const getJBrowseLinkParams = async (
  assemblyKey?: string,
): Promise<JBrowseLinkParams> => {
  const baseURL = getJbrowseConfigBaseUrl().replace(/\/+$/, "");
  const config: JBrowseConfig = await (
    await fetch(`${baseURL}/data/config.json`)
  ).json();

  // Assemblies are named by their assembly key (e.g. "v1a6"); use the key
  // reported for the gene, and fall back to the default session's assembly
  // when it is missing or unknown.
  const defaultAssembly =
    config.defaultSession?.views?.[0]?.init?.assembly ||
    config.assemblies?.[0]?.name;
  const assembly =
    (assemblyKey && config.assemblies?.some((a) => a.name === assemblyKey)
      ? assemblyKey
      : undefined) || defaultAssembly;
  const view =
    config.defaultSession?.views?.find((v) => v.init?.assembly === assembly) ||
    config.defaultSession?.views?.[0];

  const tracks = (view?.init?.tracks || [])
    .map(toTrackId)
    .filter(
      (trackId): trackId is string =>
        !!trackId && !trackId.includes("ReferenceSequenceTrack"),
    );

  if (!assembly || tracks.length === 0) {
    throw new Error("No default assembly/tracks in JBrowse config");
  }

  return { assembly, tracks, loc: view?.init?.loc };
};
