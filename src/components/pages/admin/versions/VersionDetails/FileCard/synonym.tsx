import { useEffect, useState } from "react";
import { toast } from "sonner";
import useService from "@/hooks/useService";
import genomicsService from "@/utils/services/genomics";
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
  const { upload } = useService(genomicsService);
  const [progress, setProgress] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const speciesValue = speciesProp || mainSpecies;

  useEffect(() => {
    let cancelled = false;

    upload({
      file,
      version: versionId,
      fileType: "species.synonym",
      species: speciesValue,
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
        category: "Synonyms",
        icon: "sync_alt",
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
