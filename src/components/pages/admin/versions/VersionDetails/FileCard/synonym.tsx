import { useEffect } from "react";
import { toast } from "sonner";
import useUpload from "@/hooks/useUpload";
import { mainSpecies } from "@/utils/mainSpecies";
import { FileCardBase } from "./base";

export const SynonymFileCard = ({
  file,
  versionId,
  onComplete,
  size = "sm",
  species: speciesProp,
}: {
  file: File;
  versionId: string;
  onComplete: () => void;
  size?: "sm";
  species?: string;
}) => {
  const { upload, progress, isUploading, error } = useUpload();

  const speciesValue = speciesProp || mainSpecies;

  useEffect(() => {
    let cancelled = false;

    upload({
      file,
      version: versionId,
      fileType: "species.synonym",
      species: speciesValue,
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
        category: "Synonyms",
        icon: "sync_alt",
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