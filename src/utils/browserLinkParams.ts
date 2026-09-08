import genomicsService from "@/utils/services/genomics";
import { getEnv } from "@/utils/env";

const { fetchPublicVersions } = genomicsService();

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

const getCurrentVersionName = async (): Promise<string | undefined> => {
  try {
    const versions = await fetchPublicVersions();
    return versions[0]?.name;
  } catch {
    return undefined;
  }
};

export const getJBrowseLinkParams = async (): Promise<JBrowseLinkParams> => {
  const baseURL = getEnv("PUBLIC_UI_PAGE_GENOMEBROWSER").replace(/\/+$/, "");
  const config: JBrowseConfig = await (
    await fetch(`${baseURL}/data/config.json`)
  ).json();

  const currentVersion = await getCurrentVersionName();
  const assembly =
    currentVersion ||
    config.defaultSession?.views?.[0]?.init?.assembly ||
    config.assemblies?.[0]?.name;
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

  return { assembly, tracks };
};
