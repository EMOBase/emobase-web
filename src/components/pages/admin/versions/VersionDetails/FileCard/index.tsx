import { useRef, useState } from "react";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import GffUpload, { type GffMappingConfirmData } from "../GffUpload";
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
  icon: string;
  theme?: "orange" | "blue";
}

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

export const FileCard = ({
  file,
  isUploading: isUploadingOverride,
  uploadProgress: uploadProgressOverride,
  onUploadFile,
  onUploadGffFile,
  onDeleteFile,
  size = "md",
}: {
  file: FileStatus;
  isUploading?: boolean;
  uploadProgress?: number;
  onUploadFile?: (
    file: File,
    onProgress?: (pct: number) => void,
  ) => Promise<void>;
  onUploadGffFile?: (
    file: File,
    mapping: GffMappingConfirmData,
    onProgress?: (pct: number) => void,
  ) => Promise<void>;
  onDeleteFile?: (id: string) => Promise<void>;
  size?: "sm" | "md";
}) => {
  const [internalIsUploading, setInternalIsUploading] = useState(false);
  const [internalUploadProgress, setInternalUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [gffFileToUpload, setGffFileToUpload] = useState<File | null>(null);

  const isGff = file.name === "genomic.gff";

  const isUploading =
    isUploadingOverride !== undefined
      ? isUploadingOverride
      : internalIsUploading;

  const uploadProgress =
    isUploadingOverride !== undefined
      ? (uploadProgressOverride ?? 0)
      : internalUploadProgress;

  const canUpload = !!(onUploadFile || onUploadGffFile);

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    if (!ALLOWED_UPLOAD_FILE_TYPES.has(file.name)) {
      toast.error(`Unsupported upload type: ${file.name}`);
      event.target.value = "";
      return;
    }

    if (
      !selectedFile.name.endsWith(".gz") &&
      !selectedFile.name.endsWith(".bgz")
    ) {
      toast.error("Only .gz or .bgz files are accepted");
      event.target.value = "";
      return;
    }

    if (isGff) {
      setGffFileToUpload(selectedFile);
      return;
    }

    setInternalIsUploading(true);
    setInternalUploadProgress(0);

    try {
      await onUploadFile?.(selectedFile, (pct: number) => {
        setInternalUploadProgress(Math.round(pct));
      });
      toast.success(`Uploaded ${selectedFile.name}`);
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${selectedFile.name}`);
    } finally {
      setInternalIsUploading(false);
      setInternalUploadProgress(0);
      event.target.value = "";
    }
  };

  const handleGffMappingConfirm = async (
    mappingData: GffMappingConfirmData,
  ) => {
    if (!gffFileToUpload || !onUploadGffFile) return;

    setInternalIsUploading(true);
    setInternalUploadProgress(0);

    try {
      await onUploadGffFile(gffFileToUpload, mappingData, (pct: number) =>
        setInternalUploadProgress(Math.round(pct)),
      );
      toast.success(`Uploaded ${gffFileToUpload.name}`);
    } catch (error) {
      console.error("GFF Upload failed:", error);
      toast.error(`Failed to upload ${gffFileToUpload.name}`);
    } finally {
      setInternalIsUploading(false);
      setInternalUploadProgress(0);
      setGffFileToUpload(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDelete = async () => {
    if (!file.id || !onDeleteFile) return;

    setIsDeleting(true);

    try {
      await onDeleteFile(file.id);
      toast.success("File deletion initiated");
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  const isReady = !isUploading && file.status === "READY";
  const isPending = !isUploading && file.status === "PENDING";
  const isError = !isUploading && file.status === "ERROR";

  const effectiveStatus = isUploading ? "UPLOADING" : file.status;
  const effectiveProgress =
    isUploading && uploadProgress !== undefined
      ? uploadProgress
      : file.progress;
  const effectiveProgressTitle = isUploading
    ? "IN TRANSIT"
    : file.progressTitle;

  return (
    <div
      className={twMerge(
        "bg-white border border-slate-100 shadow-sm flex items-center relative overflow-hidden group hover:shadow-md transition-shadow",
        size === "sm" ? "p-4 gap-4 rounded-xl" : "p-5 gap-6 rounded-2xl",
        isError && "bg-[#FFF5F5] border-[#FFE4E4]",
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".gz,.bgz"
        onChange={handleFileChange}
      />

      {/* Left-side indicator */}
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

      {/* Icon */}
      <div
        className={twMerge(
          "flex items-center justify-center shrink-0",
          size === "sm" ? "size-10 rounded-lg" : "size-14 rounded-xl",
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
          className={size === "sm" ? "text-2xl" : "text-3xl"}
          weight={500}
          fill={isReady || isError}
        />
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3
            className={twMerge(
              "font-bold text-slate-900 truncate",
              size === "sm" ? "text-sm" : "text-lg",
            )}
          >
            {file.name}
          </h3>
          {file.size && !isUploading && (
            <span
              className={twMerge(
                "font-medium text-slate-400",
                size === "sm" ? "text-[10px]" : "text-xs",
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
                    name="error_outline"
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
            size === "sm" ? "text-[10px]" : "text-[11px]",
          )}
        >
          {file.category}
        </p>
      </div>

      {/* Progress or Button */}
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
            onClick={handleChooseFile}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-red-200 text-red-700 hover:border-red-300 hover:bg-red-100/30 transition-all font-bold text-xs tracking-widest",
              size === "sm" ? "rounded-lg py-2" : "rounded-xl py-3",
            )}
          >
            <Icon
              name="refresh"
              className={size === "sm" ? "text-lg" : "text-xl"}
            />
            RE-UPLOAD
          </button>
        ) : file.status === "PAUSED" && canUpload ? (
          <button
            onClick={handleChooseFile}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-orange-200 text-orange-700 hover:border-orange-300 hover:bg-orange-50 transition-all font-bold text-xs tracking-widest",
              size === "sm" ? "rounded-lg py-2" : "rounded-xl py-3",
            )}
          >
            <Icon
              name="upload_file"
              className={size === "sm" ? "text-lg" : "text-xl"}
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
            onClick={handleChooseFile}
            disabled={isUploading}
            className={twMerge(
              "flex-1 flex items-center justify-center gap-3 border-2 border-dashed border-slate-200 text-slate-400 hover:border-slate-300 hover:bg-slate-50 transition-all font-bold disabled:cursor-not-allowed disabled:opacity-70",
              size === "sm"
                ? "rounded-lg py-2 text-xs"
                : "rounded-xl py-3 text-sm",
            )}
          >
            <Icon
              name="upload_file"
              className={size === "sm" ? "text-lg" : "text-xl"}
            />
            CHOOSE FILE
          </button>
        ) : null}

        {onDeleteFile &&
          file.id &&
          !isUploading &&
          (isReady ||
            isError ||
            file.status === "PAUSED" ||
            file.status === "UPLOADING") && (
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="w-10 flex items-center justify-center text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              title="Delete file"
            >
              <Icon
                name={isDeleting ? "pending" : "delete"}
                className={size === "sm" ? "text-xl" : "text-2xl"}
              />
            </button>
          )}

        {size !== "sm" && (
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

      {/* GFF upload dialog */}
      {isGff && (
        <GffUpload
          file={gffFileToUpload}
          isOpen={gffFileToUpload !== null}
          onConfirm={handleGffMappingConfirm}
          onClose={() => {
            setGffFileToUpload(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
          }}
          onUploadDifferentFile={() => {
            setGffFileToUpload(null);
            if (fileInputRef.current) {
              fileInputRef.current.value = "";
              fileInputRef.current.click();
            }
          }}
        />
      )}
    </div>
  );
};
