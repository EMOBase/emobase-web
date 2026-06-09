import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/icon";
import type { IconName } from "@/utils/constants/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProgressBar } from "./ProgressBar";

export interface FileStatus {
  id?: string;
  name: string;
  category: string;
  status: "PENDING" | "UPLOADING" | "PAUSED" | "PROCESSING" | "READY" | "ERROR";
  progress?: number;
  progressTitle?: string;
  size?: string;
  error?: string;
  icon: IconName;
  theme?: "orange" | "blue";
}

export const ALLOWED_UPLOAD_FILE_TYPES = new Set([
  "genomic.fna",
  "genomic.gff",
  "rna.fna",
  "cds.fna",
  "protein.faa",
  "dsrna.csv",
  "jbrowse.track",
  "orthology.tsv",
  "fb_synonym.tsv",
  "fbgn_fbtr_fbpp.tsv",
]);

export const FileCardBase = ({
  file,
  isUploading,
  uploadProgress,
  canUpload = false,
  onChooseFile,
  onDelete,
  isDeleting = false,
  cardSize = "md",
  children,
}: {
  file: FileStatus;
  isUploading: boolean;
  uploadProgress: number;
  canUpload?: boolean;
  onChooseFile?: () => void;
  onDelete?: () => void;
  isDeleting?: boolean;
  cardSize?: "sm" | "md";
  children?: React.ReactNode;
}) => {
  const isReady = !isUploading && file.status === "READY";
  const isPending = !isUploading && file.status === "PENDING";
  const isError = !isUploading && file.status === "ERROR";

  const effectiveStatus = isUploading ? "UPLOADING" : file.status;
  const effectiveProgress =
    isUploading && uploadProgress !== undefined
      ? uploadProgress
      : file.progress;
  const effectiveProgressTitle = isUploading ? "IN TRANSIT" : file.progressTitle;

  return (
    <div
      className={twMerge(
        "bg-white border border-slate-100 shadow-sm flex items-center relative overflow-hidden group hover:shadow-md transition-shadow",
        cardSize === "sm" ? "p-4 gap-4 rounded-xl" : "p-5 gap-6 rounded-2xl",
        isError && "bg-[#FFF5F5] border-[#FFE4E4]",
      )}
    >
      {children}

      <div
        className={twMerge(
          "absolute left-0 top-6 bottom-6 w-1 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity",
          isPending || isUploading
            ? "bg-neutral-400"
            : isReady
              ? "bg-blue-600"
              : isError
                ? "bg-red-500"
                : "bg-[#c2410c]",
        )}
      />

      <div
        className={twMerge(
          "flex items-center justify-center shrink-0",
          cardSize === "sm" ? "size-10 rounded-lg" : "size-14 rounded-xl",
          isReady
            ? "bg-blue-50 text-blue-600"
            : isPending || isUploading
              ? "bg-slate-50 text-slate-400"
              : isError
                ? "bg-red-100 text-red-600"
                : "bg-orange-50 text-orange-600",
        )}
      >
        <Icon
          name={file.icon}
          className={cardSize === "sm" ? "text-2xl" : "text-3xl"}
          weight={500}
          fill={isReady || isError}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={twMerge(
              "font-bold text-slate-900 truncate",
              cardSize === "sm" ? "text-sm" : "text-lg",
            )}
          >
            {file.name}
          </h3>
          {file.size && !isUploading && (
            <span
              className={twMerge(
                "font-medium text-slate-400",
                cardSize === "sm" ? "text-[10px]" : "text-xs",
              )}
            >
              {file.size}
            </span>
          )}
          {isError && file.error && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="flex items-center justify-center p-0.5 rounded-full hover:bg-red-100/50 transition-colors">
                  <Icon
                    name="error"
                    className="text-red-500 text-sm cursor-help"
                  />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">{file.error}</TooltipContent>
            </Tooltip>
          )}
        </div>
        <p
          className={twMerge(
            "font-bold text-slate-400 tracking-wider uppercase mt-0.5",
            cardSize === "sm" ? "text-[10px]" : "text-[11px]",
          )}
        >
          {file.category}
        </p>
      </div>

      <div className="w-1/2 flex items-center gap-8">
        {isUploading ? (
          <ProgressBar
            progress={effectiveProgress ?? 0}
            title={effectiveProgressTitle || ""}
            theme={file.theme}
            showComplete={isReady}
          />
        ) : isError && canUpload ? (
          <button
            onClick={onChooseFile}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-red-200 text-red-700 hover:border-red-300 hover:bg-red-100/30 transition-all font-bold text-xs tracking-widest",
              cardSize === "sm" ? "rounded-lg py-2" : "rounded-xl py-3",
            )}
          >
            <Icon
              name="refresh"
              className={cardSize === "sm" ? "text-lg" : "text-xl"}
            />
            RE-UPLOAD
          </button>
        ) : file.status === "PAUSED" && canUpload ? (
          <button
            onClick={onChooseFile}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-orange-200 text-orange-700 hover:border-orange-300 hover:bg-orange-50 transition-all font-bold text-xs tracking-widest",
              cardSize === "sm" ? "rounded-lg py-2" : "rounded-xl py-3",
            )}
          >
            <Icon
              name="upload_file"
              className={cardSize === "sm" ? "text-lg" : "text-xl"}
            />
            RESUME UPLOAD
          </button>
        ) : (!isPending || isUploading) && effectiveProgress !== undefined ? (
          <ProgressBar
            progress={effectiveProgress}
            title={effectiveProgressTitle || ""}
            theme={file.theme}
            showComplete={isReady}
          />
        ) : isPending && canUpload ? (
          <button
            onClick={onChooseFile}
            disabled={isUploading}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold disabled:cursor-not-allowed disabled:opacity-70",
              cardSize === "sm"
                ? "rounded-lg py-2 text-xs"
                : "rounded-xl py-3 text-sm",
            )}
          >
            <Icon
              name="upload_file"
              className={cardSize === "sm" ? "text-lg" : "text-xl"}
            />
            CHOOSE FILE
          </button>
        ) : null}

        {onDelete &&
          !isUploading &&
          (isReady || isError || file.status === "PAUSED" || file.status === "UPLOADING") && (
            <button
              onClick={onDelete}
              disabled={isDeleting}
              className="w-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete file"
            >
              <Icon
                name={isDeleting ? "pending" : "delete"}
                className={cardSize === "sm" ? "text-xl" : "text-2xl"}
              />
            </button>
          )}

        {cardSize !== "sm" && (
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
              {effectiveStatus}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
