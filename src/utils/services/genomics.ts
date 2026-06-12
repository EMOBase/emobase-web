import { Upload as TusUpload } from "tus-js-client";

import { apiFetch, getApiBaseUrl } from "@/utils/apiFetch";
import { useSessionStore } from "@/states/sessionStore";

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
    | "CDS.FNA"
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

export type FileJobSummary = {
  id: number;
  type: JobItem["type"] | string;
  description: string;
  status: "PENDING" | "RUNNING" | "DONE" | "FAILED";
  payload: any;
  error?: string | null;
};

export type FileDetail = {
  id: string;
  filePath: string;
  fileSize: number;
  uploadStatus: "UPLOADING" | "COMPLETED" | "FAILED";
  createdAt: string;
  createdBy: string;
  completedAt?: string | null;
  jobs: FileJobSummary[];
};

export type VersionDetailFiles = {
  "genomic.fna"?: FileDetail | null;
  "genomic.gff"?: FileDetail | null;
  "rna.fna"?: FileDetail | null;
  "cds.fna"?: FileDetail | null;
  "protein.faa"?: FileDetail | null;
  "dsrna.csv"?: FileDetail | null;
  "jbrowse.track"?: FileDetail[];
  "orthology.tsv"?: FileDetail[];
};

type FetchVersionDetailResponse = {
  data: {
    id: number;
    name: string;
    isDefault: boolean;
    status: "DRAFT" | "PROCESSING" | "READY" | "ERROR";
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    files: VersionDetailFiles;
  };
  requestId: string;
};

type UploadInput = {
  file: File;
  version: string;
  fileType: string;
  fileName?: string;
  order?: number;
  algorithm?: string;
  trackName?: string;
  geneIDKey?: string;
  trimPrefixChars?: number;
  trimSuffixChars?: number;
  oldGeneIDKeys?: string;
  onProgress?: (
    percentage: number,
    bytesUploaded: number,
    bytesTotal: number,
  ) => void;
  shouldResume?: boolean;
};

export type GeneSearchResult = {
  genes?: string[];
  orthologies?: {
    source: string;
    group: string;
    orthologs: {
      species: string;
      genes: {
        gene: string;
        synonyms: string[];
      }[];
    }[];
  }[];
  otherGenes?: {
    species: string;
    gene: string;
  }[];
};

export type UploadResponse = {
  uploadUrl?: string;
};

const genomicsService = (fetch: typeof apiFetch = apiFetch) => {
  const fetchVersions = async (opts?: { page: number; pageSize: number }) => {
    const { page = 1, pageSize = 10 } = opts ?? {};
    const url = `/versions?page=${page}&page_size=${pageSize}`;

    return await fetch<FetchVersionsResponse>("genomicsservice", url);
  };

  const createVersion = async (versionInput: CreateVersionInput) => {
    return await fetch<CreateVersionResponse>("genomicsservice", "/versions", {
      method: "POST",
      body: {
        ...versionInput,
      },
    });
  };

  const fetchJobs = async (version: string) => {
    return await fetch<FetchJobResponse>("genomicsservice", "/jobs", {
      query: {
        version,
      },
    });
  };

  const fetchVersionDetail = async (version: string) => {
    return await fetch<FetchVersionDetailResponse>(
      "genomicsservice",
      `/versions/${version}/detail`,
      {
        query: {
          name: version,
        },
      },
    );
  };

  const upload = async ({
    file,
    version,
    fileType,
    fileName,
    order,
    algorithm,
    trackName,
    geneIDKey,
    trimPrefixChars,
    trimSuffixChars,
    oldGeneIDKeys,
    onProgress,
    shouldResume = false,
  }: UploadInput): Promise<UploadResponse> => {
    return await new Promise((resolve, reject) => {
      const tusUpload = new TusUpload(file, {
        // Trailing slash avoids nginx/tusd redirect on preflight.
        endpoint: `${getApiBaseUrl("genomicsservice")}/uploads/`,
        retryDelays: [0, 1000, 3000, 5000],
        headers: {
          Authorization: `Bearer ${useSessionStore.getState().session?.user?.accessToken}`,
        },
        chunkSize: 5 * 1024 * 1024, // 5 MB
        metadata: {
          fileType,
          fileName: fileName ?? file.name,
          version,
          ...(order ? { order: order.toString() } : {}),
          ...(algorithm ? { algorithm } : {}),
          ...(trackName ? { trackName } : {}),
          ...(geneIDKey ? { geneIDKey } : {}),
          ...(trimPrefixChars !== undefined ? { trimPrefixChars: trimPrefixChars.toString() } : {}),
          ...(trimSuffixChars !== undefined ? { trimSuffixChars: trimSuffixChars.toString() } : {}),
          ...(oldGeneIDKeys ? { oldGeneIDKeys } : {}),
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

      if (shouldResume) {
        tusUpload.findPreviousUploads()
          .then((uploads) => {
            if (uploads.length > 0) {
              tusUpload.resumeFromPreviousUpload(uploads[0]);
            }
            tusUpload.start();
          })
          .catch(() => {
            tusUpload.start();
          });
      } else {
        tusUpload.start();
      }
    });
  };

  const deleteUploadFile = async (id: string) => {
    return await fetch<{ data: FileJobSummary; requestId: string }>(
      "genomicsservice",
      `/upload-files/${id}`,
      {
        method: "DELETE",
      },
    );
  };

  const deleteVersion = async (version: string) => {
    return await fetch<undefined>(
      "genomicsservice",
      `/versions/${version}`,
      {
        method: "DELETE",
      },
    );
  };

  const releaseVersion = async (version: string) => {
    return await fetch<{ data: any; requestId: string }>(
      "genomicsservice",
      `/versions/${version}/release`,
      {
        method: "POST",
      },
    );
  };

  const search = async (query: string) => {
    const res = await fetch<{
      data: GeneSearchResult;
      requestId: string;
    }>("genomicsservice", `/search?query=${encodeURIComponent(query)}`);
    return res.data;
  };

  const suggest = async (query: string) => {
    const res = await fetch<{
      data: string[];
      requestId: string;
    }>("genomicsservice", `/search/_suggest?query=${encodeURIComponent(query)}`);
    return res.data;
  };

  return {
    fetchVersions,
    createVersion,
    fetchJobs,
    fetchVersionDetail,
    upload,
    deleteUploadFile,
    deleteVersion,
    releaseVersion,
    search,
    suggest,
  };
};

export default genomicsService;
