import { apiFetch } from "@/utils/apiFetch";

/* Fixed token to test for now, will remove later in favor of useService() that apply token from session automatically */
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvdWxvdWRpIn0.xDl3GuKVz743m9Cmit_ME4dzr91bIaJiC-2ExUNwK0c";

type CreateVersionInput = {
  name: string;
};

type CreateVersionResult = {
  ID: number;
  Name: string;
};

export type VersionItem = {
  id: string;
  name: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  isDefault: boolean;
  status: "DRAFT" | "PROCESSING" | "ERROR" | "READY";
  totalFileSize: number;
};

type FetchVersionsResponse = {
  data: {
    page: number;
    pageSize: number;
    total: number;
    versions: VersionItem[];
  };
  requestId: string;
};

const genomicsService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchVersions = async () => {
    return await fetch<FetchVersionsResponse>("genomics", "/versions", {
      authorization: `Bearer ${ACCESS_TOKEN}`,
    });
  };

  const createVersion = async (versionInput: CreateVersionInput) => {
    return await fetch<CreateVersionResult>("genomics", "/versions", {
      method: "POST",
      authorization: `Bearer ${ACCESS_TOKEN}`,
      body: {
        ...versionInput,
      },
    });
  };

  return {
    fetchVersions,
    createVersion,
  };
};

export default genomicsService;
