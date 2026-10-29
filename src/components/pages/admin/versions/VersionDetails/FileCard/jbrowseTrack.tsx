import { useEffect } from "react";
import { toast } from "sonner";
import useUpload from "@/hooks/useUpload";
import { FileCardBase } from "./base";

export const JBrowseTrackFileCard = ({
  file,
  versionId,
  trackName,
  category,
  selectInDefaultSession,
  onComplete,
  size = "sm",
}: {
  file: File;
  versionId: string;
  trackName: string;
  category?: string;
  selectInDefaultSession?: boolean;
  onComplete: () => void;
  size?: "sm";
}) => {
  const { upload, progress, isUploading, error } = useUpload();

  useEffect(() => {
    let cancelled = false;

    upload({
      file,
      version: versionId,
      fileType: "jbrowse.track",
      trackName,
      category,
      selectInDefaultSession,
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
        status: error ? "ERROR" : "UPLOADING",
        progress,
        progressTitle: "IN TRANSIT",
        error: error ?? "",
      }}
      isUploading={isUploading}
      uploadProgress={progress}
      cardSize={size}
    />
  );
};