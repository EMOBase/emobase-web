import { Upload as TusUpload } from "tus-js-client";

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

type UploadInput = {
  file: File;
  version: string;
  fileType: string;
  fileName?: string;
  order?: string;
  algorithm?: string;
  onProgress?: (
    percentage: number,
    bytesUploaded: number,
    bytesTotal: number,
  ) => void;
};

export type UploadResponse = {
  uploadUrl?: string;
};

const GENOMICS_BASE_URL = "http://localhost:8000/api";

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
    return await fetch<FetchJobResponse>("genomics", "/jobs", {
      body: {
        version,
      },
    });
  };

  const upload = async ({
    file,
    version,
    fileType,
    fileName,
    order,
    algorithm,
    onProgress,
  }: UploadInput): Promise<UploadResponse> => {
    return await new Promise((resolve, reject) => {
      const tusUpload = new TusUpload(file, {
        // Trailing slash avoids nginx/tusd redirect on preflight.
        endpoint: `${GENOMICS_BASE_URL}/uploads/`,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
        },
        metadata: {
          fileType,
          fileName: fileName ?? file.name,
          version,
          ...(order ? { order } : {}),
          ...(algorithm ? { algorithm } : {}),
        },
        removeFingerprintOnSuccess: true,
        onError: (error) => {
          reject(error);
        },
        onProgress: (bytesUploaded, bytesTotal) => {
          const percentage =
            bytesTotal > 0 ? (bytesUploaded / bytesTotal) * 100 : 0;
          onProgress?.(percentage, bytesUploaded, bytesTotal);
        },
        onSuccess: () => {
          resolve({ uploadUrl: tusUpload.url ?? undefined });
        },
      });

      tusUpload.start();
    });
  };

  return {
    fetchVersions,
    createVersion,
    fetchJobs,
    upload,
  };
};

export default genomicsService;
