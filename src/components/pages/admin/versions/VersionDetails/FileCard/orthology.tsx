import { useEffect } from "react";
import { toast } from "sonner";
import useUpload from "@/hooks/useUpload";
import { FileCardBase } from "./base";

export const OrthologyFileCard = ({
  file,
  versionId,
  order,
  algorithm,
  onComplete,
  size = "sm",
}: {
  file: File;
  versionId: string;
  order: number;
  algorithm: string;
  onComplete: () => void;
  size?: "sm";
}) => {
  const { upload, progress, isUploading, error } = useUpload();

  useEffect(() => {
    let cancelled = false;

    upload({
      file,
      version: versionId,
      fileType: "orthology.tsv",
      order,
      algorithm,
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
        category: "Orthology Mapping",
        icon: "tsv",
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