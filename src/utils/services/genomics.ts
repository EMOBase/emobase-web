import { apiFetch } from "@/utils/apiFetch";

/* Fixed token to test for now, will remove later in favor of useService() that apply token from session automatically */
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImxvdWxvdWRpIn0.xDl3GuKVz743m9Cmit_ME4dzr91bIaJiC-2ExUNwK0c";

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

type CreateVersionInput = {
  name: string;
};

type CreateVersionResponse = {
  data: {
    id: string;
    name: string;
    createdAt: string;
    createdBy: string;
  };
  requestId: string;
};

type JobItem = {
  id: string;
  versionId: string;
  type:
    | "GENOMIC.FNA"
    | "GENOMIC.GFF"
    | "RNA.FNA"
    | "PROTEIN.FAA"
    | "ORTHOLOGY.TSV"
    | "SYNONYM";
  status: "PENDING" | "RUNNING" | "DONE" | "FAILED";
  error?: string;
};

type FetchJobResponse = {
  data: JobItem[];
  requestId: string;
};

const genomicsService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchVersions = async (opts?: { page: number; pageSize: number }) => {
    const { page = 1, pageSize = 10 } = opts ?? {};
    const url = `/versions?page=${page}&page_size=${pageSize}`;

    return await fetch<FetchVersionsResponse>("genomics", url, {
      authorization: `Bearer ${ACCESS_TOKEN}`,
    });
  };

  const createVersion = async (versionInput: CreateVersionInput) => {
    return await fetch<CreateVersionResponse>("genomics", "/versions", {
      method: "POST",
      authorization: `Bearer ${ACCESS_TOKEN}`,
      body: {
        ...versionInput,
      },
    });
  };

  const fetchJobs = async (version: string) => {
    return await fetch("genomics", "/jobs", {
      body: {
        version,
      },
    });
  };

  return {
    fetchVersions,
    createVersion,
    fetchJobs,
  };
};

export default genomicsService;
