import React from "react";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";

interface FileStatus {
  name: string;
  category: string;
  status: "PENDING" | "UPLOADING" | "INDEXING" | "VALIDATING" | "READY";
  progress?: number;
  progressTitle?: string;
  size?: string;
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
    category: "NUCLEOTIDE SEQUENCE",
    status: "PENDING",
    icon: "description",
  },
  {
    name: "genomic.gff",
    category: "UPLOADING",
    status: "UPLOADING",
    progress: 65,
    progressTitle: "IN TRANSIT",
    size: "412 MB",
    icon: "numbers",
    theme: "orange",
  },
  {
    name: "genomic.faa",
    category: "PROTEIN SEQUENCE",
    status: "INDEXING",
    progress: 84,
    progressTitle: "ALIGNMENT INDEXING",
    icon: "science",
    theme: "orange",
  },
  {
    name: "transcript.gbk",
    category: "TRANSCRIPTS",
    status: "VALIDATING",
    progress: 45,
    progressTitle: "METADATA SYNC",
    size: "1.1 GB",
    icon: "data_object",
    theme: "orange",
  },
  {
    name: "protein.fa",
    category: "READY",
    status: "READY",
    progress: 100,
    progressTitle: "STRUCTURAL ANNOTATION",
    size: "150 MB",
    icon: "check_circle",
    theme: "blue",
  },
  {
    name: "assembly.stats",
    category: "ASSEMBLY METRICS",
    status: "PENDING",
    icon: "bar_chart",
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

const FileCard = ({ file }: { file: FileStatus }) => {
  const isReady = file.status === "READY";
  const isPending = file.status === "PENDING";

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-6 relative overflow-hidden group hover:shadow-md transition-shadow">
      {/* Sidebar indicator */}
      {!isPending && (
        <div
          className={twMerge(
            "absolute left-0 top-6 bottom-6 w-1 rounded-r-full",
            file.theme === "blue" ? "bg-blue-600" : "bg-[#c2410c]",
          )}
        />
      )}

      {/* Icon */}
      <div
        className={twMerge(
          "size-14 rounded-xl flex items-center justify-center shrink-0",
          isReady
            ? "bg-blue-50 text-blue-600"
            : isPending
              ? "bg-slate-50 text-slate-400"
              : "bg-orange-50 text-orange-600",
        )}
      >
        <Icon
          name={file.icon}
          className="text-3xl"
          weight={500}
          fill={isReady}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg font-bold text-slate-900 truncate">
            {file.name}
          </h3>
          {file.size && (
            <span className="text-xs font-medium text-slate-400">
              {file.size} • {file.status}
            </span>
          )}
        </div>
        <p className="text-[11px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
          {file.category}
        </p>
      </div>

      {/* Progress or Button */}
      <div className="w-1/2 flex items-center gap-8">
        {!isPending && file.progress !== undefined ? (
          <ProgressBar
            progress={file.progress}
            title={file.progressTitle || ""}
            theme={file.theme}
            showComplete={isReady}
          />
        ) : isPending ? (
          <button className="flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 rounded-xl py-3 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold text-sm">
            <Icon name="upload_file" className="text-xl" />
            CHOOSE FILE
          </button>
        ) : null}

        {/* Status Badge */}
        <div className="w-24 flex justify-end">
          <span
            className={twMerge(
              "px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase",
              isReady
                ? "bg-blue-600 text-white"
                : isPending
                  ? "bg-slate-100 text-slate-400"
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

const VersionDetails: React.FC<{ name?: string }> = ({ name = "v3.5.0" }) => {
  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Info (Mocked from design) */}
      <div className="px-2">
        <h1 className="text-2xl font-bold">Version {name}</h1>
      </div>

      {/* Main Files Grid */}
      <div className="space-y-4 relative">
        {mockMainFiles.map((file, idx) => (
          <FileCard key={idx} file={file} />
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
          <Button
            variant="ghost"
            className="bg-white border rounded-lg text-orange-800 hover:bg-orange-50 font-bold text-xs px-4"
          >
            <Icon name="add_circle" className="text-lg" />
            APPEND DATASET
          </Button>
        </div>

        <div className="space-y-4">
          {mockSecondaryFiles.map((file, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-center gap-6 relative overflow-hidden group transition-all hover:shadow-md"
            >
              {file.status === "UPLOADING" && (
                <div className="absolute left-0 top-6 bottom-6 w-1 bg-[#c2410c] rounded-r-full" />
              )}

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
