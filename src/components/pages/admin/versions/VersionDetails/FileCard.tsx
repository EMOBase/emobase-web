import { twMerge } from "tailwind-merge";
import { Icon } from "@/components/ui/icon";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export interface FileStatus {
  id?: string;
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

export const FileCard = ({
  file,
  onChooseFile,
  isUploading = false,
  uploadProgress = 0,
  onDeleteFile,
  isDeleting = false,
  size = "md",
}: {
  file: FileStatus;
  onChooseFile?: (fileName: string) => void;
  isUploading?: boolean;
  uploadProgress?: number;
  onDeleteFile?: (id: string) => void;
  isDeleting?: boolean;
  size?: "sm" | "md";
}) => {
  const isReady = file.status === "READY";
  const isPending = file.status === "PENDING";
  const isError = file.status === "ERROR";

  return (
    <div
      className={twMerge(
        "bg-white border border-slate-100 shadow-sm flex items-center relative overflow-hidden group hover:shadow-md transition-shadow",
        size === "sm" ? "p-4 gap-4 rounded-xl" : "p-5 gap-6 rounded-2xl",
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
          "flex items-center justify-center shrink-0",
          size === "sm" ? "size-10 rounded-lg" : "size-14 rounded-xl",
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
          {file.size && (
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
        {isError && onChooseFile ? (
          <button
            onClick={() => onChooseFile(file.name)}
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
        ) : !isPending && file.progress !== undefined ? (
          <ProgressBar
            progress={file.progress}
            title={file.progressTitle || ""}
            theme={file.theme}
            showComplete={isReady}
          />
        ) : isPending && onChooseFile ? (
          <button
            onClick={() => onChooseFile(file.name)}
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
            {isUploading
              ? `UPLOADING ${Math.round(uploadProgress)}%`
              : "CHOOSE FILE"}
          </button>
        ) : null}

        {onDeleteFile && file.id && (isReady || isError) && (
          <button
            onClick={() => onDeleteFile(file.id!)}
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
              {file.status}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
