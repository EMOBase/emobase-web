import { useRef, useState } from "react";
import { toast } from "sonner";
import useService from "@/hooks/useService";
import genomicsService from "@/utils/services/genomics";
import { FileCardBase, ALLOWED_UPLOAD_FILE_TYPES } from "./base";
import type { FileStatus } from "./base";

export type { FileStatus };

export { GffFileCard } from "./gff";
export { OrthologyFileCard } from "./orthology";
export { JBrowseTrackFileCard } from "./jbrowseTrack";
export { SynonymFileCard } from "./synonym";

export const FileCard = ({
  file,
  versionId,
  canDelete,
  onRefresh,
  size = "md",
}: {
  file: FileStatus;
  versionId?: string;
  canDelete?: boolean;
  onRefresh?: () => void;
  size?: "sm" | "md";
}) => {
  const { upload, deleteUploadFile } = useService(genomicsService);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!versionId) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      await upload({
        file: selectedFile,
        version: versionId,
        fileType: file.name,
        onProgress: (pct) => setUploadProgress(Math.round(pct)),
        shouldResume: file.status === "PAUSED",
      });
      toast.success(`Uploaded ${selectedFile.name}`);
      onRefresh?.();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${selectedFile.name}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
      event.target.value = "";
    }
  };

  const handleDelete = async () => {
    if (!file.id) return;

    setIsDeleting(true);

    try {
      await deleteUploadFile(file.id);
      toast.success("File deletion initiated");
      onRefresh?.();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete file");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <FileCardBase
      file={file}
      isUploading={isUploading}
      uploadProgress={uploadProgress}
      canUpload={!!versionId}
      onChooseFile={handleChooseFile}
      onDelete={canDelete && file.id ? handleDelete : undefined}
      isDeleting={isDeleting}
      cardSize={size}
    >
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept=".gz,.bgz"
        onChange={handleFileChange}
      />
    </FileCardBase>
  );
};
