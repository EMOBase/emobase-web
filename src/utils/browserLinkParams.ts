import { getEnv } from "@/utils/env";

export type JBrowseLinkParams = {
  assembly: string;
  tracks: string[];
};

type JBrowseConfig = {
  assemblies?: { name: string }[];
  defaultSession?: {
    views?: {
      init?: {
        assembly?: string;
        tracks?: (string | { configuration?: string })[];
      };
    }[];
  };
};

const toTrackId = (track: string | { configuration?: string }) =>
  typeof track === "string" ? track : track.configuration;

export const getJBrowseLinkParams = async (): Promise<JBrowseLinkParams> => {
  const baseURL = getEnv("PUBLIC_UI_PAGE_GENOMEBROWSER").replace(/\/+$/, "");
  const config: JBrowseConfig = await (
    await fetch(`${baseURL}/data/config.json`)
  ).json();

  const assembly =
    config.assemblies?.[0]?.name ||
    config.defaultSession?.views?.[0]?.init?.assembly;
  const view =
    config.defaultSession?.views?.find(
      (v) => v.init?.assembly === assembly,
    ) || config.defaultSession?.views?.[0];

  const tracks = (view?.init?.tracks || [])
    .map(toTrackId)
    .filter(
      (trackId): trackId is string =>
        !!trackId && !trackId.includes("ReferenceSequenceTrack"),
    );

  if (!assembly || tracks.length === 0) {
    throw new Error("No default assembly/tracks in JBrowse config");
  }

  return { assembly, tracks };
};