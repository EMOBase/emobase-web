import { useEffect, useState } from "react";
import { toast } from "sonner";
import useService from "@/hooks/useService";
import genomicsService from "@/utils/services/genomics";
import { FileCardBase } from "./base";

export const JBrowseTrackFileCard = ({
  file,
  versionId,
  trackName,
  onComplete,
  size = "sm",
}: {
  file: File;
  versionId: string;
  trackName: string;
  onComplete: () => void;
  size?: "sm";
}) => {
  const { upload } = useService(genomicsService);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let cancelled = false;

    upload({
      file,
      version: versionId,
      fileType: "jbrowse.track",
      trackName,
      onProgress: (pct: number) => {
        if (!cancelled) setProgress(Math.round(pct));
      },
    })
      .then(() => {
        if (!cancelled) {
          toast.success(`Uploaded ${file.name}`);
          onComplete();
        }
      })
      .catch((err: any) => {
        if (!cancelled) {
          console.error("Upload failed:", err);
          setHasError(true);
          setErrorMessage(err.message || "Upload failed");
          toast.error(`Failed to upload ${file.name}`);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <FileCardBase
      file={{
        name: file.name,
        category: trackName,
        icon: "view_timeline",
        status: hasError ? "ERROR" : "UPLOADING",
        progress,
        progressTitle: "IN TRANSIT",
        error: errorMessage,
      }}
      isUploading={!hasError}
      uploadProgress={progress}
      cardSize={size}
    />
  );
};
