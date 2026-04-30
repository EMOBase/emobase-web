import React, { useRef, useState, useEffect } from "react";
import { toast } from "sonner";

import { formatBytes } from "@/utils/format";
import useAsyncData from "@/hooks/useAsyncData";
import genomicsService from "@/utils/services/genomics";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import type { VersionDetailFiles } from "@/utils/services/genomics";
import { FileCard, type FileStatus } from "./FileCard";

const { fetchVersionDetail, upload, deleteUploadFile } = genomicsService();

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

const MAIN_FILE_CONFIGS: Record<
  string,
  { category: string; icon: string; theme?: "orange" | "blue" }
> = {
  "genomic.fna": {
    category: "Genome Sequence",
    icon: "description",
  },
  "genomic.gff": {
    category: "Genome Annotation",
    icon: "numbers",
  },
  "rna.fna": {
    category: "RNA Sequences",
    icon: "science",
  },
  "cds.fna": {
    category: "Coding Sequences",
    icon: "data_object",
  },
  "protein.faa": {
    category: "Protein Sequences",
    icon: "conversion_path",
  },
};

const VersionDetails: React.FC<{ name?: string }> = ({ name = "" }) => {
  const [refreshKey, setRefreshKey] = useState(0);

  const { data } = useAsyncData(
    () => fetchVersionDetail(name),
    [name, refreshKey],
  );

  const refresh = () => setRefreshKey((prev) => prev + 1);

  const versionData = data?.data;

  useEffect(() => {
    const status = versionData?.status;
    if (status === "PROCESSING" || status === "DRAFT") {
      const interval = setInterval(refresh, 5000);
      return () => clearInterval(interval);
    }
  }, [data]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTargetFile, setSelectedTargetFile] = useState<string | null>(
    null,
  );
  const [uploadingTargetFile, setUploadingTargetFile] = useState<string | null>(
    null,
  );
  const [uploadProgress, setUploadProgress] = useState(0);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  const handleDeleteFile = async (id: string) => {
    try {
      setDeletingFiles((prev) => new Set(prev).add(id));
      await deleteUploadFile(id);
      toast.success("File deletion initiated");
      refresh();
    } catch (error: any) {
      console.error("Delete failed:", error);
      toast.error(error.message || "Failed to delete file");
    } finally {
      setDeletingFiles((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const mainFiles = React.useMemo(() => {
    const files = versionData?.files || {};
    return Object.entries(MAIN_FILE_CONFIGS).map(([fileName, config]) => {
      let status: FileStatus["status"] = "PENDING";
      let progress = 0;
      let progressTitle = "";
      let error = "";
      let size = "";

      const fileDetail = files[fileName as keyof VersionDetailFiles];
      const typedFileDetail = Array.isArray(fileDetail)
        ? fileDetail[0]
        : fileDetail;

      if (uploadingTargetFile === fileName) {
        status = "UPLOADING";
        progress = uploadProgress;
        progressTitle = "IN TRANSIT";
      } else if (typedFileDetail) {
        size = formatBytes(typedFileDetail.fileSize);

        if (typedFileDetail.uploadStatus === "FAILED") {
          status = "ERROR";
          error = "Upload failed";
          progress = 100;
        } else if (typedFileDetail.uploadStatus === "UPLOADING") {
          status = "UPLOADING";
          progress = 50;
          progressTitle = "IN TRANSIT";
        } else {
          // COMPLETED upload
          const jobs = typedFileDetail.jobs || [];
          const failedJob = jobs.find((j: any) => j.status === "FAILED");
          const activeJob = jobs.find(
            (j: any) => j.status === "RUNNING" || j.status === "PENDING",
          );

          if (failedJob) {
            status = "ERROR";
            error = failedJob.error || "Processing failed";
            progress = 100;
          } else if (activeJob) {
            status = "PROCESSING";
            const doneJobsCount = jobs.filter(
              (j: any) => j.status === "DONE",
            ).length;
            progress = Math.min(100, Math.max(10, doneJobsCount * 20));
            progressTitle = activeJob.description || "PROCESSING DATA";
          } else {
            status = "READY";
            progress = 100;
          }
        }
      }

      return {
        id: typedFileDetail?.id,
        name: fileName,
        ...config,
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData, uploadingTargetFile, uploadProgress]);

  const orthologyFiles = React.useMemo(() => {
    const files = versionData?.files?.["orthology.tsv"] || [];

    return files.map((fileDetail) => {
      let status: FileStatus["status"] = "PENDING";
      let progress = 0;
      let progressTitle = "";
      let error = "";
      const size = formatBytes(fileDetail.fileSize);

      if (fileDetail.uploadStatus === "FAILED") {
        status = "ERROR";
        error = "Upload failed";
        progress = 100;
      } else if (fileDetail.uploadStatus === "UPLOADING") {
        status = "UPLOADING";
        progress = 50;
        progressTitle = "IN TRANSIT";
      } else {
        const jobs = fileDetail.jobs || [];
        const failedJob = jobs.find((j: any) => j.status === "FAILED");
        const activeJob = jobs.find(
          (j: any) => j.status === "RUNNING" || j.status === "PENDING",
        );

        if (failedJob) {
          status = "ERROR";
          error = failedJob.error || "Processing failed";
          progress = 100;
        } else if (activeJob) {
          status = "PROCESSING";
          const doneJobsCount = jobs.filter(
            (j: any) => j.status === "DONE",
          ).length;
          progress = Math.min(100, Math.max(10, doneJobsCount * 20));
          progressTitle = activeJob.description || "PROCESSING DATA";
        } else {
          status = "READY";
          progress = 100;
        }
      }

      // If it's the currently uploading file (matching by name and UPLOADING state)
      // we could show precise progress, but API files typically don't have local progress
      // unless we match the name. The name is usually "orthology.tsv" which is generic.

      const fileName = fileDetail.filePath.split("/").pop() || "orthology.tsv";

      return {
        id: fileDetail.id,
        name: fileName,
        category: "Orthology Mapping",
        icon: "tsv",
        status,
        progress,
        progressTitle,
        error,
        size,
        theme: status === "READY" ? "blue" : "orange",
      } as FileStatus;
    });
  }, [versionData]);

  const openFilePicker = (fileName: string) => {
    setSelectedTargetFile(fileName);
    fileInputRef.current?.click();
  };

  const onFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file || !selectedTargetFile) {
      return;
    }

    if (!ALLOWED_UPLOAD_FILE_TYPES.has(selectedTargetFile)) {
      toast.error(`Unsupported upload type: ${selectedTargetFile}`);
      event.target.value = "";
      return;
    }

    if (!file.name.endsWith(".gz") && !file.name.endsWith(".gzip")) {
      toast.error("Only .gz or .gzip files are accepted");
      event.target.value = "";
      return;
    }

    try {
      setUploadingTargetFile(selectedTargetFile);
      setUploadProgress(0);

      await upload({
        file,
        version: name,
        fileType: selectedTargetFile,
        order: selectedTargetFile === "orthology.tsv" ? 1 : undefined,
        algorithm:
          selectedTargetFile === "orthology.tsv" ? "OrthoFinder" : undefined,
        onProgress: (progress) => setUploadProgress(Math.round(progress)),
      });

      toast.success(`Uploaded ${file.name}`);
      refresh();
    } catch (error) {
      console.error("Upload failed:", error);
      toast.error(`Failed to upload ${file.name}`);
    } finally {
      setUploadingTargetFile(null);
      setSelectedTargetFile(null);
      setUploadProgress(0);
      event.target.value = "";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        onChange={onFileChange}
      />
      {/* Header Info (Mocked from design) */}
      <div className="px-2 space-y-4">
        <a
          href="/admin/versions"
          className="inline-flex items-center gap-2 text-[10px] font-bold text-slate-400 hover:text-primary transition-colors group tracking-widest uppercase"
        >
          <Icon
            name="arrow_back"
            className="text-lg group-hover:-translate-x-1 transition-transform"
          />
          Back to Data Management
        </a>
        <h1 className="text-3xl font-bold text-slate-900 font-display tracking-tight">
          Version {name}
        </h1>
      </div>

      {/* Main Files Grid */}
      <div className="space-y-4 relative">
        {mainFiles.map((file, idx) => (
          <FileCard
            key={idx}
            file={file}
            onChooseFile={openFilePicker}
            isUploading={uploadingTargetFile === file.name}
            uploadProgress={uploadProgress}
          />
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
            variant="outline"
            className="font-bold text-xs px-4 py-2"
            onClick={() => openFilePicker("orthology.tsv")}
          >
            <Icon name="add_circle" weight={500} className="text-lg" />
            APPEND DATASET
          </Button>
        </div>

        <div className="space-y-4">
          {orthologyFiles.length > 0 ? (
            orthologyFiles.map((file, idx) => (
              <FileCard
                key={file.id || idx}
                file={file}
                onDeleteFile={handleDeleteFile}
                isDeleting={file.id ? deletingFiles.has(file.id) : false}
                size="sm"
              />
            ))
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm font-medium">
              No additional orthology files uploaded yet.
            </div>
          )}

          {uploadingTargetFile === "orthology.tsv" && (
            <FileCard
              file={{
                name: "Uploading...",
                category: "Orthology Mapping",
                icon: "tsv",
                status: "UPLOADING",
                progress: uploadProgress,
                progressTitle: "IN TRANSIT",
              }}
              isUploading={true}
              uploadProgress={uploadProgress}
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VersionDetails;
