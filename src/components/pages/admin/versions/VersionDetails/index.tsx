import React, { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { toast } from "sonner";

import useAsyncData from "@/hooks/useAsyncData";
import genomicsService from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const { fetchJobs, upload } = genomicsService();

const ALLOWED_UPLOAD_FILE_TYPES = new Set([
  "genomic.fna",
  "genomic.gff",
  "rna.fna",
  "cds.fna",
  "protein.faa",
  "orthology.tsv",
  "fb_synonym.tsv",
  "fbgn_fbtr_fbpp.tsv",
]);

interface FileStatus {
  name: string;
  category: string;
  status: "PENDING" | "UPLOADING" | "PROCESSING" | "READY" | "ERROR";
  progress?: number;
  progressTitle?: string;
  size?: string;
  error?: string;
  icon: string;
  theme?: "orange" | "blue";
}

interface SecondaryFile {
  name: string;
  info: string;
  status: "PENDING" | "UPLOADING";
  progress: number;
  actionIcon: "close" | "delete";
}

const mockMainFiles: FileStatus[] = [
  {
    name: "genomic.fna",
    category: "Genome Sequence",
    status: "PENDING",
    icon: "description",
  },
  {
    name: "genomic.gff",
    category: "Genome Annotation",
    status: "UPLOADING",
    progress: 65,
    progressTitle: "IN TRANSIT",
    size: "412 MB",
    icon: "numbers",
    theme: "orange",
  },
  {
    name: "rna.fna",
    category: "RNA Sequences",
    status: "PROCESSING",
    progress: 84,
    progressTitle: "PROCESSING DATA",
    icon: "science",
    theme: "orange",
  },
  {
    name: "cds.fna",
    category: "Coding Sequences",
    status: "ERROR",
    error: "Invalid file format, cannot parse, please follow ABC format",
    progress: 45,
    progressTitle: "METADATA SYNC",
    size: "1.1 GB",
    icon: "data_object",
    theme: "orange",
  },
  {
    name: "protein.faa",
    category: "Protein Sequences",
    status: "READY",
    progress: 100,
    size: "150 MB",
    icon: "conversion_path",
    theme: "blue",
  },
];

const mockSecondaryFiles: SecondaryFile[] = [
  {
    name: "ortho_batch_09.csv",
    info: "84.2 MB • PROCESSING HEADERS",
    status: "UPLOADING",
    progress: 65,
    actionIcon: "close",
  },
  {
    name: "metadata_clinical_v2.json",
    info: "1.2 MB • WAITING",
    status: "PENDING",
    progress: 0,
    actionIcon: "delete",
  },
];

const ProgressBar = ({
  progress,
  title,
  theme = "orange",
  showComplete = false,
}: {
  progress: number;
  title: string;
  theme?: "orange" | "blue";
  showComplete?: boolean;
}) => {
  const barColor = theme === "blue" ? "bg-blue-600" : "bg-[#c2410c]";
  const textColor = theme === "blue" ? "text-blue-600" : "text-[#c2410c]";

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between text-[11px] font-bold tracking-wider uppercase">
        <span className={textColor}>{title}</span>
        <span className="text-slate-400">
          {showComplete && progress === 100 ? "COMPLETE" : `${progress}%`}
        </span>
      </div>
      <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
        <div
          className={twMerge("h-full transition-all duration-500", barColor)}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};

const FileCard = ({
  file,
  onChooseFile,
  isUploading = false,
  uploadProgress = 0,
}: {
  file: FileStatus;
  onChooseFile: (fileName: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
}) => {
  const isReady = file.status === "READY";
  const isPending = file.status === "PENDING";
  const isError = file.status === "ERROR";

  return (
    <div
      className={twMerge(
        "bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-6 relative overflow-hidden group hover:shadow-md transition-shadow",
        isError && "bg-[#FFF5F5] border-[#FFE4E4]",
      )}
    >
      {/* Left-side indicator */}
      <div
        className={twMerge(
          "absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity",
          isPending
            ? "bg-neutral-400"
            : isReady
              ? "bg-blue-600"
              : isError
                ? "bg-red-500"
                : "bg-[#c2410c]",
        )}
      />

      {/* Icon */}
      <div
        className={twMerge(
          "size-14 rounded-xl flex items-center justify-center shrink-0",
          isReady
            ? "bg-blue-50 text-blue-600"
            : isPending
              ? "bg-slate-50 text-slate-400"
              : isError
                ? "bg-red-100 text-red-600"
                : "bg-orange-50 text-orange-600",
        )}
      >
        <Icon
          name={file.icon}
          className="text-3xl"
          weight={500}
          fill={isReady || isError}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {file.name}
          </h3>
          {file.size && (
            <span className="text-xs font-medium text-slate-400">
              {file.size}
            </span>
          )}
          {isError && file.error && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center p-0.5 rounded-full hover:bg-red-100/50 transition-colors">
                  <Icon
                    name="error_outline"
                    className="text-red-500 text-sm cursor-help"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{file.error}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
          {file.category}
        </p>
      </div>

      {/* Progress or Button */}
      <div className="w-1/2 flex items-center gap-8">
        {isError ? (
          <button
            onClick={() => onChooseFile(file.name)}
            className="flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-red-200 rounded-xl py-3 text-red-700 hover:border-red-300 hover:bg-red-100/30 transition-all font-bold text-xs tracking-widest"
          >
            <Icon name="refresh" className="text-xl" />
            RE-UPLOAD
          </button>
        ) : !isPending && file.progress !== undefined ? (
          <ProgressBar
            progress={file.progress}
            title={file.progressTitle || ""}
            theme={file.theme}
            showComplete={isReady}
          />
        ) : isPending ? (
          <button
            onClick={() => onChooseFile(file.name)}
            disabled={isUploading}
            className="flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl py-3 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold text-sm disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Icon name="upload_file" className="text-xl" />
            {isUploading
              ? `UPLOADING ${Math.round(uploadProgress)}%`
              : "CHOOSE FILE"}
          </button>
        ) : null}

        <div className="w-24 flex justify-end">
          <span
            className={twMerge(
              "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
              isReady
                ? "bg-blue-600 text-white"
                : isPending
                  ? "bg-slate-100 text-slate-400"
                  : isError
                    ? "bg-[#FFE4E4] text-[#D13434]"
                    : "bg-orange-100 text-orange-600",
            )}
          >
            {file.status}
          </span>
        </div>
      </div>
    </div>
  );
};

const VersionDetails: React.FC<{ name?: string }> = ({ name = "" }) => {
  const { data, loading } = useAsyncData(() => fetchJobs(name), [name]);
  console.log({ data, loading });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTargetFile, setSelectedTargetFile] = useState<string | null>(
    null,
  );
  const [uploadingTargetFile, setUploadingTargetFile] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);

  const openFilePicker = (fileName: string) => {
    setSelectedTargetFile(fileName);
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !selectedTargetFile) {
      return;
    }

    if (!ALLOWED_UPLOAD_FILE_TYPES.has(selectedTargetFile)) {
      toast.error(`Unsupported upload type: ${selectedTargetFile}`);
      event.target.value = "";
      return;
    }

    if (!file.name.endsWith(".gz") && !file.name.endsWith(".gzip")) {
      toast.error("Only .gz or .gzip files are accepted");
      event.target.value = "";
      return;
    }

    try {
      setUploadingTargetFile(selectedTargetFile);
      setUploadProgress(0);

      await upload({
        file,
        version: name,
        fileType: selectedTargetFile,
        onProgress: (progress) => setUploadProgress(progress),
      });

      toast.success(`Uploaded ${file.name}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setUploadingTargetFile(null);
      setSelectedTargetFile(null);
      setUploadProgress(0);
      event.target.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />
      {/* Header Info (Mocked from design) */}
      <div className="px-2 space-y-4">
        <a
          href="/admin/versions"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors group tracking-widest uppercase"
        >
          <Icon
            name="arrow_back"
            className="text-lg group-hover:-translate-x-1 transition-transform"
          />
          Back to Data Management
        </a>
        <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
          Version {name}
        </h1>
      </div>

      {/* Main Files Grid */}
      <div className="space-y-4 relative">
        {mockMainFiles.map((file, idx) => (
          <FileCard
            key={idx}
            file={file}
            onChooseFile={openFilePicker}
            isUploading={uploadingTargetFile === file.name}
            uploadProgress={uploadProgress}
          />
        ))}
      </div>

      {/* Additional Files Section */}
      <div className="bg-slate-50/50 rounded-3xl border border-slate-100 p-8 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-slate-900 tracking-wider uppercase">
              ADDITIONAL ORTHOLOGY FILES
            </h2>
            <p className="text-slate-500 text-xs mt-1 font-medium">
              Supplementary clinical evidence and batch records
            </p>
          </div>
          <Button variant="outline" className="font-bold text-xs px-4 py-2">
            <Icon name="add_circle" weight={500} className="text-lg" />
            APPEND DATASET
          </Button>
        </div>

        <div className="space-y-4">
          {mockSecondaryFiles.map((file, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-6 relative overflow-hidden group transition-all hover:shadow-md"
            >
              <div
                className={
                  "absolute left-0 top-6 bottom-6 w-1 rounded-r-full bg-[#c2410c] opacity-0 group-hover:opacity-100 transition-opacity"
                }
              />

              <div className="size-12 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-orange-50 group-hover:text-orange-600 transition-colors shrink-0">
                <Icon
                  name={file.name.endsWith(".json") ? "article" : "csv"}
                  className="text-2xl"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold text-slate-800 truncate">
                  {file.name}
                </h4>
                <p className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
                  {file.info}
                </p>
              </div>

              <div className="w-1/2 flex items-center gap-8">
                <div className="flex-1">
                  <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5">
                    <span
                      className={
                        file.status === "PENDING"
                          ? "text-slate-400"
                          : "text-[#c2410c]"
                      }
                    >
                      {file.status === "PENDING" ? "PENDING" : "UPLOADING..."}
                    </span>
                    <span className="text-slate-300">{file.progress}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div
                      className={twMerge(
                        "h-full transition-all duration-500",
                        file.status === "PENDING"
                          ? "bg-slate-100"
                          : "bg-[#c2410c]",
                      )}
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                </div>

                <div className="w-10 flex justify-end">
                  <button className="p-2 text-slate-300 hover:text-slate-500 rounded-lg transition-colors">
                    <Icon name={file.actionIcon} className="text-2xl" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VersionDetails;
