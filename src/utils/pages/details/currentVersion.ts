import genomicsService from "@/utils/services/genomics";

export const getCurrentVersionName = async (): Promise<string | undefined> => {
  try {
    const { fetchPublicVersions } = genomicsService();
    const versions = await fetchPublicVersions();
    return versions.find((v) => v.isDefault)?.name || versions[0]?.name;
  } catch {
    return undefined;
  }
};

export const getSelectedVersionName = async (): Promise<string | undefined> => {
  const { resolveVersion } = genomicsService();
  const selected = await resolveVersion();
  return selected ?? (await getCurrentVersionName());
};
