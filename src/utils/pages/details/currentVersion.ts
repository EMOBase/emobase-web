import genomicsService from "@/utils/services/genomics";
import { createVersionResolver } from "@/utils/version";

export const getSelectedVersionName = async (): Promise<string | undefined> => {
  const { fetchPublicVersions } = genomicsService();
  return createVersionResolver(fetchPublicVersions, { fallback: true })();
};