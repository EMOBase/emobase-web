import genomicsService from "@/utils/services/genomics";

const { fetchPublicVersions } = genomicsService();

export const getCurrentVersionName = async (): Promise<string | undefined> => {
  try {
    const versions = await fetchPublicVersions();
    return versions.find((v) => v.isDefault)?.name || versions[0]?.name;
  } catch {
    return undefined;
  }
};