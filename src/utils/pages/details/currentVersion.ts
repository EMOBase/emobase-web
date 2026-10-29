import genomicsService from "@/utils/services/genomics";
import { createVersionResolver } from "@/utils/version";

export const getCurrentVersionName = async (): Promise<string | undefined> => {
  const { fetchPublicVersions } = genomicsService();
  return createVersionResolver(fetchPublicVersions, { fallback: true })();
};